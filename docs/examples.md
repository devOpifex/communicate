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
    console.log('click');
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
