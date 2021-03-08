import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import CS from "../constants";
import { getCurrSubString, subCurrWord } from "../utils";

export default class DetailWindowComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.actionManager.registerEventHook(
            CS.EVENT_NAME_DETAIL_VIEW_CHANGE,
            () => {
                this.modelReload();
            }
        );

        this.actionManager.registerEventHook(CS.EVENT_SHOW_DETAIL, () => {
            this.showReload();
        });
    }

    @action
    onHide() {
        this.frames = undefined;
    }

    @action modelReload() {
        this.show = this.dataLoader.getShowDetailView();
        this.allFrames = this.dataLoader.getDetailFrames();
        this.frames = this.allFrames;
    }

    @action showReload() {
        this.show = this.dataLoader.getShowDetailView();
    }

    /* Member variables */
    @service actionManager;
    @service dataLoader;

    @tracked show = false;
    @tracked frames = undefined;
    @tracked allFrames = undefined;
}
