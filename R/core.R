env <- new.env(hash = TRUE)
env$prefix <- NULL
env$handlers <- list()
env$schemas<- list()
env$defaults<- list()

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
#' 
#' @export
com <- \(id) {
  #id <- sprintf("%s-%s", get_prefix(), id)

  \(handler){
    env$handlers[[id]] <- handler
    env$schemas[[id]] <- list()
    env$datas[[id]] <- list()

    \(...){
      env$schemas[[id]] <- list(...)

      \(...) {
        env$defaults[[id]] <- list(...)
      }
    } |> 
      invisible()
  }
}

#' Communicate
#' 
#' Communicate
#' 
#' @param session Shiny session.
#' 
#' @export
communicate <- \(session = shiny::getDefaultReactiveDomain()) {
  handlers <- env$handlers |> names()

  endpoints <- lapply(handlers, \(name) {
    observe({
      path <- session$registerDataObj(
        name,
        list(),
        \(data, req) {
          args <- parse_query_string(req$QUERY_STRING) |>
            parse_args(env$schemas[[name]])
         
          args <- modifyList(env$defaults[[name]], args)
          print(args)

          results <- do.call(
            env$handlers[[name]], 
            args
          ) |>
            tryCatch(error = \(e) e)

          status = 200L
          if(inherits(results, "error")) {
            status <- 400L
            results <- list(
              error = results$message,
              id = results$id
            )
          }

          http_response_json(results)
        }
      )

      session$sendCustomMessage(
        type = "communicate-set-path",
        message = list(id = name, path = path)
      )
    })
  })
}

args_from_query_string <- \(qs, schema){
  qs <- parse_query_string(qs)

  schema_vars <- schema |> names()
  qs_names <- qs |> names()

  schema_vars <- schema_vars |> intersect(qs_names)

  args <- schema_vars |> 
    lapply(\(name) {
      schema[[name]](qs[[name]])
    })

  names(args) <- schema_vars
  return(args)
}


get_handlers <- \(data, req){
  handlers <- env |> ls() |> names()
  http_response_json(data)
}

http_response_json <- \(body, status = 200){
  shiny::httpResponse(
    status = status,
    content_type = "application/json",
    content = body |>
      jsonlite::toJSON(
        dataframe = "rows", 
        auto_unbox = TRUE
      )
  )
}

parse_query_string <- \(str){
 shiny::parseQueryString(str)
}

make_id <- \(n = 20) {
  1:9 |>
    c(letters) |>
    c(LETTERS) |>
    sample(n) |>
    paste0(collapse = "")
}

useCommunicate <- \() {
  htmltools::htmlDependency(
		"communicate",
		version = utils::packageVersion("communicate"),
		src = "assets",
		package = "communicate",
		script = "index.js"
	)
}
