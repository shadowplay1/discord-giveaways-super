"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.isTimeStringValid=void 0;const ms_1=require("../../misc/ms"),isTimeStringValid=i=>{try{return(0,ms_1.ms)(i),!0}catch{return!1}};exports.isTimeStringValid=isTimeStringValid;
