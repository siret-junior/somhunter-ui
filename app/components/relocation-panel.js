import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";
import { EVENTS } from "../constants";

export default class RelocationPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.actionManager.registerEventHook(
            EVENTS.SET_RELOCATION,
            this.onSetRelocation.bind(this)
        );

        this.actionManager.registerEventHook(
            EVENTS.RELOAD_USER_CONTEXT,
            this.onReload.bind(this)
        );
    }

    onSetRelocation(args) {
        if (args.tempId == 0) {
            this.relocation0 = args.frame;
        } else {
            this.relocation1 = args.frame;
        }
    }

    onReload() {
        let rel0 = this.args.model.userContext.search.relocation[0];
        let rel1 = this.args.model.userContext.search.relocation[1];
        this.relocation0 =
            rel0 == undefined || rel0.id == undefined ? undefined : rel0;
        this.relocation1 =
            rel1 == undefined || rel1.id == undefined ? undefined : rel1;
    }

    @action
    onRelocationBtnClick0(e) {
        this.actionManager.showRelocationView(0);
        e.stopPropagation(); // Prevent the bubbling
    }

    @action
    clearRelocation0(e) {
        this.relocation0 = undefined;
        e.stopPropagation(); // Prevent the bubbling
    }

    @action
    onRelocationBtnClick1(e) {
        this.actionManager.showRelocationView(1);
        e.stopPropagation(); // Prevent the bubbling
    }

    @action
    clearRelocation1(e) {
        this.relocation1 = undefined;
        e.stopPropagation(); // Prevent the bubbling
    }

    /* Member variables */
    @service actionManager;

    @tracked relocation0;
    @tracked relocation1;
}
