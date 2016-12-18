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

    getNeig()
    {
        return this.neighbours;
    }
}