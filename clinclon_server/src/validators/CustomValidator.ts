import { BaseRequest } from "../models/BaseRequest";
import Validator from "./Validator";
import "reflect-metadata"

function Validate(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    var types = Reflect.getMetadata("design:paramtypes", target, key);
    var rqType = types.map((a: { name: any; }) => a.name).join();
    descriptor.value = function (...args: BaseRequest[]) {
        Validator.Instance.validateBody(args[0], rqType)
        const result = originalMethod.apply(this, args);
        return result;
      };
}

export default Validate