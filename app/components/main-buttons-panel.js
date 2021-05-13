import Component from "@glimmer/component";

import { action } from "@ember/object";

import { getCurrSubString, subCurrWord } from "../utils";

import { inject as service } from "@ember/service";
import ENV from "somhunter-ui/config/environment";

import { EVENTS, ELEM_IDS } from "../constants";
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
    async onClickRescoreTopScoredBtn(e) {
        await this.actionManager.rescore();
        this.actionManager.gotoTopScoredView(0);
    }

    @action
    async onClickRescoreSomScoredBtn(e) {
        await this.actionManager.rescore();
        this.actionManager.gotoSomView();
    }

    @action
    async onClickSave(e) {
        await this.actionManager.rescore(true);
        //this.actionManager.gotoSomView();
    }

    debug = ENV.debug;

    /* Member variables */
    @service actionManager;
}
