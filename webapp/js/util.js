function getCookie(cname) 
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
function setCookie(cname, cvalue) 
{
    document.cookie = cname + "=" + cvalue + "; ";
}
function setCookieExpire(cname, cvalue, exdays) 
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//returns - if date1 is before date2
//returns 0 if date1 is same as date2
//returns + if date1 is after date2
function dateCompare(date1,date2)
{
	a1 = date1.split("-");
	a2 = date2.split("-");
	var num1,num2,res;

	num1 = parseInt(a1[0]);
	num2 = parseInt(a2[0]);
	res = num1-num2;
	if(res != 0)
		return res;

	num1 = parseInt(a1[1]);
	num2 = parseInt(a2[1]);
	res = num1-num2;
	if(res != 0)
		return res;

	num1 = parseInt(a1[2]);
	num2 = parseInt(a2[2]);
	res = num1-num2;
	return res;
}