import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { getCurrSubString, subCurrWord } from "../utils";

import { inject as service } from "@ember/service";
import { EVENTS, ELEM_IDS } from "../constants";
export default class DebugButtonsPanelComponent extends Component {
    @action
    block(e) {
        this.actionManager.triggerEvent(
            EVENTS.BLOCK_WITH_NOTIFICATION,
            "Blocking process is running!",
            "User is not allowed to interact with the UI!",
            12000
        );
    }

    @action
    unblock(e) {
        this.actionManager.triggerEvent(EVENTS.UNBLOCK_WITH_NOTIFICATION);
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
