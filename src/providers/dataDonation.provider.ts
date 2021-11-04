import { differenceInSeconds } from 'date-fns';
import _ from 'lodash';
import { Keypair } from 'models/Settings';
import { GetLogger } from '../utils/logger.utils';
import { config } from '../config';
import * as TE from 'fp-ts/lib/TaskEither';
import { ContributionEvent } from '@backend/models/ContributionEvent';
import { sendMessage } from './browser.provider';
import { Messages } from 'models/Messages';
import { pipe } from 'fp-ts/lib/function';

const ddLogger = GetLogger('data-donation');

const HISTORY_KEY = 'history';
const H1_SELECTOR = 'h1';
const RECOMMENDED_VIDEOS_SELECTOR = '.recommendedVideosContainer';
const NUMBER_OF_RETRANSMISSION = 3;

const FLUSH_INTERVAL = parseInt(
  config.REACT_APP_DATA_DONATION_FLUSH_INTERVAL,
  10
);


export type ContributionState =
  | { type: 'loading' }
  | { type: 'seen' }
  | { type: 'sent' };

type SetState = (s: ContributionState) => void;

interface CollectedState {
  incremental: number;
  content: ContributionEvent[];
}

const state: CollectedState = {
  incremental: 0,
  content: [],
};

function addVideo(e: ContributionEvent): void {
  state.content.push(e);
  state.incremental++;
}

// variable used to spot differences due to refresh and url change
let randomUUID =
  'INIT' +
  Math.random().toString(36).substring(2, 13) +
  Math.random().toString(36).substring(2, 13);

let profileStory: any = null;
let collectDataTimer: any;
let flushInterval: any;

// Boot the user script. This is the first function called.
// Everything starts from here.
const boot = (keypair: Keypair, setState: SetState): void => {
  // this get executed on pornhub.com and it is the start of potrex extension
  ddLogger.debug('Version %s', config.REACT_APP_VERSION);

  const history = localStorage.getItem(HISTORY_KEY);
  if (history !== null) {
    profileStory = JSON.parse(history).length;
  }

  // register flush timer

  flushInterval = setInterval(() => {
    flush();
  }, FLUSH_INTERVAL);

  collectDataTimer = setInterval(function () {
    setState({ type: 'loading' });
    const urlMatch = window.location.href !== lastVideoURL;
    ddLogger.debug(
      `Last url %s, current url %s, is different %s`,
      lastVideoURL,
      window.location.href,
      urlMatch
    );

    // client might duplicate the sending of the same
    // video. using a random identifier, we spot the
    // clones and drop them server side.
    // also, here is cleaned the cache declared below
    if (urlMatch) {
      setState({ type: 'seen' });
      cache = [];
      refreshUUID();
    }

    lastVideoURL = window.location.href;
    const genericElements = window.document.querySelectorAll(H1_SELECTOR);
    ddLogger.debug('Found h1 %O', genericElements);
    genericElements.forEach(function (el) {
      return processData(urlMatch, H1_SELECTOR, document.body, setState);
    });

    const recommendationEls = window.document.querySelectorAll<HTMLElement>(
      RECOMMENDED_VIDEOS_SELECTOR
    );
    ddLogger.debug('Found recommendations %O', recommendationEls);
    recommendationEls.forEach(function (el) {
      if (el !== null) {
        processData(urlMatch, RECOMMENDED_VIDEOS_SELECTOR, el, setState);
      }
    });
  }, videoPeriodicTimeout);
};

const videoPeriodicTimeout = 5000;
let lastVideoURL: string;
let lastVideoCNT = 0;

function processData(
  urlMatch: boolean,
  selector: string,
  e: HTMLElement,
  setState: SetState
): void {
  ddLogger.debug('check %s %O %d %s', selector, e, e.innerHTML);
  if (!urlMatch) {
    ddLogger.debug(`Url doesn't match...`);
    lastVideoCNT++;
    if (lastVideoCNT > NUMBER_OF_RETRANSMISSION) {
      ddLogger.debug(
        `Last video count (%d) greater than number of retransmission %d`,
        lastVideoCNT,
        NUMBER_OF_RETRANSMISSION
      );
      return;
    }
  }
  ddLogger.debug(
    `Selector %s match in %s, sending %d <- size: %d counters %d still < then %d`,
    selector,
    window.location.href,
    _.size(e.innerHTML),
    lastVideoCNT,
    NUMBER_OF_RETRANSMISSION
  );
  if (testElement(document.body.innerHTML, 'body')) {
    setState({
      type: 'sent',
    });
  }
}

let cache: any[] = [];
function testElement(nodeHTML: any, selector: string): boolean {
  ddLogger.debug(`Test html for selector %s`, selector);
  // this function look at the LENGTH of the proposed element.
  // if an element with the same size has been already sent with
  // this URL, this duplication is ignored.

  const s = _.size(nodeHTML);
  const exists = _.reduce(
    cache,
    function (memo, e, i) {
      const isEqual = _.eq(e, s);
      if (!memo) {
        if (isEqual) {
          memo = true;
        }
      }

      return memo;
    },
    false
  );

  if (exists) {
    ddLogger.debug('El exists in cache, returning...');
    return false;
  }
  if (s === 0) {
    ddLogger.debug('El size is 0, returning...');
    return false;
  }

  cache.push(s);

  addVideo({
    element: nodeHTML,
    href: window.location.href,
    clientTime: new Date().toISOString() as any,
    selector,
    size: s,
    randomUUID,
    profileStory,
    incremental: state.incremental + 1,
  });

  ddLogger.debug(
    `-> %d new element sent with selector %s at %s size %d cache %O`,
    _.size(cache),
    selector,
    Date(),
    s,
    cache
  );
  return true;
}

let lastCheck: Date;
const REFERENCE = 3;
function refreshUUID(): void {
  ddLogger.debug(`Refreshing the UUID with last check %s`, lastCheck);
  if (lastCheck !== undefined) {
    const timed = differenceInSeconds(new Date(), lastCheck);
    ddLogger.debug(`Time ellapsed %s`, timed);
    if (timed > REFERENCE) {
      // here is an example of a non secure random generation
      // but doesn't matter because the query on the server we
      // has this with the user publicKey, so if someone wants to
      // corrupt their data: they can ¯\_(ツ)_/¯
      randomUUID =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      ddLogger.debug('Refreshed randomUUID %s', randomUUID);
    } else {
      ddLogger.debug('Keep last randomUUID.');
    }
  }
  lastCheck = new Date();
}

const flush = (): void => {
  if (state.content.length > 0) {
    const uuids = _.size(_.uniq(_.map(state.content, 'randomUUID')));
    ddLogger.debug(
      'sync tot (%d)/(%d) %O with %O randomUUID(s)',
      state.content.length,
      state.incremental,
      JSON.stringify(_.countBy(state.content, 'type')),
      uuids
    );

    void pipe(
      sendMessage(Messages.SyncEvents)(state.content),
      // eslint-disable-next-line array-callback-return
      TE.map(() => {
        state.content = [];
      })
    )();
  }
};

const clear = (): void => {
  flush();
  clearInterval(flushInterval);
  clearInterval(collectDataTimer);
};

export { boot, flush, clear };
