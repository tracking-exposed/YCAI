const { chrome } = require('jest-chrome/lib/index.cjs');
const { SVGPathElement } = require('svgdom');

process.env.REACT_APP_BUILD_DATE = new Date().toISOString();

Object.assign((global.chrome = {}), chrome);
Object.assign((global.browser = {}), chrome);

global.window.SVGPathElement = SVGPathElement;
