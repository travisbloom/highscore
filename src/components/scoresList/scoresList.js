export default function scoresListController(scoresFactory, $location, notificationFactory) {
  this.show = {
    reorder: false,
    loading: false
  };
  //load high scores from local storage
  this.highScores = scoresFactory.getScores();

  this.reorderItem = scoresFactory.reorderScores;
  /***
   * 3rd party score functions
   ***/
  //trigger page loading view while score is updated
  this.refreshScore = refreshScore;
  /***
   * non-incrementing custom score functions
   ***/
  this.preventClick = (event) => event.stopPropagation();
  //used by input box
  this.newScore = newScore;
  /***
   * incrementing custom score functions
   ***/
  this.increment = increment;

  function increment(event, highScore, direction) {
    event.stopPropagation();
    highScore.increment(direction);
  }

  function newScore(event, highScore) {
    event.stopPropagation();
    highScore.saveObj({currentScore: highScore.newCurrent});
    highScore.newCurrent = null;
  }

  function refreshScore(event, highScore) {
    event.stopPropagation();
    highScore.loading = true;
    highScore.pullScore()
      .then(() => highScore.loading = false)
      .catch((error) => {
        highScore.loading = false;
        notificationFactory.show(error);
      });
  }
}

