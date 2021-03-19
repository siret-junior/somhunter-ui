import Component from "@glimmer/component";
import { action, computed } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

import CS from "../constants";

export default class MainGridComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Register the reload hook to `changeView` event
        this.actionManager.registerEventHook(CS.EVENT_NAME_VIEW_CHANGE, () =>
            this.modelReload()
        );

        this.modelReload();
    }

    modelReload() {
        this.frames = this.dataLoader.mainDisplayFrames();
        this.viewType = this.dataLoader.mainDisplayType();
    }

    @action
    onScroll(e) {
        const tarEl = e.target;
        const diff = tarEl.scrollHeight - tarEl.scrollTop - tarEl.clientHeight;

        console.log("diff: ", diff);
        if (diff < 500) {
            const viewTypes = this.dataLoader.stringSettings.displayTypes;
            if (
                this.viewType === viewTypes.topn ||
                this.viewType === viewTypes.topknn ||
                this.viewType === viewTypes.topnContext
            ) {
                const t = new Date().getTime();
                if (this.prevFetchTimestamp + 2000 < t) {
                    this.prevFetchTimestamp = t;

                    this.currentPage = this.currentPage + 1;

                    this.actionManager.loadTopViewPage(
                        this.viewType,
                        this.currentPage
                    );
                }
            }
        }
    }

    /* Member variables */
    @service actionManager;
    @service dataLoader;

    currentPage = 0;
    prevFetchTimestamp = null;

    @tracked frames = undefined;
    @tracked viewType = undefined;
}
