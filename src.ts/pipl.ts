import fetch from "node-fetch";
import url from "url";
import qs from "querystring";

export class PiplClient {
  static BASE_URL = "api.pipl.com";
  public apiKey: string;
  constructor({ apiKey }) {
    this.apiKey = apiKey || process.env.PIPL_API_KEY;
  }
  async search(o) {
    return await (
      await fetch(
        url.format({
          hostname: (this.constructor as any).BASE_URL,
          protocol: "https:",
          pathname: "/search",
          search: "?" + qs.stringify({ ...o, key: this.apiKey }),
        }),
        {
          method: "GET",
        }
      )
    ).json();
  }
  async personSearch(o) {
    return await (
      await fetch(
        url.format({
          hostname: (this.constructor as any).BASE_URL,
          protocol: "https:",
          pathname: "/search",
          search:
            "?" +
            qs.stringify({
              person: JSON.stringify(o),
              key: this.apiKey,
            }),
        }),
        {
          method: "GET",
        }
      )
    ).json();
  }
}
