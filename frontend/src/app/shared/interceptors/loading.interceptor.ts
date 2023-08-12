import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

var pendingRequests = 0;

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const loadingTimeout = setTimeout(() => {
      this.loadingService.showLoading();
    }, 400);
    pendingRequests = pendingRequests + 1;
    return next.handle(request).pipe(
      tap({
        next:(event) => {
          if(event.type === HttpEventType.Response){
            clearTimeout(loadingTimeout);
            this.handleHideLoading();
          }
        },
        error: (_) => {
          clearTimeout(loadingTimeout);
          this.handleHideLoading();
        }
      })
    );
  }

  handleHideLoading(){
    pendingRequests = pendingRequests - 1;
    if(pendingRequests === 0)
    this.loadingService.hideLoading();
  }
}
