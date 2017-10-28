// Execute this script once jQuery has loaded.
$(function() {
  const clickFrequency = 666; // Set click pitch;
  const clickDuration = 0.05; // Set click duration;

  var tempo, sPeriod, msPeriod, audioCtx, clickIndex;
  var playing = false;

  // Reset the audio context clock and the click index back to zero.
  function refreshAudioCtx() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    clickIndex = 0;
  }

  // Schedule a single click period/2 in the future.
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

  // Flip the boolean and stop scheduling clicks.
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

  // Calculate the period from tempo in s and ms.
  function calculatePeriod() {
    sPeriod = 60 / tempo;
    msPeriod = 1000 * sPeriod;
  }

  // Define play button behavior.
  $("#play-btn").click(function() {
    tempo = parseInt($("#tempo-input").val());
    if (tempo) {
      $(this).find("span").toggleClass("glyphicon-play");
      $(this).find("span").toggleClass("glyphicon-pause");
      calculatePeriod();
      togglePlaying();
    } else {
      alert("Please enter a tempo!");
    }
  });
});
