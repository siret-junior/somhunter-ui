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
                console.log(this.selIdx);
                break;

            case 40: // down
                this.selIdx = Math.min(
                    this.suggestions.length - 1,
                    ++this.selIdx
                );
                console.log(this.selIdx);
                break;

            case 13: // enter
                this.setChosenWord(this.suggestions[this.selIdx].wordString);
                console.log(this.suggestions[this.selIdx].wordString);
                break;

            case 27: // ESC
                this.suggestions = [];
                document.activeElement.blur();
                break;
        }
    }

    @action
    updateInputValue(e) {
        this.inputValue = e.target.value;
        this.lastCurrPos = e.target.selectionStart;

        const currValue = getCurrSubString(this.inputValue, this.lastCurrPos);

        this.actionManager.getTextAutocompleteSuggestions(
            currValue,
            (suggs) => {
                this.suggestions = suggs;
                console.log(this.suggestions);
            },
            (e) => {
                alert(e.message);
            }
        );
    }

    @action
    setChosenWord(word) {
        this.inputValue = subCurrWord(this.inputValue, this.lastCurrPos, word);
    }

    /* Member variables */
    @service actionManager;

    @tracked suggestions = [];
    @tracked inputValue = "";
    @tracked selIdx = 0;
    lastCurrPos = 0;
}
