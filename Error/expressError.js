class expressError extends Error{
    constructor(status,message)
    {
        super();
        this.status=status;
        this.message=message;
    }
}

module.exports=expressError;

/* this is user defined error class which have status code and message
*/