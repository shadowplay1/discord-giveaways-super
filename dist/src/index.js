"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./types/misc/utils"), exports);
__exportStar(require("./types/misc/colors.interface"), exports);
__exportStar(require("./types/configurations"), exports);
__exportStar(require("./types/giveawaysEvents.interface"), exports);
__exportStar(require("./lib/managers/DatabaseManager"), exports);
__exportStar(require("./types/databaseStructure.interface"), exports);
__exportStar(require("./types/databaseType.enum"), exports);
__exportStar(require("./structures/defaultConfig"), exports);
__exportStar(require("./structures/giveawayTemplate"), exports);
__exportStar(require("./lib/util/functions/checkConfiguration.function"), exports);
__exportStar(require("./lib/util/functions/checkUpdates.function"), exports);
__exportStar(require("./lib/util/functions/typeOf.function"), exports);
__exportStar(require("./lib/util/functions/time.function"), exports);
__exportStar(require("./lib/util/classes/Logger"), exports);
__exportStar(require("./lib/util/classes/JSONParser"), exports);
__exportStar(require("./lib/util/classes/MessageUtils"), exports);
__exportStar(require("./lib/util/classes/Emitter"), exports);
__exportStar(require("./lib/util/classes/GiveawaysError"), exports);
__exportStar(require("./lib/util/classes/TypedObject"), exports);
__exportStar(require("./Giveaways"), exports);
__exportStar(require("./lib/Giveaway"), exports);
__exportStar(require("./lib/giveaway.interface"), exports);
