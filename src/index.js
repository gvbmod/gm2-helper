var fs = require("fs");
var path = require("path");
var electron = require("electron");
var app = electron.app;
var Menu = electron.Menu;
var dialog = electron.dialog;
var Tray = electron.Tray;

if (app.requestSingleInstanceLock()) {
    app.on("ready", () => {
        var ws = require("./ws-module.js");
        var wss = new ws.WebSocketServer({
            port: 7423
        });

        var helperExtensions = {
            roku: require("./roku/")
        };

        wss.on("connection", (ws) => {
            var helperExtension = null;
            ws.on("message", (raw) => {
                var data = JSON.parse(raw.toString());
                if (data.cmd == "setup") {
                    helperExtension = new helperExtensions[data.type](ws);
                }
            });
        });

        let tray = null;
        tray = new Tray(path.resolve(__dirname, "art/icon.png"));
        const contextMenu = Menu.buildFromTemplate([
					{
                        label: 'Stop running background service',
						click: function () {
							app.quit();
						}
                    },
                ]);
        tray.setToolTip('Gvbvdxx Mod 2 - Helper Extension, allows for communication through other devices, and lets Gvbvdxx Mod 2 programs do special things that browsers can\'t typically do.');
        tray.setContextMenu(contextMenu);
    })
} else {
    app.on("ready", () => {
        app.quit();
    });
}
app.on('second-instance', () => {
    dialog.showMessageBox({
        title: "Already open!",
        message: "This process is already open, check the tray icon for options.",
        type: "warning"
    });
});
