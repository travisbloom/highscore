/***
 * src
 ***/
import {stateConfig, cordovaRun, httpIntercept} from './config.js';
/***
 * .tmp
 ***/
import templateCache from '../.tmp/templateCache.js';
/***
* shared
***/
//globals
import appConfig from './shared/globals/appConfig.js';
import providerOptions from './shared/globals/providerOptions.js';
import scoreOptions from './shared/globals/scoreOptions.js';
//factories
import apiFactory from './shared/factories/http/apiFactory.js';
import authFactory from './shared/factories/http/authFactory.js';
import notificationFactory from './shared/factories/notificationFactory.js';
import ScoreConstructorFactory from './shared/factories/scores/scoreConstructorFactory.js';
import scoresFactory from './shared/factories/scores/scoresFactory.js';
import userDataFactory from './shared/factories/userDataFactory.js';
//directives
import scoreConfigOptions from './shared/directives/scoreConfigOptions/scoreConfigOptions.js';
/***
 * components
 ***/
import mainController from './components/main/main.js';
import newScoreController from './components/newScore/newScore.js';
import scoreController from './components/score/score.js';
import scoresListController from './components/scoresList/scoresList.js';

angular
  .module('highScoreApp', ['ionic', 'ngCordovaOauth', 'n3-line-chart'])

    .run(cordovaRun)
    .run(templateCache)

    .config(stateConfig)
    .config(httpIntercept)

    //inject 3rd party libraries (makes testing easier)
    .value('moment', moment)
    .value('appConfig', appConfig)
    .value('providerOptions', providerOptions)
    .value('scoreOptions', scoreOptions)

    .factory('apiFactory', apiFactory)
    .factory('authFactory', authFactory)
    .factory('notificationFactory', notificationFactory)
    .factory('ScoreConstructorFactory', ScoreConstructorFactory)
    .factory('scoresFactory', scoresFactory)
    .factory('userDataFactory', userDataFactory)

    .directive('scoreConfigOptions', scoreConfigOptions)

    .controller('mainController', mainController)
    .controller('newScoreController', newScoreController)
    .controller('scoreController', scoreController)
    .controller('scoresListController', scoresListController);

