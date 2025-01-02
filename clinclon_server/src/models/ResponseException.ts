class ResponseException extends Error {
    public errorObj: any;
    public code: number;
    public message: string;

    constructor(err: any, code: number, message: string) {
        super();
        this.errorObj = err;
        this.code = code;
        this.message = message;
    }    
}

export default ResponseException;