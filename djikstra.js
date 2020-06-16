function BinaryHeap(valueFunction) {
	this.valueFunction = valueFunction;
	this.heap = [];
};
BinaryHeap.prototype = {
	insert: function(node) {
		this.heap.push(node);
		this.bubbleUp(this.heap.length - 1);
	},
	pop: function() {
		var rootNode = this.heap[0];
		var lastNode = this.heap.pop();
		if (this.heap.length > 0) {
			this.heap[0] = lastNode;
			this.bubbleDown(0);
		};
		return rootNode;
	},
	update: function(nodeName, newValue) {
		var length = this.heap.length;
		for (var i = 0; i < length; i++) {
			if (this.heap[i][0] === nodeName) {
				var oldValue = this.heap[i][1];
				if (parseInt(newValue) < oldValue) {
					this.heap[i][1] = newValue;
					this.bubbleUp(i);
					this.bubbleDown(i);
					break;
				};
			};
		};
	},
	size: function() { return this.heap.length },
	bubbleUp: function(node) {
		var nodeElement = this.heap[node];
		var nodeValue = this.valueFunction(nodeElement);

		while (node > 0) {
			var parentNodeIndex = Math.floor((node + 1) / 2) - 1;
			var parentElement = this.heap[parentNodeIndex];
			var parentValue = this.valueFunction(parentElement);
			if (nodeValue < parentValue) {
				this.heap[parentNodeIndex] = nodeElement;
				this.heap[node] = parentElement;
				node = parentNodeIndex;
			} else {
				break;
			};
		};
	},
	bubbleDown: function(node) {
		while (true) {
			var nodeElement = this.heap[node];
			var nodeValue = this.valueFunction(nodeElement);
			var swap = undefined;
			var childNodeRIndex = ((node + 1) * 2);
			var childNodeLIndex = childNodeRIndex - 1;

			if (childNodeRIndex < this.heap.length) {
				var childElementR = this.heap[childNodeRIndex];
				var childNodeRValue = this.valueFunction(childElementR);
				if (childNodeRValue < nodeValue)
					swap = childNodeRIndex;
			};

			if (childNodeLIndex < this.heap.length) {
				var childElementL = this.heap[childNodeLIndex];
				var childNodeLValue = this.valueFunction(childElementL);
				if (childNodeLValue < nodeValue &&
					childNodeRIndex < this.heap.length &&
					childNodeLValue < this.valueFunction(this.heap[childNodeRIndex])) {
					swap = childNodeLIndex;
				};
			};

			if (swap === undefined) break;
			this.heap[node] = this.heap[swap];
			this.heap[swap] = nodeElement;
			node = swap;
		};
	}
};

function Dijkstra(graph, start, end) {
	this.graph = graph;
	this.start = start;
	this.end = end;
	this.distances = {};
	this.binaryHeap = new BinaryHeap(function(vertex) {
		return vertex[1];
	});
	this.path = [];
	for (var vertex in this.graph) {
		vertex === this.start ? this.binaryHeap.insert([vertex, 0]) :
			this.binaryHeap.insert([vertex, Infinity]);
	};

	while (this.binaryHeap.size() > 0) {
		var currentVertex = this.binaryHeap.pop();
		this.distances[currentVertex[0]] = currentVertex[1];
		if (currentVertex[0] === this.end) break;
		for (var currentEdge in this.graph[currentVertex[0]]) {
			var newDistance = currentVertex[1] + this.graph[currentVertex[0]][currentEdge];
			this.binaryHeap.update(currentEdge, newDistance);
		};
	};
};
Dijkstra.prototype.getPath = function() {
	if (this.end != undefined &&
		this.distances[this.end] != Infinity) {
		this.path.push(this.end);
		while (true) {
			var last = this.path[this.path.length - 1];
			if (last === this.start) break;
			var smallestNode, smallestValue = Infinity;
			for (var edge in this.graph[last]) {
				if (this.distances[edge] < smallestValue) {
					smallestValue = this.distances[edge];
					smallestNode = edge;
				};
			};
			this.path.push(smallestNode);
		};
		return this.path;
	};
	return false;
};

var graph = {
    "A": {"B": 2, "C": 1, "D": 3},
    "B": {"A": 2},
    "C": {"A": 1, "I": 2},
    "D": {"A": 3, "F": 2, "E": 3},
    "E": {"D": 3, "G": 3},
    "F": {"D": 2, "G": 4},
    "G": {"E": 3, "F": 4, "H": 5},
    "H": {"G": 5, "I": 3},
    "I": {"C": 2, "J": 1, "H": 3},
    "J": {"I": 1, "K": 3},
    "K": {"J": 3}
}
var dj = new Dijkstra(graph, "K", "B");
console.log(dj.getPath())