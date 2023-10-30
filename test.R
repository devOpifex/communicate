devtools::load_all()
library(shiny)

options(shiny.port = 3000)

add <- \(x){
  x + 2
}

script <- "
  $(document).on('communicate:registered', (event) => {
    console.log(event.detail)
  })
  $('#btn').on('click', (e) => {
    communicate.com('add', {x: 1})
      .then(res => alert(`equals: ${res}`));
  })
"

ui <- fluidPage(
  # import dependencies
  useCommunicate(),
  tags$head(
    tags$script(HTML(script))
  ),
  h1("Hello"),
  tags$a("Communicate", id = "btn"),
)

server <- \(input, output, session){
  com("add", add)(x = Integer)
}

shinyApp(ui, server)
