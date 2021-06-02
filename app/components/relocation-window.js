import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class RelocationWindowComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // On global ESC keydown
        this.actionManager.registerEventHook(
            EVENTS.GLOBAL_ESC_KEY_DOWN,
            this.hideRelocationWindow
        );

        this.actionManager.registerEventHook(
            EVENTS.LOAD_RELOCATION,
            this.loadRelocationFrames
        );

        this.actionManager.registerEventHook(
            EVENTS.SHOW_RELOCATION,
            this.showRelocationWindow
        );

        this.actionManager.registerEventHook(
            EVENTS.HIDE_RELOCATION,
            this.hideRelocationWindow
        );

        // Create shortcuts for frequently used values
        const configVideoDetail = this.dataLoader.getConfigUi().video_detail;
        
        this.thumbWidth = configVideoDetail.thumb_width;
        this.thumbHeight = Math.ceil(this.thumbWidth * 0.5625);
        this.gridWidth = 5;//configVideoDetail.grid_width;
        this.gridHeight = 5;//configVideoDetail.grid_height;

        this.modalSliderW = this.gridWidth * this.thumbWidth;
        this.modalSliderH = this.gridWidth * this.thumbHeight;

        this.cssFrameWidth = `${100 / this.gridWidth}%`;
        this.cssFrameHeight = `${this.thumbHeight}px`;
    }

    @action loadRelocationFrames() {
        this.allFrames = this.dataLoader.getRelocationFrames();
    }

    @action showRelocationWindow(tempId) {
        // Make sure we have the HTML element handle
        if (!this.windowEl || !this.sliderEl) {
            this.windowEl = document.getElementById(ELEM_IDS.RELOCATION_WINDOW);
            this.sliderEl = document.getElementById(
                ELEM_IDS.RELOCATION_WINDOW_SLIDER
            );
        }
        
        this.tempId = tempId;
        this.windowVisible = true;

        // Number of rows above/below pivot row to be loaded initialy
        const totH = this.gridHeight * this.thumbHeight

        this.sliderEl.style.height = `${totH}px`;
        
        this.displayedFrames = this.allFrames;
    }

    @action
    hideRelocationWindow() {
        this.windowVisible = false;

        this.allFrames = undefined;
        this.displayedFrames = undefined;
    }

    @action
    setRelocation(frame) {
        this.actionManager.triggerEvent(EVENTS.SET_RELOCATION, {
            frame: frame,
            tempId: this.tempId,
        });
    }

    /* Member variables */
    @service actionManager;
    @service dataLoader;

    ELEM_IDS = ELEM_IDS;

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

    allFrames = undefined;

    tempId = undefined;
}
