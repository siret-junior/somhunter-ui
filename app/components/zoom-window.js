import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";
import thumb from "../helpers/thumb";
import ENV from "somhunter-ui/config/environment";

export default class ZoomWindowComponent extends Component {

    /* Member methods */
    constructor() {
        super(...arguments);

        // On global ESC keydown
        this.actionManager.registerEventHook(
            EVENTS.GLOBAL_ESC_KEY_DOWN,
            this.hideRelocationWindow
        );

        this.actionManager.registerEventHook(
            EVENTS.SHOW_ZOOM,
            (thumbSrc) => { this.showRelocationWindow(thumbSrc) }
        );

        this.actionManager.registerEventHook(
            EVENTS.HIDE_ZOOM,
            this.hideRelocationWindow
        );

        // Create shortcuts for frequently used values
        const configVideoDetail = this.dataLoader.getConfigUi().video_detail;
        
    }

    @action showRelocationWindow(src) {

        this.windowVisible = true;
        this.frameSrc = src
    }

    @action
    hideRelocationWindow() {
        this.windowVisible = false;
    }



    /* Member variables */
    @service actionManager;
    @service dataLoader;

    ELEM_IDS = ELEM_IDS;

    @tracked windowVisible = false;
    @tracked frameSrc = null;

    framesUrlPrefix = ENV.dataServerUrl + "/thumbs/";
}




