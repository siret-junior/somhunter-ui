import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import CS from "../constants";
import { getCurrSubString, subCurrWord } from "../utils";

export default class DetailWindowComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // On global ESC keydown
        this.actionManager.registerEventHook(
            CS.EVENT_GLOBAL_ESC_KEY_DOWN,
            this.hideDetailWindow
        );

        this.actionManager.registerEventHook(
            CS.EVENT_LOAD_DETAIL,
            this.loadDetailFrames
        );

        this.actionManager.registerEventHook(
            CS.EVENT_SHOW_DETAIL,
            this.showDetailWindow
        );

        this.actionManager.registerEventHook(
            CS.EVENT_HIDE_DETAIL,
            this.hideDetailWindow
        );

        // Create shortcuts for frequently used values

        this.thumbWidth = this.dataLoader.uiSettings.videoDetail.thumbWidth;
        this.thumbHeight = Math.ceil(this.thumbWidth * 0.5625);
        this.gridWidth = this.dataLoader.uiSettings.videoDetail.gridWidth;
        this.gridHeight = this.dataLoader.uiSettings.videoDetail.gridHeight;

        this.modalSliderW = this.gridWidth * this.thumbWidth;
        this.modalSliderH = this.gridWidth * this.thumbHeight;

        this.cssFrameWidth = `${100 / this.gridWidth}%`;
        this.cssFrameHeight = `${this.thumbHeight}px`;
        console.debug("..");
    }

    @action loadDetailFrames() {
        this.allFrames = this.dataLoader.getDetailFrames();
    }

    @action loadUp() {
        this.rowFrom = Math.max(0, this.rowFrom - this.postLoadChunkSize);

        const frameFrom = this.rowFrom * this.gridWidth;
        const fr = Math.max(0, frameFrom);
        this.displayedFrom = fr;
        this.displayedFrames = this.allFrames.slice(
            this.displayedFrom,
            this.displayedTo
        );

        // Set up the final padding & scroll
        const topPadding = this.thumbHeight * this.rowFrom;
        this.sliderEl.style.paddingTop = `${topPadding}px`;

        if (fr > 0) {
            this.upTimeoutHandle = setTimeout(
                this.loadUp,
                this.postLoadTimeout
            );
        } else {
            console.debug("Loaded UP!");
        }

        // console.debug("rowFrom: ", this.rowFrom);
        // console.debug("rowTo: ", this.rowTo);
        //console.debug("displayedFrom: ", this.displayedFrom);
        // console.debug("displayedTo: ", this.displayedTo);
    }

    @action loadDown() {
        const max = Math.ceil(this.allFrames.length / this.gridWidth);
        this.rowTo = Math.min(max, this.rowTo + this.postLoadChunkSize);

        const frameTo = this.rowTo * this.gridWidth + 1;
        const to = Math.min(this.allFrames.length, frameTo);

        this.displayedTo = to;
        this.displayedFrames = this.allFrames.slice(
            this.displayedFrom,
            this.displayedTo
        );

        //console.debug("displayedTo: ", this.displayedTo);

        if (to < this.allFrames.length) {
            this.downTimeoutHandle = setTimeout(
                this.loadDown,
                this.postLoadTimeout
            );
        } else {
            console.debug("Loaded DOWN!");
        }
    }

    @action showDetailWindow(frameId) {
        // Make sure we have the HTML element handle
        if (!this.windowEl || !this.sliderEl) {
            this.windowEl = document.getElementById(CS.ELEM_ID_DETAIL_WINDOW);
            this.sliderEl = document.getElementById(
                CS.ELEM_ID_DETAIL_WINDOW_SLIDER
            );
        }

        this.windowVisible = true;

        // Number of rows above/below pivot row to be loaded initialy
        const neighRowRadius = Math.ceil((this.gridHeight - 1) / 2);
        const windowH = this.windowEl.clientHeight;
        const totH =
            Math.ceil(this.allFrames.length / this.gridWidth) *
                this.thumbHeight +
            neighRowRadius * this.thumbHeight;

        this.sliderEl.style.height = `${totH}px`;
        //this.sliderEl.style.overflowY = "scroll";

        const pivodIdx = this.allFrames.findIndex((x) => {
            return x.id == frameId;
        });
        this.allFrames[pivodIdx].highlighted = true;

        const pivotRowIdx = Math.floor(pivodIdx / this.gridWidth);

        const rowFrom = pivotRowIdx - neighRowRadius;
        const rowTo = pivotRowIdx + neighRowRadius + 1;

        const frameFrom = rowFrom * this.gridWidth;
        const frameTo = rowTo * this.gridWidth + 1;

        const fr = Math.max(0, frameFrom);
        const to = Math.min(this.allFrames.length, frameTo);

        // Insert what frames are to be actually rendered
        this.rowFrom = rowFrom;
        this.rowTo = rowTo;
        this.displayedFrom = fr;
        this.displayedTo = to;
        this.displayedFrames = this.allFrames.slice(
            this.displayedFrom,
            this.displayedTo
        );

        // Set up the final padding & scroll
        const topPadding = this.thumbHeight * rowFrom;
        const topScroll = pivotRowIdx * this.thumbHeight - windowH / 2;

        this.sliderEl.style.paddingTop = `${topPadding}px`;
        this.windowEl.scrollTop = topScroll;

        // console.debug("pivotRowIdx: ", pivotRowIdx);
        // console.debug("rowFrom: ", rowFrom);
        // console.debug("rowTo: ", rowTo);
        // console.debug("frameFrom: ", frameFrom);
        // console.debug("frameTo: ", frameTo);

        this.downTimeoutHandle = setTimeout(
            this.loadDown,
            this.postLoadTimeout
        );
        this.upTimeoutHandle = setTimeout(this.loadUp, this.postLoadTimeout);
    }

    @action
    hideDetailWindow() {
        this.windowVisible = false;

        this.displayedFrom = 0;
        this.displayedTo = 0;
        this.rowFrom = 0;
        this.rowTo = 0;

        this.allFrames = undefined;
        this.displayedFrames = undefined;

        clearTimeout(this.upTimeoutHandle);
        clearTimeout(this.downTimeoutHandle);
    }

    /* Member variables */
    @service actionManager;
    @service dataLoader;

    upTimeoutHandle = null;
    downTimeoutHandle = null;

    postLoadChunkSize = 2;
    postLoadTimeout = 100;

    CS = CS;

    cssFrameWidth = undefined;
    cssFrameHeight = undefined;

    windowEl = undefined;
    sliderEl = undefined;

    thumbWidth = undefined;
    thumbHeight = undefined;
    gridWidth = undefined;
    gridHeight = undefined;
    modalSliderW = undefined;
    modalSliderH = undefined;

    @tracked windowVisible = false;
    @tracked displayedFrames = undefined;

    rowFrom = 0;
    rowTo = 0;

    displayedFrom = 0;
    displayedTo = 0;

    allFrames = undefined;
}
