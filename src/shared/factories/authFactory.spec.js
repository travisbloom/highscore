describe('authFactory', () => {
  var authFactory, $cordovaOauth, $rootScope;
  var userDataFactory = {
    providers: {
      facebook: null
    }
  };
  beforeEach(angular.mock.module('highScoreApp', ($provide) => {
    $provide.value('userDataFactory', userDataFactory);
  }));
  beforeEach(inject((_authFactory_, _$cordovaOauth_, _$rootScope_) => {
    authFactory = _authFactory_;
    $cordovaOauth = _$cordovaOauth_;
    $rootScope = _$rootScope_;
  }));

  it('should instantly return providers that have previously been authenticated', () => {
    userDataFactory.providers.facebook = true;
    spyOn($cordovaOauth, 'facebook');
    authFactory.getAuth('facebook');
    $rootScope.$apply();
    expect($cordovaOauth.facebook).not.toHaveBeenCalled();
  });

  it('should call $cordovaAuth if the provider doesn\'nt exist', () => {
    userDataFactory.providers.facebook = false;
    spyOn($cordovaOauth, 'facebook').and.returnValue({
      then(callback) { return callback(); }
    });
    authFactory.getAuth('facebook');
    $rootScope.$apply();
    expect($cordovaOauth.facebook).toHaveBeenCalled();
  });
});