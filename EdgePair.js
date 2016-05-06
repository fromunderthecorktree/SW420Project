int sourceNode;
int intermediateNode;
int destNode;

function EdgePair(source, intermediate, dest){
    sourceNode = source;
    intermediateNode = intermediate;
    destNode = dest;
}


EdgePair.prototype = {
	constructor: EdgePair
};
