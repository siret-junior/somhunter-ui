import Route from "@ember/routing/route";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import CS from "../constants";

export default class IndexRoute extends Route {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Initialize the app
        const cb = () => this.refresh();
        this.actionManager.initialize(cb, cb);
    }

    model() {
        const coreSettings = this.store.peekRecord("core-settings", 0);
        const userContext = this.store.peekRecord("user-context", 0);

        return {
            coreSettings,
            userContext,
        };
    }

    @action
    forceRefresh() {
        console.debug("Forcing the `index.js` route refresh!");
        this.refresh();
    }

    /* Member variables */
    @service actionManager;
}
