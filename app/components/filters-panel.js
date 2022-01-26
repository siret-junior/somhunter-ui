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
