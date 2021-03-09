import Component from "@glimmer/component";

import { action } from "@ember/object";

import { getCurrSubString, subCurrWord } from "../utils";

import { inject as service } from "@ember/service";

export default class FrameComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    @action
    refresh() {
        console.debug("Doing the `main-grid.js` component controller refresh!");
        this.modelReload();
    }

    @action
    onWheel(e) {
        if (e.shiftKey) {
            const frameId = Number(e.target.dataset.id);
            const deltaY = e.deltaY;

            this.actionManager.onSlideReplay(frameId, deltaY);
        }
    }

    @action
    onDetailBtnClick(e) {
        this.actionManager.showDetailView(Number(e.target.dataset.id), 0);
    }

    @action
    onKnnBtnClick(e) {
        this.actionManager.gotoKnnView(Number(e.target.dataset.id), 0);
    }

    @action
    onSubmitBtnClick(e) {
        alert(`Submitting frame with ID ${e.target.dataset.id}...`);
    }

    /* Member variables */
    @service actionManager;
}
