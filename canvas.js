window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    // context means 2d or 3d
    // context is also the tool that draws
    const ctx = canvas.getContext('2d');

    // set proper canvas dimensions
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    //ctx.fillRect(50,50,200,200);
    tileBack(canvas, ctx, 50, 50);
});

// resize canvas when window is resized
window.addEventListener("resize", () => {
    // resize canvas dimensions to be the window's dimensions
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

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

    y = canvas.height / rectHeight;
    x = canvas.width / rectWidth;

    console.log("y x");
    console.log(y);
    console.log(x);

    for (var ix=0; ix<x-1; ix++) {
        for (var iy=0; iy<y-1; iy++) {
            ctx.strokeRect(rectWidth*ix, rectHeight*iy, rectWidth, rectHeight);
        }
    }

};