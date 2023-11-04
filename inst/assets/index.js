(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Shiny"));
	else if(typeof define === 'function' && define.amd)
		define(["Shiny"], factory);
	else if(typeof exports === 'object')
		exports["communicate"] = factory(require("Shiny"));
	else
		root["communicate"] = factory(root["Shiny"]);
})(self, (__WEBPACK_EXTERNAL_MODULE_shiny__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "shiny":
/*!************************!*\
  !*** external "Shiny" ***!
  \************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_shiny__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./srcjs/index.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   com: () => (/* binding */ com),
/* harmony export */   getCom: () => (/* binding */ getCom),
/* harmony export */   getComs: () => (/* binding */ getComs),
/* harmony export */   hasCom: () => (/* binding */ hasCom)
/* harmony export */ });
/* harmony import */ var shiny__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! shiny */ "shiny");
/* harmony import */ var shiny__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(shiny__WEBPACK_IMPORTED_MODULE_0__);


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



})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7Ozs7QUNWQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOZTs7QUFFZjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQyxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7O0FBRUQsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdDQUF3QyxHQUFHO0FBQzNDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsa0NBQWtDLG1CQUFtQixHQUFHLEdBQUc7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdDQUF3QyxHQUFHO0FBQzNDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QixRQUFRO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QixRQUFRLDRCQUE0QixXQUFXLFFBQVEsV0FBVztBQUMvRjtBQUNBOztBQUVBOztBQUVBLGNBQWMsUUFBUSxHQUFHLHdCQUF3QjtBQUNqRCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUV3QyIsInNvdXJjZXMiOlsid2VicGFjazovL2NvbW11bmljYXRlL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9jb21tdW5pY2F0ZS9leHRlcm5hbCB1bWQgXCJTaGlueVwiIiwid2VicGFjazovL2NvbW11bmljYXRlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NvbW11bmljYXRlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NvbW11bmljYXRlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jb21tdW5pY2F0ZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NvbW11bmljYXRlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY29tbXVuaWNhdGUvLi9zcmNqcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJTaGlueVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJTaGlueVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJjb21tdW5pY2F0ZVwiXSA9IGZhY3RvcnkocmVxdWlyZShcIlNoaW55XCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJjb21tdW5pY2F0ZVwiXSA9IGZhY3Rvcnkocm9vdFtcIlNoaW55XCJdKTtcbn0pKHNlbGYsIChfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3NoaW55X18pID0+IHtcbnJldHVybiAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfc2hpbnlfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwic2hpbnlcIjtcblxuY29uc3QgZW5kcG9pbnRzID0ge307XG5jb25zdCB0aW1lb3V0cyA9IHt9O1xuXG5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcImNvbW11bmljYXRlLXNldC1wYXRoXCIsIChtc2cpID0+IHtcbiAgZW5kcG9pbnRzW21zZy5pZF0gPSBtc2c7XG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiY29tbXVuaWNhdGU6cmVnaXN0ZXJlZFwiLCB7XG4gICAgZGV0YWlsOiBnZXRDb20obXNnLmlkKSB8fCB7fSxcbiAgfSk7XG5cbiAgLy8gYXZvaWQgZHVwbGljYXRlIGNhbGxzXG4gIGNsZWFyVGltZW91dCh0aW1lb3V0c1ttc2cuaWRdKTtcbiAgdGltZW91dHNbbXNnLmlkXSA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9LCAyNTApO1xufSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbShpZCwgYXJncyA9IHt9KSB7XG4gIGlmICghaWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBpZCBwcm92aWRlZFwiKTtcbiAgfVxuXG4gIGlmICghaGFzQ29tKGlkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgTm8gY29tIGZvdW5kIGZvciAke2lkfWApO1xuICB9XG5cbiAgaWYgKE9iamVjdC5rZXlzKGVuZHBvaW50cykubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJObyBjb21zIHJlZ2lzdGVyZWQsIGRpZCB5b3UgZm9yZ2V0IHRvIHJlZ2lzdGVycyBjaGFubmVscyB3aXRoIGBjb20oKWBcIixcbiAgICApO1xuICB9XG5cbiAgY29uc3QgcXMgPSBtYWtlUXVlcnkoaWQsIGFyZ3MpO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7ZW5kcG9pbnRzW2lkXS5wYXRofSYke3FzfWApO1xuICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICBpZiAoZGF0YS5lcnJvcikge1xuICAgIHRocm93IG5ldyBFcnJvcihkYXRhLmVycm9yKTtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn1cblxuY29uc3QgZ2V0Q29tcyA9ICgpID0+IHtcbiAgY29uc3QgZXAgPSBbXTtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBpbiBlbmRwb2ludHMpIHtcbiAgICBjb25zdCBwcm9wID0ge1xuICAgICAgaWQ6IGVuZHBvaW50c1twcm9wZXJ0eV0uaWQsXG4gICAgICBwYXRoOiBlbmRwb2ludHNbcHJvcGVydHldLnBhdGgsXG4gICAgICBhcmdzOiBlbmRwb2ludHNbcHJvcGVydHldLmFyZ3MsXG4gICAgfTtcbiAgICBlcC5wdXNoKHByb3ApO1xuICB9XG4gIHJldHVybiBlcDtcbn07XG5cbmNvbnN0IGdldENvbSA9IChpZCkgPT4ge1xuICBpZiAoIWlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gaWQgcHJvdmlkZWRcIik7XG4gIH1cblxuICBpZiAoIWhhc0NvbShpZCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGNvbSBmb3VuZCBmb3IgJHtpZH1gKTtcbiAgfVxuXG4gIHJldHVybiBnZXRDb21zKCkuZmlsdGVyKChjb20pID0+IGNvbS5pZCA9PT0gaWQpWzBdO1xufTtcblxuY29uc3QgaGFzQ29tID0gKGlkKSA9PiB7XG4gIGlmICghaWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBpZCBwcm92aWRlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBnZXRDb21zKCkuc29tZSgoY29tKSA9PiBjb20uaWQgPT09IGlkKTtcbn07XG5cbmNvbnN0IG1ha2VRdWVyeSA9IChpZCwgYXJncykgPT4ge1xuICBpZiAoIWlkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gaWQgcHJvdmlkZWRcIik7XG4gIH1cblxuICBpZiAoIWFyZ3MpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhcmdzIHByb3ZpZGVkXCIpO1xuICB9XG5cbiAgY29uc3QgdmFsaWRzID0gZW5kcG9pbnRzW2lkXS5hcmdzO1xuICBjb25zdCBhcmdOYW1lcyA9IE9iamVjdC5rZXlzKGFyZ3MpO1xuXG4gIHJldHVybiBhcmdOYW1lcy5tYXAoKGFyZ05hbWUpID0+IHtcbiAgICBsZXQgYXJnID0gYXJnc1thcmdOYW1lXTtcbiAgICBjb25zdCB2YWxpZCA9IHZhbGlkcy5maW5kKCh2YWxpZCkgPT4gdmFsaWQubmFtZSA9PT0gYXJnTmFtZSk7XG5cbiAgICBpZiAoIXZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIGFyZ3VtZW50OiAke2FyZ05hbWV9LCBub3QgaGFuZGxlZCBieSBSIGZ1bmN0aW9uYCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF0eXBlTWF0Y2goYXJnLCB2YWxpZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEludmFsaWQgYXJndW1lbnQ6ICR7YXJnTmFtZX0sIHR5cGUgbWlzbWF0Y2gsIGV4cGVjdGVkICR7dmFsaWQudHlwZX0sIGdvdCAke3R5cGVvZiBhcmd9YCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgYXJnID0gY29udmVydEFyZyhhcmcpO1xuXG4gICAgcmV0dXJuIGAke2FyZ05hbWV9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGFyZyl9YDtcbiAgfSkuam9pbihcIiZcIik7XG59O1xuXG5jb25zdCBpc0RhdGUgPSAoeCkgPT4ge1xuICByZXR1cm4geCBpbnN0YW5jZW9mIERhdGU7XG59O1xuXG5jb25zdCBjb252ZXJ0QXJnID0gKGFyZykgPT4ge1xuICBpZiAoaXNEYXRlKGFyZykpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhcmcgPT09IFwib2JqZWN0XCIpIHtcbiAgICBhcmcgPSBKU09OLnN0cmluZ2lmeShhcmcpO1xuICB9XG5cbiAgcmV0dXJuIGFyZztcbn07XG5cbmNvbnN0IHR5cGVNYXRjaCA9ICh2YWx1ZSwgdmFsaWQpID0+IHtcbiAgaWYgKCF2YWxpZC50eXBlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoaXNEYXRlKHZhbHVlKSAmJiB2YWxpZC50eXBlID09PSBcImRhdGVcIikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGlzRGF0ZSh2YWx1ZSkgJiYgdmFsaWQudHlwZSA9PT0gXCJwb3NpeFwiKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbGlkLnR5cGUgPT09IFwiZGF0YWZyYW1lXCIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsaWQudHlwZSA9PT0gXCJsaXN0XCIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgdmFsaWQudHlwZSA9PT0gXCJudW1lcmljXCIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgdmFsaWQudHlwZSA9PT0gXCJpbnRlZ2VyXCIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsaWQudHlwZSA9PT0gXCJjaGFyYWN0ZXJcIikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IHsgY29tLCBnZXRDb20sIGdldENvbXMsIGhhc0NvbSB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9