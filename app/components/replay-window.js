/* This file is part of SOMHunter UI.
 *
 * Copyright (C) 2022    Frantisek Mejzlik <frankmejzlik@protonmail.com>
 *                       Vit Skrhak <vitek.skrhak@seznam.cz>
 *                       Patrik Veselý <prtrikvesely@gmail.com>
 * 
 *  SOMHunter UI is free software: you can redistribute it and/or modify it under
 *  the terms of the GNU General Public License as published by the Free
 *  Software Foundation, either version 2 of the License, or (at your option)
 *  any later version.
 * 
 *  SOMHunter UI is distributed in the hope that it will be useful, but WITHOUT ANY
 *  WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 *  FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 *  details.
 * 
 *  You should have received a copy of the GNU General Public License along with
 *  SOMHunter UI. If not, see <https://www.gnu.org/licenses/>.
 */

import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class ReplayWindowComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // On global ESC keydown
        this.actionManager.registerEventHook(
            EVENTS.GLOBAL_ESC_KEY_DOWN,
            this.hideReplayWindow
        );

        this.actionManager.registerEventHook(
            EVENTS.SHOW_REPLAY,
            (frameId, yNorm) => {
                this.showReplayWindow(frameId, yNorm);
            }
        );

        this.actionManager.registerEventHook(EVENTS.HIDE_REPLAY, () => {
            this.hideReplayWindow();
        });

        this.actionManager.registerEventHook(EVENTS.SLIDE_REPLAY, (deltaY) => {
            this.slideReplayWindow(deltaY);
        });

        this.actionManager.registerEventHook(EVENTS.LOAD_REPLAY, () => {
            this.loadReplayFrames();
        });

        // Create shortcuts for frequently used values

        this.slideSpeed = this.dataLoader.getConfigUi().video_replay.slide_speed;
        this.thumbWidth = this.dataLoader.getConfigUi().video_replay.thumb_width;
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
    showReplayWindow(frameId, yNorm) {
        // Make sure we have the HTML element handle
        if (!this.windowEl || !this.sliderEl) {
            this.windowEl = document.getElementById(ELEM_IDS.REPLAY_WINDOW);
            this.sliderEl = document.getElementById(
                ELEM_IDS.REPLAY_WINDOW_SLIDER
            );
        }

        this.windowVisible = true;

        /*
         * Calculate values for perfect centering & scroll of the slider to the pivot.
         */
        const windowW = this.windowEl.clientWidth;
        const neighRadius = Math.ceil(windowW / this.thumbWidth) / 2 + 5;

        const totW = (this.allFrames.length + neighRadius) * this.thumbWidth;
        this.sliderEl.style.width = `${totW}px`;
        this.sliderEl.style.overflowX = "scroll";

        let topPos = yNorm * 100 + (yNorm > 0.5 ? -25 : 15);

        this.windowEl.style.top = `${topPos}vh`;

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
        this.dataLoader.setShowReplayView(false);
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

        const t = new Date().getTime();

        if (
            !this.prevScrollLogTime ||
            t - this.prevScrollLogTime >
                this.dataLoader.getConfig().core.eval_server.log_action_timeout
        ) {
            this.prevScrollLogTime = t;
            this.actionManager.logScroll(deltaY, "video_replay");
        }
    }

    /* Member variables */
    @service actionManager;
    @service dataLoader;

    ELEM_IDS = ELEM_IDS;

    slideSpeed = undefined;
    windowEl = undefined;
    sliderEl = undefined;
    thumbWidth = undefined;

    @tracked windowVisible = false;
    @tracked displayedFrames = undefined;

    displayedFrom = 0;
    displayedTo = 0;

    prevScrollLogTime = null;

    allFrames = undefined;
}
