import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

import { tracked } from "@glimmer/tracking";

export default class IndexController extends Controller {
  // Will load the service defined in: app/services/shopping-cart.js
  @service coreApi;

  @tracked sss;

  @action
  createBoardGame() {
    //const res = await this.coreApi.fetchRequest("/user/context", "GET");
    // const res = await this.coreApi.post("/get_top_screen", {
    //     type: "topn_display",
    //     id: 123,
    //     page: 0
    // });

    // console.warn(JSON.stringify(res));
    // this.store.createRecord('user-context', {
    //     viewData: res
    // });

    this.store
      .findRecord("user-context", 0)
      .then((r) => {
        let pre = r.viewData;

        r.viewData = pre + "r";
        console.warn(r.viewData);
        this.replaceRoute();
        this.send("foo");
      })
      .catch((e) => {
        console.error(e);
        alert(e.message);
      });

    return;
  }
}
