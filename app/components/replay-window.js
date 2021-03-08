import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import CS from "../constants";
import { getCurrSubString, subCurrWord } from "../utils";

export default class ReplayWindowComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.actionManager.registerEventHook(
            CS.EVENT_SHOW_REPLAY,
            (frameId) => {
                this.showReplayWindow(frameId);
            }
        );

        this.actionManager.registerEventHook(CS.EVENT_HIDE_REPLAY, () => {
            this.hideReplayWindow();
        });

        this.actionManager.registerEventHook(
            CS.EVENT_SLIDE_REPLAY,
            (deltaY) => {
                this.slideReplayWindow(deltaY);
            }
        );

        this.actionManager.registerEventHook(CS.EVENT_LOAD_REPLAY, () => {
            this.loadReplayFrames();
        });

        // Create shortcuts for frequently used values

        this.slideSpeed = this.dataLoader.uiSettings.videoReplay.slideSpeed;
        this.thumbWidth = this.dataLoader.uiSettings.videoReplay.thumbWidth;
    }

    /**
     * Responsible for loading all the video frames into the inner variable
     * (but DOES NOT render it!).
     */
    @action
    loadReplayFrames() {
        this.allFrames = this.dataLoader.getReplayFrames();
    }

    /**
     * Actually shows the appropriate number of frames to the user scrolled
     * to the frame of interest (pivot frame).
     */
    @action
    showReplayWindow(frameId) {
        // Make sure we have the HTML element handle
        if (!this.windowEl || !this.sliderEl) {
            this.windowEl = document.getElementById(CS.ELEM_ID_REPLAY_WINDOW);
            this.sliderEl = document.getElementById(
                CS.ELEM_ID_REPLAY_WINDOW_SLIDER
            );
        }

        this.windowVisible = true;

        /*
         * Calculate values for perfect centering & scroll of the slider to the pivot.
         */
        const windowW = this.windowEl.clientWidth;
        const neighRadius = Math.ceil(windowW / this.thumbWidth) / 2;

        const totW = (this.allFrames.length + neighRadius) * this.thumbWidth;
        this.sliderEl.style.width = `${totW}px`;
        this.sliderEl.style.overflowX = "scroll";

        const pivodIdx = this.allFrames.findIndex((x) => {
            return x.id == frameId;
        });
        this.allFrames[pivodIdx].highlighted = true;

        const fr = Math.max(0, pivodIdx - neighRadius);
        const to = Math.min(this.allFrames.length, pivodIdx + neighRadius);

        // Insert what frames are to be actually rendered
        this.displayedFrom = fr;
        this.displayedTo = to;
        this.displayedFrames = this.allFrames.slice(
            this.displayedFrom,
            this.displayedTo
        );

        // Set up the final padding & scroll
        const leftPadding = this.thumbWidth * fr;
        const leftScroll =
            pivodIdx * this.thumbWidth + this.thumbWidth / 2 - windowW / 2;

        this.sliderEl.style.paddingLeft = `${leftPadding}px`;
        this.windowEl.scrollLeft = leftScroll;
    }

    @action
    hideReplayWindow() {
        this.windowVisible = false;
        this.displayedFrames = undefined;
        this.displayedFrom = 0;
        this.displayedTo = 0;
    }

    @action
    slideReplayWindow(deltaY) {
        const deltaYFrames = deltaY > 0 ? 1 : -1;
        const prevScrollLeft = this.windowEl.scrollLeft;
        const newScrollLeft = prevScrollLeft + deltaYFrames * this.thumbWidth;

        console.debug("deltaYFrames: ", deltaYFrames);
        console.debug("newScrollLeft: ", newScrollLeft);

        this.windowEl.scrollLeft = newScrollLeft;
        if (deltaYFrames < 0) {
            this.displayedFrom = Math.max(0, this.displayedFrom + deltaYFrames);
            let prevPadd = this.sliderEl.style.paddingLeft;
            prevPadd = Number(prevPadd.substr(0, prevPadd.length - 2));
            this.sliderEl.style.paddingLeft = `${prevPadd - this.thumbWidth}px`;
        } else {
            this.displayedTo = Math.min(
                this.allFrames.length,
                this.displayedTo + deltaYFrames
            );
        }

        this.displayedFrames = this.allFrames.slice(
            this.displayedFrom,
            this.displayedTo
        );
    }

    /* Member variables */
    @service actionManager;
    @service dataLoader;

    CS = CS;

    slideSpeed = undefined;
    windowEl = undefined;
    sliderEl = undefined;
    thumbWidth = undefined;

    @tracked windowVisible = false;
    @tracked displayedFrames = undefined;

    displayedFrom = 0;
    displayedTo = 0;

    allFrames = undefined;
}
