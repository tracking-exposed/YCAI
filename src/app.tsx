/* eslint-disable */
import { ThemeProvider } from '@material-ui/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Recommendations } from './containers/Recommendations';
// import { Recommendations } from './containers/Recommendations';
import { YCAITheme } from './theme';

// const YT_VIDEOTITLE_SELECTOR = 'h1.title';
// const YOUCHOOSE_HREF_FREQUENCY_CHECK = 1000;
/* move watchers somewhere else in a more clean way */
// const hrefPERIODICmsCHECK = 9000;
// const nodePERIODICmsCHECK = 4000;
// let nodePeriodicCheck = nodePERIODICmsCHECK; // this check is dynamics, it grows if nothing change
// let hrefPeriodicCheck = hrefPERIODICmsCHECK;
// let lastVideoURL = null;
// let lastVideoCNT = 0;

// bo is the browser object, in chrome is named 'chrome', in firefox is 'browser'
// const bo = chrome || browser;

// variable used to spot differences due to refresh and url change
// let randomUUID =
//   'INIT' +
//   Math.random().toString(36).substring(2, 13) +
//   Math.random().toString(36).substring(2, 13);

/* UX modifier */
// function matchUXhackURL(locat) {
//   return locat.pathname.match(/\/watch/);
// }

// let lastObservedSize = null;
// function checkRecommendationStatus() {
//   const rw = $('.ytd-watch-next-secondary-results-renderer').clientWidth;
//   // eslint-disable-next-line no-console
//   console.log('please note this size is', rw, 'previous', lastObservedSize);
//   if (lastObservedSize === rw) {
//     return false;
//   }

//   // also check if fullscreen
//   lastObservedSize = rw;
//   return true;
// }

// let initializedWatchers = false;
// function initializeHackedYTUX() {
//   if (!initializedWatchers) {
//     // eslint-disable-next-line no-console
//     console.log('This should be the first time you see this, and the last');
//     initializedWatchers = true;
//   } else {
//     return;
//   }

//   /* actual code for monitoring */
//   const needResize = checkRecommendationStatus();
//   if (needResize) {
//     // eslint-disable-next-line no-console
//     console.log('we might wants to redraw?', lastObservedSize);
//   }

//   let diff = window.location.href !== lastVideoURL;
//   return diff;
// }

// Boot the user script. This is the first function called.
// Everything starts from here.
// function boot() {
//   if (_.endsWith(window.location.origin, 'youtube.tracking.exposed')) {
//     if (_.isUndefined($('#extension--parsable').html())) {
//       return null;
//     } else {
//       // $(".extension-missing").hide();
//       return null;
//     }
//   } else if (_.endsWith(window.location.origin, 'youtube.com')) {
//     // this get executed only on youtube.com

//     // Register all the event handlers.
//     // An event handler is a piece of code responsible for a specific task.
//     // You can learn more in the [`./handlers`](./handlers/index.html) directory.
//     registerHandlers(hub);

//     // Lookup the current user and decide what to do.
//     // localLookup((response) => {
//     //   // `response` contains the user's public key, we save it global to access them as config
//     //   config.publicKey = response.publicKey;
//     //   config.ux = response.active;
//     //   config.community = response.svg;
//     //   config.alphabeth = response.videorep;
//     //   // eslint-disable-next-line no-console
//     //   console.log(`YouChoose operative: ${JSON.stringify(config)}`);
//     //   // this makes
//     //   // hrefUpdateMonitor();
//     //   // flush();
//     // });
//   } else if (_.startsWith(window.location.origin, 'localhost')) {
//     // eslint-disable-next-line no-console
//     console.log('YCAI in localhost: ignored condition');
//     return null;
//   }

//   // this is the YouChoose specific main loop
//   // window.setInterval(function () {
//   //   if (matchUXhackURL(window.location)) {
//   //     const needrefresh = initializeHackedYTUX();
//   //     // remoteLookup fetch remotely if we've information about videoId or channelId,
//   //     // depending on what we're watching
//   //     if (needrefresh) {
//   //       // remoteLookup((response) => {
//   //       //   try {
//   //       //     const freshj = JSON.parse(response.response);
//   //       //     const uxstatus = updateUX(freshj);
//   //       //     // eslint-disable-next-line no-console
//   //       //     console.log('UXStatus:', uxstatus);
//   //       //   } catch (erro) {
//   //       //     // eslint-disable-next-line no-console
//   //       //     console.warn('unable to fetch recommendation and to trim UX', erro);
//   //       //   }
//   //       // });
//   //     }
//   //   }
//   // }, YOUCHOOSE_HREF_FREQUENCY_CHECK);
//   // and the execution loop in the iteration above
// }

// completed

// function phase (path) {
//     const f = _.get(phases, path);
//     f(path);
// }

// function hrefUpdateMonitor() {
//   window.setInterval(function () {
//     // phase('video.wait');
//     let diff = window.location.href !== lastVideoURL;

//     // client might duplicate the sending of the same
//     // video. using a random identifier, we spot the
//     // clones and drop them server side.
//     // also, here is cleaned the cache declared below
//     if (diff) {
//       // phase('video.seen');
//       cleanCache();
//       refreshUUID();
//     }
//     if (!diff) {
//       lastVideoCNT++;
//       if (lastVideoCNT > 3) {
//         // console.log(lastVideoCNT, "too many repetition: stop");
//         return;
//       }
//     }

//     lastVideoURL = window.location.href;
//     document.querySelectorAll(YT_VIDEOTITLE_SELECTOR).forEach(function () {
//       /*
//                 console.log("Video Selector match in ",
//                     window.location.href,
//                     ", sending",
//                     _.size($('ytd-app').html()),
//                     " <- ",
//                     $(YT_VIDEOTITLE_SELECTOR).length,
//                     $(YT_VIDEOTITLE_SELECTOR).text()
//                 ); */ if (sizeCheck($('ytd-app').html(), 'ytd-app')) {
//         // phase('video.send');
//       }
//     });
//   }, hrefPeriodicCheck);
// }

// let sizecache = [];
// function sizeCheck(nodeHTML, selector) {
//   // this function look at the LENGTH of the proposed element.
//   // this is used in video because the full html body page would be too big
//   // this is also a case of premature optimization. known mother of all evil.

//   // if an element with the same size has been already sent with
//   // this URL, this duplication is ignored.

//   const s = _.size(nodeHTML);
//   if (!s) {
//     return false;
//   }
//   if (sizecache.indexOf(s) !== -1) {
//     return false;
//   }

//   sizecache.push(s);
//   hub.event('newVideo', {
//     element: nodeHTML,
//     href: window.location.href,
//     when: Date(),
//     selector,
//     size: s,
//     randomUUID,
//   });
//   /* console.log("->",
//         _.size(sizecache),
//         "new href+content sent, selector", selector,
//         Date(), "size", s,
//         sizecache,
//     ); */
//   return true;
// }

// let contentcache = {};

// function cleanCache() {
//   contentcache = {};
//   sizecache = [];
// }

// var lastCheck = null;
// function refreshUUID() {
//   const REFERENCE = 3;
//   if (lastCheck && lastCheck.isValid && lastCheck.isValid()) {
//     var timed = moment.duration(moment() - lastCheck);
//     if (timed.asSeconds() > REFERENCE) {
//       // here is an example of a non secure random generation
//       // but doesn't matter because the query on the server we
//       // has this with the user publicKey, so if someone wants to
//       // corrupt their data: they can ¯\_(ツ)_/¯
//       randomUUID =
//         Math.random().toString(36).substring(2, 15) +
//         Math.random().toString(36).substring(2, 15); /*
//             console.log(
//                 "-> It is more than", REFERENCE, timed.asSeconds(),
//                 "Refreshed randomUUID", randomUUID); */
//     } else {
//       /*
//             console.log("-> It is less then", REFERENCE, timed.asSeconds()); */
//     }
//   }
//   lastCheck = moment(); // TODO understand and verify, should this be in the block above?
// }

// The function `remoteLookup` communicate the intention
// to the server of performing a certain test, and retrive
// the userPseudonym from the server, it is used here also to
// retrieve recommendations for a certain videoID
// function remoteLookup(callback) {
//   bo.runtime.sendMessage(
//     {
//       type: 'recommendationsFetch',
//       payload: {
//         ...config,
//         videoId: getVideoId(window.location.href),
//       },
//     },
//     callback
//   );
// }

// Before booting the app, we need to update the current configuration
// with some values we can retrieve only from the `chrome`space.

const ytRelatedVideoNode = document.querySelector('#related');
const ycRecommendations = document.querySelector('#yc-recommendations');

if (ytRelatedVideoNode !== null && ycRecommendations === null) {
  const ycMainNode = document.createElement('div');
  ycMainNode.id = 'yc-recommendations';
  ytRelatedVideoNode.prepend(ycMainNode);

  ReactDOM.render(
    <React.StrictMode>
      <ErrorBoundary>
        <ThemeProvider theme={YCAITheme}>
          <div style={{ marginBottom: 40 }}>
            <Recommendations />
          </div>
        </ThemeProvider>
      </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('yc-recommendations')
  );
}

// bo.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   console.log('tab updated', { tabId, changeInfo, tab });
// });