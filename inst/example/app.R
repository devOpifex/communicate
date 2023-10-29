library(shiny)
library(communicate)

script <- "
$(() => {
  $('#btn').on('click', (_event) => {
    const n = $('#slider').val();
    communicate.com('data', {n: parseInt(n)})
      .then(data => {
        const cnt = data.map(d => `<h1>${d}</h1>`);
        $('#output').html(cnt);
      });
  });
})"

get_data <- function(n){
  n |>
    seq() |>
    lapply(\(i) {
      sample(letters, 10, replace = TRUE) |>
        paste0(collapse = "")
    })
}

ui <- fluidPage(
  tags$head(tags$script(HTML(script))),
  useCommunicate(),
  p(
    "Pressing the button executes a",
    tags$code("GET"),
    "request that generates",
    tags$code("n"),
    "number of random strings",
    "and renders them in the output div."
  ),
  actionButton("btn", "Click me to communicate"),
  sliderInput("slider", "Slider", value = 4, min = 3, max = 10),
  div(id = "output")
)

server <- \(input, output, session){
  com("data", get_data)(n = Integer)(n = 5)
}

shinyApp(ui, server)
