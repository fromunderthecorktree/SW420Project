int sourceNode;
int destNode;
function edge(sourceNode, destNode){
    this.sourceNode = sourceNode;
    this.destNode = destNode;
}

Edge.prototype = {
    constructor: Edge
};