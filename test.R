devtools::load_all()
library(shiny)

options(shiny.port = 3000)

add <- \(x){
  x + 2
}

script <- "
  $('#btn').on('click', () => {
    communicate.com('add', {x: 1})
      .then(res => alert(`equals: ${res}`));
  })
"

ui <- fluidPage(
  # import dependencies
  useCommunicate(),
  h1("Hello"),
  tags$a("Communicate", id = "btn"),
  tags$script(HTML(script))
)

server <- \(input, output, session){
  com("add", add)
}

shinyApp(ui, server)
