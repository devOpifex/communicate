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

## Error handling

Finally, you can pass an error handler.

Note that the code below purposely fails.

```r
library(shiny)
library(communicate)

add <- \(x, y){
  x + y + "error" # this will cause an error
} 

err <- \(error){
  cat("Aaaaah, an error!\n")
  print(error)
}

# more on JavaScript error handling in the JavaScript page
script <- "
  $('#btn').on('click', () => {
    communicate.com('add', {x: 1})
      .then(res => alert(`equals: ${res}`))
      .catch(error => alert('There was an error')); // catch error
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
  com("add", add)(x = Integer, y = Numeric)(y = 1.1)(err)
}

shinyApp(ui, server)
```

## Custom types

You can create custom types with the `create_type` function,
this function takes 2 arguments:

1. `r_converter` The R function that converts the value received from the
server to the correct type in R, e.g.: `as.numeric`
2. `js_checker` The JavaScript function that checks that the value one
wants to send from the client is valid.

See 2) above, Communicate checks for the type JavaScript-side, this can 
avoid headaches R-side: there is no need to send that value to the server
if it is not valid.

In the app below we create a new type that ensures the value we send is pie ~3.14.

```r
library(shiny)
library(communicate)

add <- \(x, y){
  x + y
} 

script <- "
  $('#btn').on('click', () => {
    communicate.com('add', {x: 3.14})
      .then(res => alert(`equals: ${res}`))
      .catch(error => alert('There was an error')); // catch error
  })
"

# create custom type
is_pie <- create_type(
  r_converter = \(x) x == 3.14,
  js_checker = "(x) => x === 3.14"
)

ui <- fluidPage(
  # import dependencies
  useCommunicate(),
  h1("Hello"),
  tags$a("Communicate", id = "btn"),
  tags$script(HTML(script))
)

server <- \(input, output, session){
  com("add", add)(x = is_pie, y = Numeric)(y = 1.1)
}

shinyApp(ui, server)
```
