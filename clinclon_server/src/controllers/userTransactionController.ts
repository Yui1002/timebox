import UserTransactionManager from '../managers/userTransactionManager';
import SuperController from './SuperController';
import { GetUserTransactionRq } from '../models/UserTransaction';

interface IUserTransactionController {
    getUserTransaction(request: any, response: any, next: any): Promise<void>;
}

class UserTransactionController extends SuperController implements IUserTransactionController {
    private _userTransactionManager: UserTransactionManager;

    constructor() {
        super();
        this._userTransactionManager = new UserTransactionManager();
    }

    public async getUserTransaction(request: any, res: any, next: any): Promise<void> {
        try {
            let parsedRq = this._validator.validateBody<GetUserTransactionRq>(request, new GetUserTransactionRq());
            let response = await this._userTransactionManager.getUserTransaction(parsedRq);
            return res.status(200).json(response);
        } 
        catch (e: any) {
            next(e);
        }
    }  
}

export default UserTransactionController;