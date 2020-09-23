import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { AuthenticationService } from "../services/authentication.service";
import { Observable } from 'rxjs';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private auth: AuthenticationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

        const authToken = this.auth.getToken();
        // Clone the request and set the new header in one step.
        const authReq = req.clone({ setHeaders: { Authorization: `Token ${authToken}` } });
        // send cloned request with header to the next handler.
        return next.handle(authReq);
    }
}