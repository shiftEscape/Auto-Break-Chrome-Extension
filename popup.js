
function generateTimes (selElem, limit) {
	selElem.innerHTML = "";
	for(var i=0; i<=limit; i++) {
		var option = document.createElement("option");
		i = (i < 10?'0'+i:i);
		option.innerHTML = i; option.value = i;
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


document.addEventListener('DOMContentLoaded', function() {
  var enableAutoBreakButton = document.getElementById('enableAutoBreak');
  var disableAutoBreakButton = document.getElementById('disableAutoBreak');

  var selectSTHour = document.getElementById('st-hour');
  var selectSTMin  = document.getElementById('st-min');

	var selectENHour = document.getElementById('end-hour');
  var selectENMin  = document.getElementById('end-min');

	// Load all times
	generateTimes(selectSTHour, 12);
	generateTimes(selectSTMin, 60);
	generateTimes(selectENHour, 12);
	generateTimes(selectENMin, 60);

	// Enable button
  enableAutoBreakButton.addEventListener('click', function() {
		this.style.display = 'none';
		disableAutoBreakButton.style.display = 'block';

    chrome.tabs.getSelected(null, function(tab) {
			var tInt = setInterval(function() {
				console.log(getCurrentTime());
				var time = (getStrTime(11, 34) == getCurrentTime());
				if(time) {
					console.info('TIME!!');
					clearInterval(tInt);
				}
			}, 1000)
			// chrome.tabs.sendRequest(tab.id, {action: "getDOM"}, function(response) {
		  //   console.log(response.dom);
		  // });
			// console.log(d.getElementById('lunchIn'));
			//
      // var f = d.createElement('form');
      // f.action = 'http://gtmetrix.com/analyze.html?bm';
      // f.method = 'post';
      // var i = d.createElement('input');
      // i.type = 'hidden';
      // i.name = 'url';
      // i.value = tab.url;
      // f.appendChild(i);
      // d.body.appendChild(f);
      // f.submit();
    });
  }, false);

	// Disable button
	disableAutoBreakButton.addEventListener('click', function() {
		this.style.display = 'none';
		enableAutoBreakButton.style.display = 'block';
	}, false);

}, false);
