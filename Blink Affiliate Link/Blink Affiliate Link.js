// Search Blink using Draft content, then replace content with markdown affiliate link.

// Setup base Blink URL with no parameters
const baseURL = "blink://x-callback-url/search";
var searchTerm = editor.getText();

function searchBlink(query) {
	//create and configure callback object
	var cb = CallbackURL.create();
	cb.baseURL = baseURL;
	cb.addParameter("q", query)
	//open and wait for result
	var success = cb.open();
	if (success) {
		var response = cb.callbackResponse;
		var responseText = response["text"]
		editor.setText(responseText)
	}
	else {
		console.log(cb.status);
		if (cb.status == "cancel") {
			context.cancel();
		}
		else {
			contextfail();
		}
	}
}

searchBlink(searchTerm);