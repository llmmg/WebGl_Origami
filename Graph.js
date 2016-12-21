/**
 * Created by Lancelot on 18.12.2016.
 */
class Graph {
    constructor() {
        //dict of all nodes
        this.nodes = {};

    }

    //add new dot
    addNode(newNode) {
        this.nodes[newNode.name] = newNode;
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

                    // console.log("NEXT POINT");
                    // console.log(curNode.name + curNeig[i].name);
                }
            }
        }
        return [vertices, indices, colors];
    }

    addIntersections(foldPoints) {
        //fold line points
        var x1 = foldPoints[0];
        var y1 = foldPoints[1];
        var x2 = foldPoints[3];
        var y2 = foldPoints[4];

        var visitedNodes = [];
        var newIntesectPts = [];
        var nodesToInserts = []; //[A,B,newNode]

        for (var node in this.nodes) {

            var curNode = this.nodes[node];
            visitedNodes.push(curNode.name);
            var curNeig = curNode.getNeig();


            // console.log("node "+curNode.name+" \nneighbours:\n");
            // console.log(curNeig.length);


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
                        //add new node
                        var interNode = new Node(new ADot([intersect[0], intersect[1], 0.1], false), curNode.name + curNeig[n].name);

                        //add to return
                        newIntesectPts.push(interNode.dot.getPos());

                        nodesToInserts.push([curNode, curNeig[n], interNode]);
                    }
                    else{
                        // console.log("INVALID INTERSECTION");
                        // console.log(curNode.name+"-"+curNeig[n].name);
                    }
                }else
                {
                    // console.log("ALREDY VISITED");
                    // console.log(curNeig[n].name);
                }
            }
        }
        //insert new nodes in graph
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
}
