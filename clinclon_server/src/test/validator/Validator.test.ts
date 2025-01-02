import { GetUserRequestValidator, SetUserRequestValidator } from "../../validators/UserRequestValidator";
import { GetUserRq, SetUserRq } from "../../models/User";
import ResponseException from "../../models/ResponseException";

describe("validate get user request", () => {
  let validator = new GetUserRequestValidator();
  let request = {
    body: {},
  };

  beforeEach(() => {
    request.body = {};
  });

  test("validate empty request", () => {
    expect(() => {
      validator.checkRequestEmpty(request);
    }).toThrow(ResponseException);
  });

  // test("validate GetUserRq instance", () => {
  //   request.body = {
  //     email: "test@gmail.com",
  //   };
  //   let instance = validator.validateAndConvertRequest(request);
  //   expect(instance).toBeInstanceOf(GetUserRq);
  // });

  // test("validate invalid email", () => {
  //   request.body = {
  //     email: "",
  //   };
  //   expect(() => {
  //       validator.validateAndConvertRequest(request)
  //   }).toThrow(ResponseException);
  // });
});

describe("validate set user request", () => {
  let validator = new SetUserRequestValidator();
  let request = {
    body: {},
  };

  beforeEach(() => {
    request.body = {};
  });

  test("validate SetUserRq instance", () => {
    request.body = {
      first_name: "Clin",
      last_name: "Clon",
      email: "test@gmail.com",
      password: "testest",
    };
    let instance = validator.validateAndConvertRequest(request);
    expect(instance).toBeInstanceOf(SetUserRq);
  });

  test("validate invalid email", () => {
    request.body = {
        first_name: "Clin",
        last_name: "Clon",
        email: "",
        password: "testest",
    };
    expect(() => {
        validator.validateAndConvertRequest(request)
    }).toThrow(ResponseException);
  });

  test("validate invalid password", () => {
    request.body = {
        first_name: "Clin",
        last_name: "Clon",
        email: "test@gmail.com",
        password: "",
    };
    expect(() => {
        validator.validateAndConvertRequest(request)
    }).toThrow(ResponseException);
  });
});
