import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import { EVENTS, DEFAULT_LSC_FILTER_VALUES } from "../constants";
import { action } from "@ember/object";

export default class FiltersPanelComponent extends Component {
    weekdays = ["M", "T", "W", "T", "F", "S", "S"];
    constructor() {
        super(...arguments);

        this.features = this.dataLoader.getConfigUi().features;

        this.DEFAULT_LSC_FILTER_VALUES = DEFAULT_LSC_FILTER_VALUES;

        // Reset filters after clicking on "Reset" button
        this.actionManager.registerEventHook(
            EVENTS.AFTER_RESET_SEARCH,
            () => {
                this.setAllDays(true);

                const hoursFromTextbox = document.getElementById("hoursFrom");
                const hoursToTextbox = document.getElementById("hoursTo");

                hoursFromTextbox.value = DEFAULT_LSC_FILTER_VALUES.hoursFrom;
                hoursToTextbox.value = DEFAULT_LSC_FILTER_VALUES.hoursTo;

                const yearsFromTextbox = document.getElementById("yearsFrom");
                const yearsToTextbox = document.getElementById("yearsTo");

                yearsFromTextbox.value = DEFAULT_LSC_FILTER_VALUES.yearsFrom;
                yearsToTextbox.value = DEFAULT_LSC_FILTER_VALUES.yearsTo;
            }

        );
    }

    setAllDays(value) {
        if (value === null || value === undefined) return;
        for (let weekday = 0; weekday < 7; weekday++) {
            const weekdayCheckbox = document.getElementById("weekday".concat(weekday));
            weekdayCheckbox.checked = value;
        }
    }

    @action
    onClickSelectAll(e) {
        this.setAllDays(true);
    }

    @action
    onClickUnselectAll(e) {
        this.setAllDays(false);
    }

    /* Member variables */
    @service dataLoader;
    @service actionManager;
}
