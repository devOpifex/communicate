devtools::load_all()
library(shiny)

add <- \(x, y = 41) {
  x + y
}

ui <- fluidPage(
  useCommunicate(),
  h1("Hello")
)

server <- \(input, output, session){
  d <- reactiveValues(
    x = runif(10)
  )

  com("add")(add)
  communicate()
}

shinyApp(ui, server, options = list(port = 3000L))
