import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {map, Observable, of, Subscriber} from 'rxjs';
import {ILoginRequest} from '../interfaces/requests/auth/login-request';
import {IAuthResponse} from '../interfaces/responses/auth/auth-response';
import {IAuthData} from '../interfaces/auth-data';
import {Router} from '@angular/router';
import dayjs, {Dayjs} from 'dayjs';
import {IRefreshRequest} from '../interfaces/requests/auth/refresh.request';
import {ISignUpRequest} from '../interfaces/requests/auth/sign-up-request.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly _http = inject(HttpClient);
    private readonly _router = inject(Router);

    private readonly _apiPath = '/api/v1.0/auth';
    private refreshInProgress: boolean = false;
    private requests: CallerRequest[] = [];

    private readonly _accessToken = signal<string>(localStorage.getItem('access-token') ?? '');
    private readonly _refreshToken = signal<string>(localStorage.getItem('refresh-token') ?? '');

    private readonly _accessTokenPayload = computed(() => {
        if (!this._accessToken()) return undefined;

        const base64Url = this._accessToken().split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const json = window.atob(base64);
        return JSON.parse(json);
    });

    private readonly _authData = computed<IAuthData | undefined>(() => {
        if (!this._accessTokenPayload()) return undefined;

        return {
            email: this._accessTokenPayload().email,
            name: this._accessTokenPayload().username
        };
    });

    private readonly _accessTokenExpiresAt = computed<Dayjs | undefined>(() => {
        if (!this._accessTokenPayload()) return undefined;
        return dayjs.unix(this._accessTokenPayload().exp);
    });

    public readonly isAuthorized = computed(() => {
        return !!this._authData();
    });

    public readonly authData = computed(() => {
        return this._authData();
    });

    constructor() {
        this.renewAuth();

        effect(() => {
            localStorage.setItem('access-token', this._accessToken());
            localStorage.setItem('refresh-token', this._refreshToken());
        });
    }

    public signIn(request: ILoginRequest): Observable<void> {
        return this._http.post<IAuthResponse>(`${this._apiPath}/sign-in`, JSON.stringify(request)).pipe(
            map(authResponse => {
                this._accessToken.set(authResponse.accessToken);
                this._refreshToken.set(authResponse.refreshToken);
                this._router.navigate(['/']).then(() => {
                });
            }),
        );
    }

    public signUp(request: ISignUpRequest): Observable<void> {
        return this._http.post<IAuthResponse>(`${this._apiPath}/sign-up`, JSON.stringify(request)).pipe(
            map(authResponse => {
                this._accessToken.set(authResponse.accessToken);
                this._refreshToken.set(authResponse.refreshToken);
                this._router.navigate(['/']).then(() => {
                });
            }),
        );
    }

    public signOut(): void {
        this._accessToken.set('');
        this._refreshToken.set('');
        this._router.navigate(['auth', 'sign-in']).then(() => {
        });
    }

    public renewAuth(): Observable<void> {
        if(this._accessTokenExpiresAt()?.subtract(1, 'minute').isAfter(dayjs())) return of();

        let request: IRefreshRequest = {
            refreshToken: this._refreshToken(),
        };

        return this._http.post<IAuthResponse>(`${this._apiPath}/refresh`, JSON.stringify(request)).pipe(
            map(authResponse => {
                this._accessToken.set(authResponse.accessToken);
                this._refreshToken.set(authResponse.refreshToken);
            }),
        );
    }

    public addAuthorizationHeader(requestHeaders: HttpHeaders): HttpHeaders {
        if(!this.isAuthorized()) return requestHeaders;
        return requestHeaders.set('Authorization', `Bearer ${this._accessToken()}`);
    }

    public handleUnauthorizedError(subscriber: Subscriber<any>, request: HttpRequest<any>) {
        this.requests.push({
            subscriber: subscriber,
            failedRequest: request,
        });

        if (this.refreshInProgress) return;

        this.refreshInProgress = true;
        this.renewAuth().subscribe({
            next: () => {
                this.repeatFailedRequests();
            },
            error: () => {
                this._router.navigate(['auth', 'sign-in']).then(() => {
                });
            },
            complete: () => {
                this.refreshInProgress = false;
            },
        });
    }

    private repeatFailedRequests() {
        this.requests.forEach(callerRequest => {
            const request = callerRequest.failedRequest.clone({
                headers: this.addAuthorizationHeader(callerRequest.failedRequest.headers),
            });
            this.repeatRequest(request, callerRequest.subscriber);
        })
        this.requests = [];
    }

    private repeatRequest(request: HttpRequest<any>, subscriber: Subscriber<any>) {
        this._http.request(request).subscribe({
            next: response => subscriber.next(response),
            error: error => {
                if(error.status === 401) this.signOut();
                subscriber.error(error);
            },
            complete: () => subscriber.complete()
        });
    }
}

type CallerRequest = {
    subscriber: Subscriber<any>;
    failedRequest: HttpRequest<any>;
};
