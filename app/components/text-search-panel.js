import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";
import { EVENTS } from "../constants";

export default class TextSearchPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.actionManager.registerEventHook(
            EVENTS.GLOBAL_TAB_KEY_DOWN,
            this.switchInput
        );

    }

    @action
    switchInput() {
        if (document.activeElement.id === "textQueryInput0")
            document.getElementById("textQueryInput1").focus();
        else
            document.getElementById("textQueryInput0").focus();
    }

    /* Member variables */
    @service actionManager;
}
