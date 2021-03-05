import Route from "@ember/routing/route";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class IndexRoute extends Route {
    @service coreApi;

    activate() {
        console.log("=> init()");

        const succCb = () => {
            const dispType = this.coreApi.settings().strings.displayTypes.topn;
            this.coreApi.fetchTopDispFrames(
                dispType,
                0,
                0,
                null,
                () => {
                    console.log("Initial Top N loaded!");
                    this.refresh();
                },
                () => {
                    console.log("Initial Top N load failed!");
                    this.refresh();
                }
            );
        };
        // Get settings from the core
        this.coreApi.fetchInitial(succCb, () => this.refresh());

        console.log("<= init()");
    }

    @action
    foo() {
        console.log("index refresh");
        this.refresh();
    }

    model() {
        const coreSettings = this.store.peekRecord("core-settings", 0);
        const userContext = this.store.peekRecord("user-context", 0);
        const mainDisplay = this.store.peekRecord("main-display", 0);
        console.warn(`userContext: ${userContext}`);
        return {
            coreSettings,
            userContext,
            mainDisplay,
        };
    }

    // setupController(controller, model) {
    //     super.setupController(controller, model);
    //     console.log("bbbbbb", model.viewData)
    //     controller.viewData = model.viewData;
    // }
}
