/**
 * Created by Lancelot on 20.12.2016.
 */

//do axial simetry of ptsToInverse by intersectPts line
/**
 *
 * @param ptsToInverse [x,y]
 * @param intersectPts [1][x,y]
 * @returns {Array} [x,y,z] z=0.1 now
 */
function axialSymmetry(ptsToInverse, intersectPts) {

    var reversedPts = []
    //f(0)=b
    var b = y0ofMyLine(intersectPts[0], intersectPts[1]);

    // console.log("y= " + b);
    // console.log("intersection:" + intersectPts[0] + ";" + intersectPts[1]);

    // for (var i = 0; i < ptsToInverse.length; i++) {
        //dy/dx (slope)
        p = (intersectPts[0][1] - intersectPts[1][1]) / (intersectPts[0][0] - intersectPts[1][0]);

        var newX = ((1 - p * p) * ptsToInverse[0] + 2 * p * ptsToInverse[1] - 2 * b * p) / (1 + p * p);
        var newY = (2 * p * ptsToInverse[0] - (1 - p * p) * ptsToInverse[1] + 2 * b) / (1 + p * p);

        reversedPts.push([newX, newY,0.1]);
    // }

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


//foldline[x1,y1,x2,y2]
/**
 *  return a number (z value) vectorial product of a 1st foldLine pt to node and foldline Vector
 *  so it possible to know what side of foldLine a pt is AND which pts to "fold"
 *
 * @param node - object Node to make vectorial product with
 * @param foldLine - 2 points, 4 values [x1,y1,x2,y2]
 */
function vectProd(node, foldLine) {

    //AB=OB-OA
    var vectU = [foldLine[3] - foldLine[0], foldLine[4] - foldLine[1]];
    var vectV = [foldLine[0] - node.dot.getPos()[0], foldLine[1] - node.dot.getPos()[1]];

    //Z composant of vectorial product (VectU CROSS vectV)
    //z=ux*vy-uy*ux
    var myZ=vectU[0]*vectV[1]-vectU[1]*vectV[0];

    return myZ;
}

//distance between pt and line
//line=[[x1,y1],[x2,y2]]
function distLinePts(line, point) {
    //y=bx+d
    b = (line[0][1] - line[1][1]) / (line[0][0] - line[1][0]);
    //d=y-bx
    d = line[0][1] - b * line[0][0];

    console.log("d=" + d);
    console.log("b=" + b);
    console.log(line);
    // console.log(vectorMagnitude(b)); //<==== HERE THE PROBLEM
    var dist = (b * point[0] - point[1] + d) / (Math.sqrt(1 + Math.pow(b, 2)));

    return dist;
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

//intersec is a point ([x,y])
//check if intersec between two corners
function validIntersec(intersec, corners) {

    for (let j = 0; j < corners.length; j++) {
        var ab = []; //[x,y]
        ab.push(corners[(j + 1) % corners.length][0] - corners[j][0]);
        ab.push(corners[(j + 1) % corners.length][1] - corners[j][1]);

        var ac = [];
        ac.push(intersec[0] - corners[j][0]);
        ac.push(intersec[1] - corners[j][1]);

        //x*AB=AC x€[0,1]? if so, intersec is valide
        //as AB//AC => AC(x)/AB(x) == AC(y)/AB(y)
        //1st test if parallel => alpha=180°
        angleRad = Math.acos((ab[0] * ac[0] + ab[1] * ac[1]) / (vectorMagnitude(ab) * vectorMagnitude(ac)));

        //test to avoid NaN or very small values
        if (angleRad < 0.0001 || isNaN(angleRad))
            angleRad = 0;

        angle = angleRad * 180 / Math.PI;
        if (angle >= 0 && angle <= 0.0001) {
            //2nd test if x*AB=AC with x[0,1]
            var rat = (ab[0] == 0) ? (ac[1] / ab[1]) : (ac[0] / ab[0]);

            if (rat >= 0 && rat <= 1) {
                //valid
                return true;
            }
        }
    }


    return false;
}

//return ||vector||
function vectorMagnitude(vector) {
    return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
}