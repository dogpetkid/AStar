var grid_y = 25;
var grid_x = 25;
var cir_gx = 4; // grid x TEMPORARY
var cir_gy = 7; // grid y TEMPORARY

// enum to keep track of the circle types and their colors
const CircleType = {
    START: "BLUE",
    END: "YELLOW",
    CHECK: "GREEN",
    CHECKED: "RED"
};
const GridColor = "BLACK";

window.addEventListener("load", () => {
    console.log("Start canvas");

    const canvas = document.querySelector("#canvas");

    // set proper canvas dimensions
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    draw(canvas);
    
});

// resize canvas when window is resized
window.addEventListener("resize", () => {
    console.log("Resize canvas");

    // resize canvas dimensions to be the window's dimensions
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    draw(canvas);
});


// draws contents
function draw(canvas) {
    
    // context means 2d or 3d
    // context is also the tool that draws
    const ctx = canvas.getContext('2d');

    console.log("Draw");

    tileBack(canvas, ctx, grid_x, grid_y);

    gridCircle(canvas, ctx, CircleType.START, cir_gx, cir_gy);
    gridCircle(canvas, ctx, CircleType.END, 0, 0);
    gridCircle(canvas, ctx, CircleType.CHECK, 4, 6);
    gridCircle(canvas, ctx, CircleType.CHECKED, 4, 8);

}


// // Put stroked rectangles in the background
// // x is the number of rectangles in the x direction
// // y is the number of rectangles in the y direction
// function tileBack(canvas, ctx, x, y) {

//     rectHeight = 1.0 * canvas.height / y;
//     rectWidth = 1.0 * canvas.width / x;

//     console.log("rectHeight rectWidth");
//     console.log(rectHeight);
//     console.log(rectWidth);

//     for (var ix=0; ix<x; ix++) {
//         for (var iy=0; iy<y; iy++) {
//             ctx.strokeRect(rectWidth*ix, rectHeight*iy, rectWidth, rectHeight);
//         }
//     }

// };

// Put stroked rectangles in the background
// rectHeight is the height of the rectangles
// rectWidth is the width of the rectangles
function tileBack(canvas, ctx, rectHeight, rectWidth) {

    ctx.strokeStyle = GridColor;

    y = canvas.height / rectHeight;
    x = canvas.width / rectWidth;

    console.log("Tile rectangles: x "+ x + " y " + y);

    for (var ix=0; ix<x-1; ix++) {
        for (var iy=0; iy<y-1; iy++) {
            ctx.strokeRect(rectWidth*ix, rectHeight*iy, rectWidth, rectHeight);
        }
    }

};

// put a type of circle on the grid
// type is one of the CircleType types
// gx is an x value on the grid
// gy is a y value on the grid
function gridCircle(canvas, ctx, type, gx, gy) {

    console.log("Grid circle: color " + type + " gx " + gx + "gy " + gy);

    ctx.strokeStyle = type; // because type holds the string of the color, it can just be set here

    ctx.beginPath();
    ctx.arc((gx+0.5)*grid_x, (gy+0.5)*grid_y, Math.min(grid_x, grid_y)/2, 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = type;
    ctx.fill();

}