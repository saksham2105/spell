"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellServerUtil = void 0;
const fs_1 = __importDefault(require("fs"));
const package_conf_json_1 = __importDefault(require("../../package.conf.json"));
class SpellServerUtil {
    constructor() {
        this.interpolationSuffix = "}";
        this.interpolationPrefix = "{";
    }
    serveStaticContent(file, response, config) {
        fs_1.default.readFile(file, 'utf8', (err, data) => {
            response.send(this.processInterpolation(data, config));
            if (err) {
                throw err;
            }
        });
    }
    getPort() {
        return package_conf_json_1.default.port;
    }
    getResourcesDir() {
        return package_conf_json_1.default.resources;
    }
    replaceDoubleBraces(html, map) {
        return html.replace(/{{(.+?)}}/g, (_, key) => {
            if (map[key] === undefined) {
                return this.interpolationPrefix + this.interpolationPrefix +
                    key + this.interpolationSuffix + this.interpolationSuffix;
            }
            else {
                return map[key];
            }
        });
    }
    processInterpolation(maskedHtml, map) {
        return this.replaceDoubleBraces(maskedHtml, map);
    }
}
exports.SpellServerUtil = SpellServerUtil;
