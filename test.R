devtools::load_all()
library(shiny)

options(shiny.port = 3000)

search <- \(term, ...){
  if(term == "")
    return(list(results = list()))

  # for case insensistive search
  term <- tolower(term)

  mtcars |>
    tibble::rownames_to_column() |>
    dplyr::filter(grepl(term, tolower(rowname))) |>
    dplyr::pull(rowname) |>
    head(10) |> # return max 10 results
    lapply(\(x) list(id = x, text = x)) |>
    (\(.) list(results = .))()
}

script <- "
  $(document).one('communicate:registered', (e) => {
    if(e.detail.id !== 'search') return;

    $('#models').select2({
      ajax: {
        url: communicate.getCom('search').path,
        dataType: 'json'
      }
    })
  })
"

ui <- fluidPage(
  theme = bslib::bs_theme(version = 5),
  tags$head(
    tags$link(
      rel = "stylesheet",
      href = "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
    ),
    tags$script(
      src = "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js",
      type = "text/javascript"
    )
  ),
  # import dependencies
  useCommunicate(),
  h1("Search a car model from mtcars"),
  tags$select(
    id = "models",
    style = "width: 100%;"
  ),
  tags$script(HTML(script))
)

server <- \(input, output, session){
  com("search", search)
}

shinyApp(ui, server)
