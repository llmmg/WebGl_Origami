/**
 * Created by Lancelot on 18.12.2016.
 */
/**
 * Node class have
 * - one ADot for position and anchor flag
 * - A list of nodes => neighbours
 *
 */
class Node{
    //aDot object and string name
    constructor(dot,name)
    {
        this.dot=dot;
        this.name=name;
        this.neighbours=[];

    }

    //add a neighbour
    addNeig(neigNode)
    {
        this.neighbours.push(neigNode);
    }
    removeNeig(neigNode)
    {
        for(let r=0;r<this.neighbours.length;r++){
            if(this.neighbours[r].name==neigNode.name)
            {
                this.neighbours.splice(r,1);
            }
        }
    }

    getNeig()
    {
        return this.neighbours;
    }

    //set pos to last known position
    undoPos()
    {
        this.dot.undoPos();
    }
}