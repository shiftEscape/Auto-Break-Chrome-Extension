
(function() {

	'use strict';

	var port = chrome.runtime.connect({name: "auto-break-port"});

	var WATCHER_KEY = 'watcherStatus',
			ICON_URL = './AutoBreak48.png';

	var enableAutoBreakButton = null;
	var disableAutoBreakButton = null;

	function generateTimes (selElem, start, limit, step, text) {
		selElem.innerHTML = "";
		for(var i=start; i<=limit; i+=step) {
			var option = document.createElement("option");
			var txt = (i < 10?'0'+i:i);
			option.innerHTML = txt + text; option.value = i;
			selElem.appendChild(option);
		}
	}

	function showNotify (notif) {
		// Let's check if the browser supports notifications
		if (!("Notification" in window)) {
			alert("This browser does not support desktop notification");
		}

		// Let's check whether notification permissions have already been granted
		else if (Notification.permission === "granted") {
			// If it's okay let's create a notification
			var notification = new Notification('', {body: notif, icon: ICON_URL});
		}

		// Otherwise, we need to ask the user for permission
		else if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {
				// If the user accepts, let's create a notification
				if (permission === "granted") {
					var notification = new Notification('', {body: notif, icon: ICON_URL});
				}
			});
		}
	}

	function disableControls () {
		var sel = document.getElementsByTagName('select');
		var boolDisable = isWatcherEnabled();
		for(var i=0;i<sel.length;i++) {
			sel[i].disabled = boolDisable;
		}
	}

	function enableWatcher (bool) {
		localStorage.setItem(WATCHER_KEY, (bool?'ENABLED':'DISABLED'));
		setButtonWatcherState();
	}

	function isWatcherEnabled () {
		var stat = localStorage.getItem(WATCHER_KEY);
		return (stat === 'ENABLED' ? true : false);
	}

	function setButtonWatcherState () {
		var isEnabled = isWatcherEnabled(),
				enableAutoBreakButton  = document.getElementById('enableAutoBreak'),
				disableAutoBreakButton = document.getElementById('disableAutoBreak');
		enableAutoBreakButton.style.display = (isEnabled? 'none':'block');
		disableAutoBreakButton.style.display = (isEnabled? 'block':'none');
	}

	function setOptionsState () {
		var opts = localStorage.getItem('setTimes')
		if(opts !== null) {
			// window.alert(opts);
			opts = JSON.parse(opts);
			document.getElementById('st-hour').value = opts.hr;
		  document.getElementById('st-min').value = opts.min;
		  document.getElementById('duration').value = opts.duration;
		}
	}

	function getBreakIn () {
		var tHour = document.getElementById('st-hour');
		var tMin  = document.getElementById('st-min');
		return { hr: tHour.value, min: tMin.value };
	}

	function getBreakOutFromDuration () {
		var brkIN     = getBreakIn();
		var dateObj   = new Date();
		var tDuration = document.getElementById('duration');

		dateObj.setHours(brkIN.hr, brkIN.min, 0);
		dateObj.setMinutes(dateObj.getMinutes() + parseInt(tDuration.value));
		return { hr: dateObj.getHours(), min: dateObj.getMinutes() };
	}

	function storeTimeData (times) {
		times['duration'] = document.getElementById('duration').value;
		localStorage.setItem('setTimes', JSON.stringify(times));
	}

	// DOM onload
	document.addEventListener('DOMContentLoaded', function() {

		setButtonWatcherState();
		disableControls();

	  enableAutoBreakButton = document.getElementById('enableAutoBreak');
	  disableAutoBreakButton = document.getElementById('disableAutoBreak');

	  var selectSTHour = document.getElementById('st-hour');
	  var selectSTMin  = document.getElementById('st-min');

		var selectDuration = document.getElementById('duration');

		// Load all times
		generateTimes(selectSTHour, 0, 23, 1, '');
		generateTimes(selectSTMin, 0, 59, 1, '');
		generateTimes(selectDuration, 10, 60, 10, ' mins');

		setOptionsState();

		// Enable button
	  enableAutoBreakButton.addEventListener('click', function() {
			var brkIN = getBreakIn(),
					brkOUT = getBreakOutFromDuration();
			enableWatcher(true);
			storeTimeData(brkIN);
			disableControls();
			port.postMessage({ in: brkIN, out: brkOUT, current: brkIN, type: 'IN' });
			showNotify('Break watcher started!');
		}, false);

		// Disable button
		disableAutoBreakButton.addEventListener('click', function() {
			enableWatcher(false);
			disableControls();
			showNotify('Break watcher stopped!');
			port.postMessage({ type: 'STOP' });
		}, false);

	}, false);

}).call(this);
