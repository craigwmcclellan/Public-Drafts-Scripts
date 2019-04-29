// Post to Micro.blog Hosted Blog

var credential = Credential.create("Micro.blog", "Manton Reece's Micro.blog blogging platform");
credential.addPasswordField("craigmcclellan", "CraigMcClellan.com"); // Change to whatever your blog is called. The first item is what Drafts will use to call your token back. The second is what will display as the name of your site.

credential.authorize();
var appToken = credential.getValue("craigmcclellan"); // Replace with whatever is in the first parameter of line 4


var endpoint = "https://micro.blog/micropub"


// Gets a category list from your Micro.blog account
function getCategories() {
	var req = HTTP.create();
	var catRequest = req.request({
		"url": endpoint + "?q=category",
		"method": "GET",
		"headers": {
			"Authorization": "Bearer " + appToken
		}
	});
	
	console.log("Category Response: " + catRequest.statusCode);
	
	if (catRequest.statusCode != 200 && catRequest.statusCode != 202) {
		context.fail();
	}
	else {
		var json = JSON.parse(catRequest.responseText);
		var catArray = json.categories;
		return catArray
	}
}

// Creates the JSON Data to send to the MicroPub server based on a series of prompts
function buildRequest(categories) {
	var data = {
		"h": "entry"
	}
	
	var p = Prompt.create();
	p.title = "Micro.blog Post";
	p.message = "Select Posting Options";
	p.addSwitch("title", "Include Title With Post", false);
	
	if (categories.length > 0) {
		p.addSelect("categories", "Categories", categories, [], true);
	}
	p.addButton("Done");
	var promptResponse = p.show();
	
	if (promptResponse == false) {
		context.fail("User cancelled action");
	}
	
	var titleBool = p.fieldValues["title"];
	var categoryList = p.fieldValues["categories"];
	
	if (titleBool == true) {
		var titleObj = draft.processTemplate("[[safe_title]]");
		data.name = titleObj
		var content = draft.processTemplate("[[body]]");
		data.content = content
	 }
	 else {
	 	var content = draft.content;
	 	data.content = content
	 }
	 
	 if (categoryList) {
	 	data.category = categoryList
	 }
	 var actionData = [promptResponse, data]
	 return actionData;
}

var fullCategories = getCategories();
var dataBuild = buildRequest(fullCategories);

if (dataBuild[0] == true) {

	//create and post HTTP request
	var http = HTTP.create();
	var response = http.request({
		"url": endpoint,
		"method": "POST",
		"encoding": "form",
		"data": dataBuild[1],
		"headers": {
			"Authorization": "Bearer " + appToken
		}
	});

	console.log("Response: " + response.statusCode);

	if (response.statusCode != 200 && response.statusCode != 202) {
		context.fail();
	}
}
