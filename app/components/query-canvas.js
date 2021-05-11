import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class QueryCanvasComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Subscribe to the specific EVENTS
        this.actionManager.registerEventHook(
            EVENTS.GLOBAL_ESC_KEY_DOWN,
            this.hideDetailWindow
        );

        this.index = this.args.index;
        this.initActive = this.index == 0 ? true : false;
    }

    didUpdateAttrs(elem, [updatedStructure]) {
        // On attrupate
    }

    @action
    onClickQueryCanvas(queryIdx, e) {
        const el = e.currentTarget;

        const canvases = document.querySelectorAll(".collage-canvas");
        canvases.forEach((x) => x.classList.remove("paste-active"));
        el.classList.add("paste-active");
    }

    // If this canavs is visible to the user
    visible = true;
    index = null;
    initActive = null;

    /* Member variables */
    @service actionManager;
}
