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
function initBuffers() {

    //----INIT GRAPH----

    nodeA = new Node(new ADot([-0.5, 0.5, 0.1], false), 'A');
    nodeB = new Node(new ADot([0.5, 0.5, 0.1], false), 'B');
    nodeC = new Node(new ADot([0.5, -0.5, 0.1], false), 'C');
    nodeD = new Node(new ADot([-0.5, -0.5, 0.1], false), 'D');
    nodeE = new Node(new ADot([0.8, 0.0, 0.1], false), 'E');
    nodeF = new Node(new ADot([0.0, 0.0, 0.1], false), 'F');

    myGraph.addNode(nodeA);
    myGraph.addNode(nodeB);
    myGraph.addNode(nodeC);
    myGraph.addNode(nodeD);

    // myGraph.addNode(nodeE);
    // myGraph.addNode(nodeF);

    myGraph.addRelation(nodeA, nodeB);
    myGraph.addRelation(nodeB, nodeC);

    myGraph.addRelation(nodeC, nodeD);
    myGraph.addRelation(nodeD, nodeA);
    //
    // myGraph.addRelation(nodeB, nodeE);
    // myGraph.addRelation(nodeE, nodeC);
    //
    // myGraph.addRelation(nodeF, nodeA);
    // myGraph.addRelation(nodeF, nodeC);
    // myGraph.addRelation(nodeF, nodeD);
    // myGraph.addRelation(nodeF, nodeB);


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

    vertices = edges[0];
    indices = edges[1];
    colors = edges[2];


    bind([pointsIndices, points, colors2], [addedPts, colorLine, lineIndices], edges);
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
function unDo() {
    myGraph.unDo();
    refresh();
}
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

    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

    //draws lines
    drawLines();

    //draw points (debug)
    drawPoints();

    //draw fold line
    drawFoldLine();

}
function refresh() {
    //get stuff for lines (segments)
    edges = myGraph.segments();

    vertices = edges[0];
    indices = edges[1];
    colors = edges[2];

    tstColor = [0.0, 1.0, 0.0, 1.0];
    // pushPtsGlobal(newsPts, tstColor);
    allNodes = myGraph.getNodes();
    for (var key in allNodes) {
        pushPtsGlobalSimple(allNodes[key].dot.getPos(), tstColor);
    }

    bind([pointsIndices, points, colors2], [addedPts, colorLine, lineIndices], edges);
}
function addPointOnGLScene(pX, pY) {

    if (addedPts.length >= 6) {
        addedPts = [];
        lineIndices = [];
    }

    addedPts.push(pX, pY, 0.1);
    lineIndices.push(lineIndices.length);
    colorLine.push(1.0, 0.0, 0.5, 1.0);

    //add new points only if a line is drawn
    if (addedPts.length >= 5) {
        pointsIndices = [];
        points = [];

        newsPts = myGraph.addIntersections(addedPts);
        edges = myGraph.segments();

        //for bind
        vertices = edges[0];
        indices = edges[1];
        colors = edges[2];

        tstColor = [0.0, 0.0, 0.0, 1.0];
        // pushPtsGlobal(newsPts, tstColor);
        allNodes = myGraph.getNodes();
        for (var key in allNodes) {
            pushPtsGlobalSimple(allNodes[key].dot.getPos(), tstColor);
        }
    }


    var point = [pointsIndices, points, colors2];
    var fline = [addedPts, colorLine, lineIndices];
    //update buffers
    bind(point, fline, [vertices, indices, colors]);
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
        // glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, lineIndexBuff);
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
