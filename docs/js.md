# JavaScript Package

## Dependency

You import the dependency with `useCommunicate()`.
Alternatively you can install the npm package, 
e.g.: if you use [packer](https://packer.john-coene.com/).

```bash
npm install @devopifex/communicate
```

Or with packer:

```r
packer::npm_install("@devopifex/communicate")
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
- `hasCom` - check if communication channel registered.
- `getCom` - get communication channel and its arguments.
- `getComs` - get all communication channels registered.

### Usage

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

Note that reactives re-register the `com` so the above may still run multiple times,
you can prevent this with.

```js
$(document).one("communicate:registered", (event) => {
  if(event.detail.id != "add")
    return;

  communicate.com("add", {x: 1, y: 2})
    .then(data => console.log(data))
    .catch(error => console.error(error))
})
```

