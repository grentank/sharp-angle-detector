class Point {
    constructor({x, y}) {
        this.x = x;
        this.y = y;
    }
    distanceTo(point) {
        return Math.sqrt((this.x - point.x)**2 + (this.y - point.y)**2);
    }
}

class Vector {
    constructor({begin, end}) {
        this.begin = begin;
        this.end = end;
        this.x = end.x - begin.x;
        this.y = end.y - begin.y;
    }
    length() {
        return this.begin.distanceTo(this.end);
    }
    dot(vector) {
        return this.x*vector.x + this.y*vector.y;
    }
    angleBetween(vector) {
        return Math.acos((this.dot(vector))/(this.length()*vector.length()));
    }
}

class VectorPath {
    constructor() {
        this.pointSequence = [];
        this.vectorSequence = [];
        this.nodes = [];
    }
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return {x, y};
}

let mouseup = true;
let path;
const canvas = document.querySelector('canvas')

canvas.addEventListener('mousedown', (e) => {
    path = new VectorPath;
    path?.pointSequence.push(new Point(getCursorPosition(canvas, e)))
    mouseup = false;
})

canvas.addEventListener('mousemove', function(e) {
    path?.pointSequence.push(new Point(getCursorPosition(canvas, e)))
    path?.vectorSequence.push(new Vector({
        begin: path.pointSequence[path.pointSequence.length - 2],
        end: path.pointSequence[path.pointSequence.length - 1]
    }))
    const prevVector = path?.vectorSequence[path.vectorSequence.length-2];
    const nextVector = path?.vectorSequence[path.vectorSequence.length-1];
    if(prevVector?.angleBetween(nextVector) >= 1 && prevVector?.angleBetween(nextVector) <= 2.14) {
        console.log('Sharp angle!')
        path?.nodes.push(path.pointSequence[path.pointSequence.length - 1]);
    }
})

canvas.addEventListener('mouseup', (e) => {
    mouseup = true;
    console.log('Final path:', path);
    console.log('Nodes: ', path.nodes);
})
