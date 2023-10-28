import "shiny";

let endpoints = {};

Shiny.addCustomMessageHandler("communicate-set-path", (msg) => {
  console.log(msg);

  endpoints[msg.id] = msg

  console.log(endpoints);
  if(!endpoints.data)
    return;

  fetch(`${endpoints.data.path}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
});
