// # Welcome to the extension docs!
// Here you can learn how the extension works and, if this is what you aim for,
// where to put your hands to hack the code.
//
// ## Structure of the extension
// The extension has two parts:
//  - a content script
//  - event pages.
//
// The **content script** is the JavaScript code injected into the pornhub.com
// website. It can interact with the elements in the page to scrape the data and
// prepare the payload to be sent to the API.
//
// On the other side there are **event pages**. They are scripts triggered by
// some events sent from the **content script**. Since they run in *browser-space*,
// they have the permission (if granted) to do cross-domain requests,
// and [much more](https://developer.chrome.com/extensions/declare_permissions).
// All **event pages** are contained in the [`./background`](./background/app.html) folder.
// (the name is **background** for historical reasons and it might be subject of changes
// in the future).
//

// # Code

// Import other utils to handle the DOM and scrape data.
import { differenceInSeconds } from 'date-fns';
import _ from 'lodash';
import { Keypair } from 'models/Settings';
import { GetLogger } from '../utils/logger.utils';
import { config } from '../config';
import { API } from './api.provider';
import { ContributionEvent } from '@backend/models/ContributionEvent';

const ddLogger = GetLogger('data-donation');

const HISTORY_KEY = 'history';
const H1_SELECTOR = 'h1';
const RECOMMENDED_VIDEOS_SELECTOR = '.recommendedVideosContainer';
const NUMBER_OF_RETRANSMISSION = 3;

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

// Boot the user script. This is the first function called.
// Everything starts from here.
const boot = (keypair: Keypair, setState: SetState): void => {
  // this get executed on pornhub.com and it is the start of potrex extension
  ddLogger.debug('Version %s', config.REACT_APP_VERSION);

  const history = localStorage.getItem(HISTORY_KEY);
  if (history !== null) {
    profileStory = JSON.parse(history).length;
  }

  window.setInterval(function () {
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

/*
 * phases are all the div which can appears on the right bottom.
 * the function below is called in the code, when the condition is
 * met, and make append the proper span */
// const phases = {
//   video: { seen: videoSeen, wait: videoWait, send: videoSend },
//   counters: {
//     video: { seen: 0, wait: 0, send: 0 },
//   },
// };
// function phase(path: string): void {
//   const f = _.get(phases, path);
//   f(path);
// }

/* below the 'span creation' function mapped in the dict phases above */
// function videoWait(path: string): void {
//   buildSpan({
//     path,
//     position: 1,
//     text: 'waiting...',
//     duration: 400,
//   });
// }

// function videoSeen(path: string): void {
//   ddLogger.debug('Video seen %s', path);
//   buildSpan({
//     path,
//     position: 2,
//     text: 'Evidence collected',
//     duration: 11500,
//   });
//   const videoSeenDiv = document.querySelector<HTMLDivElement>('#video-seen');
//   if (videoSeenDiv !== null) {
//     videoSeenDiv.style.backgroundColor = '#c136b3';
//     videoSeenDiv.style.backgroundPosition = 'center';
//     videoSeenDiv.style.cursor = 'cell';
//     videoSeenDiv.onclick = () => {
//       if (testElement(document.body.innerHTML, 'body')) {
//         phase('video.send');
//         setState({ type: 'sent' });
//       }
//     };
//   }
// }

/* this function build the default span, some css sytes are
 * overriden in the calling function */
// function buildSpan(c: {
//   path: string;
//   position: number;
//   text: string;
//   duration: number;
// }): void {
//   let cnt = _.get(phases.counters, c.path);
//   cnt += 1;
//   const id = _.replace(c.path, /\./, '-');
//   _.set(phases.counters, c.path, cnt);

//   let infospan: HTMLSpanElement | null = null;
//   const fullt = c.text; /* `${cnt} ▣ ${c.text}`; */
//   if (cnt === 1) {
//     // console.log("+ building span for the first time", c, cnt);
//     infospan = document.createElement('span');
//     infospan.setAttribute('id', id);
//     infospan.style.position = 'fixed';
//     infospan.style.width = '120px';
//     infospan.style.textAlign = 'right';
//     infospan.style.height = '20px';
//     infospan.style.right = '5px';
//     infospan.style.color = 'lightgoldenrodyellow';
//     infospan.style.bottom = c.position * 16 + 'px';
//     (infospan.style as any).size = '0.5em';
//     infospan.style.padding = '4px';
//     infospan.style.zIndex = '9000';
//     infospan.style.borderRadius = '10px';
//     infospan.style.background = '#798e05';
//     infospan.textContent = fullt;
//     document.body.appendChild(infospan);
//     /* change infospan in jquery so no proble in apply .fadeOut */
//     infospan = document.querySelector<HTMLSpanElement>('#' + id);
//   } else {
//     infospan = document.querySelector<HTMLSpanElement>('#' + id);
//     if (infospan !== null) {
//       infospan.innerText = fullt;
//     }
//   }

//   const loadDiv = document.querySelector<HTMLDivElement>('#loadiv');
//   if (loadDiv !== null) {
//     loadDiv.style.display = 'block';
//   }
//   if (infospan !== null) {
//     infospan.style.display = 'flex';
//     // infospan.fadeOut({ duration: c.duration });
//   }
// }

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
  ddLogger.debug(`Test element %O for selector %s`, nodeHTML, selector);
  // this function look at the LENGTH of the proposed element.
  // if an element with the same size has been already sent with
  // this URL, this duplication is ignored.

  const s = _.size(nodeHTML);
  const exists = _.reduce(
    cache,
    function (memo, e, i) {
      const evalu = _.eq(e, s);
      /* console.log(memo, s, e, evalu, i); */
      if (!memo) {
        if (evalu) {
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
  window.clearInterval();
  // hub.event('windowUnload');
  // hub.register('windowUnload', sync.bind(null, hub));
  if (state.content.length > 0) {
    const uuids = _.size(_.uniq(_.map(state.content, 'randomUUID')));
    ddLogger.debug(
      'sync tot (%d)/(%d) %O with %O randomUUID(s)',
      state.content.length,
      state.incremental,
      JSON.stringify(_.countBy(state.content, 'type')),
      uuids
    );
    // Send timelines to the page handling the communication with the API.
    // This might be refactored using something compatible to the HUB architecture.

    ddLogger.error(`Sync with backend before leaving %O`, state.content);

    void API.v2.Public.AddEvents({
      Headers: {
        'X-YTtrex-Build': '',
        'X-YTtrex-Version': config.REACT_APP_VERSION,
        'X-YTtrex-PublicKey': '',
        'X-YTtrex-Signature': '',
      },
      Body: state.content,
    })();
    state.content = [];
  }
};

export { boot, flush };
