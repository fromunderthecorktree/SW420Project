// 1,2;2,3;2,4;4,2;4,6;4,7;3,5;6,5;7,5



var Node = function (reach, number, isFirstNode, isLastNode){
	this.reach = reach;
	this.number = number;
	this.isFirstNode = isFirstNode;
	this.isLastNode = isLastNode;
}
var Edge = function(sourceNode, destNode){
    this.sourceNode = sourceNode;
    this.destNode = destNode;
}

var EdgePair= function (source, intermediate, dest){
    this.sourceNode = source;
    this.intermediateNode = intermediate;
    this.destNode = dest;
}

function runSubmit(){
	var x = initNodes();
	var y = initEdges(); // get edgepairs
	printNodeList(x);
	
	runTests(x,y)
}

function initNodes(){
	var x = createNodes();
	setStartingNodes(x);
	setEndingNodes(x);
	setReach(x);
	return x;
}

function initEdges(){
	var list = [];
	$("#edgeTxt").val().split(";").forEach(function(entry){
		var nodes = entry.split(",");
		var e = new Edge(nodes[0],nodes[1]);
		list.push(e);
	});
	return list;
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




function runTests(list, elist){
	var edgePairList = runEdgePairCoverageRequirements(list);
	var nodeAndEdgePath = runNodeCoverage(list, elist);
	var edgepairPath = runEdgePair(list, edgePairList);	
	//runEdgeCoverage(list);
	//runPrimePath(list);
	//runSimplePath(list);
}

function runEdgePairCoverageRequirements(list){
	var edgePairList = []
	var print = "Edge Pair Test Requirements <br />";
	list.forEach(function(entry){
		var firstNodeInPair = entry.number;		
		entry.reach.forEach(function(entity){
			var secondNodeInPair = entity.number;
			entity.reach.forEach(function(end){
				var lastNodeInPair = end.number;
				edgePairList.push(new EdgePair(firstNodeInPair , secondNodeInPair , lastNodeInPair) );
		print+=firstNodeInPair + ", " +secondNodeInPair +", " +lastNodeInPair + "<br />";
			});
		});		
	});	
	
	
	$("#nodeTable").append(print);
	
	return edgePairList;
}





function runNodeCoverage(list, elist){
	var allTests = startCheckAllTests(list, elist);
	allTests.forEach(function(entry){
		console.log(entry);	
	});
	
	var print = "Node and Edge Test Paths <br />";
	
	allTests.forEach(function (entry){
		entry.forEach(function(entity){
			print+= entity.number + ", "
		});
		print += "<br />"
	});
	
	
	
	$("#nodeTable").append(print);
	
	
	
	
	
	
	
	// allTests.forEach(function(entity){
	// 	printNodeList(entity);
	// });
	return allTests;
}


//////////////////////////////////////////
function startCheckAllTests(list, elist){
	var allTests = [[]];
	
	
	var startingNodes = findstartNodes (list);
	for(var i = 0; i<startingNodes.length; i++ ){
		allTests[i].push(startingNodes[i]);
	}
		//get all of the possible starting positions
	
	//find all of the possible next nodes
	var allTests = checkAllTests(allTests, list, elist);
	
	return allTests;
	
}



function checkAllTests(allTests, list, elist){
	
	for(var i = 0; i < allTests.length; i++){
	var goodNodes = []

		do{
			goodNodes = findNextNodeOnASingleTest(allTests[i], list, elist);
			
			console.log ("misc info: Current loop: [" + i + "]; total arrays: ["+allTests.length+"]; good Nodes: [" + goodNodes.length +"];");
			
			console.log (goodNodes);
			console.log(allTests);
			
			
			//if it has more than one, we ignore the first good node, we copy the row, and add the last element
			for (var j = 1 ; j< goodNodes.length; j++){
				// var newCopy = (Array) jQuery.extend(true, {}, allTests[i]);
				var newCopy = allTests[i].slice(0);
				allTests.push(newCopy);//copy new test over
				console.log("before extra push");
					console.log(allTests);
				
				allTests[allTests.length-1].push( goodNodes[j]);//add last element
				console.log("after extra push" +allTests);
			}
			
			//If it has anything, put the first one in place
			if (goodNodes.length >0){
				allTests[i].push(goodNodes[0]);
			}
			
			console.log(allTests);
			
			allTests.forEach(function(entry){
				console.log(allTests);
			});
			
			
		}while(goodNodes.length > 0);
	}
	return allTests;
}


function findNextNodeOnASingleTest(currTest, list, elist){
	var newestNode = currTest[currTest.length-1];
	if (newestNode.isLastNode){
		return []
	}
	var possibleElists = filterEList(newestNode, elist);
	var goodNodesNumbers = filterPossibleIfDoneAlready(currTest, possibleElists, list);
	return goodNodesNumbers;
}


function findstartNodes(list){
	var startingNodes = [];
	for (var i = 1; i< list.length; i++){
		if( list[i].isFirstNode){
			startingNodes.push(list[i]);
		}
	}
	return startingNodes;
	
}


function filterEList(node, elist){
	var possibleElists = [];
	for (var i = 0; i< elist.length; i++){
		if (elist[i].sourceNode === node.number){// is that how that works
			possibleElists.push(elist[i]);
		}
	}
	return possibleElists;
}


function filterPossibleIfDoneAlready(currTest, possibleElists, list){
	var finalELists = possibleElists;
	for (var k = 0; k< possibleElists.length; k++){
		
			for(var i = 1; i<currTest.length; i++){
				if (currTest [i-1].number === possibleElists[k].sourceNode && currTest[i].number === possibleElists[k].destNode ){
					finalELists.splice(k,1);
					break;
				}
			}
	
	}
	
	return getGoodNodes(finalELists, list);
	
	
}



function getGoodNodes (finalELists,list){
	var goodNodes = [];
	finalELists.forEach(function (entity){
			goodNodes.push(list[entity.destNode]);	
	});

	return goodNodes;
	
	
}









function runEdgePair(list, elist){
		var allTests = startCheckAllTests2(list, elist);
		
		endTests = unique(allTests);
		
		console.log(endTests);

		var print = "Edge Pair Coverage <br />";
		
		
		for (var key in endTests){
			print += key + "<br />"
		}
		
	
	
	
	$("#edgepairCPath").append(print);


	// endTests.forEach(function(entity){
	// 	console.log(entity);
	// });
	return endTests;
}





//////////////////////////////////////////////////////////////
function startCheckAllTests2(list, elist){
	var allTests = [[]];
	
	
	var startingNodes = findstartNodes2 (list);
	for(var i = 0; i<startingNodes.length; i++ ){
		allTests[i].push(startingNodes[i]);
	}
		//get all of the possible starting positions
	
	//find all of the possible next nodes
	var allTests = checkAllTests2(allTests, list, elist);
	
	return allTests;
	
}



function checkAllTests2(allTests, list, elist){
	
	for(var i = 0; i < allTests.length; i++){
	var goodNodes = []

		do{
			goodNodes = findNextNodeOnASingleTest2(allTests[i], list, elist);
			
			console.log ("misc info: Current loop: [" + i + "]; total arrays: ["+allTests.length+"]; good Nodes: [" + goodNodes.length +"];");
			
			console.log (goodNodes);
			console.log(allTests);
			
			
			//if it has more than one, we ignore the first good node, we copy the row, and add the last element
			for (var j = 1 ; j< goodNodes.length; j++){
				// var newCopy = (Array) jQuery.extend(true, {}, allTests[i]);
				var newCopy = allTests[i].slice(0);
				allTests.push(newCopy);//copy new test over
				console.log("before extra push");
					console.log(allTests);
				
				allTests[allTests.length-1].push( goodNodes[j]);//add last element
				console.log("after extra push" +allTests);
			}
			
			//If it has anything, put the first one in place
			if (goodNodes.length >0){
				allTests[i].push(goodNodes[0]);
			}
			
			console.log(allTests);
			
			allTests.forEach(function(entry){
				console.log(allTests);
			});
			
			
		}while(goodNodes.length > 0);
	}
	return allTests;
}


function findNextNodeOnASingleTest2(currTest, list, elist){
	var newestNode = currTest[currTest.length-1];
	if (newestNode.isLastNode){
		return []
	}
	var possibleElists = filterEList2(newestNode, elist, (currTest.length <3));
	var goodNodesNumbers = filterPossibleIfDoneAlready2(currTest, possibleElists, list);
	return goodNodesNumbers;
}


function findstartNodes2(list){
	var startingNodes = [];
	for (var i = 1; i< list.length; i++){
		if( list[i].isFirstNode){
			startingNodes.push(list[i]);
		}
	}
	return startingNodes;
	
}


function filterEList2(node, elist, isFirst){
	var possibleElists = [];
	for (var i = 0; i< elist.length; i++){
		if (isFirst){
			if (elist[i].sourceNode === node.number){// is that how that works
				possibleElists.push(elist[i]);
			}
		}else{
			
			if (elist[i].intermediateNode === node.number){// is that how that works
				possibleElists.push(elist[i]);
			}
		}
	}
	return possibleElists;
}


var isSecondGo

function filterPossibleIfDoneAlready2(currTest, possibleElists, list){
	var finalELists = possibleElists;
	for (var k = 0; k< possibleElists.length; k++){
		isSecondGo = true;
			for(var i = 2; i<currTest.length; i++){
				isSecondGo = false
				if (currTest [i-2].number === possibleElists[k].sourceNode &&     currTest [i-1].number === possibleElists[k].intermediateNode      && currTest[i].number === possibleElists[k].destNode ){///
					finalELists.splice(k,1);
					break;
				}
			}
	
	}
	
	return getGoodNodes2(finalELists, list);
	
	
}



function getGoodNodes2 (finalELists,list){
	var goodNodes = [];
	finalELists.forEach(function (entity){
		if(!isSecondGo){	
			goodNodes.push(list[entity.destNode]);	///
		}else{
			goodNodes.push(list[entity.intermediateNode]);
		}
	});

	return goodNodes;
	
	
}











function unique (list) {
	var uniqueList = [];
	list.forEach(function(entry){
		var hash = "";
		entry.forEach(function(entity){
			hash+=entity.number+",";
		});
		uniqueList [hash] =entry; 
	});
	return uniqueList;
}