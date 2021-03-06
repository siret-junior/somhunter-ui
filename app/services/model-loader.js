import Service from "@ember/service";

import { inject as service } from "@ember/service";

export default class ModelLoaderService extends Service {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    mainDisplayFrames() {
        const mainDisplay = this.store.peekRecord("main-display", 0);

        return mainDisplay?.frames;
    }

    /* Member variables */
    @service store;
}
