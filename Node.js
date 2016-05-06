var reach [];
int number;
boolean isFirstNode;
boolean isLastNode;

function Node(reach, number, isFirstNode, isLastNode){
	this.reach = reach;
	this.number = number;
	this.isFirstNode = isFirstNode;
	this.isLastNode = isLastNode;
}

Node.prototype = {
	constructor: Node
};

function toString(){
	return number.toString;
}