devtools::load_all()
library(shiny)

ui <- fluidPage(
  useCommunicate(),
  h1("Hello")
)

add <- \(x, y = 41) {
  x + y
}

server <- \(...){
  com("add")(add)(x = as_integer, y = as_integer)
  communicate()
}

shinyApp(ui, server, options = list(port = 3000L))
