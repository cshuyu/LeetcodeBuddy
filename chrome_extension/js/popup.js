(function () {
  console.log("popup script executed. ");
  const commands = Settings.commands;
  const STATUS = {
    NOT_SUBMITTED: 0,
    WAITING: 1,
    SUBMITTED: 2
  }
  let cached_detail = {};
  let status = STATUS.NOT_SUBMITTED;
  // Build sanitizer.
  const sanitizerBuilder = new goog.html.sanitizer.HtmlSanitizer.Builder();
  sanitizerBuilder.onlyAllowTags(["DIV", "STRONG", "SPAN", "P", "CODE"]);
  const sanitizer = sanitizerBuilder.build();

  /** Update the detail in popup window. */
  function updateProblemDetail(detail) {
    if (!detail) return;
    cached_detail = detail;

    document.getElementById('title').innerHTML =
      sanitizer.sanitize(detail.title).getTypedStringValue();
    document.getElementById('contents').innerHTML =
      sanitizer.sanitize(detail.content).getTypedStringValue();
    document.getElementById('difficulty').innerHTML =
      sanitizer.sanitize(detail.difficulty).getTypedStringValue();
  }

  /** Request popup window. */
  function requestProblemDetailCallback(message) {
    if (message.cmd === commands.ProblemContents) {
      updateProblemDetail(message.data);
    } else {
      console.log("failed to fetch problem detail: ", message);
    }
  }

  /** Submit event listener. */
  function submit() {
    if (status !== STATUS.NOT_SUBMITTED) {
      document.getElementById("status").innerText = "You have clicked submission. ";
      return;
    }
    status = STATUS.WAITING;
    const rating = document.getElementById("rating").value;
    const comments = document.getElementById("comments").value;
    cached_detail['rating'] = rating;
    cached_detail['comments'] = comments;
    chrome.runtime.sendMessage({
      cmd: commands.UploadProblemCompletion,
      data: cached_detail
    }, function (response) {});
    document.getElementById('submit').innerText = "Uploading...";
  }

  function init() {
    const submitBtn = document.getElementById("submit");
    if (!submitBtn) {
      setTimeout(init, 500);
      return false;
    }
    
    // Listener for background
    chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
      if (msg.cmd === Settings.commands.UploadResult) {
        if(msg.data.status == Settings.status.SUCC) {
          document.getElementById("submit").innerText = "Finished uploading.";
          status = STATUS.SUBMITTED;
        } else {
           document.getElementById("submit").innerText = "Failed uploading.";
          document.getElementById("status").innerText = msg.data.details;
           status = STATUS.NOT_SUBMITTED;        
        }
      }
    });

    submitBtn.addEventListener("click", submit);
    // Request problem detail.
    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(
        activeTab.id, {
          cmd: commands.ExtractProblemCmd
        },
        requestProblemDetailCallback
      )
    });
    console.log("initialized");
    return true;
  }

  setTimeout(init, 10);
})();
