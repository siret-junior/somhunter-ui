import Component from "@glimmer/component";

import { action } from "@ember/object";

import { getCurrSubString, subCurrWord } from "../utils";
import LOG from "../logger";

import { inject as service } from "@ember/service";
import ENV from "somhunter-ui/config/environment";

import { EVENTS, ELEM_IDS, ELEM_CLASSES } from "../constants";
export default class MainButtonsPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.ELEM_CLASSES = ELEM_CLASSES;
        this.ELEM_IDS = ELEM_IDS;

        const configStrings = this.dataLoader.getConfigStrings();
    }

    updateActiveButton() {
        const currDisplay = this.dataLoader.mainDisplayType();
        const displays = this.dataLoader.getConfigStrings().display_types;
        LOG.W(currDisplay);

        // switch (currDisp) {

        // }

        // currActiveBtnElem.classList.remove(ELEM_CLASSES.ACTIVE_BUTTON);
        // this.currActiveBtnElem = e.currentTarget;
        // currActiveBtnElem.classList.add(ELEM_CLASSES.ACTIVE_BUTTON);
    }

    @action
    onClickTopScoredBtn(e) {
        this.actionManager.gotoTopScoredView(0);
        this.updateActiveButton();
    }

    @action
    onClickSomBtn(e) {
        this.actionManager.gotoSomView();
        this.updateActiveButton();
    }

    @action
    async onClickRescoreTopScoredBtn(e) {
        await this.actionManager.rescore();
        this.actionManager.gotoTopScoredView(0);
        this.updateActiveButton();
    }

    @action
    async onClickRescoreSomScoredBtn(e) {
        await this.actionManager.rescore();
        this.actionManager.gotoSomView();
        this.updateActiveButton();
    }

    @action
    async onClickSave(e) {
        await this.actionManager.rescore(true);
        //this.actionManager.gotoSomView();
    }

    currActiveBtnElem = null;
    debug = ENV.debug;
    collectorMode = ENV.collectorMode;

    /* Member variables */
    @service actionManager;
    @service dataLoader;
}
