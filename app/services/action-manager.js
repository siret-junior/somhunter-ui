import Service from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

import CS from "../constants";

export default class ActionManagerService extends Service {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.eventHooks[CS.EVENT_NAME_VIEW_CHANGE] = [];
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

        const coreSettings = this.coreApi.settings();
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

    gotoTopScoredView(cbSucc = () => null, cbFail = () => null) {
        const dispType = this.coreApi.settings().strings.displayTypes.topn;

        this.coreApi.fetchTopDispFrames(
            dispType,
            0,
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
        const dispType = this.coreApi.settings().strings.displayTypes.som;
        this.coreApi.fetchSomViewFrames(
            () => {
                this.triggerEvent(CS.EVENT_NAME_VIEW_CHANGE);
                cbSucc();
            },
            () => cbFail()
        );
    }

    /* Member variables */
    @service coreApi;
}
