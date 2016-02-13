/*
 * This javascript file will handle the use of FHIR requests
 */

//Returns an XML document for the url
function getXML(url)
{
    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send();
    if(req.readyState == 4 && req.status == "200")
    {
        var string = req.responseText;
        var parser = new DOMParser();
        var doc = parser.parseFromString(string,"application/xml");
        return doc;
    }
    else
    {
        alert("Not found!");
    }
};

function search()
{

};