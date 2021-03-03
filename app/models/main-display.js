import Model, { attr } from "@ember-data/model";

export default class MainDisplayModel extends Model {
  @attr("string") activeDisplay;
  @attr currentPage;
  @attr frames;
}

export function toMainDisplayModel(data) {
  return {
    data: [
      {
        id: 0,
        type: "main-display",
        attributes: data,
        relationships: {},
      },
    ],
  };
}
