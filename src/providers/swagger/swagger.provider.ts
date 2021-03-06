/**
 * Swagger provider
 *
 * Generate Swagger configuration from our endpoints definition
 *
 * Here is a the OpenAPI Specs used by swagger
 *
 * https://swagger.io/docs/specification/about/
 */

import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Record';
import * as S from 'fp-ts/lib/string';
import {
  MinimalEndpoint,
  MinimalEndpointInstance
} from 'ts-endpoint/lib/helpers';
import { getOpenAPISchema, HasOpenAPISchema } from './IOTSToOpenAPISchema';

interface ServerConfig {
  protocol: 'http' | 'https';
  host: string;
  port: number;
  basePath: string;
}

interface DocConfig {
  title: string;
  description: string;
  version: string;
  endpoints: {
    // version
    [key: string]: {
      // scope (public, creator)
      [key: string]: {
        // endpoint name
        [key: string]: MinimalEndpointInstance;
      };
    };
  };
  models: {
    [key: string]: HasOpenAPISchema;
  };
  server: ServerConfig;
  components: {
    security: {
      [key: string]: {
        type: 'http' | 'apiKey';
        name: string;
        in: 'header';
        scheme?: 'bearer';
        bearerFormat?: 'JWT';
      };
    };
  };
  security: [{ [key: string]: string[] }];
}

/**
 * Check the endpoint has body defined
 *
 */
const hasRequestBody = <E extends MinimalEndpoint>(e: E): boolean => {
  return (
    (e.Method === 'POST' || e.Method === 'PUT') &&
    (e.Input as any)?.Body !== undefined
  );
};

/**
 * generate the Open API schema from endpoint
 */
const apiSchemaFromEndpoint = (
  key: string,
  e: MinimalEndpointInstance,
  tags: string[]
): any => {
  const path = e.getStaticPath((param: any) => `:${param}`);
  const responseStatusCode = e.Method === 'POST' ? 201 : 200;

  const input = e.Input;

  const Headers = (input as any).Headers;

  // derive headers from io-ts definition of e.Input.Headers
  const headerParameters =
    Headers !== undefined
      ? R.keys(Headers.props).reduce<any[]>(
          (acc, k) =>
            acc.concat({
              name: k,
              in: 'header',
              required: false,
              schema: getOpenAPISchema((Headers?.props)[k]),
            }),
          []
        )
      : [];

  // add security when "x-authorization" header is defined
  const security =
    Headers?.props?.['x-authorization'] !== undefined ? [{ ACTToken: [] }] : [];

  const Query = (input as any).Query;

  // derive query parameters from io-ts definition of e.Input.Query
  const queryParameters =
    Query !== undefined
      ? R.keys(Query.props).reduce<any[]>(
          (acc, k) =>
            acc.concat({
              name: k,
              in: 'query',
              required: Query?._tag === 'PartialType',
              schema: getOpenAPISchema((Query?.props)[k]),
            }),
          []
        )
      : [];

  // console.log('endpoint query', e.Input.Params);

  const Params = (input as any).Params;
  // derive path parameters from io-ts definition of e.Input.Params
  const pathParameters =
    Params !== undefined
      ? R.keys(Params.props).reduce<any[]>(
          (acc, k) =>
            acc.concat({
              name: k,
              in: 'path',
              required: true,
              schema: getOpenAPISchema((Params?.props)[k]),
            }),
          []
        )
      : [];

  // combine all parameters
  const parameters = [
    ...headerParameters,
    ...queryParameters,
    ...pathParameters,
  ];
  //   console.log('parameters', parameters);

  // add definition of request body, if needed
  const requestBody = hasRequestBody(e)
    ? {
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${(input as any).Body.name}`,
            },
          },
        },
      }
    : {};

  // define success response
  const successResponse = {
    [responseStatusCode]: {
      description: (e.Output as any).name,
      content: {
        'application/json': {
          schema: {
            $ref: `#/components/schemas/${(e.Output as any).name}`,
          },
        },
      },
    },
  };

  // TODO: define error response

  return {
    summary: key,
    description: `${e.Method} ${path}`,
    tags: tags,
    parameters,
    security,
    requestBody,
    responses: {
      ...successResponse,
    },
  };
};

const getPaths = (
  endpoints: DocConfig['endpoints']
): {
  paths: any;
  schemas: any;
} => {
  return pipe(
    endpoints,
    R.reduceWithIndex(S.Ord)(
      { paths: {}, schemas: {} },
      (versionKey, versionAcc, versionEndpoints) => {
        return pipe(
          versionEndpoints,
          R.reduceWithIndex(S.Ord)(
            versionAcc,
            (scopeKey, scopeAcc, scopeEndpoints) => {
              return pipe(
                scopeEndpoints,
                R.reduceWithIndex(S.Ord)(
                  { paths: {}, schemas: {} },
                  (key, endpointAcc, endpoint) => {
                    // get swagger compatible path
                    const endpointStaticPath = endpoint.getStaticPath(
                      (param) => `{${param}}`
                    );
                    const prevEndpoints =
                      (endpointAcc.paths as any)[endpointStaticPath] ??
                      undefined;

                    const previousMethodSchema =
                      prevEndpoints?.[endpoint.Method.toLowerCase()];
                    const currentEndpointSchema = apiSchemaFromEndpoint(
                      key,
                      endpoint,
                      [`${versionKey} - ${scopeKey}`]
                    );

                    const currentSchema = {
                      [(endpoint.Output as any).name]: getOpenAPISchema(
                        endpoint.Output as any
                      ),
                    };

                    return {
                      schemas: {
                        ...currentSchema,
                      },
                      paths: {
                        ...endpointAcc.paths,
                        [endpointStaticPath]: {
                          ...prevEndpoints,
                          ...previousMethodSchema,
                          [endpoint.Method.toLowerCase()]:
                            currentEndpointSchema,
                        },
                      },
                    };
                  }
                ),
                (endpointResult) => ({
                  schemas: { ...scopeAcc.schemas, ...endpointResult.schemas },
                  paths: { ...scopeAcc.paths, ...endpointResult.paths },
                })
              );
            }
          ),
          (defs) => ({
            paths: {
              ...versionAcc.paths,
              ...defs.paths,
            },
            schemas: {
              ...versionAcc.schemas,
              ...defs.schemas,
            },
          })
        );
      }
    )
  );
};

export const generateDoc = (config: DocConfig): any => {
  const { paths, schemas } = getPaths(config.endpoints);

  const modelSchema = pipe(
    config.models,
    R.reduceWithIndex(S.Ord)({}, (key, acc, model) => ({
      ...acc,
      [model.name]: getOpenAPISchema(model),
    }))
  );
  return {
    openapi: '3.0.3',
    info: {
      title: config.title,
      description: config.description,
      version: config.version,
    },
    servers: [
      {
        url: `{protocol}://{host}:{port}/{basePath}`,
        description: 'Node Server',
        variables: {
          protocol: { default: config.server.protocol },
          host: { default: config.server.host },
          port: {
            default: config.server.port,
          },
          basePath: {
            default: config.server.basePath,
          },
        },
      },
    ],
    security: config.security,
    components: {
      securitySchemes: config.components.security,
      schemas: {
        ...schemas,
        ...modelSchema
      },
    },
    paths: paths,
  };
};
