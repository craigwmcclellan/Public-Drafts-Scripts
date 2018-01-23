// Work with Airtable API to POST notes to student files

// Set API Key
var APIKey = ""; // Enter API Key between quotation marks

// Setup Airtable API and Content
var endpoint = "https://api.airtable.com/v0/";
var base = ""; //Enter base ID between quotations marks

function dateToday() {
	var d = new Date();
	var m = d.getMonth() + 1;
	var month = m.toString()
	var day = d.getDate();
	var dayStr = day.toString();
	var y = d.getFullYear();
	var year = y.toString();
	
	var fullDate = year + "-" + month + "-" + dayStr;
	return fullDate
}

var today = dateToday();

// Get student or lesson names from Airtable base.
function airtableGet(table) {
	var http = HTTP.create();
	var response = http.request({
	"url": endpoint + base +"/" + table,
	"method": "GET",
	"headers": {
		"Authorization": "Bearer " + APIKey
		}
	});
	if (response.success) {
		var rawJSON = response.responseText;
		return rawJSON
	}
	else {
		console.log(response.statusCode);
		console.log(response.error);
	}
}
// Function to post data to Airtable Base

function airtablePost(date, studentID, lessonID) {
	var draft = editor.getText()
	var d = {"fields": {
			"Date": date,
			"Notes": draft,
			"Student": studentID,
			"Lesson": lessonID
		}
	}
	var http = HTTP.create();
	var response = http.request({
	"url": endpoint + base +"/Notes",
	"method": "POST",
	"headers": {
		"Authorization": "Bearer " + APIKey,
		"Content-type": "application/json"
	},
	"data": JSON.stringify(d)
	});
	if (response.success) {
		var rawJSON = response.responseText;
		return rawJSON
	}
	else {
		console.log(response.statusCode);
		console.log(response.error);
	}
}
// Process raw JSON data to get entry ID and name for prompts.

function namesFromJSON(table, entryNameField) { // entryNameField will be either "Student Name" or "Text"
	var promptIDs = {}
	var promptList = []
	var fullList = airtableGet(table);
	var obj = JSON.parse(fullList);
	var objLength = obj.records.length;
	for (var i = 0; i < objLength; i++) {
		var id = obj['records'][i]['id'];
		var itemName = obj['records'][i]['fields'][entryNameField]
		promptList.push(itemName)
		promptIDs[itemName] = id
	}
	var p = Prompt.create();
	var arrayLength = promptList.length;
	for (var i = 0; i < arrayLength; i++) {
		p.addButton(promptList[i])
	}
	var didSelect = p.show();
	var selection = p.buttonPressed;
	var selectedID = promptIDs[selection]
	return selectedID
}



var studentID = namesFromJSON("Students", "Student Name");
var lessonID = namesFromJSON("Lessons", "Text");
airtablePost(today, studentID, lessonID);