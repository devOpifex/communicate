devtools::load_all()
library(shiny)

add <- \(x, y = 41) {
  x + y
}

react <- \(r) {
  r$x
}

ui <- fluidPage(
  useCommunicate(),
  h1("Hello")
)

server <- \(input, output, session){
  data <- reactiveValues(
    x = runif(10)
  )

  com("add")(add)
  com("data")(react)()(r = data)
  communicate()
}

shinyApp(ui, server, options = list(port = 3000L))
