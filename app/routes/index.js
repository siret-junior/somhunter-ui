import Route from "@ember/routing/route";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class IndexRoute extends Route {
    @service coreApi;

    /* Member methods */
    constructor() {
        super(...arguments);

        const cb = () => this.refresh();

        // Get settings from the core
        this.coreApi.fetchInitial(cb, cb);
    }

    @action
    forceRefresh() {
        console.debug("Forcing `index.js` route refresh!");
        this.refresh();
    }

    model() {
        const coreSettings = this.store.peekRecord("core-settings", 0);
        const userContext = this.store.peekRecord("user-context", 0);
        const mainDisplay = this.store.peekRecord("main-display", 0);

        return {
            coreSettings,
            userContext,
            mainDisplay,
        };
    }
}
