import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class LikesPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.actionManager.registerEventHook(
            EVENTS.AFTER_LIKE_FRAME,
            this.afterLikeFrameHandler.bind(this)
        );
    }

    @action
    didUpdateAttrs(elem, [x]) {
        this.items = this.args.frames;
    }

    afterLikeFrameHandler(frame) {
        if (frame.liked) this.items = [...this.items, frame];
        else this.items = [...this.items.filter((x) => x.id != frame.id)];
    }

    @tracked items = this.args.frames;

    /* Member variables */
    @service actionManager;
}
