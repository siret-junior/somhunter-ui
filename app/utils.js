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

import { EVENTS, ELEM_IDS, ELEM_CLASSES } from "./constants";
import LOG, { W } from "./logger";

export function resetMainGridScroll() {
    const el = document.getElementById(ELEM_IDS.MAIN_GRID);
    if (el) el.scrollTop = 0;
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function hashQuery(q) {
    const queryClean = {
        q0: q.q0.trim(),
        q1: q.q1.trim(),
        filters: q.filters,
        canvas_query: q.canvas_query,
        relocation0: q.relocation0,
        relocation1: q.relocation1,
        isSecondary: q.isSecondary,
    };
    return JSON.stringify(queryClean);
}
export function isQueryEmpty(q) {
    if (q.q0 != "" || q.q1 != "") {
        return false;
    }

    if (q.canvas_query.length > 0) {
        return false;
    }

    if (q.relocation0 != -1 || q.relocation1 != -1)
        return false;

    return true;
}

/**
 *
 * @param {string} str Original string.
 * @param {int} currIdx Index of the cursor.
 */
export function getCurrSubString(str, currIdx) {
    let i = currIdx - 1;
    for (; i >= 0 && str[i] != " "; --i);
    return str.substr(i + 1, currIdx - (i + 1));
}

/**
 *
 * @param {string} str Original string.
 * @param {int} currIdx Index of the cursor.
 */
export function subCurrWord(str, currIdx, word) {
    // \todo Fix!
    let i = currIdx - 1;
    for (; i >= 0 && str[i] != " "; --i);

    const prefix = str.substr(0, i + 1);
    let postfix = str.substr(currIdx);
    // If end of the input
    if (postfix.length <= 0) {
        postfix = " ";
    }

    const newString = `${prefix}${word}${postfix}`;
    const cursorIdxDiff = newString.length - str.length;

    return [newString, currIdx + cursorIdxDiff];
}

export function getTextQueryInput(idx) {
    const inp = document.getElementById(`textQueryInput${idx}`);
    if (!inp) {
        return "";
    }
    return inp.value;
}

export function getRelocationInput(idx) {
    let res = -1;
    let el = document.getElementById(`relocationFrame${idx}`);
    if (el)
        res = parseInt(el.value);
    return res;
}

export function throttle(callback, limit) {
    var waiting = false;                      // Initially, we're not waiting
    return function () {                      // We return a throttled function
        if (!waiting) {                       // If we're not waiting
            callback.apply(this, arguments);  // Execute users function
            waiting = true;                   // Prevent future invocations
            setTimeout(function () {          // After a period of time
                waiting = false;              // And allow future invocations
            }, limit);
        }
    }
}

export function getFiltersInput() {

    // Read dataset filter
    const lowerCheckbox = document.getElementById("datasetPart0");
    const upperCheckbox = document.getElementById("datasetPart1");

    const part0 = (lowerCheckbox ? lowerCheckbox.checked : true);
    const part1 = (upperCheckbox ? upperCheckbox.checked : true);

    LOG.W(`Dataset filters: ${part0}, ${part1}`);

    // Read LSC filter
    // Read weekdays
    let weekdays = [];
    for (let weekday = 0; weekday < 7; weekday++) {

        const weekdayCheckbox = document.getElementById("weekday".concat(weekday));

        weekdays.push(weekdayCheckbox ? weekdayCheckbox.checked : true);
    }

    // Read hours interval
    const hoursFromTextbox = document.getElementById("hoursFrom");
    const hoursToTextbox = document.getElementById("hoursTo");

    const hoursFromError = (!hoursFromTextbox || hoursFromTextbox.value == "" || hoursFromTextbox.validity.rangeUnderflow || hoursFromTextbox.validity.rangeOverflow)
    const hoursToError = (!hoursToTextbox || hoursToTextbox.value == "" || hoursToTextbox.validity.rangeUnderflow || hoursToTextbox.validity.rangeOverflow)
    
    const hoursFrom = (!hoursFromError ? hoursFromTextbox.value : 0);
    const hoursTo = (!hoursToError ? hoursToTextbox.value : 24);

    // Read years interval
    const yearsFromTextbox = document.getElementById("yearsFrom");
    const yearsToTextbox = document.getElementById("yearsTo");

    const yearsFromError = (!yearsFromTextbox || yearsFromTextbox.value == "" || yearsFromTextbox.validity.rangeUnderflow || yearsFromTextbox.validity.rangeOverflow)
    const yearsToError = (!yearsToTextbox || yearsToTextbox.value == "" || yearsToTextbox.validity.rangeUnderflow || yearsToTextbox.validity.rangeOverflow)
    
    const yearsFrom = (!yearsFromError ? yearsFromTextbox.value : 2000);
    const yearsTo = (!yearsToError ? yearsToTextbox.value : 2100);

    const error = hoursFromError || hoursToError || yearsFromError || yearsToError;
    
    return {
        error: error,
        filters: {
            weekdays: weekdays,
            hoursFrom: Number(hoursFrom),
            hoursTo: Number(hoursTo),
            datasetFilter: [part0, part1],
            yearsFrom: Number(yearsFrom),
            yearsTo: Number(yearsTo)
        }
    };
}

function get_raw_img(img) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    var myData = context.getImageData(0, 0, img.width, img.height);
    return Array.from(myData.data);
}

function collectCanvasQueries(queryCanvasEl) {

    if (!queryCanvasEl) {
        return [];
    }

    const maxImageWidth = 224;
    const subqueriesElems = queryCanvasEl.querySelectorAll(
        `.${ELEM_CLASSES.CANVAS_QUERY_CONT}`
    );

    let subqueries = [];
    for (var i = 0; i < subqueriesElems.length; i++) {
        const subqueryEl = subqueriesElems[i];

        let base = {
            rect: [
                subqueryEl.offsetLeft / queryCanvasEl.clientWidth,
                subqueryEl.offsetTop / queryCanvasEl.clientHeight,
                (subqueryEl.offsetLeft + subqueryEl.clientWidth) /
                queryCanvasEl.clientWidth,
                (subqueryEl.offsetTop + subqueryEl.clientHeight) /
                queryCanvasEl.clientHeight,
            ],
        };

        // If is bitmap subquery
        if (subqueryEl.classList.contains("bitmap")) {
            LOG.D("Processing BITMAP subquery...");

            var img = new Image();
            img.src = subqueryEl.querySelector("img").src;

            // Scale it down if needed
            if (img.width > maxImageWidth || img.height > maxImageWidth) {
                const scale = maxImageWidth / Math.max(img.width, img.height);
                img.width = img.width * scale;
                img.height = img.height * scale;
                LOG.D("Resizing the image to " + maxImageWidth);
            }

            subqueries.push({
                ...base,
                type: ELEM_CLASSES.CANVAS_QUERY_CONT_BITMAP,
                num_channels: 4,
                width_pixels: img.width,
                height_pixels: img.height,
                bitmap_data: get_raw_img(img),
            });
        } else {
            LOG.D("Processing TEXT subquery...");

            subqueries.push({
                ...base,
                type: ELEM_CLASSES.CANVAS_QUERY_CONT_TEXT,
                text_query: subqueryEl.querySelector("input").value,
            });
        }
    }
    return subqueries;
}

export function getCanvasQueryInput() {
    // For schema details, see `Request__Rescore__Post` in the OpenAPI specification

    const cq0El = document.getElementById(ELEM_IDS.CANVAS_QUERY_PREFIX + "0");
    const cq1El = document.getElementById(ELEM_IDS.CANVAS_QUERY_PREFIX + "1");
    const cq0 = collectCanvasQueries(cq0El);
    const cq1 = collectCanvasQueries(cq1El);

    let res = [];
    if (cq0.length != 0) res.push(cq0);
    if (cq1.length != 0) res.push(cq1);

    //LOG.D("canvasQuery: ", res);
    return res;
}
