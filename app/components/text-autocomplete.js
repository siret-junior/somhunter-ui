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

import { getCurrSubString, subCurrWord } from "../utils";

import { inject as service } from "@ember/service";

import ENV from "somhunter-ui/config/environment";
import { EVENTS, ELEM_IDS } from "../constants";
import LOG from "../logger";
import utils from "../utils";

import { addObserver } from "@ember/object/observers";

export default class TextAutocompleteComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Subscribe to the specific EVENTS
        this.actionManager.registerEventHook(
            EVENTS.GLOBAL_ESC_KEY_DOWN,
            this.hideAutocompleteWindow
        );

        this.actionManager.registerEventHook(
            EVENTS.HIDE_AUTOCOMPLETE,
            this.hideAutocompleteWindow
        );
    }

    @action
    hideAutocompleteWindow() {
        this.suggestions = [];
    }

    @action
    onKeyDown(e) {
        switch (e.which) {
            case 38: // up
                this.selIdx = Math.max(0, --this.selIdx);
                e.stopPropagation();
                e.preventDefault(); // Do not move the cursor
                break;

            case 40: // down
                this.selIdx = Math.min(
                    this.suggestions.length - 1,
                    ++this.selIdx
                );
                e.preventDefault(); // Do not move the cursor
                e.stopPropagation();
                break;

            case 13: // enter
                break;
                if (this.suggestions.length <= 0) return;

                this.setChosenWord(this.suggestions[this.selIdx].wordString);
                e.stopPropagation();
                e.preventDefault();

                break;

            case 27: // ESC
                this.suggestions = [];
                document.activeElement.blur();
                e.stopPropagation();
                break;
        }
    }
    @action
    didUpdateAttrs(elem, [x]) {
        if (this.args.value == "") return;
        this.inputValue = x.userContext.search.textQueries[this.args.id];
    }

    @action
    updateInputValue(e) {
        this.inputValue = e.target.value;

        const wholeText = utils.getTextQueryInput(0) + " >> " + utils.getTextQueryInput(1);
        this.actionManager.logTextQueryChange(wholeText);

        this.cursorIdx = e.target.selectionStart;

        const currValue = getCurrSubString(this.inputValue, this.cursorIdx);

        if (currValue == "") {
            return;
        }


        // clearTimeout(this.autocompleteTimeout);
        // this.autocompleteTimeout = setTimeout(
        //     function (parent, value) {
        //         parent.actionManager.getTextAutocompleteSuggestions(
        //             value,
        //             (suggs) => {
        //                 LOG.D("Triggering show autocomplete");
        //                 parent.actionManager.triggerEvent(
        //                     EVENTS.HIDE_AUTOCOMPLETE
        //                 );
        //                 parent.suggestions = suggs;
        //             },
        //             (e) => {
        //                 alert(e.message);
        //             }
        //         );
        //     },
        //     200,
        //     this,
        //     currValue
        // );
    }

    @action
    setChosenWord(word) {
        const [newInputValue, newCursorIndex] = subCurrWord(
            this.inputValue,
            this.cursorIdx,
            word
        );
        this.inputValue = newInputValue;
        this.cursorIdx = newCursorIndex;

        let wholeText = "";
        if (this.args.id == 0) {
            wholeText = newInputValue + " >> " + utils.getTextQueryInput(1);
        } else {
            wholeText = utils.getTextQueryInput(0) + " >> " + newInputValue;
        }
        LOG.W(wholeText);
        this.actionManager.logTextQueryChange(wholeText);

        this.hideAutocompleteWindow();
    }

    /* Member variables */
    @service actionManager;
    thumbsUrlPrefix = ENV.dataServerUrl + "/thumbs/";
    @tracked suggestions = [];
    @tracked inputValue = this.args.value
        ? this.args.value
        : this.args.model.userContext.search.textQueries[this.args.id];
    @tracked cursorIdx = 0;
    @tracked selIdx = 0;
    lastCurrPos = 0;

    autocompleteTimeout = null;
}
