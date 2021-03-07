import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { getCurrSubString, subCurrWord } from "../utils";

import { inject as service } from "@ember/service";

export default class TextAutocompleteComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);
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
                e.stopPropagation();
                break;

            case 27: // ESC
                this.suggestions = [];
                document.activeElement.blur();
                e.stopPropagation();
                break;
        }
    }

    @action
    updateInputValue(e) {
        this.inputValue = e.target.value;
        this.cursorIdx = e.target.selectionStart;

        const currValue = getCurrSubString(this.inputValue, this.cursorIdx);

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
    }

    /* Member variables */
    @service actionManager;

    @tracked suggestions = [];
    @tracked inputValue = "";
    @tracked cursorIdx = 0; //el.selectionStart
    @tracked selIdx = 0;
    lastCurrPos = 0;
}
