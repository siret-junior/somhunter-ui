import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS, ELEM_CLASSES } from "../constants";
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

function deleteElementByUid(uid) {
    var elem = document.getElementById(uid);
    elem.remove();
}

export default class CanvasQueryPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        this.ELEM_CLASSES = ELEM_CLASSES;
        this.ELEM_IDS = ELEM_IDS;

        this.collage_temporal_queries = $("#collageTemporalQueries");
        this.collage_canvases = $(".collage-canvas");

        this.texts = [[], []];
    }

    didUpdateAttrs(elem, [updatedStructure]) {
        // On attrupate
    }

    didInsertWrapper(elem, [updatedStructure]) {
        const canvases = document.querySelectorAll(".collage-canvas");
        canvases.forEach((x) => x.classList.remove("paste-active"));

        canvases[0].classList.add("paste-active");
    }

    @action
    onRemoveItem(ID, canvasId, e) {
        this.texts[canvasId] = this.texts[canvasId].filter((x) => x.id != ID);
        deleteElementByUid(ID);
    }

    @action
    onClickAddTextBtn(e) {
        const active_canvasEl = document.querySelector(".paste-active");
        const active_canvas = $(".paste-active");
        const queryIdx = active_canvasEl.dataset.id;

        if (!active_canvas) return;

        this.texts[queryIdx].push({ id: this.available_id, text: "" });

        this.texts = [...this.texts];
        this.available_id++;
    }

    @tracked texts;

    @tracked available_id = 999;

    /* Member variables */
    @service actionManager;
}
