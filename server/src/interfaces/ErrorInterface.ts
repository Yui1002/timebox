export class Error {
    private _errorMessage: string
    private _errorCode: number

    constructor(errorMessage: string, errorCode: number) {
        this._errorMessage = errorMessage
        this._errorCode = errorCode
    }

    getErrorMessage() {
        return this._errorMessage
    }

    getErrorCode(){
        return this._errorCode
    }
}