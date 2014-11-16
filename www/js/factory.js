angular.module('starter')
    .factory('highScoreFactory', function() {
        var setTypes = {
            mint: {
                name: 'Mint',
                config: {
                    icon: 'ion-social-usd',
                    color: '#26975b',
                    type: 'currency'
                }
            }
        };
        //takes a stored obj from the backend and constructs a new highScore factory from it
        var highScore = function(refObj) {
            console.log(refObj)
            //add a new current score, update the obj high score if the new score is higher
            refObj.newScore = function (score) {
              refObj.currentScore = score;
              if (score > refObj.highScore)
                refObj.highScore = score;
            };
            //add uncaptured attributes to noncustom highscores
            if (!refObj.name) {
                refObj.config = setTypes[refObj.id].config;
                refObj.name = setTypes[refObj.id].name;
            //build methods for custom highscores
            } else  {
                refObj.increment = function(amount) {
                    console.log(refObj);
                    console.log(amount);
                    //if the amount is a number, add it as the new score
                    if (!isNaN(amount))
                        return refObj.newScore(amount + refObj.currentScore);
                    //if there is no default incrementValue and a number is not passed
                    if (!refObj.incrementValue)
                        throw 'uncaught increment amount';
                    if (amount === 'down')
                        return refObj.newScore(-refObj.incrementValue + refObj.currentScore);
                    //default to adding the increment value
                    return refObj.newScore(refObj.incrementValue + refObj.currentScore);
                }
            }
            return refObj;
        };
        return highScore;
    });
