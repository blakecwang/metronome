// Execute this script once jQuery has loaded.
$(function() {

  // TESTING ONLY!
  $("#master").find(".tempo-input").val("60");
  $("#master").find(".bars-input").val("1");
  var newRow = $("#master").clone();
  newRow.find(".tempo-input").val("120");
  newRow.insertAfter("div.input-row:last");
  var newRow = $("#master").clone();
  newRow.find(".tempo-input").val("180");
  newRow.insertAfter("div.input-row:last");

  // Set values for click frequency and duration.
  const clickFrequency = 666;
  const clickDuration = 0.05;

  // Initialize global variables.
  var sPeriod, msPeriod, audioCtx, clickIndex;
  var playing = false;
  var tempos = [];
  var bars = [];
  var clickQueue = [];
  var schedulerQueue = [];

  // Reset the audio context clock and the click index back to zero.
  function refreshAudioCtx() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    clickIndex = 0;
  }

  // Schedule a single click period/2 in the future.
  function scheduleClick() {
    var clickTime = clickQueue[clickIndex];
    var osc = audioCtx.createOscillator();
    osc.connect(audioCtx.destination);
    osc.frequency.value = clickFrequency;
    osc.start(clickTime);
    osc.stop(clickTime + clickDuration);
  }

  // Schedule clicks every period.
  function play() {
    setTimeout(function () {
      if (playing && schedulerQueue[clickIndex]) {
        scheduleClick();
        clickIndex++;
        play();
      }
    }, schedulerQueue[clickIndex]);
  }

  // Round to 3 decimal places.
  function round3(num) {
    return Math.round(num * 1000) / 1000;
  }

  // Assemble click queue with absolute times in s.
  function assembleClickQueue() {
    calculatePeriod(tempos[0]);
    var time = sPeriod;
    clickQueue.push(round3(time));

    var i = 0;
    tempos.forEach(function(tempo) {
      calculatePeriod(tempo);
      var j = 0;
      while (j < (bars[i] * 4)) {
        time += sPeriod;
        clickQueue.push(round3(time));
        j++;
      }
      i++;
    });
    clickQueue.splice(-1, 1);
  }

  // Assemble scheduler queue with relative times in ms.
  function assembleSchedulerQueue() {
    var time0 = 500 * clickQueue[0];
    schedulerQueue.push(Math.round(time0));
    for (i = 1; i < clickQueue.length; i++) { 
      var time = 1000 * (clickQueue[i] - clickQueue[i - 1]);
      schedulerQueue.push(Math.round(time));
    }
  }

  // Flip the boolean and stop scheduling clicks.
  function pause() {
    playing = false;
  }

  // Calculate the period from tempo in s and ms.
  function calculatePeriod(tempo) {
    sPeriod = 60 / tempo;
    msPeriod = 1000 * sPeriod;
  }

  // Toggle the play/pause icon.
  function toggleIcon() {
    $("#play-btn").find("span").toggleClass("glyphicon-play");
    $("#play-btn").find("span").toggleClass("glyphicon-pause");
  }

  // Read values from inputs and add them to tempos and bars arrays.
  function readInput() {
    $(".tempo-input").each(function() {
      tempos.push(parseInt($(this).val()));
    });
    $(".bars-input").each(function() {
      bars.push(parseInt($(this).val()));
    });
  }

  // Define play button behavior.
  $("#play-btn").click(function() {
    playing = true;
    refreshAudioCtx();
    toggleIcon();
    readInput();
    assembleClickQueue();
    assembleSchedulerQueue();
    play();
// console.log(clickQueue);
// console.log(schedulerQueue);
  });

  // Define add row button behavior.
  $("#add-row-btn").click(function() {
    var newRow = $("#master").clone();
    newRow.find("input").val("");
    newRow.insertAfter("div.input-row:last");
  });
});
