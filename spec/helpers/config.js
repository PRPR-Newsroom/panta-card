let jsdom = require('jsdom');
// Create a fake DOM for testing with $.ajax
global.window = new jsdom.JSDOM().window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.HTMLCollection = window.HTMLCollection;
global.HTMLDocument = window.HTMLDocument;
global.Window = window.Window;