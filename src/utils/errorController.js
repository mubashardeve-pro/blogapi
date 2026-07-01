


const AppError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
    error.isOperational = true;

    Error.captureStackTrace(error, AppError);
    return error;
};




const sendErrorDev = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    res.status(statusCode).json({
        status,
        message,
        stack,
    });
};

const sendErrorProd = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    if (error.isOperational) {
        return res.status(statusCode).json({
            status,
            message,
        });
    }


    // console.log(error.name, error.message, stack);
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong',
    });
};





const globalErrorHandler = (err, req, res, next) => {

    res.setHeader('X-Robots-Tag', 'noindex, nofollow');


    if (err.name === 'JsonWebTokenError' ) {
        err = AppError('Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError' ) {
        err = AppError('Session Expired! Please Login Again.', 401);
    }


    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            status: 'fail',
            message: err.errors[0]?.message,
            error: {
                path: err.errors[0]?.path,
                message: err.errors[0]?.message,
            },
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {

        console.log("here")

        var fieldLable = err.errors[0]?.path?.replace('_', ' ')?.replace(/\b\w/g, char => char.toUpperCase()) || 'Field';


        return res.status(400).json({
            status: 'fail',
            message: err.errors[0]?.message,
            error: {
                path: err.errors[0]?.path,
                message: `${fieldLable} Already Exists!`,
            },
        });
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        err = AppError('The record you are trying to delete is being referenced by another record.', 400);
    }

    if (err.name === 'SequelizeDatabaseError' && err.message.includes('invalid input syntax for type integer')) {
        err = AppError('Invalid input syntax for integer type', 400);
    }

    if (err.name === 'SequelizeDatabaseError' && err.message.includes('invalid input syntax for type uuid')) {
        err = AppError('Invalid UUID', 400);
    }

    if (err.name === 'SequelizeDatabaseError' && err.message.includes('null value in column')) {
        const columnName = err.message.match(/null value in column "(\w+)"/)[1];
        err = AppError(`Null value in column: ${columnName} violates not-null constraint`, 400);
    }

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    }

    sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
module.exports.AppError = AppError;