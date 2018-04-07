// Send a post idea to Ulysses, get the URL of the post in Ulysses and save it as a task in Things 3.

const ulyssesURL = "ulysses://x-callback-url/new-sheet";
const postIdea = draft.content;
var markdownText = "# " + postIdea


// Send idea to Ulysses as a sheet with a title, then return the URL for that sheet to send to Things.
function createSheet() {
	var cb = CallbackURL.create();
	cb.baseURL = ulyssesURL;
	cb.addParameter("text", markdownText);
	// Replace the string in the second quotation marks with your group name or ID
	cb.addParameter("group", "");
	var success = cb.open();
	var response = cb.callbackResponse["targetURL"];
	return response
}

var ulyssesSheet = createSheet();


// Create a task in Things with the post idea as the task name and the Ulysses URL as a note.
var todo = TJSTodo.create();
todo.title = postIdea;
todo.notes = ulyssesSheet;
// Place your own lists and headings for the task to be added to below between quotation marks
todo.list = "";
todo.heading = "";

var container = TJSContainer.create([todo]);

var ncb = CallbackURL.create();
ncb.baseURL = container.url;
var success = ncb.open();
if (success) {
	console.log("Item added to Things");
}
else {
	context.fail();
}