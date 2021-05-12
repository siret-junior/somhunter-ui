import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS, ELEM_CLASSES } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class CanvasQueryPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.ELEM_CLASSES = ELEM_CLASSES;
        this.ELEM_IDS = ELEM_IDS;
    }

    didUpdateAttrs(elem, [updatedStructure]) {
        // On attrupate
    }

    @action
    onClickQueryCanvas(queryIdx, e) {}

    // If this canavs is visible to the user
    visible = true;
    model = null;

    /* Member variables */
    @service actionManager;
}
