// A node without any data about the costs
class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    // checks if the other point is the same point
    // NOTE: two points can be identical if their parents are different and/or have different costs, this is to check if they occupy the same location
    identical(other) {
        // the two points are in the same spot, their other values must be the same as well as the math should work out the same
        return this.x==other.x && this.y==other.y;
    }
}

// a node is a location that can be traveled to
// (these will be placed apon a grid in this demo)
class Node extends Point{
    constructor(parent,x,y) {
        super(x,y);
        this.parent = parent;
        this.g = Math.sqrt(Math.pow(this.x - parent.x, 2) + Math.pow(this.y - parent.y, 2)); // g cost: cost from start
        this.h = this.hueuristic();
        this.f = this.g + this.h; // f cost: sum of g and h costs
    }

    // h cost (hueristic function): cost to the goal
    hueuristic() {
        return Math.sqrt(Math.pow(this.x - goal.x, 2) + Math.pow(this.y - goal.y, 2));
    }

    // return an array of the neighbors of this node who's parent is also this node
    // (a neighbor in this demo is any nodes adjacent or diagonal to the original node)
    nodeNeighbours() {
        var neighbours = [];

        // a neighbor can have a change of -1 to 1 in the x and y direction (but can't have 0 change in both, see below)
        for (var dy=-1; dy<=1; dy++) {
            for (var dx=-1; dx<=1; dx++) {
                if (y==0&&x==0) continue; // if the change in both directions is 0, then the point must be itself and therefor not its neighbor

                neighbours.push(new Node(this, this.x+dx, this.y+dy));
            }
        }

        return neighbours;
    }

    // force open makes the node open if it isn't already and if it is open, makes sure it is the lowest f cost node
    forceOpen() {
        var index = -1;

        // this algorithm will find the node in the open list...
        for (var i=0; i<openList.length; i++) {
            // there should only be one node in the open list so if it is found then the loop can be stopped
            if (this.identical(openList[i])) {
                index = i;
                break;
            }
        }

        // if this node has a lower cost than the one in the open list, it will be replaced
        if (index>-1 && this.f < openList[index].f) {
            openList.splice(index,1); // remove the higher f cost node
            this.insertOpen();
        }

        // if the node is not in the open list, put it in the list
        else if (index=-1) {
            this.insertOpen();
        }
    }

    // adds this node to the open list (and maintains the open list's order of greatest to least f cost)
    insertOpen() {
        // this algorithm add this node to the open list so that the open list stays sorted from greatest to least
        for (var i=0; i<openList.length; i++) {
            // if the f cost of this is greater than that of the current node, this belongs in the current node's spot 
            if (this.f > openList[i].f) {
                openList.splice(i,0,this);
                return;
            }
        }
        // if the item does not come before anything, it is put on the end
        openList.push(this);
    }


    // checks if this node has a smaller f cost than

    // checks if the node can be traversed to or if it may not be
    traversable() {
        // if the node is any obstacle, it may not be traversed to
        for (var i=0; i<obstacles.length; i++) {
            if (this.identical(obstacles[i])) return false;
        }

        // if the node is not an obstacle, it may be traversed
        return true;
    }

    // checks if the node is opened
    opened() {
        // if the node is inside of the open list, it is open
        for (var i=0; i<openList.length; i++) {
            if (this.identical(openList[i])) return true;
        }

        // if the node is not inside of the open list, it is not open
        return false;
    }

    // checks if the node is closed
    closed() {
        // if the node is inside of the closedList list, it is closed
        for (var i=0; i<closedList.length; i++) {
            if (this.identical(closedList[i])) return true;
        }

        // if the node is not inside of the closed list, it is not closed
        return false;
    }
}

// the start node lacks a parent and has a g cost of 0 (because it is the start node)
class Start extends Node{
    constructor(x,y) {
        super(new Point(x,y), x, y);
        this.parent = null;
        this.g = 0; // g cost: has no cost as it is the start
        this.f = this.g + this.h; // f cost: sum of g and h costs
    }
}


var goal = new Point(10,10);
var start = new Start(5,5);

var obstacles = [

];


var openList = [];
var closedList = [];
// traversable list here
openList.push(start);
// closed.push(null);closed.pop(null); // force the array to type to an array and not transform into false (because I-don't-know why)

function AStar() {
    while (true) {
        if (openList.length === 0) return false;

        // the open array is sorted from larges f cost to lowest
        // so getting the lowest f cost is as simple as popping it off the array
        var current = openList.pop();

        closedList.push(current);

        if (current.identical(goal)) { // The path has been found
            console.log(current);
            console.log("A* done");
            return true;
        };


        var neighbours = current.nodeNeighbours();

        // with each neighbor of the node in question...
        for (var i=0; i < neighbours.length; i++) {
            neighbour = neighbours[i];

            // if the node can not be traveled to or is already closed then it does not need to be checked
            if (!neighbour.traversable() || neighbour.closed()) continue;

            neighbour.forceOpen();
        }
    }
}