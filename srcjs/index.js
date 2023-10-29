import "shiny";

let endpoints = {};

Shiny.addCustomMessageHandler("communicate-set-path", (msg) => {
  endpoints[msg.id] = msg;
  get(msg.id, { x: [1, 2, 3] })
    .then((data) => {
      console.log(data);
      console.log(typeof data);
    });
});

async function get(name, args = {}) {
  const qs = makeQuery(name, args);

  const response = await fetch(`${endpoints[name].path}&${qs}`);
  const data = await response.json();
  return data;
}

const makeQuery = (name, args) => {
  const valids = endpoints[name].args;
  const argNames = Object.keys(args);

  return argNames.map((argName) => {
    let arg = args[argName];
    const valid = valids.find((valid) => valid.name === argName);

    if (!valid) {
      throw new Error(
        `Invalid argument: ${argName}, not handled by R function`,
      );
    }

    if (!typeMatch(arg, valid)) {
      throw new Error(
        `Invalid argument: ${argName}, type mismatch, expected ${valid.type}, got ${typeof arg}`,
      );
    }

    arg = convertArg(arg);

    return `${argName}=${encodeURIComponent(arg)}`;
  }).join("&");
};

const isDate = (x) => {
  return x instanceof Date;
};

const convertArg = (arg) => {
  if (isDate(arg)) {
    return arg;
  }

  if (typeof arg === "object") {
    arg = JSON.stringify(arg);
  }

  return arg;
};

const typeMatch = (value, valid) => {
  if (!valid.type) {
    return true;
  }

  if (isDate(value) && valid.type === "date") {
    return true;
  }

  if (isDate(value) && valid.type === "posix") {
    return true;
  }

  if (typeof value === "object" && valid.type === "dataframe") {
    return true;
  }

  if (typeof value === "object" && valid.type === "list") {
    return true;
  }

  if (typeof value === "number" && valid.type === "numeric") {
    return true;
  }

  if (typeof value === "number" && valid.type === "integer") {
    return true;
  }

  if (typeof value === "string" && valid.type === "character") {
    return true;
  }

  return false;
};

export { get };
