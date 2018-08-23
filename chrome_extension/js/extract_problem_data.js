(function () {
  // The following selector might need to be updated if website is changed.
  const problemBodySelector = "[class^=question-description]";
  const problemTitleSelector = "[class^=question-title]";
  const topicSelector = "[id^=tags-topics]";
  const difficultySelector = "[class*=difficulty-label]";

  function startCollectData() {
    const content = document.querySelector(problemBodySelector);
    if (!content) {
      console.log("failed to extract problem contents. retry in 5s...");
      return;
    }

    const title = document.querySelector(problemTitleSelector);
    if (!title) {
      console.log("failed to extract title. retry in 5s...");
      return;
    }

    const topics = [];
    const topicTop = document.querySelector(topicSelector);
    if (topicTop) {
      for (const topic of topicTop.children) {
        const topicValue = topic.textContent;
        if (topicValue && topicValue.length > 0) {
          topics.push(topicValue);
        }
      }
    } else {
      console.log("failed to extract topics.");
    }

    let difficulty = document.querySelector(difficultySelector);
    if (difficulty) {
      difficulty = difficulty.textContent || "";
    } else {
      console.log("failed to extract difficulty.");
    }

    let result = {
      title: title.textContent || "",
      content: content.innerHTML || "",
      topics: topics,
      url: window.location.href
    };
    if (difficulty) {
      result['difficulty'] = difficulty;
    }
    console.log(result);
    return result;
  }

  //  setTimeout(startCollectData, 500);
  
  chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    const command = request.cmd;
    if (command === Settings.commands.ExtractProblemCmd ) {
      const problem = startCollectData();
      sendResponse({
        cmd: Settings.commands.ProblemContents ,
        data: problem
      });
      // This is required by a Chrome Extension
      return true; 
    }
  });
  console.log("content script has been injected. ",Settings.commands);

})();
