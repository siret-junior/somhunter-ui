import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

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
        this.isFrameDefined = this.args.frame?.id !== null;
        this.fade =
            this.args.frame?.videoSeen !== null
                ? this.args.frame.videoSeen
                : false;
        if (
            this.args.forceVisible !== undefined &&
            this.args.forceVisible !== null &&
            this.args.forceVisible
        ) {
            this.fade = false;
        }
        switch(this.args.frame.weekday){
            case 0:
                this.weekday = "Monday";
                break;
            case 1:
                this.weekday = "Tuesday";
                break;
            case 2:
                this.weekday = "Wednesday";
                break;
            case 3:
                this.weekday = "Thursday";
                break;
            case 4:
                this.weekday = "Friday";
                break;
            case 5:
                this.weekday = "Saturday";
                break;
            case 6:
                this.weekday = "Sunday";
                break;
        }
        console.log("this.fade=" + this.fade);
    }

    @action
    refresh() {
        this.modelReload();
        this.isFrameDefined = this.args.frame?.id !== null;
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

    afterLikeFrameHandler() { }

    @action
    onBookmarkBtnClick(e) {
        this.actionManager.addBookmark(this.args.frame);
        e.stopPropagation(); // Prevent the bubbling
    }

    @action
    onZoomBtnClick(src, e) {

        this.actionManager.triggerEvent(EVENTS.SHOW_ZOOM, src);
        e.stopPropagation(); // Prevent the bubbling
    }

    @action
    onClickFrame(e) {
        if (e.altKey) {
            this.actionManager.submitFrame(this.args.frame);
        } else if (e.shiftKey) {
            this.onZoomBtnClick(e.currentTarget.dataset.src, e);
        } else {
            if (this.args.onClick !== undefined) {
                this.args.onClick(this.args.frame);
            } else {
                this.actionManager.likeFrame(this.args.frame);
            }
        }
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
    isFrameDefined = true;
    fade = true;
    @tracked weekday = "";

    thumbsUrlPrefix = ENV.dataServerUrl + "/thumbs/";
}
