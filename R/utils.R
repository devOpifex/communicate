#' Make ID
#' 
#' Generate a random ID.
#' 
#' @param n Length of ID.
#' 
#' @keywords internal
make_id <- \(n = 32) {
  1:9 |>
    c(letters) |>
    c(LETTERS) |>
    sample(n) |>
    paste0(collapse = "")
}

