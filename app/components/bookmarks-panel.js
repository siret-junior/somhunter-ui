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
