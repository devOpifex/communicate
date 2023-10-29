#' Example
#' 
#' Run example
#' 
#' @export
example <- function(){
  file <- system.file(
    "example/app.R", 
    package = "communicate", 
    mustWork = TRUE
  )

  file |>
    readLines() |>
    suppressWarnings() |>
    cat("\n", sep = "\n")

  shiny::shinyAppDir(
    system.file(
      "example", 
      package = "communicate", 
      mustWork = TRUE
    )
  )
}
