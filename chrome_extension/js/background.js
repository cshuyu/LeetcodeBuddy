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
  
  function postDataToServer(data) {
    const xhr = new goog.net.XhrIo();
    goog.net.XhrIo.send(Settings.postRatingUrl, function(e){
      const xhr = e.target;
      console.log(xhr);
      const obj = xhr.getResponse();
      console.log("got results: ", obj)
    }, "POST", data);
    
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
        try{
          postDataToServer(msg.data);
          callback({
            status: Settings.status.SUCC
          });
        } catch(e) {
          callback({
            status: Settings.status.ERROR,
            details: e.toString()
          });
        }
        
      }
    }
  });

})();
