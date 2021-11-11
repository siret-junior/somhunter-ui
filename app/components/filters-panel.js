import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import { EVENTS } from "../constants";


export default class FiltersPanelComponent extends Component {
    weekdays = ["M", "T", "W", "T", "F", "S", "S"];
    constructor() {
        super(...arguments);

        this.features = this.dataLoader.getConfigUi().features;

        // Reset filters after clicking on "Reset" button
        this.actionManager.registerEventHook(
            EVENTS.AFTER_RESET_SEARCH,
            () => {
                for (let weekday = 0; weekday < 7; weekday++) {
                    const weekdayCheckbox = document.getElementById("weekday".concat(weekday));
                    weekdayCheckbox.checked = true;
                }

                const hoursFromTextbox = document.getElementById("hoursFrom");
                const hoursToTextbox = document.getElementById("hoursTo");

                hoursFromTextbox.value = 0;
                hoursToTextbox.value = 24;

                const yearsFromTextbox = document.getElementById("yearsFrom");
                const yearsToTextbox = document.getElementById("yearsTo");

                yearsFromTextbox.value = 2000;
                yearsToTextbox.value = 2021;
            }

        );
    }

    /* Member variables */
    @service dataLoader;
    @service actionManager;
}
