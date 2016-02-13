/*
 * This javascript file will handle the use of FHIR requests
 */

//Returns an XML document for the url
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

//Finds all observations for patient via ID
//Returns array of observations
function searchObservationsPatientID(url,patientID)
{
    var entry = getJSON(url+"/Observation/_search?patient="+patientID).entry;
    var output = [];
    if(entry != null)
    {
        for(i = 0; i < entry.length; i++)
        {
            output.push(entry[i].resource);
        }
        return output;
    }
    return null
}