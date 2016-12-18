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
        this.position=position;
        this.flag=flag;
    }

    //return [x,y,z]
    getPos()
    {
        return this.position;
    }
    //newPos=[x,y,z]
    setPos(newPos)
    {
        this.position=newPos;
    }

}