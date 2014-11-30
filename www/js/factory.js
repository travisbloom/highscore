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
        //save users set of items to local storage
        function saveItems() {
            $window.localStorage[localStorageKey] = JSON.stringify(highScores.savedItems);
            console.log(highScores.savedItems);
        }
        function getItems() {
            console.log($window.localStorage[localStorageKey]);
            try {
                return JSON.parse($window.localStorage[localStorageKey]);
            } catch (e) {
                return null;
            }
        }
        var time = new Date();
        var highScores = {
            //array of items to be saved to
            savedItems:  getItems()  || [
                {
                    id: 'mint',
                    highScore: 223,
                    currentScore: 2,
                    service: {
                        token: 'test'
                    },
                    history: [{
                        date: time.getTime(),
                        score: 2
                    }]
                },
                {
                    id: '0',
                    config: {
                        name: 'custom thing',
                        icon: 'ion-ios7-redo',
                        color: '#26335b',
                        type: 'num'
                    },
                    highScore: 4,
                    currentScore: 2,
                    incrementValue: 1,
                    history: [{
                        date: time.getTime(),
                        score: 2
                    }]
                },
                {
                    id: '1',
                    config: {
                        name: 'custom thing 2',
                        icon: 'ion-ios7-pulse',
                        color: '#16975b',
                        type: 'num'
                    },
                    highScore: 223,
                    currentScore: 2,
                    history: [{
                        date: time.getTime(),
                        score: 2
                    }]
                }
            ],
            //takes a stored obj from the backend and constructs a new highScore factory from it
            newItem: function (refObj) {
                //convert milliseconds to time Obj
                var history = refObj.history.map(function(datapoint){
                    return {
                        score: datapoint.score,
                        date: new Date(datapoint.date)
                    }
                });
                return {
                    id: refObj.id,
                    highScore: refObj.highScore,
                    currentScore: refObj.currentScore,
                    //adds config for set objects
                    config: refObj.config || setTypes[refObj.id],
                    incrementValue: refObj.incrementValue,
                    history: history,
                    saveObj: function (params) {
                        var obj = this;
                        Object.keys(params).forEach(function(key) {
                            obj[key] = params[key];
                            highScores.savedItems[refObj.index][key] = params[key];
                        });
                        saveItems();
                    },
                    newScore: function (score) {
                        var currentTime = new Date(), params;
                        currentTime = currentTime.getTime();
                        //if a new history record is being inserted and the previous record was less than 10 seconds old, override the oldest data point
                        if (currentTime - this.history[this.history.length - 1].date < 10000)
                            this.history.pop();
                        params = {
                            currentScore: score,
                            history: this.history.concat([{
                                date: currentTime,
                                score: score
                        }])
                        };
                        if (score > this.highScore)
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
