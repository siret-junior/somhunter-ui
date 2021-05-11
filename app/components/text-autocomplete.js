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
                if (this.suggestions.length <= 0) return;

                this.setChosenWord(this.suggestions[this.selIdx].wordString);

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
        this.inputValue = x.userContext.search.textQueries[this.args.id];
    }

    @action
    updateInputValue(e) {
        this.inputValue = e.target.value;
        this.cursorIdx = e.target.selectionStart;

        const currValue = getCurrSubString(this.inputValue, this.cursorIdx);

        if (currValue == "") {
            return;
        }

        this.actionManager.getTextAutocompleteSuggestions(
            currValue,
            (suggs) => {
                this.suggestions = suggs;
            },
            (e) => {
                alert(e.message);
            }
        );
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
        this.hideAutocompleteWindow();
    }

    /* Member variables */
    @service actionManager;

    @tracked suggestions = [];
    @tracked inputValue = this.args.model.userContext.search.textQueries[
        this.args.id
    ];
    @tracked cursorIdx = 0;
    @tracked selIdx = 0;
    lastCurrPos = 0;
}
