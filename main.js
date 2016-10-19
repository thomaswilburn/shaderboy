
var closest = (e, s) => {
  while (!e.matches(s) && e !== document.body) {
    e = e.parentElement;
  }
  if (e == document.body) return null;
  return e;
}

var editor = ace.edit(document.querySelector("textarea"));
editor.session.setMode("ace/mode/glsl");
editor.setOptions({
  showLineNumbers: false,
  tabSize: 2,
  showPrintMargin: false,
  wrap: true
});

  // handle bad compiles correctly, add gutter annotation on error
  //think of other uniforms - touch input, gyro position
  //add a service worker so it can work offline
  //add single-step and play modes
  //add reference materials

document.querySelector(".modes").addEventListener("click", function(e) {
  var a = closest(e.target, "[href]") || e.target;
  var href = a.getAttribute("href");
  if (!href) return;
  document.body.setAttribute("data-mode", href.replace(/^#/, ""));

  switch (href) {
    case "#edit":
      renderer.pause();
      editor.resize();
      editor.focus();
      break;

    case "#run":
      var code = editor.getValue();
      try {
        renderer.compile(code);
        renderer.play();
      } catch (err) {
        console.log(err);
      }
      break;
  }

});

//register for offline

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}