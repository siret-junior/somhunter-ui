import Model, { attr } from "@ember-data/model";

export default class ReplayWindowModel extends Model {
    @attr show;
    @attr pivotFrameId;
    @attr frames;
}

export function toReplaylWindowModel(pivotId, data) {
    return {
        data: [
            {
                id: 0,
                type: "replay-window",
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
