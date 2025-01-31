import express, { Response as ExResponse, Request as ExRequest } from "express";
const app = express();
const port = 3000;
import dotenv from "dotenv";
import ErrorHandler from "./middleware/ErrorHandler";
import { RegisterRoutes } from "../dist/routes"
import Validator from "./validators/Validator";
import { GetUserRequestValidator, ResetPasswordRequestValidator, SetUserRequestValidator, SignInUserRequestValidator } from "./validators/UserRequestValidator";
import { GetOTPRequestValidator, SetOTPRequestValidator } from "./validators/OTPRequestValidator";
import { GetEmployerRequestValidator } from "./validators/EmployerRequestValidator";
import { GetRecordRequestValidator, GetRecordByDateRequestValidator, GetRecordByPeriodRequestValidator, SetRecordRequestValidator, UpdateRecordRequestValidator } from "./validators/RecordRequestValidator";
import { GetRequestsValidator, GetRequestByEmailValidator, SetRequestValidator, UpdateRequestStatusValidator, GetRequestByStatuslValidator } from "./validators/RequestValidator";
import { GetServiceProviderRequestValidator, UpdateServiceProviderRequestValidator } from "./validators/ServiceProviderRequestValidator";
import { GetUserTransactionRequestValidator, SetUserTransactionRequestValidator } from "./validators/UserTransactionRequestValidator";
import swaggerUi from "swagger-ui-express";
import { GetUserScheduleRequestValidator, SetUserScheduleRequestValidator } from "./validators/UserScheduleValidator";
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeValidator();



app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("../dist/swagger.json"))
  );
});

app.use("/json", async (req: ExRequest, res: ExResponse) => {
  return res.send(await import("../dist/swagger.json"));
})

RegisterRoutes(app);


app.use(ErrorHandler);

app.listen(port, function () {
  console.log("Listening on port", this.address().port);
});

function initializeValidator() {
  Validator.Instance.addValidators([
      new GetUserRequestValidator(),
      new SetUserRequestValidator(),
      new SignInUserRequestValidator(),
      new ResetPasswordRequestValidator(),
      new GetOTPRequestValidator(),
      new SetOTPRequestValidator(),
      new GetServiceProviderRequestValidator(),
      new UpdateServiceProviderRequestValidator(),
      new GetEmployerRequestValidator(),
      new GetRecordRequestValidator(),
      new GetRecordByDateRequestValidator(),
      new GetRecordByPeriodRequestValidator(),
      new SetRecordRequestValidator(),
      new UpdateRecordRequestValidator(),
      new GetUserTransactionRequestValidator(),
      new GetRequestsValidator(),
      new GetRequestByEmailValidator(),
      new SetRequestValidator(),
      new UpdateRequestStatusValidator(),
      new GetRequestByStatuslValidator(),
      new SetUserTransactionRequestValidator(),
      new GetUserScheduleRequestValidator(),
      new SetUserScheduleRequestValidator(),
      
  ])
}