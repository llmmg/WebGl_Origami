/**
 * Created by Lancelot on 16.11.2016.
 */

var vertexBuffer = null;
var indexBuffer = null;
var colorBuffer = null;
var indices = [];
var vertices = [];
var colors = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
function initShaderParameters(prg) {
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
    prg.colorAttribute = glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);
    prg.pMatrixUniform = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');
}

var rotationAroundY = 0.0;
var rotationAroundX = 0.0;
var ty;
var tx;

//test for points
var points = [];
var pointsIndices = [];
var pointsBuffer = null;
var pointsIndexBuffer = null;
var colors2 = [];
var ptsColorsBuffer = null;

//the two points from user
var addedPts = [];

//for the line
var lineVertexBuffer = null;
var lineColorBuff = null;
var lineIndexBuff = null;
var colorLine = [];
var lineIndices = [];

//Graph
var myGraph = new Graph();
var edges = [];

function rotateOnYEverySecond(_rotationAroundY) {
    rotationAroundY == _rotationAroundY;
    rotationAroundY += 0.05;
    ty = setTimeout(rotateOnYEverySecond, 100);
}
function rotateOnXEverySecond(_rotationAroundX) {
    rotationAroundX == _rotationAroundX;
    rotationAroundX += 0.05;
    tx = setTimeout(rotateOnXEverySecond, 100);
}
var isRotY = 0;
var positionSceneY = 0.0;
function activeRotationY() {
    var btn = document.getElementById("btnRotY");
    if (isRotY) {
        isRotY = 0;
        btn.value = "Rotation axe Y : OFF ";
        positionSceneY = rotationAroundY;
        clearTimeout(ty);
    }
    else {
        isRotY = 1;
        btn.value = "Rotation axe Y : ON ";
        rotateOnYEverySecond(positionSceneY);
    }
}
var isRotX = 0;
var positionSceneX = 0.0;
function activeRotationX() {
    var btn = document.getElementById("btnRotX");
    if (isRotX) {
        isRotX = 0;
        btn.value = "Rotation axe X : OFF ";
        positionSceneX = rotationAroundX;
        clearTimeout(tx);
    }
    else {
        isRotX = 1;
        btn.value = "Rotation axe X : ON ";
        rotateOnXEverySecond(positionSceneX);
    }
}
function cubeGemo() {
    //drawing cube
    vertices.push(1.0, 1.0, 0.0); //haut droite avant A
    vertices.push(-1.0, 1.0, 0.0); //haut gauche avant B
    vertices.push(-1.0, 1.0, -1.0); //haut gauche arrière C
    vertices.push(1.0, 1.0, -1.0); //haut droite arrière D
    vertices.push(1.0, -1.0, 0.0); //bas droite avant E
    vertices.push(-1.0, -1.0, 0.0); //bas gauche avant F
    vertices.push(-1.0, -1.0, -1.0); //bas gauche arrière G
    vertices.push(1.0, -1.0, -1.0); //bas droite arrière H


    colors.push(1.0, 0.0, 0.0, 0.7);
    colors.push(0.0, 1.0, 1.0, 1.0);
    colors.push(1.0, 0.0, 1.0, 1.0);
    colors.push(1.0, 1.0, 0.0, 0.7);

    colors.push(0.0, 0.0, 1.0, 1.0);
    colors.push(0.0, 1.0, 1.0, 1.0);
    colors.push(0.0, 1.0, 0.0, 0.7);
    colors.push(0.0, 0.5, 1.0, 1.0);


    //B/A/H /G/F/E /G/A/C /E/D/F /B/H
    indices.push(6, 5, 7, 4, 0, 5, 1, 6, 2, 7, 3, 0, 2, 1);
}
function initBuffers() {


    //----INIT GRAPH----

    nodeA = new Node(new ADot([-0.5, 0.5, 0.1], false), 'A');
    nodeB = new Node(new ADot([0.5, 0.5, 0.1], false), 'B');
    nodeC = new Node(new ADot([0.5, -0.5, 0.1], false), 'C');
    // nodeD = new Node(new ADot([-0.5, -0.5, 0.1], false), 'D');
    // nodeE = new Node(new ADot([0.8, 0.0, 0.1], false), 'E');
    // nodeF = new Node(new ADot([0.0,0.0,0.1],false),'F');

    myGraph.addNode(nodeA);
    myGraph.addNode(nodeB);
    myGraph.addNode(nodeC);
    // myGraph.addNode(nodeD);;
    // myGraph.addNode(nodeE);
    // myGraph.addNode(nodeF);

    myGraph.addRelation(nodeA, nodeB);
    myGraph.addRelation(nodeB, nodeC);

    //temp
    myGraph.addRelation(nodeA,nodeC);

    // myGraph.addRelation(nodeC, nodeD);
    // myGraph.addRelation(nodeD, nodeA);

    // myGraph.addRelation(nodeB, nodeE);
    // myGraph.addRelation(nodeE, nodeC);
    //
    // myGraph.addRelation(nodeF,nodeA);
    // myGraph.addRelation(nodeF,nodeC);
    // myGraph.addRelation(nodeF,nodeD);


    // console.log("voisins de A");
    // console.log(myGraph.getNodeByName("A").getNeig());

    mynodes = myGraph.getNodes();
    tmpColor = [0.0, 0.0, 0.0, 1.0];

    //add graph pts on points list(to draw)
    for (var key in mynodes) {
        pushPtsGlobalSimple(mynodes[key].dot.getPos(), tmpColor);
    }

    //get stuff for lines (segments)
    edges = myGraph.segments();
    // console.log(values[0]);

    vertices = edges[0];
    indices = edges[1];
    colors = edges[2];

    // vertices.push(values[0]);
    // indices.push(values[1]);
    // colors.push(values[2]);

    bind([pointsIndices,points,colors2],[addedPts,colorLine,lineIndices],edges);
    // vertexBuffer = getVertexBufferWithVertices(vertices);
    // colorBuffer = getVertexBufferWithVertices(colors);
    // indexBuffer = getIndexBufferWithIndices(indices);
    //
    // //test points
    // pointsIndexBuffer = getIndexBufferWithIndices(pointsIndices);
    // pointsBuffer = getVertexBufferWithVertices(points);
    // ptsColorsBuffer = getVertexBufferWithVertices(colors2);
    //
    // //test lines
    // lineVertexBuffer = getVertexBufferWithVertices(addedPts);
    // lineColorBuff = getVertexBufferWithVertices(colorLine);
    // lineIndexBuff = getIndexBufferWithIndices(lineIndices);
}
function bind(pointStuff, foldLine, segments) {
    // pointsIndices, points, colors2, addedPts, colorLine, lineIndices

    //segments
    vertexBuffer = getVertexBufferWithVertices(segments[0]);
    colorBuffer = getVertexBufferWithVertices(segments[2]);
    indexBuffer = getIndexBufferWithIndices(segments[1]);

    //points
    pointsIndexBuffer = getIndexBufferWithIndices(pointStuff[0]);
    pointsBuffer = getVertexBufferWithVertices(pointStuff[1]);
    ptsColorsBuffer = getVertexBufferWithVertices(pointStuff[2]);

    //fold line
    lineVertexBuffer = getVertexBufferWithVertices(foldLine[0]);
    lineColorBuff = getVertexBufferWithVertices(foldLine[1]);
    lineIndexBuff = getIndexBufferWithIndices(foldLine[2]);
}
//do axial simetry of ptsToInverse by intersectPts line
function axialSymmetry(ptsToInverse, intersectPts) {

    reversedPts = []
    //f(0)=b
    b = y0ofMyLine(intersectPts[0], intersectPts[1]);

    console.log("y= " + b);
    console.log("intersection:" + intersectPts[0] + ";" + intersectPts[1]);

    for (var i = 0; i < ptsToInverse.length; i++) {
        //dy/dx (slope)
        p = (intersectPts[0][1] - intersectPts[1][1]) / (intersectPts[0][0] - intersectPts[1][0]);


        newX = ((1 - p * p) * ptsToInverse[i][0] + 2 * p * ptsToInverse[i][1] - 2 * b * p) / (1 + p * p);
        newY = (2 * p * ptsToInverse[i][0] - (1 - p * p) * ptsToInverse[i][1] + 2 * b) / (1 + p * p)

        reversedPts.push([newX, newY]);
    }

    return reversedPts;
}

//return y of f(0) where ptA and ptB are pts of the f(x) line
function y0ofMyLine(ptA, ptB) {
    // AB=OB-OA
    vAb = [];
    vAb.push(ptB[0] - ptA[0]);
    vAb.push(ptB[1] - ptA[1]);

    //0=aX+vAbX*alpha
    alpha = (-ptA[0] / vAb[0]);

    //found y
    y = ptA[1] + alpha * vAb[1];

    return y;
}

//put all pts that are on one side of fold line in a list and all other in another list
function separatePoints(intersecPts, layerPts) {
    listA = [];
    listB = [];

    //get all points
    var tmp = [];
    for (var j = 0; j < layerPts.length; j += 3) {
        tmp.push([layerPts[j], layerPts[j + 1]]);
    }

    for (j = 0; j < tmp.length; j++) {
        //if point is on the same line as the two interesction pts
        // if ((tmp[j][0] == intersecPts[0][0] && tmp[j][1] == intersecPts[1][1]) || (tmp[j][0] == intersecPts[1][0] && tmp[j][1] == intersecPts[0][1])) {
        //     listA.push(tmp[j]);
        // } else {
        //     // //same x as intersectPts and y>
        //     // if ((tmp[j][0] == intersecPts[0][0] && tmp[j][1] > intersecPts[0][1]) || (tmp[j][0] == intersecPts[1][0]) && tmp[j][1] > intersecPts[1][1]) {
        //     //
        //     //     listA.push(tmp[j]);
        //     //     console.log("Same x");
        //     // }
        //     // else {
        //     //     if ((tmp[j][1] == intersecPts[0][1] || tmp[j][1] == intersecPts[1][1]) && (tmp[j][0] > intersecPts[0][0] || tmp[j][0] > intersecPts[1][0])) {
        //     //         listA.push(tmp[j]);
        //     //         console.log("Same y");
        //     //     }
        //     //     else {
        //     //         listB.push(tmp[j]);
        //     //     }
        //     // }
        //
        //
        //     listB.push(tmp[j]);
        // }

        //Everithing that is right and/or up of the line must go on the same list
        if ((tmp[j][0] > intersecPts[0][0] || tmp[j][0] > intersecPts[1][0]) && (tmp[j][1] > intersecPts[0][1] || tmp[j][1] > intersecPts[1][1])) {
            listA.push(tmp[j]);
        }
        else {

            listB.push(tmp[j]);
        }
    }

    console.log("separatePoints");
    console.log(listA);
    console.log(listB);

    //[[x,y]]
    return [listA, listB]
}

//DEPRECATED
//return intersections points as an array of vectors ([[x,y]])
function findNewPoints(graphPoints) {

    //fold line points
    x1 = addedPts[0];
    y1 = addedPts[1];
    x2 = addedPts[3];
    y2 = addedPts[4];

    //store points
    var tmp = []; //[n][x, y or z]

    //get all points
    // for (i = 0; i < points.length; i += 3) {
    //     tmp.push([points[i], points[i + 1], points[i + 2]]);
    // }

    //test implementation with graphs
    for (i = 0; i < graphPoints.length; i += 3) {
        tmp.push([graphPoints[i], graphPoints[i + 1], graphPoints[i + 2]]);
    }
    // console.log(tmp);


    //---fold line equation---
    //y=bx+d
    b = (y1 - y2) / (x1 - x2);
    //d=y-bx
    d = y1 - b * x1;


    inter = []; //x,y

    //find all intersections
    for (let i = 0; i < tmp.length; i += 2) {
        foldL = [[x1, y1], [x2, y2]];
        tmpInter = intersection([tmp[i], tmp[(i + 1) % tmp.length]], foldL);
        if (validIntersec(tmpInter, tmp)) {
            inter.push(tmpInter);
            //todo: insert ADot between tmp[i] and tmp[i+1]
            // var anchor= new ADot([tmpInter,0],true);
            //insert it
        }

    }

    return inter;

}
//DEPRECATED
//where line=[[x1,y1],[x2,y2]]
// function intersection(line1, foldLine) {
//     //---fold line equation---
//     //y=bx+d
//     b = (foldLine[0][1] - foldLine[1][1]) / (foldLine[0][0] - foldLine[1][0]);
//     //d=y-bx
//     d = foldLine[0][1] - b * foldLine[0][0];
//
//     if ((line1[0][0] - line1[1][0]) == 0) {
//         //when vertical: intersection in x = a pts of the line
//         x = line1[0][0];
//         y = b * x + d;
//     } else {
//         //---border line---
//         //y=ax+c
//         a0 = (line1[0][1] - line1[1][1]) / (line1[0][0] - line1[1][0]);
//         //c0 = y-ax
//         c0 = line1[0][1] - a0 * line1[0][0];
//         //x
//         x = (d - c0) / (a0 - b);
//         //y
//         y = a0 * x + c0;
//     }
//     return [x, y];
// }
//DEPRECATED REPLACED BY INTERSECTION
//compute distance between fold points and border points
//return closest side of a point
function closestSide(sidesPts, oneFoldPoint) {
    values = [2]; //store the 2 borders pts
    values = [sidesPts[0], sidesPts[1]];
    dist1 = distance(sidesPts[0], oneFoldPoint);
    dist2 = distance(sidesPts[1], oneFoldPoint);
    minVal = dist1 + dist2;
    //closest pts of 1st points
    for (i = 0; i < sidesPts.length; i++) {
        // dist=Math.sqrt(Math.pow((tmp[0][0]-tmp[1][0]),2)+Math.pow((tmp[0][1]-tmp[1][1]),2))
        dist1 = distance(sidesPts[i], oneFoldPoint);
        dist2 = distance(sidesPts[(i + 1) % sidesPts.length], oneFoldPoint);
        res = dist1 + dist2;

        //store min dist + pts
        if ((res) < minVal) {
            minVal = res;
            values = [sidesPts[i], sidesPts[(i + 1) % sidesPts.length]];
        }
    }
    //=> value contain the points of line where intersection 1 is

    return values;
}
//return distance between ptsA and ptsB (where pts are vectors[x,y])
function distance(ptsA, ptsB) {
    return Math.sqrt(Math.pow((ptsA[0] - ptsB[0]), 2) + Math.pow((ptsA[1] - ptsB[1]), 2));
}

//intersec is a point ([x,y])
//check if intersec between one corners pair
// function validIntersec(intersec, corners) {
//
//     for (j = 0; j < corners.length; j++) {
//         ab = []; //[x,y]
//         ab.push(corners[(j + 1) % corners.length][0] - corners[j][0]);
//         ab.push(corners[(j + 1) % corners.length][1] - corners[j][1]);
//
//         ac = [];
//         ac.push(intersec[0] - corners[j][0]);
//         ac.push(intersec[1] - corners[j][1]);
//
//         //x*AB=AC x€[0,1]? if so, intersec is valide
//         //as AB//AC => AC(x)/AB(x) == AC(y)/AB(y)
//         //1st test if parallel => alpha=180°
//         angleRad = Math.acos((ab[0] * ac[0] + ab[1] * ac[1]) / (vectorMagnitude(ab) * vectorMagnitude(ac)));
//         angle = angleRad * 180 / Math.PI;
//         if (angle == 0) {
//             //2nd test if x*AB=AC with x[0,1]
//             var rat = (ab[0] == 0) ? ac[1] / ab[1] : ac[0] / ab[0];
//
//             if (rat >= 0 && rat <= 1) {
//                 //valid
//                 return true;
//             }
//         }
//     }
//     return false;
// }
//return ||vector||
// function vectorMagnitude(vector) {
//     return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
// }
function drawScene() {

    glContext.clearColor(0.9, 0.9, 0.9, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    glContext.viewport(0, 0, c_width, c_height);
    mat4.ortho(pMatrix, -1.0, 1.0, -1.0, 1.0, -2.0, 10.0);

    // mat4.identity(pMatrix);
    mat4.identity(mvMatrix);
    rotateModelViewMatrixUsingQuaternion();
    // mat4.perspective(pMatrix, degToRad(50), c_width / c_height, 0.1, 1000.0);
    // mat4.ortho(pMatrix, -1.2, 1.2, -1.2, 1.2, 1, 100);

    translationMat = mat4.create();
    mat4.identity(translationMat);
    mat4.translate(translationMat, translationMat, [0.0, 0.0, -3.5]);
    mat4.multiply(mvMatrix, translationMat, mvMatrix);

    //conditions pour les boutons de rotations
    // if (isRotY) {
    //     mat4.rotateY(mvMatrix, mvMatrix, rotationAroundY);
    // }
    // else {
    //     mat4.rotateY(mvMatrix, mvMatrix, positionSceneY);
    // }
    // if (isRotX) {
    //     mat4.rotateX(mvMatrix, mvMatrix, rotationAroundX);
    // }
    // else {
    //     mat4.rotateX(mvMatrix, mvMatrix, positionSceneX);
    // }

    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

    //draws lines
    drawLines();

    //draw points (debug)
    drawPoints();

    //draw fold line
    drawFoldLine();

}
function addPointOnGLScene(pX, pY) {

    if (addedPts.length >= 6) {
        addedPts = [];
        lineIndices = [];
    }

    addedPts.push(pX, pY, 0.1);
    lineIndices.push(lineIndices.length);
    colorLine.push(1.0, 0.0, 0.5, 1.0);
    // initBuffers();

    //add new points only if a line is drawn
    if (addedPts.length >= 5) {
        // tmp = findNewPoints(points);
        // // // test pts from each sides+
        //
        // sepPts = separatePoints(tmp, points);
        //
        // somePts = axialSymmetry(sepPts[1], tmp);
        //
        // //add pts in global point list
        // for (i = 0; i < tmp.length; i++) {
        //     points.push(tmp[i][0], tmp[i][1], 0.1);
        //     colors2.push(1.0, 0.0, 0.0, 1.0);
        //     pointsIndices.push(pointsIndices.length);
        // }
        // derpColors = [1.0, 0.4, 0.3, 1.0];
        // pushPtsGlobal(somePts, derpColors);
        // derpColors2 = [0.0, 0.0, 1.0, 1.0];
        // pushPtsGlobal(sepPts[0], derpColors2);
        // derpColors2 = [1.0, 0.0, 1.0, 1.0];
        // pushPtsGlobal(sepPts[1], derpColors2);

        //---TESTSTESETSETSET-----
        newsPts = myGraph.addIntersections(addedPts);
        edges = myGraph.segments();
        // myGraph.showNodes();

        // console.log(myGraph.getNodeByName('A'));
        // console.log(myGraph.getNodeByName('AD'));

        //for bind
        vertices=edges[0];
        indices = edges[1];
        colors = edges[2];
        // vertices.push(edges[0]);
        // indices.push(edges[1]);
        // colors.push(edges[2]);



        tstColor = [0.0, 0.0, 0.0, 1.0];
        // pushPtsGlobal(newsPts, tstColor);
        allNodes= myGraph.getNodes();
        for(var key in allNodes)
        {
            pushPtsGlobalSimple(allNodes[key].dot.getPos(),tstColor);
        }
        console.log("Numbers of nodes:");
        console.log(myGraph.countNodes());
        myGraph.showNodes();


    }

    // edges = myGraph.segments();

    var point = [pointsIndices, points, colors2];
    var fline = [addedPts, colorLine, lineIndices];
    //update buffers
    bind(point, fline, [vertices,indices,colors]);
}
//add one pts in global point list
function pushPtsGlobalSimple(pts, color) {
    // for (i = 0; i < pts.length; i++) {
    points.push(pts[0], pts[1], pts[2]);
    for (j = 0; j < color.length; j++)
        colors2.push(color[j]);
    pointsIndices.push(pointsIndices.length);
    // }
}
//add pts in global point list
function pushPtsGlobal(pts, col) {
    for (i = 0; i < pts.length; i++) {
        points.push(pts[i][0], pts[i][1], 0.1001);
        for (j = 0; j < col.length; j++)
            colors2.push(col[j]);
        pointsIndices.push(pointsIndices.length);
    }
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function drawFoldLine() {
    glContext.bindBuffer(glContext.ARRAY_BUFFER, lineVertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, lineColorBuff);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);

    if (addedPts.length >= 6) {
        // console.log("addedpoints size="+addedPts.length);
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, lineIndexBuff);
        glContext.drawElements(glContext.LINE_STRIP, lineIndices.length, glContext.UNSIGNED_SHORT, 0);
    }
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, lineIndexBuff);
    glContext.drawElements(glContext.POINTS, lineIndices.length, glContext.UNSIGNED_SHORT, 0);

}
function drawPoints() {
    glContext.bindBuffer(glContext.ARRAY_BUFFER, ptsColorsBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, pointsBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, pointsIndexBuffer);
    glContext.drawElements(glContext.POINTS, pointsIndices.length, glContext.UNSIGNED_SHORT, 0);
}
function drawLines() {
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.drawElements(glContext.LINES, indices.length, glContext.UNSIGNED_SHORT, 0);
}
function changeProjection() {
    //setting the projection in perspective
    mat4.perspective(pMatrix, degToRad(40), c_width / c_height, 0.1, 1000.0);

//            //setting the projection in orthogonal
//            mat4.ortho(pMatrix, -1.2, 1.2, -1.2, 1.2, 1, 10);

    //Sending the new projection matrix to the shaders
    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
}
function initWebGL() {
    glContext = getGLContext('webgl-canvas');
    initProgram();
    initBuffers();
    changeProjection();
    renderLoop();
}
