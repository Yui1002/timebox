import axios from 'axios';
import {
    Configuration,
    ConfigurationParameters,
    DefaultApiFactory,
    GetUserRs,
    SignInUserRq,
  } from '../swagger';

const basePath = "http://localhost:3000";

class TimeboxApiInjector {
    constructor() {

    }

    getConfiguration() {
        return new Configuration({
            basePath: basePath
        });
    }

    getAxiosInstance() {
        let axiosInstance = axios.create({
            headers: {
              "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3NDI3OTYwOTIsImV4cCI6MTc3NDMzMjA5MiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.fZn8aBIce3LIii2BYWGKeXcUPmftfxRV5HdqBSa-R1w"
            }
          });
        return axiosInstance;
    }

    getDefaultApiFactory() {
        let apiFactory = DefaultApiFactory(this.getConfiguration(), basePath, this.getAxiosInstance());
        return apiFactory;
    }
}

export default TimeboxApiInjector;