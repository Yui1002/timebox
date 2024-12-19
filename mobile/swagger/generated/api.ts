/* tslint:disable */
/* eslint-disable */
/**
 * server
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface Employer
 */
export interface Employer {
    /**
     * 
     * @type {string}
     * @memberof Employer
     */
    'firstName'?: string;
    /**
     * 
     * @type {string}
     * @memberof Employer
     */
    'lastName'?: string;
    /**
     * 
     * @type {string}
     * @memberof Employer
     */
    'email'?: string;
    /**
     * 
     * @type {Mode}
     * @memberof Employer
     */
    'mode'?: Mode;
}


/**
 * 
 * @export
 * @interface GetEmployerRq
 */
export interface GetEmployerRq {
    /**
     * 
     * @type {string}
     * @memberof GetEmployerRq
     */
    'email'?: string;
}
/**
 * 
 * @export
 * @interface GetEmployerRs
 */
export interface GetEmployerRs {
    /**
     * 
     * @type {Array<Employer>}
     * @memberof GetEmployerRs
     */
    'employers'?: Array<Employer>;
}
/**
 * 
 * @export
 * @enum {number}
 */

export const Mode = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;

export type Mode = typeof Mode[keyof typeof Mode];



/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {GetEmployerRq} getEmployerRq 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEmployer: async (getEmployerRq: GetEmployerRq, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'getEmployerRq' is not null or undefined
            assertParamExists('getEmployer', 'getEmployerRq', getEmployerRq)
            const localVarPath = `/employer`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(getEmployerRq, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {GetEmployerRq} getEmployerRq 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getEmployer(getEmployerRq: GetEmployerRq, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetEmployerRs>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getEmployer(getEmployerRq, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DefaultApi.getEmployer']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DefaultApiFp(configuration)
    return {
        /**
         * 
         * @param {GetEmployerRq} getEmployerRq 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEmployer(getEmployerRq: GetEmployerRq, options?: RawAxiosRequestConfig): AxiosPromise<GetEmployerRs> {
            return localVarFp.getEmployer(getEmployerRq, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @param {GetEmployerRq} getEmployerRq 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getEmployer(getEmployerRq: GetEmployerRq, options?: RawAxiosRequestConfig) {
        return DefaultApiFp(this.configuration).getEmployer(getEmployerRq, options).then((request) => request(this.axios, this.basePath));
    }
}



