import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ConsumeService {

  private url: string = " https://inventory-1-xnav.onrender.com"

  constructor(private httpClient: HttpClient) { }

  public postRequest(endpoint: string, data: any, token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
      "Content-type": "application/json",
      // "ngrok-skip-browser-warning": "6024"
    });
    return this.httpClient.post(`${this.url}${endpoint}`, JSON.stringify(data), { headers: headers, responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError)
      );
  }
  public postFormData(endpoint: string, formData: any, token: string | null = null): Observable<any> {
    let headers = new HttpHeaders({
      // "ngrok-skip-browser-warning": "6024"
    });

    if (token) {
      headers = headers.append("Authorization", `Bearer ${token}`);
    }

    return this.httpClient.post(`${this.url}${endpoint}`, formData, { headers: headers, responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError)
      );
  }

  // GET Request
  public getRequest(endpoint: string, token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
    });
    return this.httpClient.get(`${this.url}${endpoint}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // PUT Request
  public putRequest(endpoint: string, data: any, token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
      "Content-type": "application/json",
    });

    return this.httpClient.put(`${this.url}${endpoint}`, JSON.stringify(data), { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }



  public getUrl() {
    return this.url;
  }
}

