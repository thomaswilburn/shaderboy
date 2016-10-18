(function() {
  var gl = canvas.getContext("webgl", {
    antialias: false
  });
  
  var state = {};
  
  var compile = function(fragmentSource) {
    
    var crash = (stage, error) => { if (error) throw { error, stage } };
    
    var vertex = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex, `
precision highp float;

attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
    `);
    gl.compileShader(vertex);
    crash("vertex", gl.getShaderInfoLog(vertex));
    
    var fragment = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment, `
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 cursor;

${fragmentSource}
    `);
    gl.compileShader(fragment);
    crash("fragment", gl.getShaderInfoLog(fragment));
    
    var program = state.program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    crash("program", gl.getProgramInfoLog(program));
    
    gl.useProgram(program);
    
    state.uniforms = {
      resolution: gl.getUniformLocation(program, "resolution"),
      time: gl.getUniformLocation(program, "time")
    };
    
    state.attributes = {
      a_position: gl.getAttribLocation(program, "a_position")
    };
    
    var surface = state.geometry = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, surface);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, 1, 1, 1, -1, -1,
      -1, -1, 1, 1, 1, -1
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(state.program, state.attributes.a_position);
    gl.vertexAttribPointer(state.attributes.a_position, 2, gl.FLOAT, false, 0, 0);
  };
  
  var render = function(t) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(state.uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(state.uniforms.time, t || 0);
    gl.drawArrays(gl.TRIANGLES, state.geometry, 6, 0, 0);
  };
  
  var frame = null;
  
  var play = function(t) {
    if (frame) cancelAnimationFrame(frame);
    render(t);
    frame = requestAnimationFrame(play);
  };
  
  var pause = function() {
    if (frame) cancelAnimationFrame(frame);
    frame = null;
  };
  
  window.renderer = {
    compile, play, pause, render
  }
  
})();