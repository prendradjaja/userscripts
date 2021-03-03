// Emulates Puzzle Storm on any of Lichess's puzzle modes

const solutionOpened = {};

function getPuzzleId() {
  return document.querySelector('.infos.puzzle a').innerText;
}

function clickViewSolution() {
  document.querySelector('.view_solution a.button').click()
}

function clickContinueTraining() {
  const moreLinks = document.querySelectorAll('.puzzle__more a');
  assert(moreLinks.length === 2 && moreLinks[1].innerText === 'Continue training',
         'Could not find "Continue training" link');
  const continueTraining = moreLinks[1];
  continueTraining.click();
}

function isFailed() {
  return !!document.querySelector('.puzzle__feedback.fail');
}

function assert(condition, message) {
  if (!condition) {
    window.alert("Error from userscript: " + message);
    throw new Error(message);
  }
}

// TODO use queryUntilExists or similar. also minimize waiting time
setInterval(() => {
  if (isFailed()) {
    const puzzleId = getPuzzleId();
    if (!solutionOpened[puzzleId]) {
      solutionOpened[puzzleId] = true;
      setTimeout(() => {
        clickViewSolution();
        setTimeout(() => {
          clickContinueTraining();
        }, 500);
      }, 500);
    }
  }
}, 50);
