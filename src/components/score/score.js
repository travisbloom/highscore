angular.module('highScoreApp')
  .controller('scoreController', function($stateParams, scoresFactory, $ionicModal, $ionicScrollDelegate, $state) {

    this.increment = increment.bind(this);
    this.saveNewScore = saveNewScore.bind(this);
    this.configureSettings = configureSettings.bind(this);
    this.deleteScore = deleteScore.bind(this);

    //default config for collapsible elements
    this.show = { config: false };
    //pull the score from the url params
    this.score = scoresFactory.getScores()[$stateParams.index];
    //set initial newScore params to the current score, ensures changes will be tracked
    this.changes = { newScore: this.score.currentScore };
    //graph config options
    this.options = {
      axes: {
        x: {
          key: 'date',
          //treat x axis as date
          type: 'date',
          //apply relative timing function to labels
          labelFunction(date){ return moment(date).fromNow(); },
          //number of x axis ticks
          ticks: 3
        }
      },
      series: [{
        y: 'score',
        thickness: '3px',
        type: "area"
      }],
      tooltip: {
        mode: 'scrubber',
        formatter(_, y) { return y; }
      },
      drawLegend: false,
      drawDots: false
    };
    /***
     * increment the score, refresh newScore to reflect update
     ***/
    function increment(direction) {
      this.score.increment(direction);
      this.changes.newScore = this.score.currentScore;
    }

    function saveNewScore() {
      this.score.saveObj({
        currentScore: this.changes.newScore
      });
      this.newScore = this.score.currentScore;
    }
    /***
     * open the config options if they are closed, close and save the update config options if they changed
     ***/
    function configureSettings() {
      this.show.config = !this.show.config;
      //if saving an open config
      if (!this.show.config) {
        $ionicScrollDelegate.scrollTop(true);
        this.score.saveObj({config: this.score.config});
      } else {
        $ionicScrollDelegate.scrollBottom(true);
      }
    }

    function deleteScore() {
      scoresFactory.deleteScore();
      $state.go('^.scoresList');
    }
  });
