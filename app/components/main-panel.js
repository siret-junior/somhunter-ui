import Component from "@glimmer/component";
import { action, computed } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class MainPanel extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.features = this.dataLoader.getConfigUi().features;
    }

    /* Member variables */
    @service actionManager;
    @service dataLoader;

    ELEM_IDS = ELEM_IDS;

    currentPage = 0;
    prevFetchTimestamp = null;

    prevScrollLogTime = null;
    prevScrollLogPosition = 0;

    @tracked frames = undefined;
    @tracked viewType = undefined;
}
