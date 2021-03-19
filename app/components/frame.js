import Component from "@glimmer/component";

import { action } from "@ember/object";

import { getCurrSubString, subCurrWord } from "../utils";

import { inject as service } from "@ember/service";
import CS from "../constants";

export default class FrameComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Register the reload hook to `changeView` event
        this.actionManager.registerEventHook(CS.EVENT_NAME_VIEW_CHANGE, () =>
            this.modelReload()
        );
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

            const wndH = window.innerHeight;
            const yNorm = e.y / wndH;

            this.actionManager.onSlideReplay(frameId, deltaY, yNorm);
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
