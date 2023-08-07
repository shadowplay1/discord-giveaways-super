"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.ms=void 0;const s=1e3,m=60*s,h=60*m,d=24*h,w=7*d,y=365.25*d,ms=(s,e={long:!0})=>{e=e||{};const r=typeof s;return"string"===r&&s.length>0?parse(s):"number"===r&&isFinite(s)?e.long?fmtLong(s):fmtShort(s):null};function parse(e){if((e=String(e)).length>100)return;const r=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);if(!r)return;const n=parseFloat(r[1]);switch((r[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return n*y;case"weeks":case"week":case"w":return n*w;case"days":case"day":case"d":return n*d;case"hours":case"hour":case"hrs":case"hr":case"h":return n*h;case"minutes":case"minute":case"mins":case"min":case"m":return n*m;case"seconds":case"second":case"secs":case"sec":case"s":return n*s;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n;default:return}}function fmtShort(e){const r=Math.abs(e);return r>=d?Math.round(e/d)+"d":r>=h?Math.round(e/h)+"h":r>=m?Math.round(e/m)+"m":r>=s?Math.round(e/s)+"s":e+"ms"}function fmtLong(e){const r=Math.abs(e);return r>=d?plural(e,r,d,"day"):r>=h?plural(e,r,h,"hour"):r>=m?plural(e,r,m,"minute"):r>=s?plural(e,r,s,"second"):e+" ms"}function plural(s,e,r,n){const a=e>=1.5*r;return Math.round(s/r)+" "+n+(a?"s":"")}exports.ms=ms;
