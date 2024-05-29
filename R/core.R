#' Get or create prefix
#' 
#' Get or create the prefix.
#' 
#' @details This ensures unique names.
#' 
#' @keywords internal
get_prefix <- function() {
  if(!is.null(env$prefix))
    return(env$prefix)

  env$prefix <- make_id()

  return(env$prefix)
}

#' Communication
#' 
#' Communication handler.
#' 
#' @param id ID of communication handler.
#' @param handler Callback function.
#' 
#' @importFrom shiny observe
#' 
#' @export
com <- \(id, handler) {
  env$handlers[[id]] <- handler
  env$schemas[[id]] <- list()
  env$defaults[[id]] <- list()

  on.exit(
    com_send(id),
    add = TRUE
  )

  fn <- \(...){
    check_args_match(env$handlers[[id]], ...)
    env$schemas[[id]] <- list(...)

    on.exit(
      com_send(id),
      add = TRUE
    )

    fn <- \(...) {
      # defaults may be reactives
      check_args_match(env$handlers[[id]], ...)
      env$defaults[[id]] <- list(...)

      on.exit(
        com_send(id),
        add = TRUE
      )

      fn <- \(handler, ...){
        if(!is.function(handler))
          stop("Handler must be a function")

        if(length(methods::formalArgs(handler)) < 1L)
          stop("Handler must have at least one argument")

        env$errors[[id]] <- handler
      } |>
        construct_errors_fn() |>
        invisible()
    } 

    fn |>
      construct_defaults_fn() |>
      invisible()
  }

  fn |>
    construct_converters_fn() |>
    invisible()
}

#' Constructors
#'
#' Adds classes to returned function to allow print method.
#'
#' @name constructors
#' @keywords internal
construct_defaults_fn <- \(fn) {
  structure(
    fn,
    class = c("defaults_fn", class(fn))
  )
}

#' @rdname constructors
#' @keywords internal
construct_converters_fn <- \(fn) {
  structure(
    fn,
    class = c("converters_fn", class(fn))
  )
}

#' @rdname constructors
#' @keywords internal
construct_errors_fn <- \(fn) {
  structure(
    fn,
    class = c("errors_fn", class(fn))
  )
}

#' @export
print.defaults_fn <- \(x, ...) {
  cat("Add defaults, e.g.: (x = 1)\n")
}

#' @export
print.converters_fn <- \(x, ...) {
  cat("Add converters, e.g.: (x = as_dataframe)\n")
}

#' @export
print.errors_fn <- \(x, ...) {
  cat("Add error handlers, e.g.: (error_handler_fn)\n")
}

#' Communicate
#' 
#' Serve communication channels.
#' 
#' @param session Shiny session.
#' 
#' @export
com_serve <- \(session = shiny::getDefaultReactiveDomain()) {
  .Deprecated("com", msg = "this function is deprecated, com suffices")
  handlers <- env$handlers |> names()

  lapply(handlers, \(name) {
    shiny::observe({
      fn <- \(data, req) {
        args <- parse_query_string(req$QUERY_STRING) |>
          parse_args(env$schemas[[name]])
       
        args <- utils::modifyList(env$defaults[[name]], args)

        results <- do.call(
          env$handlers[[name]], 
          args
        ) |>
          tryCatch(error = \(e) e)

        status <- 200L
        if(inherits(results, "error")) {
          status <- 400L
          results <- list(
            error = results$message,
            id = results$id
          )

          if(env$errors[[name]]){
            env$errors[[name]](results)
          }
        }

        http_response_json(results, status)
      }

      path <- session$registerDataObj(
        name,
        env$defaults[[name]],
        fn
      )

      session$sendCustomMessage(
        type = "communicate-set-path",
        message = list(
          id = name, 
          path = path,
          args = get_args(env$handlers[[name]], env$schemas[[name]])
        )
      )
    })
  })
}

#' @keywords internal
com_send <- \(name, session = shiny::getDefaultReactiveDomain()) {
  fn <- \(data, req) {
    args <- parse_query_string(req$QUERY_STRING) |>
      parse_args(env$schemas[[name]])
   
    args <- utils::modifyList(env$defaults[[name]], args)

    results <- do.call(
      env$handlers[[name]], 
      args
    ) |>
      tryCatch(error = \(e) e)

    status <- 200L
    if(inherits(results, "error")) {
      status <- 400L
      if(length(env$errors[[name]])){
        env$errors[[name]](results)
      }

      results <- list(
        error = results$message,
        id = results$id
      )
    }

    http_response_json(results, status)
  }

  path <- session$registerDataObj(
    name,
    env$defaults[[name]],
    fn
  )

  payload = list(
    id = name, 
    path = path,
    args = get_args(env$handlers[[name]], env$schemas[[name]])
  )

  if(!env$types_sent && length(env$types) > 0L) {
    payload$types <- env$types |> lapply(\(type) {
      type$r_converter <- NULL
      return(type)
    })
    env$types_sent <- TRUE
  }

  session$sendCustomMessage(
    type = "communicate-set-path",
    message = payload
  )
}

#' HTTP response JSON
#' 
#' Sends a JSON response.
#' 
#' @param status HTTP status code.
#' @param body Body of response.
#' 
#' @importFrom jsonlite toJSON
#' @importFrom shiny httpResponse
#' 
#' @keywords internal
http_response_json <- \(body, status = 200){
  httpResponse(
    status = status,
    content_type = "application/json",
    content = body |>
      toJSON(
        dataframe = "rows", 
        auto_unbox = TRUE
      )
  )
}
