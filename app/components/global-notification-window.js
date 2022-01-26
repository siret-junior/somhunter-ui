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
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { getCurrSubString, subCurrWord } from "../utils";

import { inject as service } from "@ember/service";
import { EVENTS, ELEM_IDS } from "../constants";

export default class GlobalNotificationWindowComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.notifications = [];
        this.actionManager.registerEventHook(
            EVENTS.DO_PUSH_NOTIF,
            (title, type, duration, msg) =>
                this.pushNotification(title, type, duration, msg)
        );
        this.actionManager.registerEventHook(
            EVENTS.BLOCK_WITH_NOTIFICATION,
            (title, type, duration, msg) =>
                this.blockWithNotification(title, type, duration, msg)
        );
        this.actionManager.registerEventHook(
            EVENTS.UNBLOCK_WITH_NOTIFICATION,
            () => this.unblockWithNotification()
        );
    }

    /** type: "success","warning", "error" */
    pushNotification(title, type = "success", duration = 3000, msg = "") {
        var newId = this.nextNotId++;
        this.notifications = [
            ...this.notifications,
            {
                id: newId,
                type: type,
                title: title,
                deleteHandle: setTimeout(() => {
                    this.notifications = this.notifications.filter(
                        (x) => x.id != newId
                    );
                }, duration),
                message: msg,
            },
        ];
    }

    /** type: "success","warning", "error" */
    blockWithNotification(title, type = "success", duration = 3000, msg = "") {
        this.blockingNotification = {
            title: title,
            type: type,
            deleteHandle: setTimeout(() => {
                this.blockingNotification = null;
            }, duration),
            message: msg,
        };
    }

    unblockWithNotification() {
        if (this.blockingNotification) {
            if (this.blockingNotification.deleteHandle) {
                clearTimeout(this.blockingNotification.deleteHandle);
            }
        }

        this.blockingNotification = null;
    }

    @action
    unblock(e) {
        this.actionManager.triggerEvent(EVENTS.UNBLOCK_WITH_NOTIFICATION);
    }

    /* Member variables */
    nextNotId = 0;

    @tracked notifications;
    @tracked blockingNotification = null;

    @service actionManager;
}
