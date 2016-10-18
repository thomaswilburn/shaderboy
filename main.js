
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
  var href = e.target.getAttribute("href");
  if (!href) return;
  switch (href) {
    case "#edit":
      editor.resize();
      renderer.pause();
      break;
      
    case "#run":
      var code = editor.getValue();
      console.log(code);
      try {
        renderer.compile(code);
        renderer.play();
      } catch (err) {
        console.log(err);
      }
      break;
  }
  
  document.querySelector("section.active").classList.remove("active");
  document.querySelector(href).classList.add("active");
});