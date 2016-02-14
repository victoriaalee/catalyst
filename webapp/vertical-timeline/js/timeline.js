/*
<div class="cd-timeline-block">
	<div class="cd-timeline-img cd-picture">
		<img src="vertical-timeline/img/cd-icon-picture.svg" alt="Picture">
	</div> <!-- cd-timeline-img -->

	<div class="cd-timeline-content">
		<h2>Title of section 1</h2>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde? Iste voluptatibus minus veritatis qui ut.</p>
		<a href="#0" class="cd-read-more">Read more</a>
		<span class="cd-date">Jan 14</span>
	</div> <!-- cd-timeline-content -->
</div> <!-- cd-timeline-block -->
*/

//Returns a div block to add to the timeline
function generateBlock(titleString,contentString,dateString)
{
	titleString = titleString==undefined?"":titleString;
	contentString = contentString==undefined?"":contentString;
	dateString = dateString==undefined?"":dateString;
	//imageSrc = imageSrc==undefined?"":imageSrc;
	
	var blockDiv = document.createElement("div");
	var imgDiv = document.createElement("div");
	var contentDiv = document.createElement("div");
	var img = document.createElement("img")
	var title = document.createElement("h2");
	var content = document.createElement("p");
	var date = document.createElement("span");

	blockDiv.className = "cd-timeline-block";
	imgDiv.className = "cd-timeline-img cd-picture";
	contentDiv.className = "cd-timeline-content";
	//img.src = imageSrc;
	//img.alt = "";
	date.className = "cd-date";
	title.innerHTML = titleString;
	content.innerHTML = contentString;
	//title.innerHTML = (titleString.charAt(0).toUpperCase() + titleString.substring(1));
	//content.innerHTML = (contentString.charAt(0).toUpperCase() + contentString.substring(1));
	date.innerHTML = dateString;

	imgDiv.appendChild(img);
	contentDiv.appendChild(title);
	contentDiv.appendChild(content);
	contentDiv.appendChild(date);

	blockDiv.appendChild(imgDiv);
	blockDiv.appendChild(contentDiv);

	return blockDiv;
}