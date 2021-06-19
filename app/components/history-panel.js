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

    // Whenever the @model updates
    @action
    didUpdateAttrs(elem, [x]) {
        this.currentSearchId = x.userContext.search.id;
        this.historyItems = x.userContext.history.reverse();
    }

    @action
    onClickHistoryItem(e) {
        const hId = Number(e.currentTarget.dataset.historyId);

        if (typeof hId !== "number") throw Error("Wrong param!");

        LOG.D(`Switching to history ID ${hId}`);

        this.actionManager.switchSearchContext(hId);
    }

    @tracked historyItems = this.args.model.userContext.history.reverse();
    @tracked currentSearchId = this.args.model.userContext.search.id;

    /* Member variables */
    @service actionManager;
}
