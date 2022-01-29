/* This file is part of SOMHunter UI.
 *
 * Copyright (C) 2022    Frantisek Mejzlik <frankmejzlik@protonmail.com>
 *                       Vit Skrhak <vitek.skrhak@seznam.cz>
 *                       Patrik Veselý <prtrikvesely@gmail.com>
 * 
 *  SOMHunter UI is free software: you can redistribute it and/or modify it under
 *  the terms of the GNU General Public License as published by the Free
 *  Software Foundation, either version 2 of the License, or (at your option)
 *  any later version.
 * 
 *  SOMHunter UI is distributed in the hope that it will be useful, but WITHOUT ANY
 *  WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 *  FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 *  details.
 * 
 *  You should have received a copy of the GNU General Public License along with
 *  SOMHunter UI. If not, see <https://www.gnu.org/licenses/>.
 */

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
