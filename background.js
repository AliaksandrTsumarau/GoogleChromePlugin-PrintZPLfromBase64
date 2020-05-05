/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

var lastUtterance = '';
var globalUtteranceIndex = 0;

if (localStorage['lastVersionUsed'] != '1') {
  localStorage['lastVersionUsed'] = '1';
  chrome.tabs.create({
    url: chrome.extension.getURL('options.html')
  });
}

function initBackground() {
  loadContentScriptInAllTabs();

  var defaultKeyString = getDefaultKeyString();
  var keyString = localStorage['printZplKey'];
  if (keyString == undefined) {
    keyString = defaultKeyString;
    localStorage['printZplKey'] = keyString;
  }
  sendKeyToAllTabs(keyString);

  chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
        if (request['init']) {
          sendResponse({'key': localStorage['printZplKey']});
        }
      });

  chrome.browserAction.onClicked.addListener(
      function(tab) {
        chrome.tabs.sendRequest(
            tab.id,
            {'speakSelection': true});
      });
}

initBackground();
