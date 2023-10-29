#' Parse a query string into a list
#' 
#' Parses the query string from the request into a list.
#' 
#' @param str Query string.
#' 
#' @importFrom shiny parseQueryString
#' 
#' @keywords internal
parse_query_string <- \(str){
  parseQueryString(str)
}

#' Get Arguments from Query String
#' 
#' Get arguments from query string.
#' 
#' @param qs Query string.
#' @param schema Schema.
#' 
#' @keywords internal
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

