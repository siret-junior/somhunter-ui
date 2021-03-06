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
        this.actionManager.registerEventHook(CS.EVENT_NAME_VIEW_CHANGE, () =>
            this.modelReload()
        );

        this.modelReload();
    }

    modelReload() {
        this.frames = this.modelLoader.mainDisplayFrames();
        this.viewType = this.modelLoader.mainDisplayType();
    }

    /* Member variables */
    @service actionManager;
    @service modelLoader;

    @tracked frames = undefined;
    @tracked viewType = undefined;
}
