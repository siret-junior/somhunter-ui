import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import { inject as service } from "@ember/service";

export default class TextSearchPanelComponent extends Component {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    /* Member variables */
    @service actionManager;
}
