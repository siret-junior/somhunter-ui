import Component from "@glimmer/component";

import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class FrameComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    @action
    refresh() {
        LOG.D("Doing the `main-grid.js` component controller refresh!");
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

    afterLikeFrameHandler() {}

    @action
    onBookmarkBtnClick(e) {
        this.actionManager.addBookmark(this.args.frame);
        e.stopPropagation(); // Prevent the bubbling
    }

    @action
    onLikeFrame(e) {
        this.actionManager.likeFrame(this.args.frame);
        e.stopPropagation(); // Prevent the bubbling
    }

    @action
    onDetailBtnClick(e) {
        this.actionManager.showDetailView(Number(e.target.dataset.id), 0);
        e.stopPropagation(); // Prevent the bubbling
    }

    @action
    onKnnBtnClick(e) {
        this.actionManager.gotoKnnView(Number(e.target.dataset.id), 0);
        e.stopPropagation(); // Prevent the bubbling
    }

    @action
    onSubmitBtnClick(e) {
        alert(`Submitting frame with ID ${e.target.dataset.id}...`);
        e.stopPropagation(); // Prevent the bubbling
    }

    /* Member variables */
    @service actionManager;
}
