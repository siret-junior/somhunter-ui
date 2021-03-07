import Service from "@ember/service";

import { inject as service } from "@ember/service";

export default class ModelLoaderService extends Service {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    get settings() {
        return this.store.peekRecord("core-settings", 0);
    }

    get userContext() {
        return this.store.peekRecord("user-context", 0);
    }

    getDetailFrames() {
        const detail = this.store.peekRecord("detail-window", 0);
        return detail?.frames;
    }

    getReplayFrames() {
        const detail = this.store.peekRecord("replay-window", 0);
        return detail?.frames;
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
        const detail = this.store.peekRecord("replay-window", 0);
        detail.show = val;
    }

    setShowDetailView(val) {
        const detail = this.store.peekRecord("detail-window", 0);
        detail.show = val;
    }

    getShowReplaylView() {
        const detail = this.store.peekRecord("replay-window", 0);
        return detail?.show;
    }

    setShowReplayView(val) {
        const detail = this.store.peekRecord("replay-window", 0);
        detail.show = val;
    }

    mainDisplayFrames() {
        const mainDisplay = this.store.peekRecord("main-display", 0);

        return mainDisplay?.frames;
    }

    mainDisplayType() {
        const mainDisplay = this.store.peekRecord("main-display", 0);

        return mainDisplay?.activeDisplay;
    }

    /* Member variables */
    @service store;
}
