/**
 * User: Erwan Daubert - erwan.daubert@gmail.com
 * Date: 02/08/13
 * Time: 23:03
 *
 * @author Erwan Daubert
 * @version 1.0
 */

function PreserInitialize() {
    var ks = new Preser();

    var mode = ks.getMode();
    if (mode === "frame") {
        new frame(ks).activate();
        new IncludePlugin(ks).activate();
        new H2List(ks, 4).activate();
        new KNotesSlave(ks).activate();
        new ActivePlugin(ks).activate();
        new SlidePlugin(ks).activate();
        new ProgressPlugin(ks).activate();
        new KSlideCountSlave(ks).activate();
    } else if (mode === "master") {
        new IncludePlugin(ks).activate();
        new H2List(ks, 4).activate();
        new KKeyboard(ks).activate();
        new KWebsocketMaster(ks).activate();
        new ActivePlugin(ks).activate();
        new SlidePlugin(ks).activate();
        new ProgressPlugin(ks).activate();
    } else if (mode === "slave") {
        new IncludePlugin(ks).activate();
        new H2List(ks, 4).activate();
        new KWebsocketSlave(ks).activate();
        new ActivePlugin(ks).activate();
        new SlidePlugin(ks).activate();
        new ProgressPlugin(ks).activate();
    } else {
        new IncludePlugin(ks).activate();
        new H2List(ks, 4).activate();
        new KKeyboard(ks).activate();
        new ActivePlugin(ks).activate();
        new SlidePlugin(ks).activate();
        new ProgressPlugin(ks).activate();
    }
    ks.start();
}