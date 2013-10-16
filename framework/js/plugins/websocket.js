/**
 * Created with IntelliJ IDEA.
 * User: edaubert
 * Date: 06/09/12
 * Time: 13:40
 */

function KWebsocketSlave(preser, roomID) {
    var wsUrl = undefined;
    var ws = undefined;
    var url = new URL(preser);
    var self = this;

    this.activate = function () {
        jQuery(document.body).on("RUN", function () {
            var webSocketServiceURL = window.location.pathname;
            if (webSocketServiceURL.indexOf("/") === window.location.pathname.length - 1) {
                webSocketServiceURL = webSocketServiceURL + "webSocketURL";
            } else {
                webSocketServiceURL = webSocketServiceURL + "/webSocketURL";
            }
            jQuery.getJSON(webSocketServiceURL, function (data) {
                if (data.type === "WebSocketURL") {
                    wsUrl = data.url;
                    try {
                        ws = new WebSocket(wsUrl);
                        ws.onopen = function (e) {
                            console.log('* Connected!');
                            if (roomID === undefined) {
                                roomID = url.getParameter("roomID");
                                console.log(roomID);
                                if (roomID === undefined) {
                                    console.log(preserKeynote.getUrl());
                                    roomID = window.prompt("Keynote id: ");
                                    url.updateSearch("roomID", roomID);
                                    console.log(preserKeynote.getUrl());
                                }
                            }
                            console.log(stringify({"type": "JOIN", "KEY_ID": roomID}));
                            ws.send(stringify({"type": "JOIN", "KEY_ID": roomID}));
                            document.addEventListener('keydown', newKeyEventListener, false);
                            jQuery(document.body).trigger({type: "SLIDE"});
                        };
                        ws.onclose = function (e) {
                            console.log('* Disconnected');
                        };
                        ws.onerror = function (e) {
                            console.log('* Unexpected error');
                        };
                        ws.onmessage = manageMessage
                    } catch (e) {
                        console.error("Unable to initialize the web socket");
                    }
                }
            });
        });
    };


    function newKeyEventListener(e) {
        // Shortcut for alt, shift and meta keys
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return;
        }
        switch (e.which) {
            case 70: // f
                e.preventDefault();
                jQuery(document.body).trigger({type: "FULLSCREEN"});
                break;
            default:
            // Behave as usual
        }
    }


    function manageMessage(event) {
        console.log(event.data);
        var message = JSON.parse(event.data);
        jQuery(document.body).trigger(message);
    }
}

function KWebsocketMaster(preserKeynote, roomID, button) {
    var wsUrl = undefined;
    var ws = undefined;
    var url = new URL(preserKeynote);
    var self = this;

    this.activate = function () {
        jQuery(document.body).on("RUN", function () {
            // ask the server to get the websocket url
            var webSocketServiceURL = window.location.pathname;
            if (webSocketServiceURL.indexOf("/") === window.location.pathname.length - 1) {
                webSocketServiceURL = webSocketServiceURL + "webSocketURL";
            } else {
                webSocketServiceURL = webSocketServiceURL + "/webSocketURL";
            }
            jQuery.getJSON(webSocketServiceURL,function (data) {
                if (data.type === "WebSocketURL") {
                    wsUrl = data.url;
                    if (button !== undefined) {
                        button.on("touchstart", connectWS);
                        button.click(connectWS);
                    } else {
                        connectWS();
                    }
                }
            }).fail(function () {
                    wsUrl = window.prompt("Unable to get Web socket URL\nPlease provide it: ");
                });
        });
    };

    jQuery(document.body).on("START END FORWARD BACK SET_POSITION", function (message) {
        if (ws != undefined) {
            message.KEY_ID = roomID;
            ws.send(stringify(message));
        }
    });

    function connectWS() {
        try {
            if (roomID === undefined) {
                roomID = url.getParameter("roomID");
                console.log(roomID);
                if (roomID === undefined) {
                    console.log(preserKeynote.getUrl());
                    roomID = window.prompt("Keynote id: ");
                    url.updateSearch("roomID", roomID);
                    console.log(preserKeynote.getUrl());
                }
            }
            if (roomID !== undefined && roomID !== "") {
                console.log(wsUrl);
                ws = new WebSocket(wsUrl);
                ws.onopen = function () {
                    console.log('* Connected!');
                    ws.send(stringify({"type": "CREATE", "KEY_ID": roomID}));
                };
                ws.onclose = function () {
                    console.log('* Disconnected');
                };
                ws.onerror = function () {
                    console.log('* Unexpected error');
                };
                ws.onmessage = function (message) {
                    console.log(message.data);
                    message = JSON.parse(message.data);
                    if (message.type === "CREATED" && message.KEY_ID === roomID) {
                        jQuery(document.body).trigger({type: "SET_POSITION", position: preserKeynote.getCurrentSlideNumber()});
                        ws.send(stringify({type: "SET_POSITION", position: preserKeynote.getCurrentSlideNumber()}));
                        alert(document.URL.replace("mode=" + "master", "mode=slave"))
                    }
                    // we do nothing when the master receive messages
                };
            }
        }

        catch
            (e) {
        }
    }

    function disconnectWS() {
        if (ws != undefined) {
            ws.close();
        }
    }
}