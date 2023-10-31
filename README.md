<div align="center">

<img src="inst/logo.png" height=200 />

Small framework to communicate between Shiny client and server via HTTP requests.
Run `communicate::example()` for a short demo.

</div>

## Installation

```r
# install.packages("remotes")
remotes::install_github("devOpifex/communicate")
```

## How it works

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

### Types

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

### Defaults

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

## Errors

Ideally you'd want to catch errors as shown below,
where the callback fails because there is no default for `x`.

```r
library(shiny)
library(communicate)

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
}

shinyApp(ui, server)
```

## JavaScript

Accessible from `communicate`, functions:

- `com` - communicate.
- `comOnce` - communicate once.
- `hasCom` - check if communication channel registered.
- `getCom` - get communication channel and its arguments.
- `getComs` - get all communication channels registered.

### Examples

```js
communicate.hasCom("add")

communicate.getCom("add")

communicate.com("add", {x: 1, y: 2})
  .then(data => console.log(data))
  .catch(error => console.error(error))
```

You can also listen to the `communicate:registered` event on the `document` for
new communication channels registered.
This is useful when willing to run things on load.

```js
//  this might fail because
// it may run before the com is registered
$(() => {
  communicate.com("add", {x: 1, y: 2})
    .then(data => console.log(data))
    .catch(error => console.error(error))
});

// will run when the channel is registered
$(document).on("communicate:registered", (event) => {
  if(event.detail.id != "add")
    return;

  communicate.com("add", {x: 1, y: 2})
    .then(data => console.log(data))
    .catch(error => console.error(error))
})
```

Note that reactives re-register the `com` so the above may still run multiple times.
If you want to prevent this use `comOnce`.
