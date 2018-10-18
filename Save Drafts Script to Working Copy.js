// Save Drafts Script to Working Copy

// This script will save the script currently loaded in the Drafts editor as a Javascript file in the Working Copy repo you choose using the Credential method.

var credential = Credential.create("Working Copy", "Working Copy Git Client for iOS");

// Creates credential input for your Working Copy URL scheme key which can be retrieved from the Working Copy settings.
credential.addTextField("urlKey", "Working Copy URL Key");
// Credential input for repo name
credential.addTextField("scriptsRepo", "Scripts Repo");

credential.authorize();

var key = credential.getValue("urlKey");
var repo = credential.getValue("scriptsRepo");
// The file name in Working Copy will be set as the title of the Draft without any special characters like comments or markdown headings.
var safeTitle = draft.processTemplate("[[safe_title]]");
var path = safeTitle + ".js";


// Create callback URL to send data to Working Copy
const baseURL = "working-copy://x-callback-url/write/";

var cb = CallbackURL.create();
cb.baseURL = baseURL;
cb.addParameter("key", key);
cb.addParameter("repo", repo);
cb.addParameter("path", path);
cb.addParameter("text", draft.content);

var success = cb.open();

if (success) {
	console.log("Script saved to Working Copy");
}
else {
	if (cb.status == "cancel") {
		context.cancel();
	}	
	else {
		context.fail();
	}
}