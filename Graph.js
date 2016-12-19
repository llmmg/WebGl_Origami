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

    addRelation(node1, node2) {
        this.nodes[node1.name].addNeig(node2);
        this.nodes[node2.name].addNeig(node1);
    }

    getNodes() {
        return this.nodes;
    }

    getNodeByName(name) {
        return this.nodes[name];
    }

    // orderedGraph() {
    //
    //     queue=[];
    //
    //
    //     for (var key in this.nodes) {
    //         //neighbours of current node
    //         tmpNeig=this.nodes[key].getNeig();
    //
    //     }
    //
    // }

    //used to draw edges lines
    //return [vertices,indices,colors]
    segments() {
        var vertices = [];
        var indices = [];
        var colors = [];

        var visitedNodes = [];

        for (var node in this.nodes) {
            var curNode = this.nodes[node];

            visitedNodes.push(curNode.name);


            var curNeig = curNode.getNeig();
            for (var i = 0; i < curNeig.length; i++) {
                // console.log(curNeig[i].name);
                // console.log(curNeig[i].dot.getPos())


                //--push next (neighbour) if not visited
                if (visitedNodes.includes(curNeig[i].name)==false) {
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

                    console.log("NEXT POINT");
                    console.log(curNode.name + curNeig[i].name);

                }
                // console.log(curNode.name + curNeig[i].name);

            }
            // console.log("current: "+curNode.name);
            // console.log("1st neigbhour: "+curNeig[0].name);
        }
        indices.push(0);
        return [vertices, indices, colors];
    }
}
