devtools::load_all()
library(shiny)

options(shiny.fullstacktrace = TRUE, shiny.port = 3000)

add <- \(x, y){
  x + y
}

script <- "
  $('#btn').on('click', () => {
    communicate.com('add')
      .then(res => alert(`equals: ${res}`))
      .catch(e => alert(e))
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
  com("add", add)(x = Integer, y = Numeric)(y = 1.1)
  com_run()
}

shinyApp(ui, server)
