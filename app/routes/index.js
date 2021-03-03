import ENV from "somhunter-ui/config/environment";
import Route from "@ember/routing/route";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class IndexRoute extends Route {
  @service coreApi;

  activate() {
    console.log(" => init()");
    // Get settings from the core
    this.coreApi
      .get(ENV.settingsEndpoint)
      .then((res) => {
        // One time setup here
        this.store.push({
          data: [
            {
              id: 0,
              type: "core-settings",
              attributes: {
                generated: res.generated,
                strings: res.strings,
                core: res.core,
                server: res.server,
                ui: res.ui,
                api: res.api,
                url: `${ENV.coreUrl}${ENV.settingsEndpoint}`,
              },
              relationships: {},
            },
          ],
        });
        console.log(" Core settings loaded...");

        this.coreApi
          .get(res.api.endpoints.userContext.get.url)
          .then((res2) => {
            this.store.push({
              data: [
                {
                  id: 0,
                  type: "user-context",
                  attributes: {
                    search: res2.search,
                    history: res2.history,
                    bookmarkedFrames: res2.bookmarkedFrames,
                    url: `${ENV.coreUrl}${res.api.endpoints.userContext.get.url}`,
                  },
                  relationships: {},
                },
              ],
            });
            console.log(" User context loaded...");

            this.refresh();
          })
          .catch(() => {
            this.store.push({
              data: [
                {
                  id: 0,
                  type: "user-context",
                  attributes: {
                    error: true,
                    url: `${ENV.coreUrl}${res.api.endpoints.userContext.get.url}`,
                  },
                  relationships: {},
                },
              ],
            });
            this.refresh();
          });
      })
      .catch(() => {
        this.store.push({
          data: [
            {
              id: 0,
              type: "core-settings",
              attributes: {
                error: true,
                url: `${ENV.coreUrl}${ENV.settingsEndpoint}`,
              },
              relationships: {},
            },
          ],
        });
        this.refresh();
      });

    console.log(" <= init()");
  }

  @action
  foo() {
    console.log("index refresh");
    this.refresh();
  }

  model() {
    const coreSettings = this.store.peekRecord("core-settings", 0);
    const userContext = this.store.peekRecord("user-context", 0);
    console.warn(`userContext: ${userContext}`);
    return {
      coreSettings,
      userContext,
    };
  }

  // setupController(controller, model) {
  //     super.setupController(controller, model);
  //     console.log("bbbbbb", model.viewData)
  //     controller.viewData = model.viewData;
  // }
}
