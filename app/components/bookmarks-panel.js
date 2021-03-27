import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

export default class BookmarksPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.actionManager.registerEventHook(
            EVENTS.AFTER_BOOKMARK_FRAME,
            this.afterBookmarkFrameHandler.bind(this)
        );
    }

    // Whenever the @model updates
    @action
    didUpdateAttrs(elem, [x]) {
        this.items = x;
    }

    afterBookmarkFrameHandler(frame, isBookmarked) {
        if (isBookmarked) this.items = [...this.items, frame];
        else this.items = [...this.items.filter((x) => x.id != frame.id)];
    }

    @action
    onRemoveBookmarkItem(e) {
        const frameId = Number(e.currentTarget.dataset.frameId);

        if (typeof frameId !== "number") throw Error("Wrong param!");
        this.actionManager.addBookmark(frameId);
    }

    @tracked items = this.args.frames;

    /* Member variables */
    @service actionManager;
}
