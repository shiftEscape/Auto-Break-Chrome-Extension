
(function() {

	'use strict';

	var tInt = null;
	var WATCHER_KEY = 'watcherStatus';
	var breakInUrl = 'http://google.com';
	var breakOutUrl = 'http://google.com';

	function generateTimes (selElem, start, limit, step, text) {
		selElem.innerHTML = "";
		for(var i=start; i<=limit; i+=step) {
			var option = document.createElement("option");
			var txt = (i < 10?'0'+i:i);
			option.innerHTML = txt + text; option.value = i;
			selElem.appendChild(option);
		}
	}

	function getStrTime (hr, min) {
		var d = new Date();
		d.setHours(hr, min, 0);
		return d.getTime();
	}

	function getCurrentTime () {
		var d = new Date();
		return d.getTime();
	}

	function watchBreakTime () {
		tInt = setInterval(function() {
			if( isWatcherEnabled() ) {
				console.log(getCurrentTime());
				var time = (getStrTime(17, 58) == getCurrentTime());
				if (time) enableWatcher(false);
			}
		}, 1000)
	}

	function enableWatcher (bool) {
		localStorage.setItem(WATCHER_KEY, (bool?'ENABLED':'DISABLED'));
		if (bool) {
			console.warn('STARTED!')
			watchBreakTime();
		} else {
			console.warn('STOPPED!')
			setButtonWatcherStatus();
			clearInterval(tInt);
		}
	}

	function isWatcherEnabled () {
		var stat = localStorage.getItem(WATCHER_KEY);
		return (stat === 'ENABLED' ? true : false);
	}

	function setButtonWatcherStatus () {
		var isEnabled = isWatcherEnabled(),
				enableAutoBreakButton  = document.getElementById('enableAutoBreak'),
				disableAutoBreakButton = document.getElementById('disableAutoBreak');
		enableAutoBreakButton.style.display = (isEnabled? 'none':'block');
		disableAutoBreakButton.style.display = (isEnabled? 'block':'none');
	}

	function sendRequest (url, handleStateChange) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = handleStateChange;
		xhr.open("POST", url, true);
		xhr.send();
	}

	// DOM onload
	document.addEventListener('DOMContentLoaded', function() {

		setButtonWatcherStatus();

	  var enableAutoBreakButton = document.getElementById('enableAutoBreak');
	  var disableAutoBreakButton = document.getElementById('disableAutoBreak');

	  var selectSTHour = document.getElementById('st-hour');
	  var selectSTMin  = document.getElementById('st-min');

		var selectDuration = document.getElementById('duration');

		// Load all times
		generateTimes(selectSTHour, 0, 23, 1, '');
		generateTimes(selectSTMin, 0, 59, 1, '');
		generateTimes(selectDuration, 10, 60, 10, ' mins');

		// Enable button
	  enableAutoBreakButton.addEventListener('click', function() {
			enableWatcher(true);
			setButtonWatcherStatus();
	  }, false);

		// Disable button
		disableAutoBreakButton.addEventListener('click', function() {
			enableWatcher(false);
			setButtonWatcherStatus();
		}, false);

	}, false);

}).call(this);
