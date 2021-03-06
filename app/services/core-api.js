import Service from "@ember/service";
import fetch from "fetch";
import { inject as service } from "@ember/service";
import { delay, resetMainGridScroll } from "../utils";

import { toMainDisplayModel } from "../models/main-display";

import ENV from "somhunter-ui/config/environment";

export default class CoreApiService extends Service {
    @service store;

    settings() {
        return this.store.peekRecord("core-settings", 0);
    }

    post(url, data) {
        return this.fetchRequest(url, "POST", data);
    }

    get(url, data) {
        return this.fetchRequest(url, "GET", data);
    }

    async fetchSomViewFrames(cbSucc = () => null, cbFail = (e) => null) {
        const coreSettings = this.settings();
        const requestSettings = coreSettings.api.endpoints.screenSom;

        // << Core API >>
        let res = null;
        do {
            res = await this.post(requestSettings.post.url);

            if (res === null) return;

            // 222 means that SOM not ready
            if (res.status === 222) {
                await delay(500);
            }

            const resData = {
                activeDisplay: this.settings().strings.displayTypes.som,
                currentPage: 0,
                frames: res.viewData.somhunter.screen.frames,
            };
            const data = toMainDisplayModel(resData);
            this.store.push(data);

            cbSucc();
        } while (res.status === 222);
    }

    fetchTopDispFrames(
        type,
        pageId,
        frameId,
        cbSucc = () => null,
        cbFail = (e) => null
    ) {
        const reqData = {
            pageId: pageId,
            type: type,
            frameId: frameId,
        };

        const coreSettings = this.settings();
        const requestSettings = coreSettings.api.endpoints.screenTop;

        // << Core API >>
        this.post(requestSettings.post.url, reqData)
            .then((res) => {
                if (res === null) return;
                if (pageId === 0) resetMainGridScroll();

                const resData = {
                    activeDisplay: type,
                    currentPage: pageId,
                    frames: res.viewData.somhunter.screen.frames,
                };
                const data = toMainDisplayModel(resData);
                this.store.push(data);

                cbSucc();
            })
            .catch((e) => {
                cbFail(e);
            });
    }

    fetchInitial(cbSucc = () => null, cbFail = () => null) {
        this.get(ENV.settingsEndpoint)
            .then((res) => {
                // One time setup here
                this.store.push({
                    data: [
                        {
                            id: 0,
                            type: "core-settings",
                            attributes: {
                                generated: res.generated,
                                strings: res.strings,
                                core: res.core,
                                server: res.server,
                                ui: res.ui,
                                api: res.api,
                                url: `${ENV.coreUrl}${ENV.settingsEndpoint}`,
                            },
                            relationships: {},
                        },
                    ],
                });
                console.debug(" Core settings loaded...");

                this.get(res.api.endpoints.userContext.get.url)
                    .then((res2) => {
                        this.store.push({
                            data: [
                                {
                                    id: 0,
                                    type: "user-context",
                                    attributes: {
                                        search: res2.search,
                                        history: res2.history,
                                        bookmarkedFrames: res2.bookmarkedFrames,
                                        url: `${ENV.coreUrl}${res.api.endpoints.userContext.get.url}`,
                                    },
                                    relationships: {},
                                },
                            ],
                        });
                        console.debug(" User context loaded...");

                        cbSucc();
                    })
                    .catch(() => {
                        this.store.push({
                            data: [
                                {
                                    id: 0,
                                    type: "user-context",
                                    attributes: {
                                        error: true,
                                        url: `${ENV.coreUrl}${res.api.endpoints.userContext.get.url}`,
                                    },
                                    relationships: {},
                                },
                            ],
                        });
                        cbFail();
                    });
            })
            .catch(() => {
                this.store.push({
                    data: [
                        {
                            id: 0,
                            type: "core-settings",
                            attributes: {
                                error: true,
                                url: `${ENV.coreUrl}${ENV.settingsEndpoint}`,
                            },
                            relationships: {},
                        },
                    ],
                });
                cbFail();
            });
    }

    async fetchRequest(url, method, body) {
        const fetchOptions = {
            headers: { "Content-type": "Content-Type: application/json" },
            method,
        };

        if (method == "GET" && body) {
            url = url + "?";
            for (const key of Object.keys(body)) {
                url += `${key}=${body[key]}`;
            }
        } else {
            if (body) {
                fetchOptions["body"] = body;
            }
        }

        const response = await fetch(
            "http://127.0.0.1:8888" + url,
            fetchOptions
        );

        if (!response.ok) {
            console.error("RES NOK");
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
