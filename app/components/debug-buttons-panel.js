import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class DebugButtonsPanelComponent extends Component {
    @action
    block(e) {
        this.actionManager.triggerEvent(
            EVENTS.BLOCK_WITH_NOTIFICATION,
            "Blocking process is running!"
        );
    }

    @action
    unblock(e) {
        this.actionManager.triggerEvent(EVENTS.UNBLOCK_WITH_NOTIFICATION);
    }

    @action
    toast(type, e) {
        this.actionManager.triggerEvent(
            EVENTS.DO_PUSH_NOTIF,
            "Some notification",
            type
        );
    }

    /* Member variables */
    @service actionManager;
}
