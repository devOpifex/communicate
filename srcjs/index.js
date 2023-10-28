import "shiny";

// In shiny server use:
// session$sendCustomMessage('packer-alert', 'hello packer!')
Shiny.addCustomMessageHandler("communicate-paths", (msg) => {
  console.log(msg);
  fetch(`${msg.endpoints[0].path}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
});
