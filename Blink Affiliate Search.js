// Blink Affiliate Search

const baseURL = "blink://x-callback-url/search"

var sel = editor.getSelectedText();
var selRange = editor.getSelectedRange();

// Create a callback search and return the affiliate URL from Blink. The variable created when this is called will be used in the second function below to use the selection to search.

function searchBlink(searchTerm) {
	var cb = CallbackURL.create()
	cb.baseURL = baseURL;
	cb.addParameter("q", searchTerm);
	// Open and wait for result
	var success = cb.open();
	if (success) {
		var response = cb.callbackResponse;
		var affLink = response["result"];
		return affLink
	}
}

// If nothing is selected, the user will be prompted to enter a search term. If there is a selection, that will be the search term. This will then call the searchBlink() function.

function selectAndSearch() {
	if (!sel || sel.length == 0) {
		var p = Prompt.create();
		p.title = "Search Term";
		p.message = "What would you like to search Blink for?";
		p.addTextField("Query", "Search", "");
		p.addButton("Done");
		p.show();
		var search = p.fieldValues["Query"];
	}
	else {
		var search = sel
	}
	var affiliate = searchBlink(search);
	return affiliate
}

function linkStyle() {
	var ps = Prompt.create();
	ps.title = "Link Style";
	ps.message = "Use Blink's Standard or Markdown Link?";
	ps.addButton("Markdown Link");
	ps.addButton("Plain Link");
	ps.show();
	var style = ps.buttonPressed;
	
	if (style == "Markdown Link") {
		var link = selectAndSearch();
		editor.setSelectedText(link);
		editor.setSelectedRange(selRange[0]+1,0);
	}
	else {
		var link = selectAndSearch();
		editor.setSelectedText("["+sel+"](" + link + ")");
		editor.setSelectedRange(selRange[0]+selRange[1]+link.length+4,0);
		}
}

var complete = linkStyle();
