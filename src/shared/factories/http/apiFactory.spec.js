describe('apiFactory', () => {
  var authFactory, $httpBackend, $rootScope, apiFactory, $q, responseHandler;
  var authResponse = 'facebookAuth';
  var baseUrl = 'http://baseUrl.com';
  var path = '/testPath';
  beforeEach(angular.mock.module('highScoreApp', ($provide) => {
    $provide.value('appConfig', {
      facebook: { clientId: 'test'},
      twitter: { clientId: 'test'},
      env: 'dev',
      envs: {
        dev: {
          apiUri: baseUrl
        }
      }
    });
  }));
  beforeEach(inject((_apiFactory_, _authFactory_, _$httpBackend_, _$rootScope_, _$q_) => {
    authFactory = _authFactory_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    apiFactory = _apiFactory_;
    $q = _$q_;
    responseHandler = $httpBackend.when('POST').respond({userId: 'userX'});
  }));
  beforeEach(() => {
    spyOn(authFactory, 'getAuth').and.callFake(() => $q.when(authResponse));
  });
  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should append query params to the post request', () => {
    apiFactory.scoreRequest('facebook', path, {test: 'test'});
    $httpBackend.expect('POST', baseUrl + path + '?test=test');
    $httpBackend.flush();
  });

  it('should retry the request once if the server says the token expired', () => {
    apiFactory.scoreRequest('facebook', path, {test: 'test'});
    $httpBackend.expect('POST', baseUrl + path + '?test=test').respond(401, {expiredToken: true});
    $httpBackend.flush();
    expect(authFactory.getAuth.calls.count()).toEqual(2);
  });
});