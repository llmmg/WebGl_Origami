/**
 * Created by Lancelot on 18.12.2016.
 */
class Graph {
    constructor() {
        //dict of all nodes
        this.nodes = {};

        //for undo function
        this.history = [];
        //boolean to block undo function to one use at the time
        this.canUnDo = false;


    }

    //add new dot
    addNode(newNode) {
        this.nodes[newNode.name] = newNode;
    }

    //remove node
    delNode(nodeToDel) {
        var neighBourds = nodeToDel.getNeig();
        for (let v = 0; v < nodeToDel.getNeig().length; v++) {
            nodeToDel.removeNeig(neighBourds[v]);
        }
        delete this.nodes[nodeToDel.name];
    }

    showNodes() {
        console.log("Graph nodes:");

        for (var key in this.nodes) {
            console.log(key)
        }
    }

    countNodes() {
        var count = 0;
        for (var name in this.nodes) {
            count++;
        }
        return count;
    }

    addRelation(node1, node2) {
        this.nodes[node1.name].addNeig(node2);
        this.nodes[node2.name].addNeig(node1);
    }

    delRelation(node1, node2) {
        this.nodes[node1.name].removeNeig(node2);
        this.nodes[node2.name].removeNeig(node1);
    }

    getNodes() {
        return this.nodes;
    }

    getNodeByName(name) {
        return this.nodes[name];
    }

    //used to draw edges lines
    //return [vertices,indices,colors]
    segments() {
        var vertices = [];
        var indices = [];
        var colors = [];

        var visitedNodes = [];

        //each node in graph
        //graph traversal => follow relations
        for (var node in this.nodes) {

            var curNode = this.nodes[node];
            visitedNodes.push(curNode.name);
            var curNeig = curNode.getNeig();

            //each neighbours of current node
            for (var i = 0; i < curNeig.length; i++) {

                //--push next (neighbour) if not visited
                if (visitedNodes.includes(curNeig[i].name) == false) {
                    //--push current pts
                    var pos = curNode.dot.getPos();
                    vertices.push(pos[0], pos[1], pos[2]);
                    colors.push(0.0, 1.0, 0.0, 1.0);
                    indices.push(indices.length);

                    //--push next
                    var posNext = curNeig[i].dot.getPos();
                    vertices.push(posNext[0], posNext[1], posNext[2]);
                    colors.push(0.0, 0.0, 0.0, 1.0);
                    indices.push(indices.length);

                }
            }
        }

        return [vertices, indices, colors];
    }

    //add intersections points between fold line and graph.
    //add relations between intersections points and old points
    //Do mirror operation for left part of fold line
    addIntersections(foldPoints) {

        //if the origami is folded then we can undo the action one time after that
        this.canUnDo = true;

        //fold line points
        var x1 = foldPoints[0];
        var y1 = foldPoints[1];
        var x2 = foldPoints[3];
        var y2 = foldPoints[4];

        var visitedNodes = [];
        var newIntesectPts = [];
        var nodesToInserts = []; //[A,B,newNode]

        //tmp list to add mirrored pts in history list
        var currentNodes = [];

        for (var node in this.nodes) {

            var curNode = this.nodes[node];
            visitedNodes.push(curNode.name);
            var curNeig = curNode.getNeig();


            //each neighbours of current node
            for (var n = 0; n < curNeig.length; n++) {

                //--push next (neighbour) if not visited
                if (visitedNodes.includes(curNeig[n].name) == false) {
                    //--current pts
                    var pos = curNode.dot.getPos();
                    //--next pts (neighbour)
                    var posNext = curNeig[n].dot.getPos();

                    var foldL = [[x1, y1], [x2, y2]];
                    var intersect = intersection([pos, posNext], foldL);
                    if (validIntersec(intersect, [pos, posNext])) {

                        //add new node (intersection node)
                        var interNode = new Node(new ADot([intersect[0], intersect[1], 0.1], false), curNode.name + curNeig[n].name);

                        //add to return
                        newIntesectPts.push(interNode.dot.getPos());
                        nodesToInserts.push([curNode, curNeig[n], interNode]);

                    }
                }
            }

            //vectorial product
            var screwDir = vectProd(this.nodes[node], foldPoints);
            if (screwDir < 0) {
                //convert to "good" format list to list[x,y]...
                var axialLine = [[foldPoints[0], foldPoints[1]], [foldPoints[3], foldPoints[4]]];
                var reversedCoords = axialSymmetry(this.nodes[node].dot.getPos(), axialLine);

                // console.log(reversedCoords);

                //Do mirrors operation
                this.nodes[node].dot.setPos(reversedCoords[0]);

                //add current point in tmp list to add in history later
                currentNodes.push(this.nodes[node].name);
            }
        }
        //add mirrored pts to history list == pts to reverse
        this.history.push(currentNodes);


        //insert new nodes in graph (intersection nodes)
        for (let i = 0; i < nodesToInserts.length; i++) {
            this.insertNode(nodesToInserts[i][0], nodesToInserts[i][1], nodesToInserts[i][2]);
        }


        //add relations between new nodes (fold line)
        for (let i = 0; i < nodesToInserts.length; i++) {
            if (i + 1 < nodesToInserts.length) {
                this.addRelation(nodesToInserts[i][2], nodesToInserts[i + 1][2]);
            }
        }

        return newIntesectPts;
    }

    //insert a node between a nodeA and a nodeB
    insertNode(nodeA, nodeB, nodeToInsert) {
        this.addNode(nodeToInsert);

        //add realtions between intersections and pts
        this.addRelation(nodeA, nodeToInsert);
        this.addRelation(nodeToInsert, nodeB);

        //remove relation between curNode and curNeig[i]
        this.delRelation(nodeA, nodeB);

    }

    //undo "ctrl+z" for folds
    unDo() {

        //reverse points
        if (this.canUnDo) {
            var toReverse = this.history.pop();
            for (let m = 0; m < toReverse.length; m++) {
                this.nodes[toReverse[m]].undoPos();
            }

            //Cant do it more than once in a row
            this.canUnDo = false;
        }

    }

}
