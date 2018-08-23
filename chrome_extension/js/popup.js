(function () {
  console.log("popup script executed. ");
  const commands = Settings.commands;
  let cached_detail = {};
  let submitted = false;
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
    if (submitted) {
      document.getElementById("status").innerText = "You have submitted. ";
      return ;
    }
    const rating = document.getElementById("rating").value;
    const comments = document.getElementById("comments").value;
    cached_detail['rating'] = rating;
    cached_detail['comments'] = comments;
    chrome.runtime.sendMessage({
      cmd: commands.UploadProblemCompletion,
      data: cached_detail
    }, function (response) {
        console.log("received response: ",response);
        if (response.status == Settings.status.SUCC) {
          document.getElementById("submit").innerText = "Finished uploading";
          submitted = true;
        } else {
          document.getElementById("submit").innerText = "Submit";
          document.getElementById("status").innerText = "Failed uploading: "+response.details;
        }
    });
    document.getElementById('submit').innerText = "Uploading...";
  }

  function init() {
    const submitBtn = document.getElementById("submit");
    if (!submitBtn) {
      setTimeout(init, 500);
      return false;
    }

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
