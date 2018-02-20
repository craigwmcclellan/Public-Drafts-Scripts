// Script uses Drafts 5's Javascript engine to integrate with Things for iOS's advanced automation functionality available in Things 3.4 and above. A new project will be created from your Draft title (the first line of the draft), and all subsequent lines will be added as to-dos in that project. You will be presented with a prompt to select an Area in Things to place the project in.

// Replace the areas below with your own personal areas. IDs can be retrieved from Things by selecting Share and Copy URL in the area you want to use.

var areaIDs = {
	"Work": "81B977B8-A0B8-4984-8619-4BB5C86F753B",
	"Personal": "995F2A03-F576-4E07-9820-A4B1B0CA1CED",
	"Worship and Arts": "0D531E7C-9129-4ADC-899E-F91EAF2C726D",
	"Blogging": "04F484A7-029E-487C-AED6-16E434038B4F"
}

// Create the prompt to select your area using the above object.

function selectArea() {
	var p = Prompt.create();
	p.title = "Area";
	p.message = "Select an Area for Your New Project";
	for (var key in areaIDs){
		if (areaIDs.hasOwnProperty(key)) {
			p.addButton(key);
		}
	}
	var didSelect = p.show()
	var response = p.buttonPressed;
	var id = areaIDs[response];
	return id
}

// Create project and Todos in the chosen area of Things

function createProject(areaID) {
	var project = TJSProject.create();
	project.title = draft.title;
	project.areaID = areaID;
	var draftBody = draft.processTemplate("[[body]]");
	var lines = draftBody.split("\n");
	for (var line of lines) {
		var lineLength = line.length;
		if (lineLength > 0) {
			var todo = TJSTodo.create();
			todo.title = line;
			project.addTodo(todo)
		}
	}
	return project
}

var area = selectArea();
var project = createProject(area);

// Use Drafts's Things integration functions to send created project to Things

var container = TJSContainer.create([project]);

var cb = CallbackURL.create();
cb.baseURL = container.url;
var success = cb.open();
if (success) {
	console.log("Project created in Things")
}
else {
	context.fail();
}