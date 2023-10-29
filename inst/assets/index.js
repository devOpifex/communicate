/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "shiny":
/*!************************!*\
  !*** external "Shiny" ***!
  \************************/
/***/ ((module) => {

module.exports = Shiny;

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
/* harmony export */   get: () => (/* binding */ get)
/* harmony export */ });
/* harmony import */ var shiny__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! shiny */ "shiny");
/* harmony import */ var shiny__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(shiny__WEBPACK_IMPORTED_MODULE_0__);


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



})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7OztBQ05lOztBQUVmOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsY0FBYztBQUM5QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRCxrQ0FBa0M7QUFDbEM7O0FBRUEsa0NBQWtDLHFCQUFxQixHQUFHLEdBQUc7QUFDN0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QixRQUFRO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QixRQUFRLDRCQUE0QixXQUFXLFFBQVEsV0FBVztBQUMvRjtBQUNBOztBQUVBOztBQUVBLGNBQWMsUUFBUSxHQUFHLHdCQUF3QjtBQUNqRCxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVlIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY29tbXVuaWNhdGUvZXh0ZXJuYWwgdmFyIFwiU2hpbnlcIiIsIndlYnBhY2s6Ly9jb21tdW5pY2F0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jb21tdW5pY2F0ZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jb21tdW5pY2F0ZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY29tbXVuaWNhdGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jb21tdW5pY2F0ZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NvbW11bmljYXRlLy4vc3JjanMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBTaGlueTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwic2hpbnlcIjtcblxubGV0IGVuZHBvaW50cyA9IHt9O1xuXG5TaGlueS5hZGRDdXN0b21NZXNzYWdlSGFuZGxlcihcImNvbW11bmljYXRlLXNldC1wYXRoXCIsIChtc2cpID0+IHtcbiAgZW5kcG9pbnRzW21zZy5pZF0gPSBtc2c7XG4gIGdldChtc2cuaWQsIHsgeDogWzEsIDIsIDNdIH0pXG4gICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgY29uc29sZS5sb2codHlwZW9mIGRhdGEpO1xuICAgIH0pO1xufSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldChuYW1lLCBhcmdzID0ge30pIHtcbiAgY29uc3QgcXMgPSBtYWtlUXVlcnkobmFtZSwgYXJncyk7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtlbmRwb2ludHNbbmFtZV0ucGF0aH0mJHtxc31gKTtcbiAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIGRhdGE7XG59XG5cbmNvbnN0IG1ha2VRdWVyeSA9IChuYW1lLCBhcmdzKSA9PiB7XG4gIGNvbnN0IHZhbGlkcyA9IGVuZHBvaW50c1tuYW1lXS5hcmdzO1xuICBjb25zdCBhcmdOYW1lcyA9IE9iamVjdC5rZXlzKGFyZ3MpO1xuXG4gIHJldHVybiBhcmdOYW1lcy5tYXAoKGFyZ05hbWUpID0+IHtcbiAgICBsZXQgYXJnID0gYXJnc1thcmdOYW1lXTtcbiAgICBjb25zdCB2YWxpZCA9IHZhbGlkcy5maW5kKCh2YWxpZCkgPT4gdmFsaWQubmFtZSA9PT0gYXJnTmFtZSk7XG5cbiAgICBpZiAoIXZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIGFyZ3VtZW50OiAke2FyZ05hbWV9LCBub3QgaGFuZGxlZCBieSBSIGZ1bmN0aW9uYCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF0eXBlTWF0Y2goYXJnLCB2YWxpZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEludmFsaWQgYXJndW1lbnQ6ICR7YXJnTmFtZX0sIHR5cGUgbWlzbWF0Y2gsIGV4cGVjdGVkICR7dmFsaWQudHlwZX0sIGdvdCAke3R5cGVvZiBhcmd9YCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgYXJnID0gY29udmVydEFyZyhhcmcpO1xuXG4gICAgcmV0dXJuIGAke2FyZ05hbWV9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGFyZyl9YDtcbiAgfSkuam9pbihcIiZcIik7XG59O1xuXG5jb25zdCBpc0RhdGUgPSAoeCkgPT4ge1xuICByZXR1cm4geCBpbnN0YW5jZW9mIERhdGU7XG59O1xuXG5jb25zdCBjb252ZXJ0QXJnID0gKGFyZykgPT4ge1xuICBpZiAoaXNEYXRlKGFyZykpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhcmcgPT09IFwib2JqZWN0XCIpIHtcbiAgICBhcmcgPSBKU09OLnN0cmluZ2lmeShhcmcpO1xuICB9XG5cbiAgcmV0dXJuIGFyZztcbn07XG5cbmNvbnN0IHR5cGVNYXRjaCA9ICh2YWx1ZSwgdmFsaWQpID0+IHtcbiAgaWYgKCF2YWxpZC50eXBlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoaXNEYXRlKHZhbHVlKSAmJiB2YWxpZC50eXBlID09PSBcImRhdGVcIikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGlzRGF0ZSh2YWx1ZSkgJiYgdmFsaWQudHlwZSA9PT0gXCJwb3NpeFwiKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbGlkLnR5cGUgPT09IFwiZGF0YWZyYW1lXCIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsaWQudHlwZSA9PT0gXCJsaXN0XCIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgdmFsaWQudHlwZSA9PT0gXCJudW1lcmljXCIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgdmFsaWQudHlwZSA9PT0gXCJpbnRlZ2VyXCIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsaWQudHlwZSA9PT0gXCJjaGFyYWN0ZXJcIikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IHsgZ2V0IH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=