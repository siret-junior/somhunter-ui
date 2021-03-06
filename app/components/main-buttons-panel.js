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
        this.actionManager.gotoTopScoredView(0);
    }

    @action
    onClickSomBtn(e) {
        this.actionManager.gotoSomView();
    }

    @action
    onClickRescoreTopScoredBtn(e) {
        this.actionManager.rescore();
        this.actionManager.gotoTopScoredView(0);
    }

    @action
    onClickRescoreSomScoredBtn(e) {
        this.actionManager.rescore();
        this.actionManager.gotoSomView();
    }

    /* Member variables */
    @service actionManager;
}
