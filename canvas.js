var grid_y = 25;
var grid_x = 25;

// enum to keep track of the circle types and their colors
const CircleType = {
    START: "BLUE",
    END: "YELLOW",
    PATH: "CYAN",
    CHECK: "GREEN",
    CHECKED: "RED"
};
// string to keep track of the grid and wall colors
const GridColor = "BLACK";

// this event occurs when the page is loaded
window.addEventListener("load", () => {
    console.log("Start canvas");

    // gets the canvas item from the html and assigns it to the canvas variable
    const canvas = document.querySelector("#canvas");

    // set proper canvas dimensions
    // this is so the canvas takes up the size of the window
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    // NOTE: this has a bug creating the canvas slightly larger than the size of the window causing scroll bars to appear

    draw(canvas);
    
});

// this event occurs when the canvas is resized
window.addEventListener("resize", () => {
    console.log("Resize canvas");

    // resize canvas dimensions to be the window's dimensions
    // this is so when the window is resized, the canvas is also resized
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    draw(canvas);
});

var drawAstar = function (canvas, ctx) {};

// draws contents of the canvas
function draw(canvas) {

    // the contents of the canvas are the grid in the back and all items from the A star function
    
    // context means 2d or 3d
    // context is also the tool that draws
    const ctx = canvas.getContext('2d');

    console.log("Draw");

    tileBack(canvas, ctx, grid_x, grid_y);

    drawAstar(canvas, ctx);

}

// Put stroked rectangles in the background
// rectHeight is the height of the rectangles
// rectWidth is the width of the rectangles
function tileBack(canvas, ctx, rectHeight, rectWidth) {

    ctx.strokeStyle = GridColor;

    // y and x are the number of rectangles that can fit on the canvas
    // total = number of * length per
    // therefore
    // number of = total / length per
    y = canvas.height / rectHeight;
    x = canvas.width / rectWidth;

    console.log("Tile rectangles: x "+ x + " y " + y);

    // iterate through each location a rectangle can go
    // -1 is to keep the rectangles on the canvas as there is an issue where they go over without 1 less iteration
    // (ix and iy are just iterative variables to keep track of the position of the current rectngle on the grid)
    for (var ix=0; ix<x-1; ix++) {
        for (var iy=0; iy<y-1; iy++) {
            // a rectangle is drawn from the upper right so
            // its x value must be a rectangle width to the right for each rectangle on it's left
            // its y value must be a rectangle height down for each rectangle above it
            // the width and height are defined at the top of the file and are constants
            ctx.strokeRect(rectWidth*ix, rectHeight*iy, rectWidth, rectHeight);
        }
    }

};

// put a type of circle on the grid
// color is the color of the circle (this will be a type for the A star circles)
// gx is an x value on the grid
// gy is a y value on the grid
function gridCircle(canvas, ctx, color, gx, gy) {

    console.log("Grid circle: color " + color + " gx " + gx + " gy " + gy);

    ctx.strokeStyle = color; // because type holds the string of the color, it can just be set here

    // a circle is drawn by creating a closed path and filling it

    ctx.beginPath();
    // the center of the arc is the center of the grid tile, so it is .5 of a gridspace over (in the x and y)
    // the radius of the arc is a minimum of the smallest "unit vector" of the grid and half of it
    //      this is so no matter the irregularity in the two, the circle stays within the rectange
    // the start angle is 0 and end angle is 2 pi (a whole circle)
    // and the circle goes clockwise, so the counterclockwise variable is false
    ctx.arc((gx+0.5)*grid_x, (gy+0.5)*grid_y, Math.min(grid_x, grid_y)/2, 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fill();

}