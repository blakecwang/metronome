// Execute this script once jQuery has loaded.
$(function() {


  // Create an oscillator.
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//  var osc = audioCtx.createOscillator();
//  osc.connect(audioCtx.destination);
//  osc.frequency.value = 880.0;
//  osc.start(0.00);
//  osc.stop(0.05);


  for (i = 0; i < 100; i++) { 
    var osc = audioCtx.createOscillator();
    osc.connect(audioCtx.destination);
    osc.frequency.value = 880.0;
    x = i / 3;
    osc.start(x);
    osc.stop(x + 0.05);
  }



  // Define variable to toggle when playing.
  var playing = false;

  // Play single click.
  function playClick() {
    osc.start(0.00);
    osc.stop(0.05);
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
