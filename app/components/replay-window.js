import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import CS from "../constants";
import { getCurrSubString, subCurrWord } from "../utils";

export default class ReplayWindowComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.actionManager.registerEventHook(CS.EVENT_SHOW_REPLAY, () => {
            this.showReload();
        });

        this.actionManager.registerEventHook(CS.EVENT_CHANGE_REPLAY, () => {
            this.modelReload();
        });
    }

    @action
    onHide() {
        this.frames = undefined;
    }

    @action modelReload() {
        this.show = this.modelLoader.getShowReplayView();
        this.frames = this.modelLoader.getReplayFrames();
        console.warn(frames);
    }

    @action showReload() {
        this.show = this.modelLoader.getShowReplayView();
    }

    /* Member variables */
    @service actionManager;
    @service modelLoader;

    @tracked show = false;
    @tracked frames = undefined;
}
