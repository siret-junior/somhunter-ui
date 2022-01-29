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

        this.actionManager.registerEventHook(EVENTS.RESET_PAGING, () =>
            this.resetPaging()
        );

        this.actionManager.registerEventHook(EVENTS.CLEAR_MAIN_GRID, () =>
            this.clearGrid()
        );

        this.modelReload();
    }

    resetPaging() {
        this.currentPage = 0;
        this.prevScrollLogPosition = 0;
    }

    modelReload() {
        this.frames = this.dataLoader.mainDisplayFrames();
        this.viewType = this.dataLoader.mainDisplayType();
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
