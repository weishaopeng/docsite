'use strict';

const shell = require('shelljs');
const generateJSONFile = require('./generateJSONFile.js');
const generateHTMLFile = require('./generateHTMLFile.js');

const CWD = process.cwd();

const build = () => {
  shell.cd(CWD);

  // 模拟浏览器环境
  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  const dom = new JSDOM(
    '<!doctype html><html><body><head><link/><style></style><script></script></head><script></script></body></html>'
  );
  const { window } = dom;
  const copyProps = (src, target) => {
    const props = Object.getOwnPropertyNames(src)
      .filter(prop => typeof target[prop] === 'undefined')
      .map(prop => Object.getOwnPropertyDescriptor(src, prop));
    Object.defineProperties(target, props);
  };
  global.window = window;
  global.document = window.document;
  global.HTMLElement = window.HTMLElement;
  global.navigator = {
    userAgent: 'node.js',
  };
  copyProps(window, global);
  generateHTMLFile('prod', CWD);
  generateJSONFile('prod', CWD);
  shell.exec('./node_modules/gulp/bin/gulp.js build');
};

module.exports = build;
