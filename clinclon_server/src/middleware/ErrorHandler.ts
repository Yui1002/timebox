import { ValidateError } from "tsoa";
import ResponseException from "../models/ResponseException";

const ErrorHandler = (err: any, req: any, res: any, next: any) => {
    if (err instanceof ResponseException) {
        const {message, code, errorObj} = err;
        res.status(code).json({
            message: message,
            exception: errorObj
        });
    }
    else if (err instanceof ValidateError) {
        res.status(400).json({
            message: "validation error occured",
            exception: null
        });
    }
    else {
        console.log(err);
        res.status(500).json({
            message: "Unhandled exception",
            exception: err
        })
    }
}

export default ErrorHandler;