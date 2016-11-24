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

    // addedPts=[];
    // //pts for the fold line
    // addedPts.push(0.0,1.2,0.1);
    // addedPts.push(0.0,-1.2,0.1);
    //
    // colorLine.push(0.0, 0.0, 1.0, 1.0);
    // colorLine.push(0.0, 0.0, 1.0, 1.0);
    //
    // lineIndices.push(0,1);


    // cubeGemo();

    //points
    points = [];
    pointsIndices = [];
    points.push(-0.5, 0.5, 0.1);
    points.push(0.5, 0.5, 0.1);
    points.push(0.5, -0.5, 0.1);
    points.push(-0.5, -0.5, 0.1);


    //div by 3 because 1pts= 3coords
    for (i = 0; i < points.length / 3; i++) {
        colors2.push(1.0, 0.0, 0.0, 1.0);
        pointsIndices.push(pointsIndices.length);

        //border color
        colors.push(0.0, 0.0, 0.0, 1.0);
        indices.push(i);
    }
    indices.push(0);

    //draw rectangle
    for (i = 0; i < points.length; i++) {
        vertices.push(points[i]);

    }


    vertexBuffer = getVertexBufferWithVertices(vertices);
    colorBuffer = getVertexBufferWithVertices(colors);
    indexBuffer = getIndexBufferWithIndices(indices);

    //test points
    pointsIndexBuffer = getIndexBufferWithIndices(pointsIndices);
    pointsBuffer = getVertexBufferWithVertices(points);
    ptsColorsBuffer = getVertexBufferWithVertices(colors2);

    //test lines
    lineVertexBuffer = getVertexBufferWithVertices(addedPts);
    lineColorBuff = getVertexBufferWithVertices(colorLine);
    lineIndexBuff = getIndexBufferWithIndices(lineIndices);
}
function bind(pointsIndices, points, colors2, addedPts, colorLine, lineIndices) {

    //test points
    pointsIndexBuffer = getIndexBufferWithIndices(pointsIndices);
    pointsBuffer = getVertexBufferWithVertices(points);
    ptsColorsBuffer = getVertexBufferWithVertices(colors2);

    //test lines
    lineVertexBuffer = getVertexBufferWithVertices(addedPts);
    lineColorBuff = getVertexBufferWithVertices(colorLine);
    lineIndexBuff = getIndexBufferWithIndices(lineIndices);
}
function findNewPoints() {

    //fold line points
    x1 = addedPts[0];
    y1 = addedPts[1];
    x2 = addedPts[3];
    y2 = addedPts[4];

    //store points
    var tmp = []; //[n][x, y or z]

    //get all points
    for (i = 0; i < points.length; i += 3) {
        tmp.push([points[i], points[i + 1]]);
    }

    //---fold line equation---
    //y=bx+d
    b = (y1 - y2) / (x1 - x2);
    //d=y-bx
    d = y1 - b * x1;


    side1 = closestSide(tmp, [x1, y1]);
    side2 = closestSide(tmp, [x2, y2]);
    sides = [];

    sides.push(side1, side2);

    inter = []; //x,y

    //find all intersections
    for (let i = 0; i < tmp.length; i++) {
        // console.log("tmp[" + (i + 1) % tmp.length + "][0]:" + tmp[(i + 1) % tmp.length][0]);

        // //(i+1)%tmp.length because at the last iteration it need to act like "loop" (go back to 0...)
        // if ((tmp[i][0] - tmp[(i + 1) % tmp.length][0]) == 0) {
        //     //when vertical: intersection in x = a pts of the line
        //     x = tmp[i][0];
        //     y = b * x + d;
        // } else {
        //     //---border line---
        //     //y=ax+c
        //     a0 = (tmp[i][1] - tmp[i + 1][1]) / (tmp[i][0] - tmp[i + 1][0]);
        //     //c0 = y-ax
        //     c0 = tmp[i][1] - a0 * tmp[i][0];
        //     //x
        //     x = (d - c0) / (a0 - b);
        //     //y
        //     y = a0 * x + c0;
        // }
        foldL = [[x1, y1], [x2, y2]];
        //TODO: push if valid ONLY
        tmpInter = intersection([tmp[i], tmp[(i + 1) % tmp.length]], foldL);
        if (validIntersec(tmpInter, tmp)) {
            inter.push(tmpInter);
        }

    }

    return inter;

}
//where line=[[x1,y1],[x2,y2]]
function intersection(line1, foldLine) {
    //---fold line equation---
    //y=bx+d
    b = (foldLine[0][1] - foldLine[1][1]) / (foldLine[0][0] - foldLine[1][0]);
    //d=y-bx
    d = foldLine[0][1] - b * foldLine[0][0];

    if ((line1[0][0] - line1[1][0]) == 0) {
        //when vertical: intersection in x = a pts of the line
        x = line1[0][0];
        y = b * x + d;
    } else {
        //---border line---
        //y=ax+c
        a0 = (line1[0][1] - line1[1][1]) / (line1[0][0] - line1[1][0]);
        //c0 = y-ax
        c0 = line1[0][1] - a0 * line1[0][0];
        //x
        x = (d - c0) / (a0 - b);
        //y
        y = a0 * x + c0;
    }
    return [x, y];
}
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
function distance(ptsA, ptsB) {
    return Math.sqrt(Math.pow((ptsA[0] - ptsB[0]), 2) + Math.pow((ptsA[1] - ptsB[1]), 2));
}

//intersec is a point ([x,y])
//check if intersec between one corners pair
function validIntersec(intersec, corners) {

    console.log(corners);

    for (j = 0; j < corners.length; j++) {
        ab = []; //[x,y]
        ab.push(corners[(j + 1) % corners.length][0] - corners[j][0]);
        ab.push(corners[(j + 1) % corners.length][1] - corners[j][1]);

        ac = [];
        ac.push(intersec[0] - corners[j][0]);
        ac.push(intersec[1] - corners[j][1]);

        //x*AB=AC x€[0,1]? if so, intersec is valide
        //as AB//AC => AC(x)/AB(x) == AC(y)/AB(y)
        //1st test if parallel => alpha=180°
        angleRad = Math.acos((ab[0] * ac[0] + ab[1] * ac[1]) / (vectorMagnitude(ab) * vectorMagnitude(ac)));
        angle = angleRad * 180 / Math.PI;
        if (angle == 0) {
            //2nd test if x*AB=AC with x[0,1]
            var rat = (ab[0] == 0) ? ac[1] / ab[1] : ac[0] / ab[0];

            if (rat >= 0 && rat <= 1) {
                //valid
                return true;
            }
        }
    }
    return false;
}
function vectorMagnitude(vector) {
    return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
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
        tmp = findNewPoints();
        for (i = 0; i < tmp.length; i++) {
            points.push(tmp[i][0], tmp[i][1], 0.1);
            colors2.push(1.0, 0.0, 0.0, 1.0);
            pointsIndices.push(pointsIndices.length);
        }
    }

    //update buffers
    bind(pointsIndices, points, colors2, addedPts, colorLine, lineIndices);
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
    glContext.drawElements(glContext.LINE_STRIP, indices.length, glContext.UNSIGNED_SHORT, 0);
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
