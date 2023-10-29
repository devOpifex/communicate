devtools::load_all()
library(shiny)

df <- \(x){
  return(x)
}

ui <- fluidPage(
  useCommunicate(),
  h1("Hello")
)

server <- \(input, output, session){
  com("df", df)(x = as_dataframe)
  com_run()
}

shinyApp(ui, server, options = list(port = 3000L))
