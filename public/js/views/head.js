
if (!isMobileBrowser()) {
    addCss("css/panta.responsive.css");
    addCss("css/grid.css");
    console.log("Desktop browser detected: " + navigator.userAgent);
} else {
    addCss("css/panta.mobile.css");
    addCss("css/grid.mobile.phone.css");
    console.log("Mobile browser detected");
}

if (useDefaultSelectStyle()) {
    addCss("css/panta.custom.input.mobile.css");
} else {
    addCss("css/panta.custom.input.css");
}

let t = TrelloPowerUp.iframe();

let cm = null;
if (!window.clientManager) {
    cm = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init();
    // initialize the plugin controller separately
    cm.getPluginController().init();
} else {
    cm = window.clientManager;
}
