import "shiny";

let endpoints = {};

Shiny.addCustomMessageHandler("communicate-set-path", (msg) => {
  console.log(msg);
  endpoints[msg.id] = msg
  get(msg.id, {x: 1})
    .then(data => console.log(data))
});

async function get(name, args = {}) {
  const qs = Object.keys(args)
    .map(key => {
      return `${key}=${encodeURIComponent(args[key])}`;
    })
    .join('&');

  return fetch(`${endpoints[name].path}&${qs}`)
    .then(res => res.json())
    .then(data => {
      return(data)
    });
}

export { get };
