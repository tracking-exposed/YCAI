import { ContentCreator } from '@backend/models/ContentCreator';
import { sequenceS } from 'fp-ts/lib/Apply';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import { config } from '../config';
import * as Messages from '../models/Messages';
import { getDefaultSettings, Keypair, Settings } from '../models/Settings';
import { API, APIError, apiFromEndpoint } from '../providers/api.provider';
import {
  catchRuntimeLastError,
  toBrowserError,
} from '../providers/browser.provider';
import { bo } from '../utils/browser.utils';
import { fromStaticPath } from '../utils/endpoint.utils';
import { GetLogger } from '../utils/logger.utils';
import db, { AUTH_KEY, CONTENT_CREATOR } from './db';
import * as development from './reloadExtension';
import * as settings from './settings';
import security from '../providers/bs58.provider';

const bkgLogger = GetLogger('bkg');

export const getStorageKey = (type: string): string => {
  switch (type) {
    case Messages.GetKeypair.value:
      return settings.PUBLIC_KEYPAIR;
    case Messages.GetSettings.value:
    case Messages.UpdateSettings.value:
      return settings.SETTINGS_KEY;
    case Messages.GetAuth.value:
    case Messages.UpdateAuth.value:
      return AUTH_KEY;
    case Messages.GetContentCreator.value:
    case Messages.UpdateContentCreator.value:
      return CONTENT_CREATOR;
    default:
      return '';
  }
};

interface MessageHandlerError {
  type: typeof Messages.ErrorOccurred.value;
  response: {
    name: string;
    message: string;
    details: string[];
  };
}

const toMessageHandlerError = (
  e: chrome.runtime.LastError | APIError | Error
): MessageHandlerError => {
  if (e instanceof APIError) {
    return {
      type: Messages.ErrorOccurred.value,
      response: {
        name: e.name,
        message: e.message,
        details: [],
      },
    };
  }

  if (e instanceof Error) {
    return {
      type: Messages.ErrorOccurred.value,
      response: {
        name: e.name,
        message: e.message ?? 'An error occurred',
        details: [],
      },
    };
  }

  if (e.message !== undefined) {
    return {
      type: Messages.ErrorOccurred.value,
      response: {
        name: 'RuntimeLastError',
        message: e.message ?? 'An error occurred',
        details: [],
      },
    };
  }

  return {
    type: Messages.ErrorOccurred.value,
    response: {
      name: 'UnknownError',
      message: e.message ?? 'An error occurred',
      details: [],
    },
  };
};

const getMessageHandler = <
  M extends Messages.Messages[keyof Messages.Messages]
>(
  r: M['Request']
): TE.TaskEither<MessageHandlerError, M['Response']> => {
  switch (r.type) {
    // keypair
    case Messages.GenerateKeypair.value:
      return pipe(
        settings.generatePublicKeypair(''),
        TE.mapLeft(toMessageHandlerError)
      );
    case Messages.DeleteKeypair.value:
      return pipe(
        settings.deletePublicKeypair(),
        TE.mapLeft(toMessageHandlerError)
      );
    // gets
    case Messages.GetSettings.value:
    case Messages.GetKeypair.value:
    case Messages.GetAuth.value:
    case Messages.GetContentCreator.value:
      return pipe(
        db.get<any>(getStorageKey(r.type)),
        TE.mapLeft(toMessageHandlerError),
        TE.map((response) => ({ type: r.type, response }))
      );
    // updates
    case Messages.UpdateContentCreator.value:
    case Messages.UpdateSettings.value:
    case Messages.UpdateAuth.value:
      return pipe(
        db.update(getStorageKey(r.type), r.payload),
        TE.mapLeft(toMessageHandlerError),
        TE.map((response): M['Response'] => ({ type: r.type as any, response }))
      );
    case Messages.APIRequest.value:
      return pipe(
        fromStaticPath(r.payload?.staticPath, r.payload?.Input),
        O.fromNullable,
        TE.fromOption(() =>
          toMessageHandlerError(
            new Error(
              `No endpoint found by the given path: ${
                r.payload?.staticPath ?? ''
              }`
            )
          )
        ),
        TE.chain((e) =>
          pipe(
            apiFromEndpoint(e)(r.payload?.Input ?? {}),
            TE.chain((v) => TE.fromEither(catchRuntimeLastError(v))),
            TE.mapLeft(toMessageHandlerError)
          )
        ),
        TE.map((response): M['Response'] => ({
          type: Messages.APIRequest.value,
          response,
        }))
      );
    // sync events
    case Messages.SyncEvents.value:
      return pipe(
        db.get<Keypair>(getStorageKey(Messages.GetKeypair.value)),
        TE.chain((keypair) => {
          if (keypair !== null) {
            return pipe(
              security.makeSignature(r.payload, keypair.secretKey),
              TE.fromEither,
              TE.chain((signature) =>
                pipe(
                  API.v2.Public.AddEvents({
                    Headers: {
                      'X-YTtrex-Build': config.REACT_APP_VERSION,
                      'X-YTtrex-PublicKey': keypair.publicKey,
                      'X-YTtrex-Signature': signature,
                      'X-YTtrex-Version': config.REACT_APP_VERSION,
                    },
                    Body: r.payload ?? [],
                  }),
                  TE.chain((v) => TE.fromEither(catchRuntimeLastError(v))),
                  TE.map((response) => ({ type: r.type as any, response }))
                )
              )
            );
          }

          return TE.right({
            type: Messages.ErrorOccurred.value,
            response: toBrowserError(
              new Error(
                `Called ${Messages.SyncEvents.value} without valid keypair`
              )
            ),
          });
        }),
        TE.mapLeft(toMessageHandlerError)
      );
    default:
      return TE.right({
        type: Messages.ErrorOccurred.value,
        response: toBrowserError(
          new Error(`Message type ${r.type} does not exist.`)
        ),
      });
  }
};

bo.runtime.onMessage.addListener(
  (request: Messages.MessageType<any, any, any>, sender, sendResponse) => {
    // eslint-disable-next-line no-console
    bkgLogger.debug('message received %O %O', request, sender);

    if (config.NODE_ENV === 'development') {
      if (request.type === Messages.ReloadExtension.value) {
        development.reloadExtension();
      }
    }

    const validMessages = Object.keys(Messages);
    if (validMessages.includes(request.type)) {
      getMessageHandler(request)()
        .then((r) => {
          if (E.isRight(r)) {
            bkgLogger.debug(
              'Response for request %s: %O',
              request.type,
              r.right
            );
            return sendResponse(r.right);
          }

          // eslint-disable-next-line
          bkgLogger.error('Failed to process request %O', r.left);

          return undefined;
        })
        // eslint-disable-next-line
        .catch((e) => bkgLogger.error('An error occurred %O', e));

      // this enable async response
      return true;
    }
  }
);

bo.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    bkgLogger.debug('Extension installed %O', details);
    // launch install message
    void pipe(
      sequenceS(TE.ApplicativePar)({
        keypair: settings.generatePublicKeypair(''),
        profile: db.update(Messages.UpdateContentCreator.value, null),
        settings: db.update(
          Messages.UpdateSettings.value,
          getDefaultSettings()
        ),
      })
    )();
  } else if (details.reason === 'update') {
    // launch update message
    void pipe(
      sequenceS(TE.ApplicativePar)({
        keypair: pipe(
          db.get<Keypair>(getStorageKey(Messages.GetKeypair.value)),
          TE.chain(
            (
              r
            ): TE.TaskEither<
              chrome.runtime.LastError,
              | Messages.Messages['GenerateKeypair']['Response']
              | Messages.Messages['GetKeypair']['Response']
            > =>
              r === null
                ? settings.generatePublicKeypair('')
                : TE.right({ type: Messages.GetKeypair.value, response: r })
          )
        ),
        settings: pipe(
          db.get<Settings>(getStorageKey(Messages.GetSettings.value)),
          TE.chain((r) =>
            r === null
              ? db.update(
                  getStorageKey(Messages.GetSettings.value),
                  getDefaultSettings()
                )
              : TE.right(r)
          )
        ),
        // check profile is not `undefined` on extension update and set it to `null`
        profile: pipe(
          db.get<ContentCreator>(
            getStorageKey(Messages.GetContentCreator.value)
          ),
          TE.chain((r) =>
            r === undefined
              ? db.update(getStorageKey(Messages.GetContentCreator.value), null)
              : TE.right(r)
          )
        ),
      })
    )();
  }
});
