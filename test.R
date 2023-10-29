devtools::load_all()
library(shiny)

options(shiny.fullstacktrace = TRUE)

df <- \(x){
  return(x)
}

ui <- fluidPage(
  useCommunicate(),
  h1("Hello")
)

server <- \(input, output, session){
  com("df", df)
  com_run()
}

shinyApp(ui, server, options = list(port = 3000L))
