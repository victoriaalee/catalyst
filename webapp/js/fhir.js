/*
 * This javascript file will handle the use of FHIR requests
 */

function get(url)
{
	var req = new XMLHttpRequest();
	req.open("GET", url, false);
	req.send();
	if(req.readyState == 4 && req.status == "200")
	{
		var string = req.responseText;
		var jason= JSON.parse(string);
		return jason;
	}
	else
	{
		alert("Not found!");
	}
}
//Returns an JSON document for the url
function getJSON(url)
{
	url += "&_format=json";
	var req = new XMLHttpRequest();
	req.open("GET", url, false);
	req.send();
	if(req.readyState == 4 && req.status == "200")
	{
		var string = req.responseText;
		var jason= JSON.parse(string);
		return jason;
	}
	else
	{
		alert("Not found!");
	}
};

//Finds patient via ID 
//Returns patient resource JSON object
function searchPatientID(url,patientID)
{
	var entry = getJSON(url+"/Patient/_search?_id="+patientID).entry;
	if(entry != null)
	{
		if(entry[0] != null)
			return entry[0].resource;
	}
	return null
};

function retrieveReference(url,reference)
{
	var resource = get(url+"/" + reference + "?_format=json");
	if(resource != null)
	{
		return resource;
	}
	return null
}

//Generic search
function retrieveResource(url,resource,id)
{
	var resource = getJSON(url+"/" + resource + "/"+id);
	if(resource != null)
	{
		return resource;
	}
	return null
}

//Finds based on resource and patientID
function searchResourcePatientID(url,resource,patientID)
{
	var entry = getJSON(url+"/" + resource + "/_search?patient="+patientID).entry;
	var output = [];
	if(entry != null)
	{
		for(i = 0; i < entry.length; i++)
		{
			output.push(entry[i].resource);
		}
		return output;
	}
	return null;
}

//Same as above, but using patient resource JSON object
function searchResourcePatient(url,resource,patient)
{
	return searchResourcePatientID(url,resource,patient.id);
}

function filter(jsonData,content,query) {
	results = new Set();
	exclude = new Set();
	query = query.toLowerCase();
	queryArray = query.split(", ");

	for (j = 0; j < queryArray.length; j++) {
		if (queryArray[j].indexOf("&") != -1) {
			newQuery = queryArray[j].split(" & ");
			results = containsWord(jsonData,content,newQuery,results);
		} else if (query[j].charAt(0) == '-') {
			newQuery = queryArray[j].substring(1);
			exclude = containsWord(jsonData,content,newQuery,exclude);
		}
		else {
			results = containsWord(jsonData,content,queryArray[j],results);
		}
	}
	var resultsArr = Array.from(results);
	var excludeArr = Array.from(exclude);
	return resultsArr.filter( function(el) { return excludeArr.indexOf(resultsArr) < 0; } );		// remove nots
}

function containsWord(jsonData,content,query,results) {
	for (i = 0; i < jsonData.length; i++) {
		tmp = true;
		for (j = 0; j < query.length; j++) {
			pattern = new RegExp(query[j]);
			if (!pattern.test(content[i].toLowerCase())) {
				tmp = false;
				break;
			}
		}
		if (tmp) {
			results.add(jsonData[i]);
		}
	}

	return results;
}

//Will generate a content string of words
//<></>   delimits the resourcetype
//<!></!> delimits important
//<#></#> delimits ID
//<@></@> delimits less important
//<%> - </%> delimits time or time range

function generateContent(jason)
{
	if(jason == null || jason == undefined)
	{
		return "";
	}
	var type = jason.resourceType;
	var output = inType(jason.ResourceType);
	switch(type)
	{
	case "Observation":
		var title = jason.code.coding[0].display;
		var content = jason.text.div;
		var date = jason.effectiveDateTime;
		output += concat(inEmphasis(title));
		output += concat(inNormal(content));
		output += concat(inTime(getDate(date)));
		break;
	case "Encounter":
		var loc = retrieveReference(url,jason.location[0].location.reference);
		var title = loc.name;
		var content = jason.class;
		if(jason.period == undefined)
		{
			var date = "";
		}
		else
		{
			var start = getDate(jason.period.start);
			var end = getDate(jason.period.end);
			var date = start + " - " + end;
		}
		output += concat(inEmphasis(title));
		output += concat(inNormal(content));
		output += concat(inTime(date));
		break;
	case "AllergyIntolerance":
		var display = jason.substance.coding[0].display;
		output += concat(inEmphasis(display));
		break;
	case "Condition":
		output += concat(inEmphasis( jason.code.coding[0].display + ": " + jason.severity.coding[0].display));
		output += concat(inNormal(jason.text.div));
		break;
	}
	return output;
}

function concat(input)
{
	if(input == undefined)
		return "";
	return input;
}

function getDate(input)
{
	if(input == undefined || input == null)
		return "";
	var inputEnd = input.indexOf("T");
	var inputOut = input.substring(0,inputEnd);
	return inputOut;
}

function inType(input) { return ("<T>" + input + "</T>");}
function inEmphasis(input) { return ("<e>" + input + "</e>");}
function inID(input) { return ("<i>" + input + "</i>");}
function inNormal(input) { return ("<n>" + input + "</n>");}
function inTime(input) { return ("<t>" + input + "</t>");}
