(function() {

	var defaultBrkINURL = 'http://10.10.9.19/logs/break_in',
			defaultBrkOUTURL = 'http://10.10.9.19/logs/break_out',
			defaultINC = 10;

	function save_options () {
		var txtBrkInUrl = document.getElementById('txtBrkInUrl').value;
		var txtBrkOutUrl = document.getElementById('txtBrkOutUrl').value;
		var durationInc = document.getElementById('durationInc').value;
		chrome.storage.sync.set({
			breakIN_Url: txtBrkInUrl,
			breakOUT_Url: txtBrkOutUrl,
			duration_INC: durationInc,
		}, function() {
			// Update status to let user know options were saved.
			var status = document.getElementById('status');
			status.textContent = 'Options saved!'
			setTimeout(function() {
				status.textContent = '';
			}, 1000);
		});
	}

	function init_options() {
		chrome.storage.sync.get({
			breakIN_Url: defaultBrkINURL,
			breakOUT_Url: defaultBrkOUTURL,
			duration_INC: defaultINC,
		}, function(items) {
			document.getElementById('txtBrkInUrl').value = items.breakIN_Url;
			document.getElementById('txtBrkOutUrl').value = items.breakOUT_Url;
			document.getElementById('durationInc').value = items.duration_INC;
		});
	}

	function restore_options () {
		document.getElementById('txtBrkInUrl').value = defaultBrkINURL;
		document.getElementById('txtBrkOutUrl').value = defaultBrkOUTURL;
		document.getElementById('durationInc').value = defaultINC;
		save_options();
	}

	document.addEventListener('DOMContentLoaded', init_options);
	document.getElementById('save').addEventListener('click', save_options);
	document.getElementById('restore').addEventListener('click', restore_options);
}).call(this);
