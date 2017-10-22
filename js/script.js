// Execute this script once jQuery has loaded.
$(function() {
  // Load audio file to use for click.
  var sound = new Audio("audio/1kHz_50ms_trimmed.mp3");
  sound.preload = 'auto';
  sound.load();

  // Define variable to toggle when playing.
  var playing = false;

  // Play single click.
  function playClick() {
    var click = sound.cloneNode();
    click.play();
  }

  // Play click repeatly at given bpm.
  var interval = null;
  function play(bpm) {
    playing = true;
    var period = 60000 / bpm;
    interval = setInterval(playClick, period)
  }

  // Pause.
  function pause() {
    playing = false;
    clearInterval(interval);
  }

  // Toggle playing.
  function togglePlaying(bpm) {
    if (playing) {
      pause();
    } else {
      play(bpm);
    }
  }

  // Define play button behavior.
  $("#play-btn").click(function() {
    $(this).find("span").toggleClass("glyphicon-play");
    $(this).find("span").toggleClass("glyphicon-pause");
    togglePlaying(120);
  });
});
