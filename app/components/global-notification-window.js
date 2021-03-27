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
            EVENTS.PUSH_NOTIFICATION,
            (title, msg, duration, type) =>
                this.pushNotification(title, msg, duration, type)
        );
        this.actionManager.registerEventHook(
            EVENTS.BLOCK_WITH_NOTIFICATION,
            (title, msg, duration, type) =>
                this.blockWithNotification(title, msg, duration, type)
        );
        this.actionManager.registerEventHook(
            EVENTS.UNBLOCK_WITH_NOTIFICATION,
            () => this.unblockWithNotification()
        );
    }

    /** type: "success","warning", "error" */
    pushNotification(title, msg, duration, type = "warning") {
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
    blockWithNotification(title, msg, duration, type = "warning") {
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
        if (this.blockingNotification.deleteHandle) {
            clearTimeout(this.blockingNotification.deleteHandle);
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
