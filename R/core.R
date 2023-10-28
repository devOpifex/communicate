env <- new.env(hash = TRUE)
env$handlers <- list()
env$schemas<- list()

#' Schema
#' 
#' @export
com <- \(id) {
  \(handler){
    env$handlers[[id]] <- handler
    env$schemas[[id]] <- list()

    \(...){
      env$schemas[[id]] <- list(...)
    } |> 
      invisible()
  }
}

communicate <- \(session = shiny::getDefaultReactiveDomain()) {
  handlers <- env$handlers |> names()

  observe({
    endpoints <- lapply(handlers, \(name) {
      path <- session$registerDataObj(
        name,
        list(),
        \(data, req) {
          args <- args_from_query_string(req$QUERY_STRING, env$schemas[[name]])
          results <- do.call(env$handlers[[name]], args) |>
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

      list(
        path = path,
        name = name
      )
    })

    session$sendCustomMessage(
      type = "communicate-paths",
      message = list(endpoints = endpoints)
    )
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
