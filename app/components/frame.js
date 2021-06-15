import Component from "@glimmer/component";

import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
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
    onClickFrame(e) {
        if (this.args.onClick !== undefined)
            this.args.onClick(this.args.frame);
        else
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
        if (
            window.confirm(
                `Do you really want to submit frame '${this.args.frame.id}'?`
            )
        )
            this.actionManager.submitFrame(this.args.frame);
        e.stopPropagation(); // Prevent the bubbling
    }

    /* Member variables */
    @service actionManager;

    thumbsUrlPrefix = ENV.dataServerUrl + "/thumbs/";
}
