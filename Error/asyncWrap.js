
const asyncWrap=function(fn)
{
    return function(req,res,next)
    {
        fn(req,res,next).catch(next);
    }
}

module.exports=asyncWrap;

/* this is asyncWrap function which is used to handle errors in asynchronous functions
    this call next(). next call express standard or by default error handling middleware
*/