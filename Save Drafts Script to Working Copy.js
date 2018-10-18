// Save Drafts Script to Working Copy

var credential = Credential.create("Working Copy", "Working Copy Git Client for iOS");

credential.addTextField("urlKey", "Working Copy URL Key");
credential.addTextField("scriptsRepo", "Scripts Repo");

credential.authorize();

var key = credential.getValue("urlKey");
var repo = credential.getValue("scriptsRepo");
var safeTitle = draft.processTemplate("[[safe_title]]");
var path = safeTitle + ".js";

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