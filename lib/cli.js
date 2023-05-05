"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCLI = exports.loadFiles = void 0;
const yargs_1 = __importDefault(require("yargs"));
const util_1 = __importDefault(require("util"));
const logger_1 = require("./logger");
const pipl_1 = require("./pipl");
const change_case_1 = require("change-case");
const fs_extra_1 = __importDefault(require("fs-extra"));
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
async function loadFiles(data) {
    const fields = [];
    for (let [k, v] of Object.entries(data)) {
        const parts = /(^.*)FromFile$/.exec(k);
        if (parts) {
            const key = parts[1];
            fields.push([key, await fs_extra_1.default.readFile(v)]);
        }
        else {
            fields.push([k, v]);
        }
    }
    return fields.reduce((r, [k, v]) => {
        r[k] = v;
        return r;
    }, {});
}
exports.loadFiles = loadFiles;
async function runCLI() {
    const query = yargs_1.default.argv._.join(' ');
    const subcommand = yargs_1.default.argv._[0];
    const options = Object.assign({}, yargs_1.default.argv);
    delete options._;
    const data = await loadFiles(Object.entries(options).reduce((r, [k, v]) => {
        r[(0, change_case_1.camelCase)(k)] = String(v);
        return r;
    }, {}));
    const pipl = new pipl_1.PiplClient({ apiKey: process.env.PIPL_API_KEY });
    const result = await (async () => {
        switch (subcommand) {
            case 'search':
                return await pipl.search(data);
            case 'query':
                return await pipl.search(piplQueryToObject(yargs_1.default.argv._.slice(1).join(' ')));
        }
        return {};
    })();
    if (yargs_1.default.argv.j)
        console.log(JSON.stringify(result, null, 2));
    else
        logger.info(util_1.default.inspect(result, { colors: true, depth: 15 }));
}
exports.runCLI = runCLI;
//# sourceMappingURL=cli.js.map