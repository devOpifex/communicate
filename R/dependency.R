#' Dependencies for communicate
#' 
#' Dependencies for communicate, to place withing the Shiny UI.
#' 
#' @importFrom htmltools htmlDependency
#' 
#' @export
useCommunicate <- \() {
  htmlDependency(
		"communicate",
		version = utils::packageVersion("communicate"),
		src = "assets",
		package = "communicate",
		script = "index.js"
	)
}
