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

        this.currActiveBtnElem = null;
        this.debug = ENV.debug;
        this.collectorMode = ENV.collectorMode;

        this.actionManager.registerEventHook(EVENTS.NAME_VIEW_CHANGE, () => {
            this.updateActiveButton();
        });
    }

    updateActiveButton() {
        const currDisplay = this.dataLoader.mainDisplayType();
        const displays = this.dataLoader.getConfigStrings().display_types;
        let allElements = [];
        allElements = allElements.concat([...document.querySelectorAll("." + ELEM_CLASSES.GOTO_SOM_BTN)]);
        allElements = allElements.concat([...document.querySelectorAll("." + ELEM_CLASSES.GOTO_TOP_SCORED_BTN)]);
        allElements = allElements.concat([...document.querySelectorAll("." + ELEM_CLASSES.GOTO_TOP_SCORED_CONTEXT_BTN)]);

        let elements = [];
        switch (currDisplay) {
            case displays.SOM:
                elements = elements.concat([...document.querySelectorAll("." + ELEM_CLASSES.GOTO_SOM_BTN)]);
                break;

            case displays.top_scored:
                elements = elements.concat([...document.querySelectorAll("." + ELEM_CLASSES.GOTO_TOP_SCORED_BTN)]);
                break;

            case displays.top_scored_context:
                elements = elements.concat([...document.querySelectorAll("." + ELEM_CLASSES.GOTO_TOP_SCORED_CONTEXT_BTN)]);
                break;

            default:
                break;
        }

        if (allElements.length > 0) {
            allElements.forEach(x => x.classList.remove(ELEM_CLASSES.ACTIVE_BUTTON))
        }
        if (elements.length > 0) {
            elements.forEach(x => x.classList.add(ELEM_CLASSES.ACTIVE_BUTTON))
        }
    }

    @action
    onClickTopScoredBtn(e) {
        this.actionManager.gotoTopScoredView(0);
    }

    @action
    onClickTopScoredContextBtn(e) {
        this.actionManager.gotoTopScoredView(0, true);
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

    /* Member variables */
    @service actionManager;
    @service dataLoader;
}
