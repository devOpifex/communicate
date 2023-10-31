devtools::load_all()
library(shiny)

options(shiny.port = 3000)

get_dataset <- \(dataset){
  data <- dataset |> get()

  list(
    header = names(data),
    data = data |> unname()
  )
}

script <- "
  $('#btn').on('click', (e) => {
    const ds = $('#dataset').val();
    communicate.com('get', {dataset: ds})
      .then((res) => {
        const header = res.header.map(el => '<th>' + el + '</th>').join('');
        const rows = res.data.map(row => {
          row = row.map(el => '<td>' + el + '</td>').join('');  
          return '<tr>' + row + '</tr>';
        }).join('');
        $('#output thead tr').html(header);
        $('#output tbody').html(rows); 
      })
      .catch(err => console.error(err));
  })
"

ui <- fluidPage(
  # import dependencies
  useCommunicate(),
  h1("Hello"),
  selectInput(
    "dataset",
    "Select Dataset",
    choices = c("cars", "mtcars", "iris")
  ),
  tags$a("Display table", id = "btn", class = "btn btn-primary"),
  tags$table(
    id = "output",
    class = "table",
    tags$thead(tags$tr()),
    tags$tbody()
  ),
  tags$script(HTML(script))
)

server <- \(input, output, session){
  com("get", get_dataset)(dataset = Character)(dataset = "mtcars")
}

shinyApp(ui, server)
