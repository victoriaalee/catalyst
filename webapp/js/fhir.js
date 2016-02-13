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

	for (int j = 0; j < query.length(); j++) {
		if (query[j].indexOf("&") != -1) {
			newQuery = query[j].split(" & ");
			results = containsWord(jsonData,content,newQuery,results);
		} else if (query[j].charAt(0) == '-') {
			newQuery = query[j].substring(1);
			exclude = containsWord(jsonData,content,newQuery,exclude);
		}
		else {
			newQuery = containsWord(jsonData,content,newQuery,results);
		}
	}

	results = containsWord(jsonData,content,word,results);
	results = results.filter( function(el) { return toRemove.indexOf(exclude) < 0; } );		// remove nots
	return results;
}

function containsWord(jsonData,content,query,results) {
	for (i = 0; i < jsonData.length(); i++) {
		tmp = true;
		for (j = 0; j < query.length(); j++) {
			pattern = new RegExp(query[j]);
			if (!pattern.test(content[i]).toLowerCase()) {
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