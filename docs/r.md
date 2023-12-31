# R Package

## Installation

```r
# install.packages("remotes")
remotes::install_github("devOpifex/communicate")
```

## Usage

Create a shiny application and "commincation channels."
Add callback functions with `com`.

```r
library(shiny)
library(communicate)

add <- \(x){
  x + 2
}

ui <- fluidPage(
  h1("Hello")
)

server <- \(input, output, session){
  com("add", add)
}

shinyApp(ui, server)
```

Then use the JavaScript library to communicate.

```r
library(shiny)
library(communicate)

add <- \(x){
  x + 2
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
  com("add", add)
}

shinyApp(ui, server)
```

## Types

Though optional it is recommended to specify the types of the arguments
of your callback function. This enables type conversion and type check when communicating from the 
client.

Existing types:

- `Character`
- `Numeric`
- `Integer`
- `Date`
- `Posixct`
- `Posixlt`
- `Character`
- `List`

```r
library(shiny)
library(communicate)

add <- \(x){
  x + 2
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
  com("add", add)(x = Integer)
}

shinyApp(ui, server)
```

## Defaults

You can also specifiy callback functions' argument defaults as done below.

```r
library(shiny)
library(communicate)

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
}

shinyApp(ui, server)
```
