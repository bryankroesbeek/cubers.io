(function(){

    // Timer stuff
    // TODO comment better
    if (!window.app.isComplete) {
        window.app.timer = new window.app.Timer(window.app.eventName, window.app.scrambleId, window.app.compEventId);
        window.app.timerDisplayManager = new window.app.TimerDisplayManager();
    }

})();