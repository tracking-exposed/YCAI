import {
  available,
  compose,
  param,
  product,
  queryShallow,
  queryStrict,
} from 'avenger';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { AccountSettings } from 'models/AccountSettings';
import { LocalLookup } from 'models/MessageRequest';
import { Video } from '../models/Video';
import { Recommendation } from '../models/Recommendation';
import { catchRuntimeLastError } from '../providers/browser.provider';
import { bo } from '../utils/browser.utils';
import { fetchTE } from './HTTPAPI';
import { ContentCreator } from '../models/ContentCreator';

export const CREATOR_CHANNEL_KEY = 'creator-channel';
export const CURRENT_VIDEO_ON_EDIT = 'current-video-on-edit';

export const accountSettings = queryStrict(() => {
  return pipe(
    TE.tryCatch(
      () =>
        new Promise<AccountSettings>((resolve) => {
          bo.runtime.sendMessage<any, AccountSettings>(
            { type: LocalLookup.value },
            resolve
          );
        }),
      E.toError
    ),
    TE.chain(catchRuntimeLastError)
  );
}, available);

export const creatorRecommendations = compose(
  product({ accountSettings, params: param() }),
  queryShallow(
    ({ accountSettings, params }) =>
      fetchTE<Recommendation[]>(
        `/v3/creator/recommendations/${accountSettings.publicKey}`,
        params
      ),
    available
  )
);

export const creatorVideos = compose(
  accountSettings,
  queryStrict((settings): TE.TaskEither<Error, Video[]> => {
    if (settings.channelCreatorId !== null) {
      return fetchTE(`/v3/creator/videos/${settings.channelCreatorId}`);
    }
    return TE.right([]);
  }, available)
);

export const recommendedChannels = compose(
  product({ accountSettings, params: param() }),
  queryStrict(({ accountSettings, params }) => {
    if (accountSettings.channelCreatorId !== null) {
      return fetchTE(
        `/v3/profile/recommendations/${accountSettings.channelCreatorId}`,
        params
      );
    }
    return TE.right([]);
  }, available)
);

export const videoRecommendations = queryShallow(
  ({ videoId }: { videoId: string }): TE.TaskEither<Error, Recommendation[]> =>
    fetchTE(`/v3/video/${videoId}/recommendations`),
  available
);

export const ccRelatedUsers = queryShallow(
  ({
    channelId,
    amount,
  }: {
    channelId: string;
    amount: number;
  }): TE.TaskEither<Error, ContentCreator[]> =>
    pipe(
      fetchTE(`/v3/creator/${channelId}/related/${amount}-0`),
      TE.map(d => d.content)
    ),
  available
);
