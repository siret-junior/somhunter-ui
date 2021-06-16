import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class SettingsWindowComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Subscribe to the specific EVENTS
        this.actionManager.registerEventHook(EVENTS.SHOW_SETTINGS_WINDOW, () =>
            this.showWindow()
        );

        // On global ESC key down
        this.actionManager.registerEventHook(EVENTS.GLOBAL_ESC_KEY_DOWN, () =>
            this.hideWindow()
        );
    }

    showWindow() {
        this.windowVisible = true;
    }

    @action
    hideWindow() {
        this.windowVisible = false;
    }

    @action
    login() {
        this.actionManager.login();
    }

    @action
    logout() {
        this.actionManager.logout();
    }

    /* Member variables */
    @service actionManager;
    @tracked coreSettings;

    @tracked windowVisible = false;
}
