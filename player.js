// Название трека, которое показывается в плеере
const TRACK_NAME = "Drowning Love (Piano Cover)";

const audio = document.getElementById("audio");
const player = document.getElementById("player");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const volume = document.getElementById("volume");

document.getElementById("trackName").textContent = TRACK_NAME;
audio.volume = parseFloat(volume.value);

function updateUI() {
  const playing = !audio.paused;
  playBtn.textContent = playing ? "❚❚" : "▶";
  player.classList.toggle("playing", playing);
  muteBtn.textContent = audio.muted || audio.volume === 0 ? "🔇" : "🔊";
}

function play() {
  audio.play().then(updateUI).catch(updateUI);
}

playBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (audio.paused) play(); else audio.pause();
  updateUI();
});

muteBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  audio.muted = !audio.muted;
  updateUI();
});

volume.addEventListener("input", () => {
  audio.volume = parseFloat(volume.value);
  audio.muted = false;
  updateUI();
});

// Пытаемся включить музыку сразу при открытии.
// Браузеры часто блокируют звук без действия пользователя,
// поэтому если не получилось — музыка начнётся при первом клике по странице.
let userPaused = false;
playBtn.addEventListener("click", () => { userPaused = audio.paused; });

audio.play().then(updateUI).catch(() => {
  const start = () => {
    if (!userPaused && audio.paused) play();
    document.removeEventListener("click", start);
    document.removeEventListener("keydown", start);
  };
  document.addEventListener("click", start);
  document.addEventListener("keydown", start);
});

updateUI();
