// Execute this script once jQuery has loaded.
$(function() {
  // Set values for click frequency and duration.
  const clickFrequency = 880;
  const clickDuration = 0.05;

  // Initialize global variables.
  var audioCtx, queue, tempos, bars, period;
  var playing = false;

  // Define play button behavior.
  $("#play-btn").click(function() {
    if (playing) {
      stop();
    } else {
      play();
    }
  });

  // Build queue of clicks and init.
  function play() {
    readInputs();
    if (validateInputs()) {
      playing = true;
      refreshAudioCtx();
      toggleIcon();
      buildQueue();
      init();
    } else {
      alert("Invalid input.");
    }
  }

  // Pause the metronome.
  function stop() {
    playing = false;
    audioCtx.close();
    toggleIcon();
  }

  // Reset the audio context clock and the click index back to zero.
  function refreshAudioCtx() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    queue = [];
  }

  // Toggle the play/stop icon.
  function toggleIcon() {
    $("#play-btn").find("span").toggleClass("glyphicon-play");
    $("#play-btn").find("span").toggleClass("glyphicon-stop");
  }

  // Schedule a single click period/2 in the future.
  function scheduleClick(t) {
    var osc = audioCtx.createOscillator();
    osc.connect(audioCtx.destination);
    osc.frequency.value = clickFrequency;
    osc.start(t);
    osc.stop(t + clickDuration);
  }

  // Init queue.
  function init() {
    queue.forEach(function(t) {
      scheduleClick(t);
    });
    tLast = queue[queue.length - 1] * 1000;
    setTimeout(stop, tLast + 100);
  }

  // Round to 3 decimal places.
  function round3(num) {
    return Math.round(num * 1000) / 1000;
  }

  // Assemble click queue with absolute times in s.
  function buildQueue() {
    var i = 0;
    var t = 0;
    tempos.forEach(function(tempo) {
      calculatePeriod(tempo);
      var j = 0;
      while (j < (bars[i] * 4)) {
        queue.push(round3(t));
        t += period;
        j++;
      }
      i++;
    });
  }

  // Calculate the period from tempo in s.
  function calculatePeriod(tempo) {
    period = 60 / tempo;
  }

  // Read values from inputs and add them to tempos and bars arrays.
  function readInputs() {
    tempos = [];
    bars = [];
    $(".tempo-input").each(function() {
      tempos.push(parseInt($(this).val()));
    });
    $(".bars-input").each(function() {
      bars.push(parseInt($(this).val()));
    });
  }

  // Make sure none of the inputs are blank.
  function validateInputs() {
    var containsInput = false;
    for (i = 0; i < tempos.length; i++) { 
      if ((tempos[i] && !bars[i]) ||
          (!tempos[i] && bars[i])) {
        return false;
      }
      if (tempos[i]) {
        containsInput = true;
      }
    }
    if (containsInput) {
      return true;
    } else {
      return false;
    }
  }

  // Define add row button behavior.
  $("#add-row-btn").click(function() {
    var newRow = $("#master").clone();
    newRow.find("input").val("");
    newRow.insertAfter("div.input-row:last");
  });

  // Define refresh button behavior.
  $("#refresh-btn").click(function() {
    var newRow = $("#master").clone();
    newRow.find("input").val("");
    $(".input-row").remove();
    newRow.insertBefore("div.row:first");
  });
});
