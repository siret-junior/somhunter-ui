import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class HistoryPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    didUpdateAttrs(elem, [updatedStructure]) {
        // On attrupate
    }

    @action
    onClickHistoryItem(e) {
        const hId = e.target.dataset.historyId;
        LOG.D(`Switching to history ID ${hId}`);
    }

    @tracked historyItems = [];

    /* Member variables */
    @service actionManager;
}
