import Component from "@glimmer/component";
import { action, computed } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class MainGridComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Register the reload hook to `changeView` event
        this.actionManager.registerEventHook(EVENTS.NAME_VIEW_CHANGE, () =>
            this.modelReload()
        );

        this.actionManager.registerEventHook(EVENTS.CLEAR_MAIN_GRID, () =>
            this.clearGrid()
        );

        this.modelReload();
    }

    modelReload() {
        this.frames = this.dataLoader.mainDisplayFrames();
        this.viewType = this.dataLoader.mainDisplayType();
        this.prevScrollLogPosition = 0;
    }
    clearGrid() {
        this.frames = [];
    }

    @action
    onScroll(e) {
        const tarEl = e.target;
        const diff = tarEl.scrollHeight - tarEl.scrollTop - tarEl.clientHeight;
        const t = new Date().getTime();

        if (diff < 500) {
            const viewTypes = this.dataLoader.getConfigStrings().display_types;
            if (
                this.viewType === viewTypes.top_scored ||
                this.viewType === viewTypes.nearest_neighbours ||
                this.viewType === viewTypes.top_scored_context
            ) {
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

        if (
            !this.prevScrollLogTime ||
            t - this.prevScrollLogTime >
                this.dataLoader.getConfig().core.eval_server.log_action_timeout
        ) {
            this.prevScrollLogTime = t;
            this.actionManager.logScroll(
                this.prevScrollLogPosition - e.currentTarget.scrollTop,
                this.viewType
            );
            this.prevScrollLogPosition = e.currentTarget.scrollTop;
        }
    }

    /* Member variables */
    @service actionManager;
    @service dataLoader;

    ELEM_IDS = ELEM_IDS;

    currentPage = 0;
    prevFetchTimestamp = null;

    prevScrollLogTime = null;
    prevScrollLogPosition = 0;

    @tracked frames = undefined;
    @tracked viewType = undefined;
}
