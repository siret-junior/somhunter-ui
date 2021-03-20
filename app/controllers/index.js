import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";

export default class IndexController extends Controller {
    /* Member methods */
    constructor() {
        super(...arguments);

        /** Add the global event listeners. */
        this.addGlobalEventListeners();
    }

    addGlobalEventListeners() {
        // When pressing some keyboard key
        document.addEventListener("keydown", this.onGlobalKeyDown);
    }

    @action
    onGlobalKeyDown(e) {
        switch (e.which) {
            case 27: // ESC
                this.actionManager.globalKeyHandler(EVENTS.GLOBAL_ESC_KEY_DOWN);
                break;

            case 13: // enter
                this.actionManager.globalKeyHandler(
                    EVENTS.GLOBAL_ENTER_KEY_DOWN
                );
                break;

            case 9: // tab
                this.actionManager.globalKeyHandler(EVENTS.GLOBAL_TAB_KEY_DOWN);
                e.stopPropagation();
                e.preventDefault();
                break;
        }
    }

    /* Member variables */
    @service actionManager;
}
