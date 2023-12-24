export default function playBackgroundAudio() {
  const scoredSound = new Audio("./audio/scored_effect.mp3");
  const levelUpSound = new Audio("./audio/level_up.mp3");
  const gameOverSound = new Audio("./audio/game_over.mp3");
  const victorySound = new Audio("./audio/victory-voiced.mp3");

  const backgroundAudio = document.createElement("audio");
  backgroundAudio.id = "background-audio";
  backgroundAudio.src = "./audio/sound_playing_lv1.mp3";
  backgroundAudio.loop = true;
  // backgroundAudio.autoplay = true;
  document.body.appendChild(backgroundAudio);
  const backgroundAudioBtn = document.createElement("button");
  backgroundAudioBtn.id = "btnSoundLoop";
  backgroundAudioBtn.style.display = "none";
  document.body.appendChild(backgroundAudioBtn);
  const onSoundLoop = document.querySelector("#btnSoundLoop");

  if (onSoundLoop) {
    onSoundLoop.addEventListener("click", function () {
      backgroundAudio.play();
    });
  }

  // Trả về đối tượng chứa âm thanh
  return {
    scoredSound,
    levelUpSound,
    gameOverSound,
    victorySound,
    onSoundLoop,
    backgroundAudio,
  };
}
