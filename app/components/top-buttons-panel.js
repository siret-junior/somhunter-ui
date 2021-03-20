import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class TopButtonsPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    @action
    onResetSearch(e) {
        this.actionManager.resetSearch();
    }

    @action
    onHelpBtnClick(e) {
        this.actionManager.triggerEvent(EVENTS.SHOW_HELP_WINDOW);
    }

    /* Member variables */
    @service actionManager;

    debug = ENV.debug;
}
