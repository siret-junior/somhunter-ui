import Model, { attr } from "@ember-data/model";

export default class DetailWindowModel extends Model {
    @attr show;
    @attr pivotFrameId;
    @attr frames;
}

export function toDetailWindowModel(pivotId, data) {
    return {
        data: [
            {
                id: 0,
                type: "detail-window",
                attributes: {
                    show: true,
                    pivotFrameId: pivotId,
                    frames: data.frames,
                },
                relationships: {},
            },
        ],
    };
}
