# Examples

Some examples below, you may also want to run `communicate::example()` for a short demo.

## Types

Types are optional but are strongly recommended as it will 
make the usage of the framework much more robust.

If types are missing it attempts to detect them but may 
fail for the more complex ones, below is an example of 
sending a data.frame to R.

```r
library(shiny)
library(communicate)

add_df <- \(df){
  df$x + 1L
}

script <- "
  $('#btn').on('click', (e) => {
    communicate.com('add', {df: [{x: 1}, {x: 2}]})
      .then(res => console.info(`equals: ${res}`))
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
```

## Render

Below we fetch a dataset and render it in a table.

```r
library(shiny)
library(communicate)

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
```
