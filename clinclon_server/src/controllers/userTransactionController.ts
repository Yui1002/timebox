import UserTransactionManager from '../managers/userTransactionManager';
import SuperController from './SuperController';
import { GetUserTransactionRq, GetUserTransactionRs } from '../models/UserTransaction';
import { Get, Queries, Route } from "tsoa";
import Validate from '../validators/CustomValidator';

interface IUserTransactionController {
    getUserTransaction(rq: GetUserTransactionRq): Promise<GetUserTransactionRs>;
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
}