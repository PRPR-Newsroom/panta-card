t.render(function() {
   document.getElementsByClassName("plugin-version").forEach(function(element) {
      element.innerText = "1.1.0";
   });
   return t.sizeTo("#content").done();
});