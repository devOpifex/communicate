RESERVED_TYPES <- c(
  "character",
  "integer",
  "numeric",
  "date",
  "posix",
  "dataframe",
  "list",
  "function"
)

#' Type Converters
#' 
#' Type converters for convenience.
#' 
#' @name converters.
#' @export
Character <- list( # nolint
  fn = as.character,
  type = "character"
)

#' @rdname converters.
#' @export
Integer <- list( # nolint
  fn = as.integer,
  type = "integer"
)

#' @rdname converters.
#' @export
Numeric <- list( # nolint
  fn = as.numeric,
  type = "numeric"
)

#' @rdname converters.
#' @export
Date <- list( # nolint
  fn = as.Date,
  type = "date"
)

#' @rdname converters.
#' @export
Posixct <- list( # nolint
  fn = as.POSIXct,
  type = "posix"
)

#' @rdname converters.
#' @export
Posixlt <- list( # nolint
  fn = as.POSIXlt,
  type = "posix"
)

#' @importFrom jsonlite fromJSON
#' @rdname converters.
#' @export
Dataframe <- list( # nolint
  fn = fromJSON,
  type = "dataframe"
)

#' @importFrom jsonlite fromJSON
#' @rdname converters.
#' @export
List <- list( # nolint
  fn = \(x) fromJSON(x, simplifyMatrix = FALSE),
  type = "list"
)

#' @importFrom jsonlite fromJSON
#' @rdname converters.
#' @export
Function <- list( # nolint
  fn = as.character,
  type = "function"
)

#' Parse Arguments
#' 
#' Attempts to parse query string for embeds into R objects.
#' 
#' @param args Parsed query string.
#' @param converters List of converters.
#' 
#' @keywords internal
parse_args <- function(args = list(), converters = list()) { # nolint
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
#' @param handler Function handler.
#' @param schemas List of schemas.
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

#' Checks that arguments passed matched that in function
#' 
#' @param callback Callback function to check against.
#' @param ... Arguments.
#' 
#' @keywords .Internal
check_args_match <- \(callback, ...) {
  args <- list(...)

  if(length(args) == 0L)
    return()

  args <- names(args)
  cb_args <- methods::formalArgs(callback)

  if(length(cb_args) == 0L)
    stop("handler takes no argument", call. = FALSE)

  extra_args <- args[!(args %in% cb_args)]

  if(length(extra_args) == 0L)
    return()

  extra_args_str <- paste(extra_args, collapse = ", ")

  sprintf(
    "arguments not found in handler: %s",
    extra_args_str
  ) |> 
    stop(call. = FALSE)
}

#' Create type
#' 
#' Create a new type with its associated checker and converter.
#' 
#' @param r_converter R converter function to transform the value.
#'    received from the server to the desired type in R.
#' @param js_checker JavaScript checker function to check if the value
#'    received from the client is of the desired type.
#' @param name Name of the type.
#' 
#' @export
create_type <- function(
  r_converter,
  js_checker = NULL,
  name = NULL
){
  if(missing(r_converter)) stop("missing `r_converter`")

  if(is.null(name))
    name <- letters |>
      c(1:9) |>
      sample() |>
      (\(x) paste0(x, collapse = ""))()

  if(name %in% RESERVED_TYPES)
    stop("this `name` is reserved")

  env$types <- append(
    env$types,
    list(
      list(
        type = name,
        r_converter = r_converter,
        js_checker = js_checker
      )
    )
  )

  invisible(
    list(
      fn = r_converter,
      type = name
    )
  )
}
