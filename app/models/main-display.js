import Model, { attr } from "@ember-data/model";

export default class MainDisplayModel extends Model {
    @attr("string") activeDisplay;
    @attr currentPage;
    @attr frames;
}

const defVal = {
    activeDisplay: null,
    currentPage: null,
    frames: [],
};

export function toMainDisplayModel(newData, prev = defVal) {
    console.log("a");
    if (!prev) {
        prev = defVal;
    }

    return {
        data: [
            {
                id: 0,
                type: "main-display",
                attributes: {
                    activeDisplay: newData.activeDisplay,
                    currentPage: newData.currentPage,
                    frames: prev.frames.concat(newData.frames),
                },
                relationships: {},
            },
        ],
    };
}
