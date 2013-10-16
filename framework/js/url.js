/**
 * User: Erwan Daubert - erwan.daubert@gmail.com
 * Date: 12/07/13
 * Time: 21:32
 *
 * @author Erwan Daubert
 * @version 1.0
 */
function URL(preser) {
    this.updateSearch = function (key, value) {
        var search = "";
        var found = false;
        var attributes = preser.getUrl().search.substring(1).split("&");
        if (attributes[0] !== "") {
            for (var i = 0; i < attributes.length; i++) {
                var element = attributes[i];
                if (element.split("=")[0] === key) {
                    found = true;
                    var newElement = key;
                    if (value != null && value !== "") {
                        newElement = newElement + "=" + value;
                    }
                    element = newElement;
                }
                if (i == 0) {
                    search = "?" + element;
                } else {
                    search = search + "&" + element;
                }
            }
        }
        if (!found) {
            if (search === "?" || search === "") {
                search = "?" + key;
                if (value != null && value !== "") {
                    search = search + "=" + value;
                }
            } else {
                search = search + "&" + key;
                if (value != null && value !== "") {
                    search = search + "=" + value;
                }
            }
        }
        return search;
    };

    this.removeSearch = function (key) {
        var search = "";
        var attributes = preser.getUrl().search.substring(1).split("&");
        for (var i = 0; i < attributes.length; i++) {
            var element = attributes[i];
            if (element.split("=")[0] !== key) {
                if (i == 0) {
                    search = "?" + element;
                } else {
                    search = search + "&" + element;
                }
            }
        }
        return search;
    };

    this.getParameter = function (key) {
        var attributes = preser.getUrl().search.substring(1).split("&");
        for (var i = 0; i < attributes.length; i++) {
            var element = attributes[i];
            if (element.split("=")[0] === key) {
                return element.split("=")[1];
            }
        }
    };
}