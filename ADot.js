/**
 * Created by Lancelot on 13.12.2016.
 */
class ADot{

    /**
     *
     * @param position - A tab that contain [x,y,z]
     * @param flag - A boolean who describe if the Dot is an anchor (intersection)
     */
    constructor(position,flag)
    {
        this.position=[];
        this.position=position;
        this.flag=flag;

        //undo test - stack (list) of old positions
        this.oldPos=[];
    }

    //return [x,y,z]
    getPos()
    {
        return this.position;
    }
    //newPos=[x,y,z]
    setPos(newPos) {
        this.oldPos.push(this.position);
        this.position = newPos;
    }

    //undo new position (set position to old position)
    undoPos(){
        var old=this.oldPos.pop();
        if(old!=undefined)
        {
            this.position=old;
        }
    }

}