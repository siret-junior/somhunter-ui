/* This file is part of SOMHunter UI.
 *
 * Copyright (C) 2022    Frantisek Mejzlik <frankmejzlik@protonmail.com>
 *                       Vit Skrhak <vitek.skrhak@seznam.cz>
 *                       Patrik Veselý <prtrikvesely@gmail.com>
 * 
 *  SOMHunter UI is free software: you can redistribute it and/or modify it under
 *  the terms of the GNU General Public License as published by the Free
 *  Software Foundation, either version 2 of the License, or (at your option)
 *  any later version.
 * 
 *  SOMHunter UI is distributed in the hope that it will be useful, but WITHOUT ANY
 *  WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 *  FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 *  details.
 * 
 *  You should have received a copy of the GNU General Public License along with
 *  SOMHunter UI. If not, see <https://www.gnu.org/licenses/>.
 */

import Service from "@ember/service";
import fetch from "fetch";
import { inject as service } from "@ember/service";
import { delay, resetMainGridScroll } from "../utils";

import { toMainDisplayModel, mergeDisplayModel } from "../models/main-display";
import { toDetailWindowModel } from "../models/detail-window";
import { toRelocationWindowModel } from "../models/relocation-window";
import { toReplaylWindowModel } from "../models/replay-window";

import ENV from "somhunter-ui/config/environment";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class CoreApiService extends Service {
    @service store;
    @service dataLoader;

    get settings() {
        return this.store.peekRecord("config", 0);
    }

    post(url, data) {
        return this.fetchRequest(url, "POST", data);
    }

    get(url, data) {
        return this.fetchRequest(url, "GET", data);
    }

    async fetchSomViewFrames(cbSucc = () => null, cbFail = (e) => null) {
        const url = this.dataLoader.getEndpoint("search_get_som_display_post");


        // << Core API >>
        let res = null;
        do {
            res = await this.post(url);

            if (res === null) return;

            // 222 means that SOM not ready
            if (res.status === 222) {
                LOG.W("SOM not yet ready!");
                await delay(500);
                continue;
            }

            const resData = {
                activeDisplay: this.dataLoader.getConfigStrings().display_types.SOM,
                currentPage: 0,
                frames: res.viewData.somhunter.screen.frames,
            };
            const data = toMainDisplayModel(resData);
            this.store.push(data);

            cbSucc();
        } while (res.status === 222);
    }

    async fetchSomRelocationViewFrames(tempId, cbSucc = () => null, cbFail = (e) => null) {
        const url = this.dataLoader.getEndpoint("search_get_som_relocation_display");
        const reqData = {
            temporalId: tempId,
        };

        // << Core API >>
        let res = null;
        do {
            res = await this.post(url, reqData);

            if (res === null) return;

            // 222 means that SOM not ready
            if (res.status === 222) {
                LOG.W("SOM relocation " + tempId + " not yet ready!");
                await delay(500);
                continue;
            }

            const resData = {
                activeDisplay: this.dataLoader.getConfigStrings().display_types.SOM, // TODO set correct display type
                currentPage: 0,
                frames: res.viewData.somhunter.screen.frames,
            };

            const data = toRelocationWindowModel(resData);
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

        const url = this.dataLoader.getEndpoint("search_get_top_display");

        // << Core API >>
        this.post(url, reqData)
            .then((res) => {
                if (res === null) return;
                if (pageId === 0) resetMainGridScroll();

                const resData = {
                    activeDisplay: type,
                    currentPage: pageId,
                    frames: res.viewData.somhunter.screen.frames,
                };
                let currData = this.store.peekRecord("main-display", 0);

                if (pageId == 0) {
                    currData = null;
                }
                //const data = toMainDisplayModel(resData);

                const data = toMainDisplayModel(resData, currData);
                this.store.push(data);

                cbSucc();
            })
            .catch((e) => {
                cbFail(e);
            });
    }

    fetchReplayFrames(
        type,
        pageId,
        frameId,
        cbSucc = () => null,
        cbFail = (e) => null
    ) {
        const reqData = {
            pageId: pageId,
            type: type,
            frameId: Number(frameId),
        };

        const url = this.dataLoader.getEndpoint("dataset_video_detail_get");

        // << Core API >>
        this.get(url, reqData)
            .then((res) => {
                if (res === null) return;

                // If empty array returned
                if (res.frames.length === 0) return;

                const videoId = res.frames[0].vId;

                const resData = {
                    activeDisplay: type,
                    currentPage: pageId,
                    frames: res.frames,
                };
                const data = toReplaylWindowModel(frameId, videoId, resData);
                this.store.push(data);

                cbSucc();
            })
            .catch((e) => {
                cbFail(e);
            });
    }


    fetchDetailFrames(
        type,
        pageId,
        frameId,
        cbSucc = () => null,
        cbFail = (e) => null
    ) {
        const reqData = {
            pageId: pageId,
            type: type,
            frameId: Number(frameId),
        };

        const url = this.dataLoader.getEndpoint("dataset_video_detail_get");

        // << Core API >>
        this.get(url, reqData)
            .then((res) => {
                if (res === null) return;

                // If empty array returned
                if (res.frames.length === 0) return;

                const videoId = res.frames[0].vId;

                const resData = {
                    activeDisplay: type,
                    currentPage: pageId,
                    frames: res.frames,
                };
                const data = toDetailWindowModel(frameId, videoId, resData);
                this.store.push(data);

                cbSucc();
            })
            .catch((e) => {
                cbFail(e);
            });
    }

    fetchUserContext(cbSucc = () => null, cbFail = () => null) {
        const url = this.dataLoader.getEndpoint("user_context_get");
        this.get(url)
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
                                url: `${ENV.coreUrl}${url}`,
                                targets: res2.targets,
                            },
                            relationships: {},
                        },
                    ],
                });
                LOG.D(" User context loaded...");

                cbSucc();
            })
            .catch((e) => {
                LOG.D(e);
                this.store.push({
                    data: [
                        {
                            id: 0,
                            type: "user-context",
                            attributes: {
                                error: true,
                                url: `${ENV.coreUrl}${url}`,
                            },
                            relationships: {},
                        },
                    ],
                });
                cbFail();
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
                            type: "config",
                            attributes: {
                                error: false,
                                strings: res.strings,
                                core: res.core,
                                dataServer: res.data_server,
                                ui: res.UI,
                                api: res.API,
                                url: `${ENV.coreUrl}${ENV.settingsEndpoint}`,
                            },
                            relationships: {},
                        },
                    ],
                });
                LOG.D(" Core settings loaded...");

                this.fetchUserContext(cbSucc, cbFail);
            })
            .catch((e) => {
                console.log(e);
                this.store.push({
                    data: [
                        {
                            id: 0,
                            type: "config",
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
            headers: { "Content-Type": "application/json" },
            method,
        };

        if (method == "GET" && body) {
            url = url + "?";
            for (const key of Object.keys(body)) {
                url += `${key}=${body[key]}&`;
            }
        } else {
            if (body) {
                fetchOptions["body"] = JSON.stringify(body);
            }
        }

        const response = await fetch(ENV.coreUrl + url, fetchOptions);

        if (!response.ok) {
            LOG.E("RES NOK");
            return;
        }
        const { "content-type": resContentType = "" } = response.headers.map;

        let resContent;
        if (resContentType.includes("application/json")) {
            resContent = await response.json();
        } else {
            resContent = await response.text();
        }

        resContent.status = response.status;

        return resContent;
    }
}
