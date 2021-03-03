import Service from "@ember/service";
import fetch from "fetch";

export default class CoreApiService extends Service {
  post(url, data) {
    return this.fetchRequest(url, "POST", data);
  }

  get(url) {
    return this.fetchRequest(url, "GET");
  }

  async fetchRequest(url, method, body) {
    const fetchOptions = {
      headers: { "Content-type": "Content-Type: application/json" },
      method,
    };
    if (body) {
      fetchOptions["body"] = body;
    }

    const response = await fetch("http://127.0.0.1:8888" + url, fetchOptions);

    if (!response.ok) {
      console.warn("RES NOK");
      return;
    }
    const { "content-type": resContentType = "" } = response.headers.map;

    let resContent;
    if (resContentType.includes("application/json")) {
      resContent = await response.json();
    } else {
      resContent = await response.text();
    }

    return resContent;
  }
}
