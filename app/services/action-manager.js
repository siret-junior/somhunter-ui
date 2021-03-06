import Service from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

import CS from "../constants";
import utils from "../utils";

export default class ActionManagerService extends Service {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.eventHooks[CS.EVENT_NAME_VIEW_CHANGE] = [];
        this.eventHooks[CS.EVENT_NAME_DETAIL_VIEW_CHANGE] = [];
        this.eventHooks[CS.EVENT_SHOW_DETAIL] = [];
    }

    /* ==================================
     *      Events & event hooks
     * ================================== */
    eventHooks = {};

    registerEventHook(name, fn) {
        // If this event name does not exist
        if (!(name in this.eventHooks)) return;

        console.debug(`<!> Registering function for the "${name}" event...`);
        this.eventHooks[name].push(fn);
    }

    triggerEvent(name) {
        console.debug(`<!> Triggering the "${name}" event...`);
        this.eventHooks[name].forEach((fn) => {
            fn();
        });
    }
    /* ================================== */

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
        this.coreApi.fetchInitial(cbSucc, cbFail);
    }

    showDetailView(
        frameId,
        pageIdx = 0,
        cbSucc = () => null,
        cbFail = () => null
    ) {
        this.triggerEvent(CS.EVENT_SHOW_DETAIL);

        const dispType = this.coreApi.settings.strings.displayTypes.detail;

        this.coreApi.fetchDetailFrames(
            dispType,
            pageIdx,
            frameId,
            null,
            () => {
                this.triggerEvent(CS.EVENT_NAME_DETAIL_VIEW_CHANGE);
                cbSucc();
            },
            () => cbFail()
        );
    }

    hideDetailView() {
        this.modelLoader.setShowDetailView(false);
        this.triggerEvent(CS.EVENT_NAME_DETAIL_VIEW_CHANGE);
    }

    gotoKnnView(
        frameId,
        pageIdx = 0,
        cbSucc = () => null,
        cbFail = () => null
    ) {
        const dispType = this.coreApi.settings.strings.displayTypes.topknn;

        this.coreApi.fetchTopDispFrames(
            dispType,
            pageIdx,
            frameId,
            null,
            () => {
                this.triggerEvent(CS.EVENT_NAME_VIEW_CHANGE);
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
                this.triggerEvent(CS.EVENT_NAME_VIEW_CHANGE);
                cbSucc();
            },
            () => cbFail()
        );
    }

    gotoSomView(cbSucc = () => null, cbFail = () => null) {
        const dispType = this.coreApi.settings.strings.displayTypes.som;
        this.coreApi.fetchSomViewFrames(
            () => {
                this.triggerEvent(CS.EVENT_NAME_VIEW_CHANGE);
                cbSucc();
            },
            () => cbFail()
        );
    }

    async rescore() {
        // \todo check query changed flag

        // this.showNotification("Working...");

        const srcSearchCtxId = this.modelLoader.userContext.search.id;

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

        let query0 = "";
        let query1 = "";
        let filters = null;
        let collagesData = null;

        // Current text queries
        // \todo Do it propperly!
        query0 = utils.getTextQueryInput(0);
        query1 = utils.getTextQueryInput(1);

        collagesData = utils.getCollageInputs();
        filters = utils.getFiltersInput();

        // POST data
        const reqData = {
            srcSearchCtxId: srcSearchCtxId,
            screenshotData: screenData,
            q0: query0,
            q1: query1,
            filters,
            collages: collagesData,
        };

        const requestSettings = this.modelLoader.settings.api.endpoints
            .searchRescore;
        // << Core API >>
        const res = await this.coreApi.post(requestSettings.post.url, reqData);
        // << Core API >>

        // If failed
        if (!res) return;

        this.coreApi.fetchUserContext(() => {
            // this.hideNotification();

            //this.modelLoader.unsetQueryChangedFlag();

            console.warn("Rescored & fetches user context...");
        });
    }

    /* Member variables */
    @service coreApi;
    @service actionManager;
    @service modelLoader;
}
