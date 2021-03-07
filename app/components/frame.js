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
            console.log("DeltaY: ", e.target);
            const frameId = e.target.dataset.id;
            const deltaY = e.deltaY;

            console.log("DeltaY: ", deltaY);
            console.log("frameId: ", frameId);
            this.actionManager.scrollReplay(frameId, deltaY);
        }
    }

    @action
    onDetailBtnClick(e) {
        this.actionManager.showDetailView(e.target.dataset.id, 0);
    }

    @action
    onKnnBtnClick(e) {
        this.actionManager.gotoKnnView(e.target.dataset.id, 0);
    }

    @action
    onSubmitBtnClick(e) {
        alert(`Submitting frame with ID ${e.target.dataset.id}...`);
    }

    /* Member variables */
    @service actionManager;
}
