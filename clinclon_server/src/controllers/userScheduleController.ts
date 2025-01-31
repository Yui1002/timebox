import SuperController from './SuperController';
import { GetUserScheduleRq, GetUserScheduleRs, SetUserScheduleRq } from '../models/UserSchedule';
import { Get, Queries, Route, Post, Body } from "tsoa";
import Validate from '../validators/CustomValidator';
import UserScheduleManager from '../managers/userScheduleManager';

interface IUserScheduleController {
    getSchedule(rq: GetUserScheduleRq): Promise<GetUserScheduleRs>;
    setSchedule(rq: SetUserScheduleRq): Promise<void>
}

@Route('schedule')
export class UserScheduleController extends SuperController implements IUserScheduleController {
    private _userScheduleManager: UserScheduleManager;

    constructor() {
        super();
        this._userScheduleManager = new UserScheduleManager();
    }

    @Get()
    @Validate
    public async getSchedule(@Queries() rq: GetUserScheduleRq): Promise<GetUserScheduleRs> {
        return await this._userScheduleManager.getUserSchedule(rq);
    }

    @Post()
    @Validate
    public async setSchedule(@Body() rq: SetUserScheduleRq): Promise<void> {
        console.log('request desu', rq)
        await this._userScheduleManager.setUserSchedule(rq);
    }
}