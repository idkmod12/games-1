var thisScript = document.currentScript;
var file = thisScript.getAttribute("data-swf-file-src");
var name = thisScript.getAttribute("data-fname") || thisScript.getAttribute("data-fName") || "Flash game";
var targetUrl = new URL(file, window.location.href).href;
document.getElementById("gameFName").textContent = name;
window.RufflePlayer = window.RufflePlayer || {};
window.RufflePlayer.config = {
  autoplay: "on",
  contextMenu: "off",
  splashScreen: false,
  openUrlMode: "confirm",
  favorFlash: true,
  playerRuntime: "flashPlayer",
  allowFullscreen: true,
  publicPath: new URL("/ruffle/", window.location.origin).href
};
window.PlayerObject = null;
window.addEventListener("load", function () {
  var ruffle = window.RufflePlayer && window.RufflePlayer.newest && window.RufflePlayer.newest();
  if (!ruffle) return;
  var player = ruffle.createPlayer();
  player.style.width = "min(800px, 100vw)";
  player.style.height = "min(600px, 100dvh)";
  var container = document.getElementById("gameContainer");
  container.replaceChildren(player);
  player.setAttribute("tabindex", "0");
  player.setAttribute("playsinline", "true");
  window.PlayerObject = player;
  player.load(targetUrl);
});
var fullscreenButton = document.getElementById("fullscreen");
if (fullscreenButton) fullscreenButton.addEventListener("click", function () {
  if (window.PlayerObject && window.PlayerObject.enterFullscreen) window.PlayerObject.enterFullscreen();
});









