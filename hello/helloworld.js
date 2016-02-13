function sayHello()
{
    alert("This is an alert window!");
}

function getREST(url)
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
