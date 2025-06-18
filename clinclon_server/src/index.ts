import express, { Response as ExResponse, Request as ExRequest } from "express";
const app = express();
const port = 3000;
import dotenv from "dotenv";
import ErrorHandler from "./middleware/ErrorHandler";
import { RegisterRoutes } from "../dist/routes"
import Validator from "./validators/Validator";
import { GetUserByIdRequestValidator, GetUserRequestValidator, ResetPasswordRequestValidator, SetUserRequestValidator, SignInUserRequestValidator } from "./validators/UserRequestValidator";
import { GetOTPRequestValidator, SetOTPRequestValidator } from "./validators/OTPRequestValidator";
import { GetEmployerRequestValidator } from "./validators/EmployerRequestValidator";
import { GetRecordRequestValidator, GetRecordByPeriodRequestValidator, SetRecordRequestValidator, UpdateRecordRequestValidator, DeleteRecordRequestValidator } from "./validators/RecordRequestValidator";
import { GetRequestsValidator, GetRequestByEmailValidator, SetRequestValidator, UpdateRequestValidator, GetRequestByStatuslValidator } from "./validators/RequestValidator";
import { GetServiceProviderRequestValidator, UpdateServiceProviderRequestValidator } from "./validators/ServiceProviderRequestValidator";
import { GetUserTransactionRequestValidator, SetUserTransactionRequestValidator } from "./validators/UserTransactionRequestValidator";
import swaggerUi from "swagger-ui-express";
import { GetUserScheduleRequestValidator, SetUserScheduleRequestValidator, UpdateUserScheduleRequestValidator } from "./validators/UserScheduleValidator";
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
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
})


app.listen(port, '0.0.0.0', function () {
  console.log("Listening on port", this.address().port);
});

function initializeValidator() {
  Validator.Instance.addValidators([
      new GetUserRequestValidator(),
      new GetUserByIdRequestValidator(),
      new SetUserRequestValidator(),
      new SignInUserRequestValidator(),
      new ResetPasswordRequestValidator(),
      new GetOTPRequestValidator(),
      new SetOTPRequestValidator(),
      new GetServiceProviderRequestValidator(),
      new UpdateServiceProviderRequestValidator(),
      new GetEmployerRequestValidator(),
      new GetRecordRequestValidator(),
      new GetRecordByPeriodRequestValidator(),
      new SetRecordRequestValidator(),
      new UpdateRecordRequestValidator(),
      new DeleteRecordRequestValidator(),
      new GetUserTransactionRequestValidator(),
      new GetRequestsValidator(),
      new GetRequestByEmailValidator(),
      new SetRequestValidator(),
      new UpdateRequestValidator(),
      new GetRequestByStatuslValidator(),
      new SetUserTransactionRequestValidator(),
      new GetUserScheduleRequestValidator(),
      new SetUserScheduleRequestValidator(),
      new UpdateUserScheduleRequestValidator(),
  ])
}