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

//An asynchronous json get, provide a handler that takes in a json object
function getAsyncJSON(url, handle)
{
	url += "&_format=json";
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.onreadystatechange = function()
	{
		if(req.readyState == 4 && req.status == "200")
		{
			var string = req.responseText;
			var jason= JSON.parse(string);
			handle(jason);
		}
		else
		{
			alert("Not found!");
		}
	}
	req.send();
}

//Extracts first patient from the json
function extractPatient(json)
{
	var entry = json.entry;
	if(entry != null)
	{
		if(entry[0] != null)
			return entry[0].resource;
	}
	return null
}
//Finds patient via ID 
//Returns patient resource JSON object
function searchPatientID(url,patientID)
{
	return extractPatient(getJSON(url+"/Patient/_search?_id="+patientID));
};
//Asynchronous: handler(patient)
function searchPatientIDAsync(url,patientID,handler)
{
	getAsyncJSON(url+"/Patient/_search?_id"+patientID,
		function(json){
			handler(extractPatient(json));
		}
	);
}

function retrieveReference(url,reference)
{
	var resource = get(url+"/" + reference + "?_format=json");
	if(resource != null)
	{
		return resource;
	}
	return null
};

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

function extractResource(json)
{
	var entry = json.entry;
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
//Finds based on resource and patientID
function searchResourcePatientID(url,resource,patientID)
{
	return extractResource(getJSON(url+"/" + resource + "/_search?patient="+patientID));
}

//Same as above, but using patient resource JSON object
function searchResourcePatient(url,resource,patient)
{
	return searchResourcePatientID(url,resource,patient.id);
}

function filterContent(jsonData,content,query) {
	if(query == "")
		return jsonData;
	cornerCase0 = false;
	results = new Set();
	exclude = new Set();
	query = query.toLowerCase();
	queryArray = query.split(", ");

	for (var j = 0; j < queryArray.length; j++) {
		if (queryArray[j].indexOf("&") != -1) {
			newQuery = queryArray[j].split(" & ");
			results = containsWord(jsonData,content,newQuery,results);
		} else if (query[j].charAt(0) == '-') {
			newQuery = [queryArray[j].substring(1)];
			exclude = containsWord(jsonData,content,newQuery,exclude);

			if (queryArray.length == 1) {
				resultsArr = jsonData;
				cornerCase0 = true;
			}
		}
		else {
			newQuery = [queryArray[j]];
			results = containsWord(jsonData,content,newQuery,results);
		}
	}
	if (!cornerCase0)
		var resultsArr = Array.from(results);
	var excludeArr = Array.from(exclude);

	return resultsArr.filter( function(el) { return excludeArr.indexOf(el) < 0; } );		// remove nots
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
	output += inID(jason.id);
	switch(type)
	{
	case "Observation":
		var title = jason.code.coding[0].display;
		var content = "";
		if(jason.valueQuantity != undefined)
		{
			content += jason.valueQuantity.value + " " + jason.valueQuantity.unit;
		}
		if(jason.component != undefined)
		{
			for(var i = 0; i < jason.component.length; i++)
			{
				content += ("<br/>" + jason.component[i].code.coding[0].display + ":");
				content += ("<br/>" + jason.component[i].valueQuantity.value + " " + jason.component[i].valueQuantity.unit);
				content += "<br/>"
			}
		}
		if(jason.valueCodeableConcept != undefined)
		{
			for(var i = 0; i < jason.valueCodeableConcept.coding.length; i++)
			{
				content += ("<br/>" + jason.valueCodeableConcept.coding[i].display);
			}
		}
		var date = jason.effectiveDateTime;
		output += concat(inEmphasis(title));
		output += concat(inNormal(content));
		output += concat(inTime(getDate(date)));
		break;
	case "Encounter":
		var loc = retrieveReference(url,jason.location[0].location.reference);
		var prac = retrieveReference(url,jason.participant[0].individual.reference);
		var org = retrieveReference(url,jason.serviceProvider.reference);
		var title = loc.name;
		var content = "";
		content += (prac.name.given[0] + " " + prac.name.family[0] + ((prac.name.suffix!=undefined)?", " + prac.name.suffix[0]:""));
		content += ("<br>" + org.name + ", " + jason.class);
		if(jason.period == undefined)
		{
			var date = "";
		}
		else
		{
			var start = getDate(jason.period.start);
			var end = getDate(jason.period.end);
			var date = start + " ~ " + end;
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
		if(jason.code.coding != undefined)
		{
			output += concat(inEmphasis( jason.clinicalStatus + ": " +jason.code.coding[0].display));
			//Get the practitioner
			var prac = retrieveReference(url,jason.asserter.reference);
			var string = jason.severity.coding[0].display;
			string += ("<br>" + prac.name.given[0] + " " + prac.name.family[0] + ((prac.name.suffix!=undefined)?", " + prac.name.suffix[0]:""));
			output += concat(inNormal(string));
		}
		else
		{
			output += concat(inEmphasis(jason.code.txt));
			output += concat(inNormal(jason.text.div));
		}
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

function fromType(input)
{
	var matches = input.match("<T>(.+?)<\/T>");
	if(matches== null)
		return null;
	return matches[0];
}
function fromEmphasis(input)
{
	var matches = input.match("<e>(.+?)<\/e>");
	if(matches == null)
		return null;
	return matches[0];
}
function fromID(input)
{
	var matches = input.match("<i>(.+?)<\/i>");
	if(matches == null)
		return null;
	return matches[0];
}function fromNormal(input)
{
	var matches = input.match("<n>(.+?)<\/n>");
	if(matches == null)
		return null;
	return matches[0];
}function fromTime(input)
{
	var matches = input.match("<t>(.+?)<\/t>");
	if(matches == null)
		return null;
	return matches[0];
}

