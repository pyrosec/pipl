import yargs from "yargs";
import util from "util";
import { getLogger } from "./logger";
import { PiplClient } from "./pipl";
import { camelCase } from "change-case";
import fs from "fs-extra";

const logger = getLogger();
const piplQueryToObject = (query) => {
  try {
    return query
      .match(/([^\s:]+):((?:"((?:[^"\\]|\\[\s\S])*)")|(?:\S+))/g)
      .map((v) =>
        v.split(":").map((v) => (v.substr(0, 1) === '"' ? JSON.parse(v) : v))
      )
      .reduce((r, [key, value]) => {
      r[key] = value;
      return r;
      }, {});
  } catch (e) {
    return {};
  }
};

export async function loadFiles(data: any) {
  const fields = [];
  for (let [ k, v ] of Object.entries(data)) {
    const parts = /(^.*)FromFile$/.exec(k);
    if (parts) {
      const key = parts[1];
      fields.push([key, await fs.readFile(v)]);
    } else {
      fields.push([k, v]);
    }
  }
  return fields.reduce((r, [k, v]) => {
    r[k] = v;
    return r;
  }, {});
}

export async function runCLI() {
  const query = yargs.argv._.join(' ');
  const subcommand = yargs.argv._[0];
  const options = Object.assign({}, yargs.argv);
  delete options._;
  const data = await loadFiles(Object.entries(options).reduce((r, [ k, v ]) => {
    r[camelCase(k)] = String(v);
    return r;
  }, {}));
  const pipl = new PiplClient({ apiKey: process.env.PIPL_API_KEY });
  const result = await (async () => {
    switch (subcommand) {
      case 'search':
        return await pipl.search(data);
      case 'query':
        return await pipl.search(piplQueryToObject(yargs.argv._.slice(1).join(' ')));
    }
    return {};
  })();
  if (yargs.argv.j) console.log(JSON.stringify(result, null, 2));
  else logger.info(util.inspect(result, { colors: true, depth: 15 }));
}
