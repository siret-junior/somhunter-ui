import Service from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { inject as service } from "@ember/service";

export default class ActionManagerService extends Service {
    /* Member methods */
    constructor() {
        super(...arguments);
    }

    fetchTextSuggestions(prefix, cbSucc = () => null, cbFail = (e) => null) {
        const reqData = {
            queryValue: prefix,
        };

        const coreSettings = this.coreApi.settings();
        const requestSettings =
            coreSettings.api.endpoints.textSearchSuggestions;

        // << Core API >>
        this.coreApi
            .get(requestSettings.get.url, reqData)
            .then((res) => {
                cbSucc(res);
            })
            .catch((e) => {
                cbFail(e);
            });
    }

    /* Member variables */
    @service coreApi;
}
