// Execute this script once jQuery has loaded.
$(function() {
  const clickFrequency = 666;    // Set click pitch;
  const clickDuration = 0.05;    // Set click duration;

  var tempo = 60;                // Initialize tempo.
  var sPeriod = 60 / tempo;      // Calculate period in seconds.
  var msPeriod = 1000 * sPeriod; // Calculate period in miliseconds.
  var clickIndex = 0;            // Define current place in queue.
  var playing = false;           // Define variable to toggle when playing.
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Initialize an AudioContext object.

  function refreshAudioCtx() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    clickIndex = 0;
  }

  // Schedule a single click.
  function scheduleClick() {
    var clickTime = (clickIndex * sPeriod) + (sPeriod / 2);
    var osc = audioCtx.createOscillator();
    osc.connect(audioCtx.destination);
    osc.frequency.value = clickFrequency;
    osc.start(clickTime);
    osc.stop(clickTime + clickDuration);
    clickIndex++;
  }

  // Schedule clicks every period.
  var interval = null;
  function play() {
    playing = true;
    refreshAudioCtx();
    interval = setInterval(scheduleClick, msPeriod);
  }

  // Pause.
  function pause() {
    playing = false;
    clearInterval(interval);
  }

  // Toggle playing.
  function togglePlaying() {
    if (playing) {
      pause();
    } else {
      play();
    }
  }

  // Define play button behavior.
  $("#play-btn").click(function() {
    $(this).find("span").toggleClass("glyphicon-play");
    $(this).find("span").toggleClass("glyphicon-pause");
    togglePlaying();
  });
});
