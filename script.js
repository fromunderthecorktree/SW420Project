var Node = function (reach, number, isFirstNode, isLastNode){
	this.reach = reach;
	this.number = number;
	this.isFirstNode = isFirstNode;
	this.isLastNode = isLastNode;
}

function runSubmit(){
	var x = initNodes();
	printNodeList(x);
}

function initNodes(){
	var x = createNodes();
	setStartingNodes(x);
	setEndingNodes(x);
	setReach(x);
	return x;
}

function createNodes(){
	var list = [];
	$("#nodesTxt").val().split(",").forEach(function(entry){
		list[entry] = new Node([], entry, false, false);
	});
	return list;
}

function setStartingNodes(list){
	$("#startTxt").val().split(",").forEach(function(entry){
		list[entry].isFirstNode = true;
	});
}

function setEndingNodes(list){
	$("#endTxt").val().split(",").forEach(function(entry){
		list[entry].isLastNode = true;
	});
}

function setReach(list){
	$("#edgeTxt").val().split(";").forEach(function(entry){
		var nodes = entry.split(",");
		list[nodes[0]].reach.push(list[nodes[1]]);
	});
}

function printNodeList(list){
	var rows = "";
	list.forEach(function(entry){
		var reach = [];
		for(var i = 0; i < entry.reach.length; i++){
			reach.push(entry.reach[i].number);
		}
		rows += 
		"<tr>" + 
			"<td>" + entry.number + "</td>" + 
			"<td>" + reach.toString() + "</td>" + 
			"<td>" + entry.isFirstNode + "</td>" + 
			"<td>" + entry.isLastNode + "</td>" +
		"</tr>" 
	});
	$("#nodeTable").css( "visibility","visible");
	$("#nodeTable tbody").append(rows);
	
}