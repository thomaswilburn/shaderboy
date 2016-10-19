const CACHE = "shaderboy_v1";

self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache) {
    return cache.addAll([
      "./index.html",
      "./main.js",
      "./renderer.js",
      "./lib/ace.js",
      "./lib/mode-glsl.js",
      "./style.css",
      "./icons/ic_blur_on_black_24px.svg",
      "./icons/ic_code_black_24px.svg",
      "./icons/ic_extension_black_24px.svg"
    ]);
  }));
});

var noop = () => {};

self.addEventListener("fetch", function(e) {
  e.respondWith(caches.open(CACHE).then(function(cache) {
    // get newest copy from network regardless
    var req = fetch(e.request);
    req.then(response => cache.put(e.request, response), noop);
    // check the cache, and respond from there if possible
    return cache.match(e.request).then(function(match) {
      if (match) return match;
      return req;
    });
  }));
});