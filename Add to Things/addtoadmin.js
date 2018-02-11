// This script utilizes the new URL scheme and automation available in Things 3.4 and above to add todos to a specific project and heading in Things.

// to get your project ID, in Things, open the project, select share, and select yet sharing URL.

// type your own Headings below.

var projectID = "7ABD3766-1819-45E2-BE2F-69A82BBC2B52";
var headings = ["Planning", "Grading", "None"];


// Split lines of current draft to make them into individual todos
var lines = draft.content.split("\n");

// Uses the headings listed in the variable headings (above) to make a Prompt to allow you to choose a heading for your Todos.

function headingChooser() {
	var p = Prompt.create();
	p.title = "Heading?"
	var arrayLength = headings.length;
	for (var i = 0; i < arrayLength; i++) {
		p.addButton(headings[i]);
	}
	var didSelect = p.show();
	var selection = p.buttonPressed
	console.log(selection)
	if (selection == "None") {
		return ""
	}
	else {
		return selection
	}

}

// Create a list of todos from the separated Draft lines and add them to the project whose ID is listed above.

function todoList(heading) {
	var todoArray = [];
	for (var line of lines) {
		var todo = TJSTodo.create();
		todo.title = line;
		todo.listID = projectID;
		todo.heading = heading;
		todoArray.push(todo)
	}
	return todoArray
}

// Run previously created functions so data can be sent to Things
var head = headingChooser();
var todos = todoList(head);

// Create Things JSON container to send todos.
var container = TJSContainer.create(todos);

// Create callback URL object to send data to Things
var cb = CallbackURL.create();
cb.baseURL = container.url;
var success = cb.open();
if (success) {
	console.log("Tasks added to Things");
}
else {
	context.fail();
}