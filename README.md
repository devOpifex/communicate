# Communicate

Small framework to communicate between Shiny client and server via HTTP requests.

## Installation

```r
# install.packages("remotes")
remotes::install_github("devOpifex/communicate")
```

## How it works

Create a shiny application and "commincation channels."
Add callback functions with `com` and start running
channels with `com_run`.

```r
library(shiny)
librar(communicate)

options(shiny.fullstacktrace = TRUE)

add <- \(x, y = 1){
  x + y
}

ui <- fluidPage(
  # import dependencies
  useCommunicate(),
  h1("Hello")
)

server <- \(input, output, session){
  com("add", add)
  com_run()
}

shinyApp(ui, server, options = list(port = 3000L))
```

Then use the JavaScript library to communicate.
Note that the `co

```r
library(shiny)
librar(communicate)

options(shiny.fullstacktrace = TRUE)

add <- \(x, y = 1){
  x + y
}

script <- "
  $('#btn').on('click', () => {
    communicate.com('add', {x: 1})
      .then(res => console.log(res));
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
  com("add", add)
  com_run()
}

shinyApp(ui, server, options = list(port = 3000L))
```

