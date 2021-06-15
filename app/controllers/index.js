import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";

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
        // General keys
        switch (e.key) {
            case "Escape":
                this.actionManager.globalKeyHandler(EVENTS.GLOBAL_ESC_KEY_DOWN);
                break;

            case "Enter":
                if (e.shiftKey) {
                    this.actionManager.globalKeyHandler(
                        EVENTS.GLOBAL_SHIFT_ENTER_KEY_DOWN
                    );
                } else {
                    this.actionManager.globalKeyHandler(
                        EVENTS.GLOBAL_ENTER_KEY_DOWN
                    );
                }
                break;

            case "Tab":
                this.actionManager.globalKeyHandler(EVENTS.GLOBAL_TAB_KEY_DOWN);
                e.stopPropagation();
                e.preventDefault();
                break;
        }

        // Global keys only if not writing
        if (!document.activeElement.id.startsWith("textQueryInput")) {
            switch (e.key) {
                case "s":
                    this.actionManager.globalKeyHandler(
                        EVENTS.GLOBAL_s_KEY_DOWN
                    );
                    break;

                case "t":
                    this.actionManager.globalKeyHandler(
                        EVENTS.GLOBAL_t_KEY_DOWN
                    );
                    break;

                case "T":
                    this.actionManager.globalKeyHandler(
                        EVENTS.GLOBAL_T_KEY_DOWN
                    );
                    break;
            }
        }
    }

    /* Member variables */
    @service actionManager;
}
