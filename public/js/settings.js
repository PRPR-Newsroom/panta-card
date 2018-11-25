let pjson = require('package.json');

t.render(function() {
   document.getElementsByClassName("plugin-version").forEach(function(element) {
      element.innerText = pjson.version;
   });
   return t.sizeTo("#content").done();
});