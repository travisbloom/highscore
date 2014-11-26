angular.module('starter')
    .factory('highScoreFactory', function($window) {
        var localStorageKey = 'highScoreData',
            setTypes = {
            mint: {
                name: 'Mint',
                icon: 'ion-social-usd',
                color: '#26975b',
                type: 'currency'
            }
        };
        function saveItems() {
            $window.localStorage[localStorageKey] = JSON.stringify(highScores.savedItems);
            console.log(highScores.savedItems);
        }
        var highScores = {
            savedItems: null,
            getItems: function () {
                console.log($window.localStorage[localStorageKey]);
                try {
                    return JSON.parse($window.localStorage[localStorageKey]);
                } catch (e) {
                    return null;
                }
            },
            //takes a stored obj from the backend and constructs a new highScore factory from it
            newItem: function (refObj) {
                //add a new current score, update the obj high score if the new score is higher
                console.log(refObj.config);
                return {
                    highScore: refObj.highScore,
                    currentScore: refObj.currentScore,
                    //adds config for set objects
                    config: refObj.config || setTypes[refObj.id],
                    incrementValue: refObj.incrementValue,
                    saveObj: function (params) {
                        var obj = this;
                        Object.keys(params).forEach(function(key) {
                            obj[key] = params[key];
                            highScores.savedItems[refObj.index][key] = params[key];
                        });
                        console.log(this);
                        saveItems();
                    },

                    newScore: function (score) {
                        var params = {
                            currentScore: score
                        };
                        if (score > refObj.highScore)
                            params.highScore = score;
                        this.saveObj(params);
                    },
                    increment: function (amount) {
                        //if the amount is a number, add it as the new score
                        if (!isNaN(amount))
                            return this.newScore(amount + this.currentScore);
                        //if there is no default incrementValue and a number is not passed
                        if (!this.incrementValue)
                            throw 'uncaught increment amount';
                        if (amount === 'down')
                            return this.newScore(-this.incrementValue + this.currentScore);
                        //default to adding the increment value
                        return this.newScore(this.incrementValue + this.currentScore);
                    }
                }
            }
        };
        return highScores;
    });
