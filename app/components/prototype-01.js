import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class Prototype01Component extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Subscribe to the specific EVENTS
        this.actionManager.registerEventHook(
            EVENTS.GLOBAL_ESC_KEY_DOWN,
            this.hideDetailWindow
        );
    }

    didUpdateAttrs(elem, [updatedStructure]) {
        // On attrupate
    }
    @action
    toast(type, e) {
        this.actionManager.triggerEvent(
            EVENTS.PUSH_NOTIFICATION,
            "Somenotification",
            "Hello from the notification!",
            30000,
            type
        );
    }

    /* Member variables */
    @service actionManager;
}
