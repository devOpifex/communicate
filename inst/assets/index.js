!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("Shiny")):"function"==typeof define&&define.amd?define(["Shiny"],t):"object"==typeof exports?exports.communicate=t(require("Shiny")):e.communicate=t(e.Shiny)}(self,(e=>(()=>{"use strict";var t={230:t=>{t.exports=e}},r={};function o(e){var n=r[e];if(void 0!==n)return n.exports;var i=r[e]={exports:{}};return t[e](i,i.exports,o),i.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};return(()=>{o.r(n),o.d(n,{com:()=>r,getCom:()=>d,getComs:()=>i,hasCom:()=>a}),o(230);const e={},t={};async function r(t,r={}){if(!t)throw new Error("No id provided");if(!a(t))throw new Error(`No com found for ${t}`);if(0===Object.keys(e).length)throw new Error("No coms registered, did you forget to registers channels with `com()`");const o=c(t,r),n=await fetch(`${e[t].path}&${o}`),i=await n.json();if(i.error)throw new Error(i.error);return i}Shiny.addCustomMessageHandler("communicate-set-path",(r=>{e[r.id]=r;const o=new CustomEvent("communicate:registered",{detail:d(r.id)||{}});clearTimeout(t[r.id]),t[r.id]=setTimeout((()=>{document.dispatchEvent(o)}),250)}));const i=()=>{const t=[];for(const r in e){const o={id:e[r].id,args:e[r].args};t.push(o)}return t},d=e=>{if(!e)throw new Error("No id provided");if(!a(e))throw new Error(`No com found for ${e}`);return i().filter((t=>t.id===e))},a=e=>{if(!e)throw new Error("No id provided");return i().some((t=>t.id===e))},c=(t,r)=>{const o=e[t].args;return Object.keys(r).map((e=>{let t=r[e];const n=o.find((t=>t.name===e));if(!n)throw new Error(`Invalid argument: ${e}, not handled by R function`);if(!p(t,n))throw new Error(`Invalid argument: ${e}, type mismatch, expected ${n.type}, got ${typeof t}`);return t=f(t),`${e}=${encodeURIComponent(t)}`})).join("&")},s=e=>e instanceof Date,f=e=>(s(e)||"object"==typeof e&&(e=JSON.stringify(e)),e),p=(e,t)=>!t.type||!(!s(e)||"date"!==t.type)||!(!s(e)||"posix"!==t.type)||"object"==typeof e&&"dataframe"===t.type||"object"==typeof e&&"list"===t.type||"number"==typeof e&&"numeric"===t.type||"number"==typeof e&&"integer"===t.type||"string"==typeof e&&"character"===t.type})(),n})()));