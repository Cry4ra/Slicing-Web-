const playlist = [
  { id: 0, title: "Dynamite", artist: "BTS", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuyt6ONiP3W5WBnopI0BCryIcfOid1pTuDW7wWqvPobhA7b3c2aG9knfo&s=10", durationSec: 199 },
  { id: 1, title: "Butter", artist: "BTS", cover: "https://i.scdn.co/image/ab67616d0000b273ed656680374294d5217193fa", durationSec: 164 },
  { id: 2, title: "Life Goes On", artist: "BTS", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAKFubB5XA_omOtJESX7jmGugY-10RFw4YIjJSD0Sg9Q&s=10", durationSec: 207 },
  { id: 3, title: "Boy With Luv", artist: "BTS feat. Halsey", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScevHuqSpQiqd-AENyYZQEprIbpkcXGKnV5WLVqL1BAg&s=10", durationSec: 229 }
];

const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const likeBtn = document.getElementById("likeBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const progressFill = document.getElementById("progressFill");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const songList = document.getElementById("songList");
const searchInput = document.getElementById("searchInput");

let currentIndex = 0;
let isPlaying = false;
let isLiked = false;
let timer = null;
let currentSec = 0;

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function renderPlaylist(songs) {
  songList.innerHTML = "";
  songs.forEach((song) => {
    const item = document.createElement("div");
    item.className = `song-item ${song.id === currentIndex ? "active" : ""}`;
    item.innerHTML = `
      <img src="${song.cover}" alt="${song.title}">
      <div class="song-item-info">
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
      </div>
    `;
    item.addEventListener("click", () => {
      currentIndex = song.id;
      loadSong(currentIndex);
      playSong();
    });
    songList.appendChild(item);
  });
}

function loadSong(index) {
  const song = playlist[index];
  cover.src = song.cover;
  title.textContent = song.title;
  artist.textContent = song.artist;
  durationEl.textContent = formatTime(song.durationSec);
  
  currentSec = 0;
  progressFill.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  
  renderPlaylist(playlist);
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    currentSec++;
    const total = playlist[currentIndex].durationSec;
    const percent = (currentSec / total) * 100;
    
    progressFill.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(currentSec);

    if (currentSec >= total) {
      nextTrack();
    }
  }, 1000);
}

function playSong() {
  isPlaying = true;
  playBtn.textContent = "⏸";
  startTimer();
}

function pauseSong() {
  isPlaying = false;
  playBtn.textContent = "▶";
  clearInterval(timer);
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  playSong();
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  playSong();
}

playBtn.addEventListener("click", () => isPlaying ? pauseSong() : playSong());
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

likeBtn.addEventListener("click", () => {
  isLiked = !isLiked;
  likeBtn.textContent = isLiked ? "❤️" : "🤍";
});

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  themeToggleBtn.textContent = document.body.classList.contains("dark-mode") ? "🌙" : "☀️";
});

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = playlist.filter(s => 
    s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query)
  );
  renderPlaylist(filtered);
});

progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const total = playlist[currentIndex].durationSec;
  
  currentSec = Math.floor((clickX / width) * total);
  progressFill.style.width = `${(clickX / width) * 100}%`;
  currentTimeEl.textContent = formatTime(currentSec);
  
  if (!isPlaying) playSong();
});

loadSong(currentIndex);