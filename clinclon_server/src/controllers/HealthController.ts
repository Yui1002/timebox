import { Route, Get } from "tsoa";
import SuperController from "./SuperController";

interface IHealthController {
    getHealth(): Promise<boolean>
}

@Route("")
export class HealthController extends SuperController implements IHealthController {
    constructor() {
        super();
    }

    @Get()
    public async getHealth(): Promise<boolean> {
        return true;
    }
}