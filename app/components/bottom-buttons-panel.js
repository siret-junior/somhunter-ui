import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class BottomButtonsPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    @action
    onSettingsBtnClick(e) {
        this.actionManager.triggerEvent(EVENTS.SHOW_SETTINGS_WINDOW);
    }

    @action
    onDebugBtnClick(e) {
        this.actionManager.triggerEvent(EVENTS.SHOW_DEBUG_WINDOW);
    }

    @action
    onCollectorBtnClick(e) {
        this.actionManager.triggerEvent(EVENTS.SHOW_COLLECTOR_WINDOW);
    }

    /* Member variables */
    @service actionManager;

    debug = ENV.debug;
    collectorMode = ENV.collectorMode;
}
