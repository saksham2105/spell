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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const spell_server_util_1 = require("./spell.server.util");
const package_conf_json_1 = __importDefault(require("../../package.conf.json"));
const getNewServerUtilInstance = () => new spell_server_util_1.SpellServerUtil();
const spellServerUtil = getNewServerUtilInstance();
const spellServer = (0, express_1.default)();
spellServer.use(express_1.default.static(process.cwd() + "/src/" + spellServerUtil.getResourcesDir()));
spellServer.get('/', (request, response, next) => {
    spellServerUtil.serveStaticContent(process.cwd() + "/src/resources/spell.html", response, package_conf_json_1.default);
});
spellServer.get('/app', (request, response, next) => {
    Promise.resolve().then(() => __importStar(require("../../dist/src/app/app.component"))).then((module) => {
        var obj = eval("new " + module.AppComponent + "()");
        var keys = Object.keys(obj);
        try {
            obj["ngOnIit"]();
        }
        catch (e) {
            console.log("Exception occured as " + e);
        }
        obj["getTrainingName"](); //Function Calling
        obj["setTitle"]("nicesasas"); //Function Calling
        obj["getTrainingName"](); //Function Calling
        for (let i = 0; i < keys.length; i++) {
            console.log(obj[keys[0]]);
        }
    }).catch((e) => {
        console.log("Error " + e);
    });
    let map = {};
    spellServerUtil.serveStaticContent(process.cwd() + "/src/app/app.component.html", response, map);
});
spellServer.listen(spellServerUtil.getPort(), () => {
    console.log(`Server is running on port ${spellServerUtil.getPort()}`);
});
