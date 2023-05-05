"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiplClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = __importDefault(require("url"));
const querystring_1 = __importDefault(require("querystring"));
class PiplClient {
    constructor({ apiKey }) {
        this.apiKey = apiKey || process.env.PIPL_API_KEY;
    }
    async search(o) {
        return await (await (0, node_fetch_1.default)(url_1.default.format({
            hostname: this.constructor.BASE_URL,
            protocol: "https:",
            pathname: "/search",
            search: "?" + querystring_1.default.stringify({ ...o, key: this.apiKey }),
        }), {
            method: "GET",
        })).json();
    }
    async personSearch(o) {
        return await (await (0, node_fetch_1.default)(url_1.default.format({
            hostname: this.constructor.BASE_URL,
            protocol: "https:",
            pathname: "/search",
            search: "?" +
                querystring_1.default.stringify({
                    person: JSON.stringify(o),
                    key: this.apiKey,
                }),
        }), {
            method: "GET",
        })).json();
    }
}
PiplClient.BASE_URL = "api.pipl.com";
exports.PiplClient = PiplClient;
//# sourceMappingURL=pipl.js.map