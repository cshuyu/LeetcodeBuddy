(function () {
  chrome.runtime.onInstalled.addListener(function () {
    console.log("Installed successfully. ", Settings.commands);
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            schemes: ['https'],
            hostEquals: 'leetcode.com'
          },
        })
     ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
   }]);
  });

  function validateUpdateData(data) {
    return true;
  }

  function postDataToServer(data, succCallback, failCallback) {
    $.ajax({
        type: "POST",
        url: Settings.postRatingUrl,
        data: data,
        success: succCallback,
        dataType: "json"
      })
      .fail(failCallback);
  }

  function returnPostDataResult(resp) {
    chrome.runtime.sendMessage({
      cmd: Settings.commands.UploadResult,
      data: resp
    });
  }

  chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
    if (msg.cmd === Settings.commands.UploadProblemCompletion) {
      if (validateUpdateData(msg.data) == false) {
        callback({
          status: Settings.status.ERROR,
          details: "failed validation."
        });
        return;
      } else {
        console.log("send data to server: ", msg.data);
        try {
          postDataToServer(msg.data,
            /** succCallback */
            function (data, textStatus, jqXHR) {
              console.log("post rating succeed.");
              returnPostDataResult({
                status: Settings.status.SUCC
              });
            },
            /** failCallback */
            function () {
              console.log("post rating failed.");
              returnPostDataResult({
                status: Settings.status.ERROR,
                details: "server reject"
              });
            });

        } catch (e) {
          returnPostDataResult({
            status: Settings.status.ERROR,
            details: e.toString()
          });
        }

      }
    }
  });

})();
