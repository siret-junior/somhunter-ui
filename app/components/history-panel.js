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

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class HistoryPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    // Whenever the @model updates
    @action
    didUpdateAttrs(elem, [x]) {
        this.currentSearchId = x.userContext.search.id;
        this.historyItems = x.userContext.history.reverse();
    }

    @action
    onClickHistoryItem(e) {
        const hId = Number(e.currentTarget.dataset.historyId);

        if (typeof hId !== "number") throw Error("Wrong param!");

        LOG.D(`Switching to history ID ${hId}`);

        this.actionManager.switchSearchContext(hId);
    }

    @tracked historyItems = this.args.model.userContext.history.reverse();
    @tracked currentSearchId = this.args.model.userContext.search.id;

    /* Member variables */
    @service actionManager;
}
