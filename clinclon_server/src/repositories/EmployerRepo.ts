import dotenv from "dotenv";
import { GetEmployerRs } from "../models/Employer";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import ResponseException from "../models/ResponseException";
import Repositories from "./Repositories";
dotenv.config();


interface IEmployerRepo {
    getEmployer(id: number): Promise<GetEmployerRs>;
}

class EmployerRepo extends Repositories implements IEmployerRepo {

    async getEmployer(id: number): Promise<GetEmployerRs> {
        try {
            const sql = `SELECT 
                            u.first_name, 
                            u.last_name,
                            u.email_address, 
                            ut.mode 
                        FROM users u
                        INNER JOIN user_transaction ut ON ut.service_provider_id = u.user_id
                        WHERE ut.employer_user_id = $1;`
            const data = await this.queryDB(sql, [id]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetEmployerRs);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to get from db");
        }
    }
} 

export default EmployerRepo;