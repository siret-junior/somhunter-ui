import Service from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

export default class ActionManagerService extends Service {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    /* ==================================
     *      Events & event hooks
     * ================================== */
    eventHooks = {
        changeView: [],
    };

    registerEventHook(name, fn) {
        if (name in this.eventHooks) return;

        console.warn(`Registering function for the "${name}" event...`);
        this.eventHooks[name].push(fn);
    }

    triggerEvent(name) {
        console.warn(`Triggering the "${name}" event...`);
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

    gotoTopScoredView(cbSucc = () => null, cbFail = () => null) {
        const dispType = this.coreApi.settings().strings.displayTypes.topn;

        this.coreApi.fetchTopDispFrames(
            dispType,
            0,
            0,
            null,
            () => {
                this.triggerEvent("changeView");
                cbSucc();
            },
            () => {
                cbFail();
            }
        );
    }

    /* Member variables */
    @service coreApi;
}
