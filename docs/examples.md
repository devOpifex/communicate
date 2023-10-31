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

## Server-side render

This example implements a server-side rendered select input with 
[select2](https://select2.org)

```
search <- \(term, ...){
  if(term == "")
    return(list(results = list()))

  # for case insensistive search
  term <- tolower(term)

  mtcars |>
    tibble::rownames_to_column() |>
    dplyr::filter(grepl(term, tolower(rowname))) |>
    dplyr::pull(rowname) |>
    head(10) |> # return max 10 results
    lapply(\(x) list(id = x, text = x)) |>
    (\(.) list(results = .))()
}

script <- "
  $(document).one('communicate:registered', (e) => {
    if(e.detail.id !== 'search') return;

    $('#models').select2({
      ajax: {
        url: communicate.getCom('search').path,
        dataType: 'json'
      }
    })
  })
"

ui <- fluidPage(
  theme = bslib::bs_theme(version = 5),
  tags$head(
    tags$link(
      rel = "stylesheet",
      href = "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
    ),
    tags$script(
      src = "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js",
      type = "text/javascript"
    )
  ),
  # import dependencies
  useCommunicate(),
  h1("Search a car model from mtcars"),
  tags$select(
    id = "models",
    style = "width: 100%;"
  ),
  tags$script(HTML(script))
)

server <- \(input, output, session){
  com("search", search)
}

shinyApp(ui, server)
```
