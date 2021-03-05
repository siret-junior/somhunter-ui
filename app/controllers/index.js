import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

export default class IndexController extends Controller {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    /* Member variables */
    @service coreApi;
}
