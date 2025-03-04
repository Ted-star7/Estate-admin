import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.service';
import { SessionService } from './session.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let sessionService: jasmine.SpyObj<SessionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const sessionSpy = jasmine.createSpyObj('SessionService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: SessionService, useValue: sessionSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    sessionService = TestBed.inject(SessionService) as jasmine.SpyObj<SessionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow the authenticated user to access app', () => {
    sessionService.isLoggedIn.and.returnValue(true);
    expect(authGuard.canActivate(null as any, null as any)).toBeTrue();
  });

  it('should not allow the unauthenticated user to access app', () => {
    sessionService.isLoggedIn.and.returnValue(false);
    expect(authGuard.canActivate(null as any, null as any)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
