// Insert Bible Verse into Drafts

// Store ESV API Token in the Drafts Credential Keychain. You will be prompted for your API Token

var credential = Credential.create("ESV", "ESV.org API");

credential.addPasswordField("API_Token", "API Token");

credential.authorize();
var token = credential.getValue("API_Token");

// Create search prompt for Bible verses

var p = Prompt.create()
p.title = "Bible Search";
p.message = "What Bible Passage Would You Like to Insert?";
p.addTextField("query", "Passage", "")
// Currently, the prompt defaults to inserting as a blockquote. If you want to change this default behavior, change the word "true" to "false" in the next line
p.addSwitch("blockQuote", "Insert as Markdown Blockquote", true);
p.addButton("Done");
p.show();
// Replace a space between book names and chapter/verse with a plus for URL purposes
var passage = p.fieldValues["query"];
var query = passage.replace(" ", "+");
// Request Data from ESV API
var http = HTTP.create();
var response = http.request({
	"url": "https://api.esv.org/v3/passage/text/",
	"method": "GET",
	"parameters": {
		"q": query,
		"include-passage-references": "false",
		"include-footnotes": "false",
		"include-footnote-body": "false"
	},
	"headers": {
	"Authorization": "Token " + token
	}
});
// Function to add Markdown Blockquotes to the beginning of each new line if the blockquote selector switch from the Prompt is toggled on.
function addMarkdownQuote(text) {
	var lines = text.split("\n");
	var quoteLines = []
	for (var line of lines) {
		var blockQuote = "> " + line
		quoteLines.push(blockQuote);
	}
	var quote = quoteLines.join("\n");
	return quote
}
// Processes JSON response from ESV Server and converts to text
function processVerses(rawJSON) {
var json = JSON.parse(rawJSON);
	var bibleVerses = json.passages[0];
	if (p.fieldValues["blockQuote"] == true) {
		var finalQuote = addMarkdownQuote(bibleVerses);
	}
	else {
		var finalQuote = bibleVerses;
	}
	return finalQuote
}
// Response Success and Failure Options
if (response.success) {
	var passageForInsert = processVerses(response.responseText);
	draft.setTemplateTag("passage", passageForInsert);
}
else {
	console.log(response.statusCode);
	console.log(response.error);
}