import UserTransactionManager from '../managers/UserTransactionManager';
import SuperController from './SuperController';
import { GetUserTransactionRq, GetUserTransactionRs, SetUserTransactionRq } from '../models/UserTransaction';
import { Get, Queries, Route, Post, Body } from "tsoa";
import Validate from '../validators/CustomValidator';

interface IUserTransactionController {
    getUserTransaction(rq: GetUserTransactionRq): Promise<GetUserTransactionRs>;
    setUserTransaction(rq: SetUserTransactionRq): Promise<void>
}

@Route('userTransaction')
export class UserTransactionController extends SuperController implements IUserTransactionController {
    private _userTransactionManager: UserTransactionManager;

    constructor() {
        super();
        this._userTransactionManager = new UserTransactionManager();
    }

    @Get()
    @Validate
    public async getUserTransaction(@Queries() rq: GetUserTransactionRq): Promise<GetUserTransactionRs> {
        return await this._userTransactionManager.getUserTransaction(rq);
    }  

    @Post()
    @Validate
    public async setUserTransaction(@Body() rq: SetUserTransactionRq): Promise<void> {
        return await this._userTransactionManager.setUserTransaction(rq);
    }
}