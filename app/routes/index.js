import Route from "@ember/routing/route";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class IndexRoute extends Route {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Initialize the app
        const cb = () => this.refresh();
        this.actionManager.initialize(cb, cb);

        this.actionManager.registerEventHook(
            EVENTS.RESET_SEARCH,
            this.forceRefresh
        );
    }

    model() {
        const coreSettings = this.store.peekRecord("core-settings", 0);
        const userContext = this.store.peekRecord("user-context", 0);

        LOG.D("INDEX: passing model with ID ", this.nextId);
        return {
            id: this.nextId++,
            coreSettings,
            userContext,
        };
    }

    nextId = 0;

    @action
    forceRefresh() {
        LOG.D("Forcing the `index.js` route refresh!");
        this.refresh();
    }

    /* Member variables */
    @service actionManager;
}
