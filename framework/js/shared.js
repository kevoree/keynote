/**
 * User: Erwan Daubert - erwan.daubert@gmail.com
 * Date: 14/07/13
 * Time: 00:18
 *
 * @author Erwan Daubert
 * @version 1.0
 */

function stringify(message) {
    return JSON.stringify(message, function (key, value) {
        if ("currentTarget" === key || "delegateTarget" === key || "target" === key || "handleObj" === key || key.indexOf("jQuery") != -1) {
            return undefined;
        }
        return value;
    });
}