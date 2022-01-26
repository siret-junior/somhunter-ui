/* This file is part of SOMHunter UI.
 *
 * Copyright (C) 2022    Frantisek Mejzlik <frankmejzlik@gmail.com>
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

import Route from "@ember/routing/route";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class IndexRoute extends Route {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Initialize the app
        const cb = () => this.refresh();
        this.actionManager.initialize(cb, cb);

        this.actionManager.registerEventHook(
            EVENTS.RELOAD_USER_CONTEXT,
            this.forceRefresh
        );

        this.actionManager.registerEventHook(EVENTS.NAME_VIEW_CHANGE, () => { this.actionManager.triggerEvent(EVENTS.GLOBAL_ESC_KEY_DOWN); }
        );
    }

    model() {
        const coreSettings = this.store.peekRecord("config", 0);
        const userContext = this.store.peekRecord("user-context", 0);

        LOG.D("INDEX: passing model with ID ", this.nextId);
        return {
            id: this.nextId++,
            coreSettings,
            userContext,
        };
    }

    nextId = 0;

    @action
    forceRefresh() {
        LOG.D("Forcing the `index.js` route refresh!");
        this.refresh();
    }

    /* Member variables */
    @service actionManager;
}
