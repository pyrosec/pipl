import yargs from "yargs";
import util from "util";
import { getLogger } from "./logger";
import { PiplClient } from "./pipl";

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

export async function runCLI() {
  const query = yargs.argv._.join(' ');

  const pipl = new PiplClient({ apiKey: process.env.PIPL_API_KEY });
  const result = await pipl.search(piplQueryToObject(query));
  if (yargs.argv.j) console.log(JSON.stringify(result, null, 2));
  else logger.info(util.inspect(result, { colors: true, depth: 15 }));
}
