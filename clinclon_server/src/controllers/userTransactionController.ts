import UserTransactionManager from '../managers/userTransactionManager';
import SuperController from './SuperController';
import { GetUserTransactionRq, GetUserTransactionRs } from '../models/UserTransaction';
import { Get, Queries, Route } from "tsoa";

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
    public async getUserTransaction(@Queries() rq: GetUserTransactionRq): Promise<GetUserTransactionRs> {
        const parsedRq = this._validator.validateBody<GetUserTransactionRq>(rq, new GetUserTransactionRq());
        return await this._userTransactionManager.getUserTransaction(parsedRq);
    }  
}