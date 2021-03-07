export function resetMainGridScroll() {
    const el = document.getElementById("mainGrid");
    if (el) el.scrollTop = 0;
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
    return document.getElementById(`textQueryInput${idx}`).value;
}

export function getFiltersInput() {
    // \todo Undummy
    return {
        weekdays: [true, true, true, true, true, true, true],
        hoursFrom: 0,
        hoursTo: 24,
    };

    const filtersContEl = document.getElementById("queryFilters");

    const weekdaysEl = document.getElementById("queryFiltersWeekdays");

    let weekdays = [];
    weekdaysEl.childNodes.forEach((x) => {
        const v = x.querySelector(".form-check-input");

        if (v) weekdays.push(v.checked);
    });

    const hoursFrom = Number(
        document.getElementById(config.ui.htmlElIds.queryFiltersHourFrom).value
    );
    const hoursTo = Number(
        document.getElementById(config.ui.htmlElIds.queryFiltersHourTo).value
    );

    return {
        weekdays,
        hoursFrom,
        hoursTo,
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

function collectCollageImages(collage_canvas) {
    collage_canvas = $(collage_canvas);
    const images = collage_canvas.find(".collage-image");
    let images_information = [];
    for (var i = 0; i < images.length; i++) {
        const image = images.eq(i);
        images_information.push({
            src: image.children("img").attr("src"),
            top: image.position().top / collage_canvas.height(),
            left: image.position().left / collage_canvas.width(),
            width: image.width() / collage_canvas.width(),
            height: image.height() / collage_canvas.height(),
        });
    }
    return images_information;
}

export function getCollageInputs() {
    return {
        pictures: [],
        left: [],
        top: [],
        width: [],
        height: [],
        pixel_width: [],
        pixel_height: [],
        break: [0],
    };

    // \todo Undummy
    const cq0 = document.getElementById("collageQuery0");
    const cq1 = document.getElementById("collageQuery1");

    let first_collage = collectCollageImages(cq0);
    let second_collage = collectCollageImages(cq1);

    let lefts = [];
    let tops = [];
    let heights = [];
    let widths = [];
    let pics = [];
    let pixel_widths = [];
    let pixel_heights = [];
    let first = [first_collage.length];

    let i, p;
    for (i in first_collage) {
        lefts.push(first_collage[i].left);
        tops.push(first_collage[i].top);
        heights.push(first_collage[i].height);
        widths.push(first_collage[i].width);
        var img = new Image();
        img.src = first_collage[i].src;
        pixel_heights.push(img.height);
        pixel_widths.push(img.width);
        pics.push(get_raw_img(img));
    }

    for (i in second_collage) {
        lefts.push(second_collage[i].left);
        tops.push(second_collage[i].top);
        heights.push(second_collage[i].height);
        widths.push(second_collage[i].width);
        var img = new Image();
        img.src = second_collage[i].src;
        pixel_heights.push(img.height);
        pixel_widths.push(img.width);
        pics.push(get_raw_img(img));
    }

    console.log(pics);

    let conc_pics = [];
    for (p in pics) {
        conc_pics = conc_pics.concat(pics[p]);
    }
    // console.log(conc_pics)

    let body = {
        pictures: conc_pics,
        left: lefts,
        top: tops,
        width: widths,
        height: heights,
        pixel_width: pixel_widths,
        pixel_height: pixel_heights,
        break: first,
    };

    return body;
}
