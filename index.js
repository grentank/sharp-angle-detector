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
const canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

canvas.addEventListener('mousedown', (e) => {
    path = new VectorPath;
    path?.pointSequence.push(new Point(getCursorPosition(canvas, e)))
    path?.nodes.push(path.pointSequence[0])
    mouseup = false;
})

canvas.addEventListener('mousemove', function(e) {
    if(!mouseup) {
        const lastPoint = new Point(getCursorPosition(canvas, e));
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 2, 0, 2 * Math.PI);
        ctx.fill();
        if(path?.pointSequence[path.pointSequence.length - 1].distanceTo(lastPoint) >= 20) {
            path?.pointSequence.push(lastPoint)
            path?.vectorSequence.push(new Vector({
                begin: path.pointSequence[path.pointSequence.length - 2],
                end: path.pointSequence[path.pointSequence.length - 1]
            }))
            if(path?.vectorSequence.length >= 2) {
                const prevVector = path?.vectorSequence[path.vectorSequence.length-2];
                const nextVector = path?.vectorSequence[path.vectorSequence.length-1];
                if(prevVector?.angleBetween(nextVector) >= Math.PI/6) {
                    console.log('Sharp angle!')
                    path?.nodes.push(path.pointSequence[path.pointSequence.length - 1]);
                }
            }
        }
    }
})


canvas.addEventListener('mouseup', (e) => {
    mouseup = true;
    const lastPoint = new Point(getCursorPosition(canvas, e));
    if(path.nodes[0].distanceTo(lastPoint) <= 100) {
        path.nodes.push(path.nodes[0]);
    } else {
        path.nodes.push(lastPoint);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    path.nodes.forEach((node, index, nodes) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, 2 * Math.PI);
        ctx.fill();

        if(index === nodes.length - 1) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[0].x, nodes[0].y);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[index + 1].x, nodes[index + 1].y);
            ctx.stroke();
        }
    })
    console.log('Final path:', path);
    console.log('Nodes: ', path.nodes);
})
