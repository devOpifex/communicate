!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("Shiny")):"function"==typeof define&&define.amd?define(["Shiny"],t):"object"==typeof exports?exports.communicate=t(require("Shiny")):e.communicate=t(e.Shiny)}(self,(e=>(()=>{"use strict";var t={230:t=>{t.exports=e}},r={};function o(e){var n=r[e];if(void 0!==n)return n.exports;var i=r[e]={exports:{}};return t[e](i,i.exports,o),i.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};return(()=>{o.r(n),o.d(n,{com:()=>t,getCom:()=>i,getComs:()=>r,hasCom:()=>a}),o(230);let e={};async function t(t,r={}){if(!t)throw new Error("No id provided");if(!a(t))throw new Error(`No com found for ${t}`);const o=d(t,r),n=await fetch(`${e[t].path}&${o}`),i=await n.json();if(i.error)throw new Error(i.error);return i}Shiny.addCustomMessageHandler("communicate-set-path",(t=>{e[t.id]=t}));const r=()=>{const t=[];for(const r in e){const o={id:e[r].id,args:e[r].args};t.push(o)}return t},i=e=>{if(!e)throw new Error("No id provided");if(!a(e))throw new Error(`No com found for ${e}`);return r().filter((t=>t.id===e))},a=e=>{if(!e)throw new Error("No id provided");return r().some((t=>t.id===e))},d=(t,r)=>{const o=e[t].args;return Object.keys(r).map((e=>{let t=r[e];const n=o.find((t=>t.name===e));if(!n)throw new Error(`Invalid argument: ${e}, not handled by R function`);if(!c(t,n))throw new Error(`Invalid argument: ${e}, type mismatch, expected ${n.type}, got ${typeof t}`);return t=p(t),`${e}=${encodeURIComponent(t)}`})).join("&")},f=e=>e instanceof Date,p=e=>(f(e)||"object"==typeof e&&(e=JSON.stringify(e)),e),c=(e,t)=>!t.type||!(!f(e)||"date"!==t.type)||!(!f(e)||"posix"!==t.type)||"object"==typeof e&&"dataframe"===t.type||"object"==typeof e&&"list"===t.type||"number"==typeof e&&"numeric"===t.type||"number"==typeof e&&"integer"===t.type||"string"==typeof e&&"character"===t.type})(),n})()));