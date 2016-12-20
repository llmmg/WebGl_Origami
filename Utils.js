/**
 * Created by Lancelot on 20.12.2016.
 */

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
//check if intersec between one corners pair
function validIntersec(intersec, corners) {

    for (let j = 0; j < corners.length; j++) {
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