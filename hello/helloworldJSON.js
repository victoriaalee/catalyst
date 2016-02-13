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
        var jason= JSON.parse(string);
        return jason;
    }
    else
    {
        alert("Not found!");
    }
};
