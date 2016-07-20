
(function() {

	'use strict';
	var ENV = 'prod';

	var breakTimer = null,
			WATCHER_INTERVAL = 1000,
			ICON_URL = './icon128.png',
			WATCHER_KEY = 'watcherStatus',
			URL = {
				'dev': {
					'IN': 'http://www.google.com',
					'OUT': 'http://www.google.com',
					'type': 'GET'
				},
				'prod': {
					'IN': 'http://10.10.9.19/logs/break_in',
					'OUT': 'http://10.10.9.19/logs/break_out',
					'type': 'POST'
				},
			};

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

	function getStrTime (hr, min) {
		var d1 = new Date();
		d1.setHours(hr, min, 0);
		return d1.getTime();
	}

	function getCurrentTime () {
		var d2 = new Date();
		return d2.getTime();
	}

	function isWatcherEnabled () {
		var stat = localStorage.getItem(WATCHER_KEY);
		return (stat === 'ENABLED' ? true : false);
	}

	function setWatcherStatus (isEnabled) {
		localStorage.setItem(WATCHER_KEY, isEnabled? 'ENABLED':'DISABLED');
	}

	function stopBreakTimeWatcher () {
		if (breakTimer && breakTimer !== null) {
			clearInterval(breakTimer);
			breakTimer = null;
			setWatcherStatus(false);
			console.warn('Break time watcher { STOPPED }');
		}
	}

	function sendRequest (url, handleStateChange) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			handleStateChange(xhr);
		};
		xhr.open(URL[ENV]['type'], url, true);
		xhr.send();
	}

	function executeWatcherForBreakOut (obj) {
		obj.type = 'OUT';
		obj.current = obj.out;
		enableBreakTimeWatcher(obj);
	}

	function reqCallback (obj, xhr) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			showNotify('{BREAK '+obj.type+'} successfully executed!');
			console.warn('Executed { BREAK ' + obj.type + ' }');
			if(obj.type === 'OUT') {
				stopBreakTimeWatcher();
				return false;
			} executeWatcherForBreakOut(obj);
		} else if (xhr.readyState == 4 && xhr.status !== 200) {
			showNotify('Something went wrong with intranet. Please make sure that you\'re logged in.');
			stopBreakTimeWatcher();
		}
	}

	function enableBreakTimeWatcher (obj) {
		var timeProps = obj.current;

		stopBreakTimeWatcher();
		setWatcherStatus(true);

		console.warn('Scheduled: ' + timeProps.hr + ':' + timeProps.min + ' for { BREAK ' + obj.type + ' }');

		breakTimer = setInterval(function() {
			// Check if scheduled time == current time
			var isTime = (getStrTime(timeProps.hr, timeProps.min) === getCurrentTime());
			console.log(isTime);

			if (isTime) {
				sendRequest(URL[ENV][obj.type], function(xhr) {
					reqCallback(obj, xhr);
				});
			}
		}, WATCHER_INTERVAL)
	}

	chrome.runtime.onConnect.addListener(function(port) {
		port.onMessage.addListener(function(request) {
			switch(request.type) {
				case ("IN" || "OUT"): {
					enableBreakTimeWatcher(request);
					break;
				}
				case "STOP": {
					stopBreakTimeWatcher();
					break;
				}
			}
		});
	});

}).call(this);
