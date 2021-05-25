import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

module("Unit | Model | core settings", function (hooks) {
    setupTest(hooks);

    // Replace this with your real tests.
    test("it exists", function (assert) {
        let store = this.owner.lookup("service:store");
        let model = store.createRecord("config", {});
        assert.ok(model);
    });
});
