import Component from "@glimmer/component";

import { action } from "@ember/object";

import { getCurrSubString, subCurrWord } from "../utils";

import { inject as service } from "@ember/service";

export default class MainButtonsPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    @action
    onClickTopScoredBtn(e) {
        this.actionManager.gotoTopScoredView();
    }

    @action
    onClickSomBtn(e) {}

    /* Member variables */
    @service actionManager;
}
