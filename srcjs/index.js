import "shiny";

const endpoints = {};
const timeouts = {};

Shiny.addCustomMessageHandler("communicate-set-path", (msg) => {
  endpoints[msg.id] = msg;
  const event = new CustomEvent("communicate:registered", {
    detail: getCom(msg.id) || {},
  });

  // avoid duplicate calls
  clearTimeout(timeouts[msg.id]);
  timeouts[msg.id] = setTimeout(() => {
    document.dispatchEvent(event);
  }, 250);
});

async function com(id, args = {}) {
  if (!id) {
    throw new Error("No id provided");
  }

  if (!hasCom(id)) {
    throw new Error(`No com found for ${id}`);
  }

  if (Object.keys(endpoints).length === 0) {
    throw new Error(
      "No coms registered, did you forget to registers channels with `com()`",
    );
  }

  const qs = makeQuery(id, args);

  const response = await fetch(`${endpoints[id].path}&${qs}`);
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

const getComs = () => {
  const ep = [];
  for (const property in endpoints) {
    const prop = {
      id: endpoints[property].id,
      path: endpoints[property].path,
      args: endpoints[property].args,
    };
    ep.push(prop);
  }
  return ep;
};

const getCom = (id) => {
  if (!id) {
    throw new Error("No id provided");
  }

  if (!hasCom(id)) {
    throw new Error(`No com found for ${id}`);
  }

  return getComs().filter((com) => com.id === id)[0];
};

const hasCom = (id) => {
  if (!id) {
    throw new Error("No id provided");
  }

  return getComs().some((com) => com.id === id);
};

const makeQuery = (id, args) => {
  if (!id) {
    throw new Error("No id provided");
  }

  if (!args) {
    throw new Error("No args provided");
  }

  const valids = endpoints[id].args;
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

export { com, getCom, getComs, hasCom };
