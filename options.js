(function() {

	var defaultBrkINURL = 'http://10.10.9.19/logs/break_in',
			defaultBrkOUTURL = 'http://10.10.9.19/logs/break_out',
			defaultINC = 10.
			tINT = null;

	function setMessage (msg) {
		if(tINT) clearTimeout(tINT);
		var status = document.getElementById('status');
		status.textContent = msg;
		tINT = setTimeout(function() {
			status.textContent = '';
		}, 750);
	}

	function save_options () {
		var txtBrkInUrl = document.getElementById('txtBrkInUrl').value;
		var txtBrkOutUrl = document.getElementById('txtBrkOutUrl').value;
		var durationInc = document.getElementById('durationInc').value;

		if (!txtBrkInUrl && txtBrkInUrl === '') {
			setMessage('{ Break IN } URL cannot be empty');
			return false;
		} else if (!txtBrkOutUrl && txtBrkOutUrl === '') {
			setMessage('{ Break OUT } URL cannot be empty');
			return false;
		}

		chrome.storage.sync.set({
			breakIN_Url: txtBrkInUrl,
			breakOUT_Url: txtBrkOutUrl,
			duration_INC: durationInc,
		}, function() {
			// Update status to let user know options were saved.
			setMessage('Options saved!');
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
