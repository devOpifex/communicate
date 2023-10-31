devtools::load_all()
library(shiny)

options(shiny.port = 3000)

add_df <- \(df){
  df$x + 1L
}

script <- "
  $('#btn').on('click', (e) => {
    console.log('click');
    communicate.com('add', {df: [{x: 1}, {x: 2}]})
      .then(res => alert(`equals: ${res}`))
      .catch(err => console.error(err));
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
  com("add", add_df)(x = Dataframe)
}

shinyApp(ui, server)
