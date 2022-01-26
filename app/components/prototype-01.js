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

import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class Prototype01Component extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Subscribe to the specific EVENTS
        this.actionManager.registerEventHook(
            EVENTS.GLOBAL_ESC_KEY_DOWN,
            this.hideDetailWindow
        );

        // Attributes passed in as `args` ar accessible as so:
        // e.g. for <Prototype01Component @someArg={{someVar}}>
        this.args.someArg = 123;
    }

    didUpdateAttrs(elem, [updatedStructure]) {
        // On attrupate
    }
    @action
    // For some reason the parameters go in inverted (event as last)
    toast(type, e) {
        // Get the target DOM element that this event happened on
        const element = e.currentTarget;

        // <!>
        this.actionManager.triggerEvent(
            EVENTS.DO_PUSH_NOTIF,
            "Somenotification",
            type,
            30000,
            "Hello from the notification!"
        );
    }

    /* Member variables */
    @service actionManager;
}
