class TestResponse {
    _status = 0;
    _data: any = null;

    sendStatus(status: any) {
        this._status = status;
        return this;
    }

    status(status: any) {
        this._status = status;
        return this;
    }

    getStatus() {
        return this._status;
    }

    getData() {
        return this._data;
    }

    json(data: any) {
        this._data = data;
        return this;
    }
}

export default TestResponse;