import Component from "@glimmer/component";
import { action, computed } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

import CS from "../constants";

export default class MainGridComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Register the reload hook to `changeView` event
        this.actionManager.registerEventHook(
            CS.EVENT_NAME_VIEW_CHANGE,
            this.refresh
        );

        this.modelReload();
    }

    @action
    refresh() {
        console.debug("Doing the `main-grid.js` component controller refresh!");
        this.modelReload();
    }

    modelReload() {
        this.frames = this.modelLoader.mainDisplayFrames();
    }

    /* Member variables */
    @service actionManager;
    @service modelLoader;

    @tracked frames = undefined;
}
