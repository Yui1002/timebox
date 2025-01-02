import Validator from '../validators/Validator';
import { Controller } from 'tsoa'

class SuperController extends Controller {
    protected _validator: Validator;
    constructor() {
        super();
        this._validator = Validator.Instance;
    }
}

export default SuperController