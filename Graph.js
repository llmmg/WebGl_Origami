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

        // for(let i=0;i<this.nodes.length;i++)
        // {
        //     console.log(this.nodes);
        // }
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
}
