import { helper } from "@ember/component/helper";
import { htmlSafe } from "@ember/template";

export default helper(function thumb(params) {
    let [host, src] = params;
    return htmlSafe(`background-image: url('${host}${src}')`);
});
