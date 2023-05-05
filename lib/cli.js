"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCLI = void 0;
const yargs_1 = __importDefault(require("yargs"));
const util_1 = __importDefault(require("util"));
const logger_1 = require("./logger");
const pipl_1 = require("./pipl");
const logger = (0, logger_1.getLogger)();
const piplQueryToObject = (query) => {
    try {
        return query
            .match(/([^\s:]+):((?:"((?:[^"\\]|\\[\s\S])*)")|(?:\S+))/g)
            .map((v) => v.split(":").map((v) => (v.substr(0, 1) === '"' ? JSON.parse(v) : v)))
            .reduce((r, [key, value]) => {
            r[key] = value;
            return r;
        }, {});
    }
    catch (e) {
        return {};
    }
};
async function runCLI() {
    const query = yargs_1.default.argv._.join(' ');
    const pipl = new pipl_1.PiplClient({ apiKey: process.env.PIPL_API_KEY });
    const result = await pipl.search(piplQueryToObject(query));
    if (yargs_1.default.argv.j)
        console.log(JSON.stringify(result, null, 2));
    else
        logger.info(util_1.default.inspect(result, { colors: true, depth: 15 }));
}
exports.runCLI = runCLI;
//# sourceMappingURL=cli.js.map