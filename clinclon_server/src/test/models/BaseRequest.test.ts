import {BaseRequest} from "../../models/BaseRequest";

describe("test base request", () => {
    test("shoud get instance name", () => {
        let request = new BaseRequest();

        expect(request.getInstanceName()).toBe('BaseRequest');
    })
});