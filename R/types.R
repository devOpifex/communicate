#' Types
as_character <- \(x){
  as.character(x)
}

as_integer <- \(x){
  as.integer(x)
}

as_numeric <- \(x){
  as.numeric(x)
}

as_date <- \(x){
  as.Date(x)
}

as_posixct <- \(x){
  as.POSIXct(x)
}

as_posixlt <- \(x){
  as.POSIXlt(x)
}

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

    if(is.function(converter))
      return(converter(arg))

    date <- tryCatch(as.Date(arg), error = \(e) NULL)

    if(!is.null(date))
      return(date)

    dttm <- tryCatch(as.POSIXct(arg), error = \(e) NULL)

    if(!is.null(dttm))
      return(dttm)

    nbr <- as.numeric(arg)

    if(!is.na(nbr))
      return(nbr)

    if(arg %in% c("TRUE", "true"))
      return(TRUE)

    if(arg %in% c("FALSE", "false"))
      return(FALSE)

    return(arg)
  })

  names(parsed) <- names(args)

  return(parsed)
}
