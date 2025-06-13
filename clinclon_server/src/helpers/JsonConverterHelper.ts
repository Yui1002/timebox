import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript"

class JsonConverterHelper {
    private static _instance: JsonConverterHelper;
    public _converter: JsonConvert;
    constructor() {
        this.setJsonSettings();
    }

    setJsonSettings() {
        this._converter = new JsonConvert();
        this._converter.operationMode = OperationMode.ENABLE;
        this._converter.ignorePrimitiveChecks = false; 
        this._converter.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
}

const JSHelperInstance = JsonConverterHelper.Instance;
export default JSHelperInstance