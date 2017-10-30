// Execute this script once jQuery has loaded.
$(function() {

  // TESTING ONLY!
  $("#master").find(".tempo-input").val("200");
  $("#master").find(".bars-input").val("3");
//  var newRow = $("#master").clone();
//  newRow.find(".tempo-input").val("120");
//  newRow.insertAfter("div.input-row:last");
//  var newRow = $("#master").clone();
//  newRow.find(".tempo-input").val("240");
//  newRow.insertAfter("div.input-row:last");
//  var newRow = $("#master").clone();
//  newRow.find(".tempo-input").val("120");
//  newRow.insertAfter("div.input-row:last");
//  var newRow = $("#master").clone();
//  newRow.find(".tempo-input").val("60");
//  newRow.insertAfter("div.input-row:last");

  // Set values for click frequency and duration.
  const clickFrequency = 666;
  const clickDuration = 0.05;

  // Initialize global variables.
  var audioCtx, clickIndex, clickQ, schedulerQ, tempos, bars, period;
  var playing = false;

  // Reset the audio context clock and the click index back to zero.
  function refreshAudioCtx() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    clickIndex = 0;
    clickQ = [];
    schedulerQ = [];
    tempos = [];
    bars = [];
  }

  // Schedule a single click period/2 in the future.
  function scheduleClick() {
    var clickTime = clickQ[clickIndex];
    var osc = audioCtx.createOscillator();
    osc.connect(audioCtx.destination);
    osc.frequency.value = clickFrequency;
    osc.start(clickTime);
    osc.stop(clickTime + clickDuration);
  }

  // Schedule a click every period.
  function play() {
    setTimeout(function () {
      if (playing && clickIndex < schedulerQ.length) {
        scheduleClick();
        clickIndex++;
        play();
      } else {
        playing = false;
        toggleIcon();
      }
    }, schedulerQ[clickIndex]);
  }
        toggleIcon();

  // Round to 3 decimal places.
  function round3(num) {
    return Math.round(num * 1000) / 1000;
  }

  // Assemble click queue with absolute times in s.
  function assembleClickQ() {
    calculatePeriod(tempos[0]);
    var time = period;
    clickQ.push(round3(time));

    var i = 0;
    tempos.forEach(function(tempo) {
      calculatePeriod(tempo);
      var j = 0;
      while (j < (bars[i] * 4)) {
        time += period;
        clickQ.push(round3(time));
        j++;
      }
      i++;
    });
    clickQ.splice(-1, 1);
  }

  // Assemble scheduler queue with relative times in ms.
  function assembleSchedulerQ() {
    var time0 = 500 * clickQ[0];
    schedulerQ.push(Math.round(time0));
    for (i = 1; i < clickQ.length; i++) { 
      var time = 1000 * (clickQ[i] - clickQ[i - 1]);
      schedulerQ.push(Math.round(time));
    }
  }

  // Calculate the period from tempo in s.
  function calculatePeriod(tempo) {
    period = 60 / tempo;
  }

  // Toggle the play/pause icon.
  function toggleIcon() {
    $("#play-btn").find("span").toggleClass("glyphicon-play");
    $("#play-btn").find("span").toggleClass("glyphicon-pause");
  }

  // Read values from inputs and add them to tempos and bars arrays.
  function readInputs() {
    $(".tempo-input").each(function() {
      tempos.push(parseInt($(this).val()));
    });
    $(".bars-input").each(function() {
      bars.push(parseInt($(this).val()));
    });
  }

  // Define play button behavior.
  $("#play-btn").click(function() {
    if (playing) {
      playing = false;
    } else {
      playing = true;
      toggleIcon();
      refreshAudioCtx();
      readInputs();
      assembleClickQ();
      assembleSchedulerQ();
      play();
    }
  });

  // Define add row button behavior.
  $("#add-row-btn").click(function() {
    var newRow = $("#master").clone();
    newRow.find("input").val("");
    newRow.insertAfter("div.input-row:last");
  });
});
