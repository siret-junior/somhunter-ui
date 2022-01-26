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

function draggableAndResizable(elements, containment) {
    elements.draggable({
        containment: containment,
    });
    elements.resizable({
        containment: containment,
        aspectRatio: false,
    });
}

export default class QueryCanvasComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.index = this.args.index;
        this.initActive = this.index == 0 ? true : false;
        this.canvasElemId = ELEM_IDS.CANVAS_QUERY_PREFIX + this.index;

        this.actionManager.registerEventHook(
            EVENTS.RELOAD_USER_CONTEXT,
            this.onReload.bind(this)
        );
    }

    didUpdateAttrs(elem, [updatedStructure]) {}

    didInsert(elem) {
        const elements = $(elem);
        const par = elements.parent();
        draggableAndResizable(elements, par);
    }

    onReload() {
        const canvases = document.querySelectorAll(".collage-canvas");
        canvases.forEach((x) => {
            // TODO
            //x.innerHTML = "";
        });
    }

    @action
    onClickQueryCanvas(queryIdx, e) {
        const el = e.currentTarget;

        const canvases = document.querySelectorAll(".collage-canvas");
        canvases.forEach((x) => {
            x.parentElement.classList.remove("active");
            x.classList.remove("paste-active");
        });
        el.classList.add("paste-active");
        el.parentElement.classList.add("active");
    }

    // @action
    // onRemoveItem(ID, e) {
    //     this.args.texts = this.args.texts.filter(x => x.id != ID);
    //     console.log(this.args.texts);
    // }

    // If this canavs is visible to the user
    visible = true;
    index = null;
    initActive = null;
    canvasElemId = null;

    /* Member variables */
    @service actionManager;
}
