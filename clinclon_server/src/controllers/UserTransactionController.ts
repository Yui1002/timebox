import UserTransactionManager from '../managers/UserTransactionManager';
import SuperController from './SuperController';
import { GetUserTransactionRq, GetUserTransactionRs, SetUserTransactionRq } from '../models/UserTransaction';
import { Get, Queries, Route, Post, Body, Security } from "tsoa";
import Validate from '../validators/CustomValidator';
import { JWT } from '../config';

interface IUserTransactionController {
    getUserTransaction(rq: GetUserTransactionRq): Promise<GetUserTransactionRs>;
    setUserTransaction(rq: SetUserTransactionRq): Promise<void>;
    updateUserTransaction(rq: )
}

@Route('userTransaction')
export class UserTransactionController extends SuperController implements IUserTransactionController {
    private _userTransactionManager: UserTransactionManager;

    constructor() {
        super();
        this._userTransactionManager = new UserTransactionManager();
    }

    @Get()
    @Security(JWT)
    @Validate
    public async getUserTransaction(@Queries() rq: GetUserTransactionRq): Promise<GetUserTransactionRs> {
        return await this._userTransactionManager.getUserTransaction(rq);
    }  

    @Post()
    @Security(JWT)
    @Validate
    public async setUserTransaction(@Body() rq: SetUserTransactionRq): Promise<void> {
        return await this._userTransactionManager.setUserTransaction(rq);
    }


}