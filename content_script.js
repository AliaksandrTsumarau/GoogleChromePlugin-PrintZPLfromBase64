var printKeyStr;
var apiUrl = 'https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/';
var imgWidth = 500;
//var dialogTop = '50px';

_createObjectURL = function(blob) {
    var objURL = URL.createObjectURL(blob);
    this.objectURLs = this.objectURLs || [];
    this.objectURLs.push(objURL);
    return objURL;
};

_fetchLabel = function(base64decodedLabelRequest) {
    var imageUrl = apiUrl + base64decodedLabelRequest;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', imageUrl);
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var img = document.createElement('img');
        img.setAttribute('data-src', imageUrl);
        img.style.border='3px solid black';
        img.width = imgWidth;
        img.className = 'icon';
        var objURL = _createObjectURL(xhr.response);
        img.setAttribute('src', objURL);
        _displayLabel(img);
    };
    xhr.send();
};

_displayLabel = function(outputImg){
    var dialog = document.createElement("dialog");
    //dialog.style.top = dialogTop;
    dialog.appendChild(outputImg);
    outputImg.addEventListener("click", function() {
        dialog.close()
    })
    document.body.appendChild(dialog)
    dialog.showModal();
};

function printZplSelection() {

    var focused = document.activeElement;
    var selectedText;
    if (focused) {
        try {
            selectedText = focused.value.substring(
                focused.selectionStart, focused.selectionEnd);
        } catch (err) {
        }
    }
    if (selectedText == undefined) {
        var sel = window.getSelection();
        var selectedText = sel.toString();
    }

    base64decodedLabelRequest = window.atob(selectedText);

    _fetchLabel(base64decodedLabelRequest);
}

function onExtensionMessage(request) {
    if (request['printZplSelection'] != undefined) {
        if (!document.hasFocus()) {
            return;
        }
        printZplSelection();
    } else if (request['key'] != undefined) {
        printKeyStr = request['key'];
    }
}

function initContentScript() {
    chrome.extension.onRequest.addListener(onExtensionMessage);
    chrome.extension.sendRequest({'init': true}, onExtensionMessage);

    document.addEventListener('keydown', function(evt) {
        if (!document.hasFocus()) {
            return true;
        }
        var keyStr = keyEventToString(evt);
        if (keyStr == printKeyStr && printKeyStr.length > 0) {
            printZplSelection();
            evt.stopPropagation();
            evt.preventDefault();
            return false;
        }
        return true;
    }, false);
}

initContentScript();
