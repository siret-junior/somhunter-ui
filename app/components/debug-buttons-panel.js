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
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class DebugButtonsPanelComponent extends Component {
    @action
    block(e) {
        this.actionManager.triggerEvent(
            EVENTS.BLOCK_WITH_NOTIFICATION,
            "Blocking process is running!"
        );
    }

    @action
    unblock(e) {
        this.actionManager.triggerEvent(EVENTS.UNBLOCK_WITH_NOTIFICATION);
    }

    @action
    toast(type, e) {
        this.actionManager.triggerEvent(
            EVENTS.DO_PUSH_NOTIF,
            "Some notification",
            type
        );
    }

    /* Member variables */
    @service actionManager;
}
