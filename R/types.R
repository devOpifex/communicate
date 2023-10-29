#' Type Converters
#' 
#' Type converters for convenience.
#' 
#' @name converters.
#' @export
as_character <- list(
  fn = as.character,
  type = "character"
)

#' @rdname converters.
#' @export
as_integer <- list(
  fn = as.integer,
  type = "integer"
)

#' @rdname converters.
#' @export
as_numeric <- list(
  fn = as.numeric,
  type = "numeric"
)

#' @rdname converters.
#' @export
as_date <- list(
  fn = as.Date,
  type = "date"
)

#' @rdname converters.
#' @export
as_posixct <- list(
  fn = as.POSIXct,
  type = "posix"
)

#' @rdname converters.
#' @export
as_posixlt <- list(
  fn = as.POSIXlt,
  type = "posix"
)

#' @importFrom jsonlite fromJSON
#' @rdname converters.
#' @export
as_dataframe <- list(
  fn = fromJSON,
  type = "dataframe"
)

#' @importFrom jsonlite fromJSON
#' @rdname converters.
#' @export
as_list <- list(
  fn = \(x) fromJSON(x, simplifyMatrix = FALSE),
  type = "list"
)

#' Parse Arguments
#' 
#' Attempts to parse query string for embeds into R objects.
#' 
#' @param args Parsed query string.
#' @param converters List of converters.
#' 
#' @keywords internal
parse_args <- function(args = list(), converters = list()) {
  args$w <- NULL
  args$nonce <- NULL

  parsed <- lapply(seq_along(args), \(index) {
    arg <- args[[index]]
    nms <- names(args)[index]
    converter <- converters[[nms]]

    if(is.function(converter$fn))
      return(converter$fn(arg))

    date <- tryCatch(as.Date(arg), error = \(e) NULL)

    if(!is.null(date))
      return(date)

    dttm <- tryCatch(as.POSIXct(arg), error = \(e) NULL)

    if(!is.null(dttm))
      return(dttm)

    nbr <- as.integer(arg) |>
      suppressWarnings()

    if(!is.na(nbr))
      return(nbr)

    nbr <- as.numeric(arg) |>
      suppressWarnings()

    if(!is.na(nbr))
      return(nbr)

    if(arg %in% c("TRUE", "true"))
      return(TRUE)

    if(arg %in% c("FALSE", "false"))
      return(FALSE)

    # it must be an array or an object
    if(grepl("\\[", arg))
      return(fromJSON(arg, simplifyMatrix = TRUE))

    return(arg)
  })

  names(parsed) <- names(args)

  return(parsed)
}

#' Get arguments from function
#' 
#' Get arguments from handler.
#' 
#' @param fn Function.
#' 
#' @keywords internal
get_args <- \(handler, schemas){
  args <- methods::formalArgs(handler)

  args |>
    lapply(\(name) {
      schema <- schemas[[name]]

      arg <- list(
        name = name,
        type = NULL
      )

      if(length(schema) > 0)
        arg$type <- schema$type

      return(arg)
    })
}

