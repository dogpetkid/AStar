// A point is a location on the grid
// (The point only contains its location and color)
class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.color = "BLACK";
    }

    // checks if the other point is the same point
    // (the two points are considered identical when their locations are the same)
    identical(other) {
        return this.x==other.x && this.y==other.y;
    }

    // draws this point on the grid
    draw(canvas, ctx) {
        gridCircle(canvas, ctx, this.color, this.x, this.y);
    }
}

// A node a point with costs
// the costs will be used to run the A* algorithm
// (these will be placed apon a grid in this demo)
class Node extends Point {
    // a node has a parent, the parent is the node that preceeds this point when following the algorithm
    // (this is used to go backwards and find the path using all the ancestors of the end node)

    // A* uses 3 different costs:
    // g cost: the cost to get to this node from the start (keeps track of distance covered)
    // h cost: the heuristic, this is the value to determine how "far" a node is from the goal
    // f cost: the sum of the g and h costs

    // the node with the lowest f cost should be handed first as it goes the least distance to get the closest to the goal
    // the goal of A* is the reduce the h cost to 0 while keeping the g cost as low as possible

    constructor(parent,x,y) {
        super(x,y);
        this.parent = parent;
        this.g = parent.g + Math.sqrt(Math.pow(this.x - parent.x, 2) + Math.pow(this.y - parent.y, 2));
        this.h = this.hueuristic();
        this.f = this.g + this.h;
    }

    // hueristic function (h cost): cost to the goal
    hueuristic() {
        // This hueristic is simply the distance to the goal
        return Math.sqrt(Math.pow(this.x - goal.x, 2) + Math.pow(this.y - goal.y, 2));
    }

    // return an array of the neighbors of this node who's parent is also this node
    // (a neighbor in this demo is any nodes adjacent or diagonal to the original node)
    nodeNeighbours() {
        // note: this algorithm for generating new nodes is not efficient as it constantly is creating more nodes and requiring more space
        // note: this however has the advantage that the grid size can be "infinite" since it is capable of generating new points

        var neighbours = [];

        // all neighbouring nodes are the nodes that vary by exactly 1 in the x and/or y axis
        // this means it will be 8 surrounding nodes

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
        var index = -1; // index will be used to hold the index of this (or an indentical) node in the open list

        // this algorithm will search though all open nodes to see if this (or an identical) node exists in the list
        for (var i=0; i<openList.length; i++) {
            if (this.identical(openList[i])) {
                index = i;
                // there should only be one node in the open list so if it is found then the loop can be stopped
                break;
            }
        }

        // if this node has a lower cost than the identical one in the open list. the identical one will be replaced
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

        // search for where in the open list this node belongs
        for (var i=0; i<openList.length; i++) {
            // if the f cost of this is greater than that of the current node, this belongs in the current node's spot 
            if (this.f > openList[i].f) {
                openList.splice(i,0,this); // insert this node before the current node
                return;
            }
        }

        // if this node does not come before anything, it is put on the end
        openList.push(this);
    }

    // checks if the node can be traversed to or if it may not be
    traversable() {
        // if the node is an obstacle, it may not be traversed to
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
class Start extends Node {
    constructor(x,y) {
        // the start node needs to pass in a parent to get pass the super constructor...
        super(new Point(x,y), x, y);
        this.parent = null; // this temporary parent is then replaced with null
        this.g = 0; // g cost: has no cost as it is the start
        this.f = this.g + this.h;
        this.color = CircleType.START;
    }
}

// the end point lacks everything except a location and color
class End extends Point {
    constructor(x,y) {
        super(x, y);
        this.color = CircleType.END;
    }
}

// note: the goal needs to be created first because all the other nodes need to know the distance to the end point
var goal = new End(30,30);
var start = new Start(5,5);

// array of all points that contain an obstacle
var obstacles = [
    new Point(6,10),
    new Point(7,10),
    new Point(8,10),
    new Point(9,10),
    new Point(9,9),
    new Point(9,8),
    new Point(9,7)
];


var openList = []; // array of open nodes
var closedList = []; // array of closed nodes
var path = []; // array of nodes that make the final path

// runs the A* pathfinding algorithm to generate a path from the start node to the end point
function AStar() {
    // reset the AStar scenario so it is just the start point
    openList = [];
    closedList = [];
    openList.push(start);

    // loops for as long as the algorithm is running
    while (true) {
        if (openList.length === 0) return false; // returns false to show the command failed
        // the command fails when there are no more open nodes to check

        // the open array is sorted from largest f cost to lowest
        // so getting the lowest f cost is as simple as popping it off the array
        var current = openList.pop();

        closedList.push(current); // closes the current point because it is going to be checked

        if (current.identical(goal)) { // if the goal has been found, the path has finished
            console.log(current);
            console.log("A* done");
            break;
        };


        // create a list of neighbors to be iterated over
        var neighbours = current.nodeNeighbours();

        for (var i=0; i < neighbours.length; i++) {
            neighbour = neighbours[i];

            // if the node can not be traveled to or is already closed then it does not need to be checked
            if (!neighbour.traversable() || neighbour.closed()) continue; // so that that neighbor does not need to be checked...

            // otherwise the node needs to be opened and checked (potentially if it has a lower cost)
            neighbour.forceOpen();
        }
    }

    // to get to this point the A* must have succeeded

    // the following section breaks the path up into individual nodes in an array
    // this is done by taking the last current node (which is the goal at this point) and use it to go backwards through all of the parent
    path = [];

    // grab the end node... (which is the current node)
    var currentPath = current;
    // and for every parent of it...
    while (currentPath != null) {
        // add it to the path array...
        path.push(currentPath);
        // then get the next parent
        currentPath = currentPath.parent;
    }

    return true; // returns true to show the command worked
}

// sets the drawAstar function from the canvas.js to be the function declared below
drawAstar = drawLocalAstar;

// note:
// this is because once javascript loads a global variable in one file, another file can use the same global variable later
// a file loaded later in the html has access to all variables from the files before it
// however it does not have access to variables from the files loaded after it
// this is why Astar needs to set the draw function from canvas.js

// draws the A star items to the screen
function drawLocalAstar(canvas, ctx) {
    // draws the goal point, start node, nodes in the open, closed, obstacles, and path lists

    goal.draw(canvas, ctx);
    start.draw(canvas, ctx);
    openList.forEach(element => {
        element.color=CircleType.CHECK;
        element.draw(canvas, ctx);
    });
    closedList.forEach(element => {
        element.color=CircleType.CHECKED;
        element.draw(canvas, ctx);
    });
    obstacles.forEach(element => {
        element.color=GridColor;
        element.draw(canvas, ctx);
    });
    path.forEach(element => {
        element.color=CircleType.PATH;
        element.draw(canvas, ctx);
    });

}