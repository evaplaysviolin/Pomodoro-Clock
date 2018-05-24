$(document).ready(function() {
  
  var timerType = "timer";
  var status = "reset";
  var lastTime;
  var checkTimers = 0, checkBreaks = 0;
  
  $("#resetPomodoros").hide();
  
  $(".button").click(function() {
    switch (true) {
      case $(this).hasClass("timerSub"):
        addOrSubMinutes($("#setTimer"), "sub");
        break;
      case $(this).hasClass("timerAdd"):
        addOrSubMinutes($("#setTimer"), "add");
        break;
      case $(this).hasClass("breakSub"):
        addOrSubMinutes($("#setBreak"), "sub");
        break;
      case $(this).hasClass("breakAdd"):
        addOrSubMinutes($("#setBreak"), "add");
        break;
    }
  });

  $("#startPause").click(function() {
    if ($("#startPause").text() == "\u25b6") {
      $(".button").hide("slow");
      handleStartOrPause();
      $("#startPause").text("\u275A\u275A");
    } else {
      status = "pause";
      $("#startPause").text("\u25b6");
    }
  });
  
  $("#stop").click(function() {
    if (status == "complete reset") {
      addZeroCountdown(timerType);
      $("#resetPomodoros").slideUp("slow");
      clearPomodoros();
      $("#startPause").show("slow");
      $("#stop").text("\u25FC");
      $("#durationContainer").slideDown("slow");
      status = "reset";
    } else if (status == "pause") {
      addZeroCountdown(timerType);
      status = "reset";
    } else if (status == "reset") {
      return;
    } else {
      status = "stop";
    }
    pauseToStartAndShowControls();
  });
  
  $("#resetPomodoros").click(function() {
    timerType = "timer";
    addZeroCountdown(timerType);
    $("#resetPomodoros").slideUp("slow");
    clearPomodoros();
    if (status == "reset") {
      return;
    } else if (status == "pause") {
      status = "reset";
    } else {
      status = "stop";
    }
    pauseToStartAndShowControls();
  });
  
  
  
  function addOrSubMinutes(type, change) {
    if (type.text() == 0 && change == "sub") {
      return;
    } else {
      var getTime = parseInt(type.text(), 10);
      if (change == "sub") {
        type.text(getTime - 1);
      } else if (change == "add") {
        type.text(getTime + 1);
      }
      addZeroCountdown(timerType);
    }
  }
  
  function handleStartOrPause() {
    if (status == "reset") {
      if (timerType == "timer") {
        timer(($("#setTimer").text() * 60), $("#countdown"));
      } else if (timerType == "break") {
        timer(($("#setBreak").text() * 60), $("#countdown"));
      }
      status = "start";
    } else if (status == "pause") {
      var getMinutes = parseInt($("#countdown").text().slice(0, 2), 10);
      var getSeconds = parseInt($("#countdown").text().slice(3, 5), 10);
      timer((getMinutes * 60) + getSeconds, $("#countdown"));
      status = "start";
    }
  }
  
  function addZeroCountdown(timerType) {
    if (timerType == "timer") {
      $("#countdown").css("color", "#0c7017");
      var checkAddZero = parseInt($("#setTimer").text(), 10);
      if (checkAddZero < 10) {
        $("#countdown").text("0" + $("#setTimer").text() + ":00");
      } else {
        $("#countdown").text($("#setTimer").text() + ":00");
      }
    } else if (timerType == "break") {
      $("#countdown").css("color", "#961f2f");
      var checkAddZero = parseInt($("#setBreak").text(), 10);
      if (checkAddZero < 10) {
        $("#countdown").text("0" + $("#setBreak").text() + ":00");
      } else {
        $("#countdown").text($("#setBreak").text() + ":00");
      }
    }
  }
  
  function clearPomodoros() {
    checkTimers = 0, checkBreaks = 0;
    $("#pomodoros").empty();
  }
  
  function pauseToStartAndShowControls() {
    if ($("#startPause").text() == "\u275A\u275A") {
      $("#startPause").text("\u25b6");
    }
    $(".button").show("slow");
  }
  
  function timer(timeLeft, show) {
    lastTime = timeLeft
    var minutes, seconds;
    
    var interval = setInterval(function() {
      minutes = parseInt(lastTime / 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = parseInt(lastTime % 60, 10);
      seconds = seconds < 10 ? "0" + seconds : seconds;
      show.text(minutes + ":" + seconds);

      if (lastTime == 0 || status == "stop" || status == "pause") {
        clearInterval(interval);
        if (status == "stop") {
          addZeroCountdown(timerType);
          status = "reset";
        }
        handleAndTrackPomodoros();
      } else {
        lastTime -= 1;
      }
    }, 1000);
  }
  
  function handleAndTrackPomodoros() {
    if (lastTime == 0 && checkTimers < 4 && checkBreaks < 3) {
      if (timerType == "timer") {
        $("#pomodoros").append("<img src='https://res.cloudinary.com/percipience/image/upload/v1519187479/Baby_Pomodoro_ekzmel.png'>");
        $("#resetPomodoros").slideDown("slow");
        timerType = "break";
        $("#countdown").css("color", "#961f2f");
        checkTimers += 1;
        timer(($("#setBreak").text() * 60), $("#countdown"));
      } else if (timerType == "break") {
        timerType = "timer";
        $("#countdown").css("color", "#0c7017");
        checkBreaks += 1;
        timer(($("#setTimer").text() * 60), $("#countdown"));
      }
    } else if (lastTime == 0 && checkTimers == 3 && checkBreaks == 3) {
      $("#pomodoros").append("<img src='https://res.cloudinary.com/percipience/image/upload/v1519187479/Baby_Pomodoro_ekzmel.png'>");
      $("#resetPomodoros").slideUp("slow");
      $("#countdown").css("color", "#11421d");
      $("#countdown").text("Take a longer break!");
      $("#startPause").hide("slow");
      $("#stop").text("Reset");
      $("#durationContainer").slideUp("slow");
      status = "complete reset";
    }
  }
  
});