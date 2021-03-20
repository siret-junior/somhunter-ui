import Service from "@ember/service";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class DataLoaderService extends Service {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    get settings() {
        return this.store.peekRecord("core-settings", 0);
    }

    get uiSettings() {
        return this.settings.ui;
    }

    get apiSettings() {
        return this.settings.api;
    }
    get stringSettings() {
        return this.settings.strings;
    }

    get userContext() {
        return this.store.peekRecord("user-context", 0);
    }
    getMainFrames() {
        const data = this.store.peekRecord("main-display", 0);
        return data?.frames;
    }

    getDetailFrames() {
        const detail = this.store.peekRecord("detail-window", 0);
        return detail?.frames;
    }

    getReplayFrames() {
        const detail = this.store.peekRecord("replay-window", 0);
        return detail?.frames;
    }

    getReplayPivotId() {
        const detail = this.store.peekRecord("replay-window", 0);
        return detail?.pivotFrameId;
    }

    getShowDetailView() {
        const detail = this.store.peekRecord("detail-window", 0);
        return detail?.show;
    }

    getShowReplayView() {
        const detail = this.store.peekRecord("replay-window", 0);
        return detail?.show;
    }

    setShowReplayView(val) {
        const window = this.store.peekRecord("replay-window", 0);
        if (window) window.show = val;
    }

    setShowDetailView(val) {
        const window = this.store.peekRecord("detail-window", 0);
        if (window) window.show = val;
    }

    getShowReplaylView() {
        const detail = this.store.peekRecord("replay-window", 0);
        return detail?.show;
    }

    setShowReplayView(val) {
        const window = this.store.peekRecord("replay-window", 0);
        if (window) window.show = val;
    }

    mainDisplayFrames() {
        const mainDisplay = this.store.peekRecord("main-display", 0);

        return mainDisplay?.frames;
    }

    mainDisplayType() {
        const mainDisplay = this.store.peekRecord("main-display", 0);

        return mainDisplay?.activeDisplay;
    }

    setLikedFlag(frameId, likedState) {
        if (!frameId || typeof likedState === "undefined" || likedState == null)
            throw Error(
                `Invalid params: frameId: ${frameId}, likedState: ${likedState}`
            );

        // Main grid
        let frames = this.getMainFrames();
        if (frames) {
            frames.forEach((x) => {
                if (x.id == frameId) {
                    x.liked = likedState;
                    LOG.D(
                        `MAIN GRID: Setting liked state to ${frameId} to ${likedState}`
                    );
                }
            });
        }

        // Replay grid
        frames = this.getReplayFrames();
        if (frames) {
            frames.forEach((x) => {
                if (x.id == frameId) {
                    x.liked = likedState;
                    LOG.D(
                        `REPLAY GRID: Setting liked state to ${frameId} to ${likedState}`
                    );
                }
            });
        }

        // Detail grid
        frames = this.getDetailFrames();
        if (frames) {
            frames.forEach((x) => {
                if (x.id == frameId) {
                    x.liked = likedState;
                    LOG.D(
                        `DETAIL GRID: Setting liked state to ${frameId} to ${likedState}`
                    );
                }
            });
        }
    }

    /* Member variables */
    @service store;
}
