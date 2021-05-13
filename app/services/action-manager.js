import Service from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class ActionManagerService extends Service {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Prepare containers for event hooks
        for (const field in EVENTS) {
            this.eventHooks[EVENTS[field]] = [];
        }
    }

    /* ==================================
     *      Events & event hooks
     * ================================== */
    eventHooks = {};

    registerEventHook(name, fn) {
        // If this event name does not exist
        if (!(name in this.eventHooks)) return;

        LOG.D(`<!> Registering function for the "${name}" event...`);
        this.eventHooks[name].push(fn);
    }

    triggerEvent(name) {
        LOG.D(`<!> Triggering the "${name}" event...`);
        this.eventHooks[name].forEach((fn) => {
            fn(...Array.prototype.slice.call(arguments, 1));
        });
    }
    /* ================================== */

    fetchReplayFrames(frameId, yNorm) {
        const dispType = this.dataLoader.stringSettings.displayTypes.replay;

        this.coreApi.fetchReplayFrames(dispType, 0, frameId, null, () => {
            this.dataLoader.setShowReplayView(true);
            this.triggerEvent(EVENTS.LOAD_REPLAY);
            this.triggerEvent(EVENTS.SHOW_REPLAY, frameId, yNorm);
        });
    }

    onSlideReplay(frameId, deltaY, yNorm) {
        const prevPivotId = this.dataLoader.getReplayPivotId();

        if (frameId !== prevPivotId) {
            this.fetchReplayFrames(frameId, yNorm);
            return;
        }

        const show = this.dataLoader.getShowReplayView();
        if (!show) {
            this.dataLoader.setShowReplayView(true);
            this.triggerEvent(EVENTS.SHOW_REPLAY, frameId, yNorm);
        } else {
            this.triggerEvent(EVENTS.SLIDE_REPLAY, deltaY);
        }
    }

    async switchSearchContext(searchId) {
        this.actionManager.triggerEvent(
            EVENTS.BLOCK_WITH_NOTIFICATION,
            "Switching search context!",
            "...",
            12000
        );

        const search = this.dataLoader.getSearchContext();

        const srcSearchCtxId = search.id;
        const url = this.dataLoader.apiSettings.endpoints.searchContext.post
            .url;

        // Take a screenshot
        let screenData = "";
        // Does this screen still lack the screenshot
        if (search.screenshotFilepath === "" && false) {
            const frs = state.mainWindow.frames;

            screenData = await takeScreenshotOfElem(
                document.getElementById("mainGrid"),
                frs
            );
        }

        const reqData = {
            srcSearchCtxId: srcSearchCtxId,
            screenshotData: screenData,
            id: searchId,
        };

        // << Core API >>
        const res = await this.coreApi.post(url, reqData);
        // << Core API >>

        var cbFail = () => {
            this.actionManager.triggerEvent(
                EVENTS.DO_PUSH_NOTIF,
                "Switch failed!",
                "error"
            );
            this.actionManager.triggerEvent(EVENTS.UNBLOCK_WITH_NOTIFICATION);
            throw Error("Search switch failed.");
        };

        // If failed
        if (res === null) {
            cbFail();
            return;
        }

        this.coreApi.fetchUserContext(() => {
            this.actionManager.triggerEvent(EVENTS.RELOAD_USER_CONTEXT);
            this.actionManager.gotoTopScoredView(0);
            this.actionManager.triggerEvent(
                EVENTS.DO_PUSH_NOTIF,
                "Search context switched!"
            );
            this.actionManager.triggerEvent(EVENTS.UNBLOCK_WITH_NOTIFICATION);
        }, cbFail);
    }

    async addBookmark(frame) {
        const frameId = frame.id;

        this.actionManager.triggerEvent(EVENTS.BEFORE_BOOKMARK_FRAME, frame);

        const url = this.dataLoader.apiSettings.endpoints.searchBookmark.post
            .url;

        const reqData = {
            frameId: frameId,
        };

        const res = await this.coreApi.post(url, reqData);
        const isBookmarked = res.isBookmarked;

        var cbFail = () => {
            this.actionManager.triggerEvent(
                EVENTS.DO_PUSH_NOTIF,
                `Bookmarking the '${frameId}' frame failed.`,
                "error"
            );
            throw Error("Bookmarking failed.");
        };

        if (res === null) {
            cbFail();
            return;
        } else {
            this.actionManager.triggerEvent(
                EVENTS.AFTER_BOOKMARK_FRAME,
                frame,
                isBookmarked
            );
        }
    }

    resetSearch() {
        const coreSettings = this.coreApi.settings;
        const reqUrl = coreSettings.api.endpoints.searchReset.post.url;
        // << Core API >>
        this.coreApi
            .post(reqUrl)
            .then((res) => {
                this.coreApi.fetchUserContext(
                    () => {
                        this.actionManager.triggerEvent(
                            EVENTS.RELOAD_USER_CONTEXT
                        );
                        this.actionManager.gotoTopScoredView(0);
                        this.actionManager.triggerEvent(
                            EVENTS.DO_PUSH_NOTIF,
                            "Search reset!"
                        );
                    },
                    () =>
                        this.actionManager.triggerEvent(
                            EVENTS.DO_PUSH_NOTIF,
                            "Reset search failed!",
                            "error"
                        )
                );
            })
            .catch((e) => {
                console.log("C");
                this.actionManager.triggerEvent(
                    EVENTS.DO_PUSH_NOTIF,
                    "Reset search failed!",
                    "error"
                );
            });
    }

    getTextAutocompleteSuggestions(
        prefix,
        cbSucc = () => null,
        cbFail = () => null
    ) {
        const reqData = {
            queryValue: prefix,
        };

        const coreSettings = this.coreApi.settings;
        const requestSettings =
            coreSettings.api.endpoints.textSearchSuggestions;

        // << Core API >>
        this.coreApi
            .get(requestSettings.get.url, reqData)
            .then((res) => {
                cbSucc(res);
            })
            .catch((e) => {
                cbFail(e);
            });
    }

    initialize(cbSucc = () => null, cbFail = () => null) {
        // Load the initial things
        this.coreApi.fetchInitial(() => {
            this.gotoTopScoredView(0);
            cbSucc();
        }, cbFail);
    }

    showDetailView(
        frameId,
        pageIdx = 0,
        cbSucc = () => null,
        cbFail = () => null
    ) {
        const dispType = this.coreApi.settings.strings.displayTypes.detail;

        this.coreApi.fetchDetailFrames(
            dispType,
            pageIdx,
            frameId,
            null,
            () => {
                this.triggerEvent(EVENTS.LOAD_DETAIL);
                this.triggerEvent(EVENTS.SHOW_DETAIL, frameId);
                cbSucc();
            },
            () => cbFail()
        );
    }

    hideDetailView() {
        this.dataLoader.setShowDetailView(false);
        this.triggerEvent(EVENTS.NAME_DETAIL_VIEW_CHANGE);
    }

    gotoKnnView(
        frameId,
        pageIdx = 0,
        cbSucc = () => null,
        cbFail = () => null
    ) {
        this.triggerEvent(EVENTS.CLEAR_MAIN_GRID);
        if (pageIdx == 0) {
            utils.resetMainGridScroll();
        }

        const dispType = this.coreApi.settings.strings.displayTypes.topknn;

        this.coreApi.fetchTopDispFrames(
            dispType,
            pageIdx,
            frameId,
            null,
            () => {
                this.triggerEvent(EVENTS.NAME_VIEW_CHANGE);
                cbSucc();
            },
            () => cbFail()
        );
    }

    loadTopViewPage(
        dispType,
        pageIdx,
        cbSucc = () => null,
        cbFail = () => null
    ) {
        LOG.D("pageIdx: ", pageIdx);
        this.coreApi.fetchTopDispFrames(
            dispType,
            pageIdx,
            null,
            null,
            () => {
                this.triggerEvent(EVENTS.NAME_VIEW_CHANGE);
                cbSucc();
            },
            () => cbFail()
        );
    }

    gotoTopScoredView(pageIdx, cbSucc = () => null, cbFail = () => null) {
        const dispType = this.coreApi.settings.strings.displayTypes.topn;

        this.coreApi.fetchTopDispFrames(
            dispType,
            pageIdx,
            0,
            null,
            () => {
                this.triggerEvent(EVENTS.NAME_VIEW_CHANGE);
                cbSucc();
            },
            () => cbFail()
        );
    }

    gotoSomView(cbSucc = () => null, cbFail = () => null) {
        const dispType = this.coreApi.settings.strings.displayTypes.som;
        this.coreApi.fetchSomViewFrames(
            () => {
                this.triggerEvent(EVENTS.NAME_VIEW_CHANGE);
                cbSucc();
            },
            () => cbFail()
        );
    }

    async rescore(isSave) {
        const srcSearchCtxId = this.dataLoader.userContext.search.id;

        LOG.W("isSave", isSave)

        // Take a screenshot
        let screenData = "";
        // // Does this screen still lack the screenshot
        // if (state.user.search.screenshotFilepath === "") {
        //     const frs = state.mainWindow.frames;
        //     screenData = await takeScreenshotOfElem(
        //         document.getElementById("mainGrid"),
        //         frs
        //     );
        // }

        let query0 = utils.getTextQueryInput(0);
        let query1 = utils.getTextQueryInput(1);
        let filters = utils.getFiltersInput();
        let canvasQuery = utils.getCanvasQueryInput();

        // POST data
        const reqData = {
            srcSearchCtxId: srcSearchCtxId,
            screenshotData: screenData,
            q0: query0.trim(),
            q1: query1.trim(),
            filters,
            canvas_query: canvasQuery,
            is_save: (isSave ? true : false),
            query_dir: "/somedir/"
        };

        const likedFrames = this.dataLoader.getLikedFrames();

        // \todo Better hash?
        const newHash = utils.hashQuery(reqData);
        const prevHash = this.dataLoader.getLastQuery();

        if (newHash.trim() == prevHash.trim() && likedFrames.length == 0) {
            LOG.I("Query hasn't changed. Not rescoring.");
            return;
        }
        if (utils.isQueryEmpty(reqData) && likedFrames.length == 0) {
            LOG.I("Empty query. Not rescoring.");
            return;
        }
        this.dataLoader.setLastQuery(newHash);

        try {
            this.actionManager.triggerEvent(
                EVENTS.BLOCK_WITH_NOTIFICATION,
                "Rescoring!",
                "...",
                60000
            );

            const requestSettings = this.dataLoader.settings.api.endpoints
                .searchRescore;
            // << Core API >>
            const res = await this.coreApi.post(
                requestSettings.post.url,
                reqData
            );
            // << Core API >>

            // If failed
            if (!res) return;

            this.coreApi.fetchUserContext(() => {
                LOG.D("Rescored & fetched user context...");
                this.actionManager.triggerEvent(EVENTS.RELOAD_USER_CONTEXT);
                this.actionManager.triggerEvent(
                    EVENTS.UNBLOCK_WITH_NOTIFICATION
                );
            });
        } catch (e) {
            // <!>
            this.actionManager.triggerEvent(
                EVENTS.DO_PUSH_NOTIF,
                `Rescore failed!.`,
                "error"
            );
            this.actionManager.triggerEvent(EVENTS.UNBLOCK_WITH_NOTIFICATION);
            throw e;
        }
    }

    globalKeyHandler(eventName) {
        LOG.D(`Global key down event: the key '${eventName}' hit!`);
        this.triggerEvent(eventName);
    }

    async likeFrame(frame) {
        const frameId = frame.id;
        if (!frameId) throw Error("Invalid `frameId`: ", frameId);

        // <!>
        this.triggerEvent(EVENTS.BEFORE_LIKE_FRAME, frame);

        const url = this.dataLoader.apiSettings.endpoints.searchLike.post.url;

        const reqData = {
            frameId: frameId,
        };

        /* FORMAT: 
        resData = {
            frameId: 1153572,
            isLiked: true,
            status: 200
        } */
        try {
            const resData = await this.coreApi.post(url, reqData);

            const likedState = resData.isLiked;

            this.dataLoader.setLikedFlag(frameId, likedState);

            if (likedState) {
                const fs = document.querySelectorAll(
                    `.frame[data-id="${frameId}"]`
                );
                fs.forEach((x) => x.classList.add("liked"));
            } else {
                const fs = document.querySelectorAll(
                    `.frame[data-id="${frameId}"]`
                );
                fs.forEach((x) => x.classList.remove("liked"));
            }

            // <!>
            this.triggerEvent(EVENTS.AFTER_LIKE_FRAME, {
                ...frame,
                liked: likedState,
            });
        } catch (e) {
            // <!>
            this.actionManager.triggerEvent(
                EVENTS.DO_PUSH_NOTIF,
                `Liking the frame with ID '${frameId}' failed.`,
                "error"
            );
            throw e;
        }
    }

    /* Member variables */
    @service coreApi;
    @service actionManager;
    @service dataLoader;
}
