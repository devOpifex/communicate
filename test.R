library(shiny)
library(communicate)

options(shiny.fullstacktrace = TRUE)

add <- \(x, y){
  x + y
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
  com("add", add)(x = Integer, y = Numeric)(y = 1.1)
  com_run()
}

shinyApp(ui, server)
