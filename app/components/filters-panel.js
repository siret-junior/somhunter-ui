import Component from '@glimmer/component';
import { inject as service } from "@ember/service";

export default class FiltersPanelComponent extends Component {
    weekdays = ["M", "T", "W", "T", "F", "S", "S"];
    constructor() {
        super(...arguments);

        this.features = this.dataLoader.getConfigUi().features;
    }

    /* Member variables */
    @service dataLoader;
}
