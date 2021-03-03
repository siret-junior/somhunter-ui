import Adapter from "@ember-data/adapter";

export default class UserContextAdapter extends Adapter {
  findRecord(store, type, id) {
    // Just dummy -> this is where you do the API fetch
    return store.peekRecord(type.modelName, id);
  }
}
