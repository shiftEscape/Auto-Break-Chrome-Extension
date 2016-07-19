
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

function createFormElement (_id, _action) {
	var frm = document.createElement('form');
	frm.id = _id; frm.action = _action; frm.method = 'post';
	return frm;
}

function watchBreakTime () {
	var tInt = setInterval(function() {
		console.log(getCurrentTime());
		var time = (getStrTime(11, 34) == getCurrentTime());
		if (time) {
			console.info('TIME!!');
			clearInterval(tInt);
		}
	}, 1000)
}

function sendRequest (url, handleStateChange) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = handleStateChange;
	xhr.open("POST", url, true);
	xhr.send();
}

// DOM onload
document.addEventListener('DOMContentLoaded', function() {

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
		var thisBtn = this;
		var cb = function () {
			thisBtn.style.display = 'none';
			disableAutoBreakButton.style.display = 'block';
		}; sendRequest('http://www.google.com', cb);
  }, false);

	// Disable button
	disableAutoBreakButton.addEventListener('click', function() {
		var thisBtn = this;
		var cb = function () {
			thisBtn.style.display = 'none';
			enableAutoBreakButton.style.display = 'block';
		}; sendRequest('http://www.google.com', cb);

	}, false);

}, false);
