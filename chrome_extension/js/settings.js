/** This script defines all the configures used by the extension. */
const Settings = (function () {
  'use strict';

  /** 
   * The commands used to communicate among conten_script, popup script and 
   * background script. 
   */
  const commands = {
    ExtractProblemCmd: "ExtractProblemCmd",
    ProblemContents: "ProblemContents",
    UploadProblemCompletion: "UploadProblemCompletion"
  };
  
  const status = {
    SUCC: "SUCC",
    ERROR: "ERROR"
  };
  
  const host = "http://localhost:5000";
  const postRating = "/postRating";

  return {
    commands: commands,
    status: status,
    postRatingUrl: host+postRating
  };
}());
