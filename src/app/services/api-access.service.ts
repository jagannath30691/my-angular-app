import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class ApiAccessService {

    private serverURI = 'http://localhost:8080/';

    constructor(private http: HttpClient) { }

    getRequest(endpoint: string) {
        return this.http
            .get<any>(this.serverURI + endpoint)
            .pipe(
                tap(result => console.log(result)),
                catchError(this.handleError<any>(`call to "${endpoint}" failed.`, []))
            );
    }

    postRequest(endpoint: string, payload: any) {
        return this.http
            .post(this.serverURI + endpoint, payload, httpOptions)
            .pipe(
                tap(result => console.log(result)),
                catchError(this.handleError<any>(`call to "${endpoint}" failed.`, []))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.error('handleError -->', error.message);

            return of(result as T);
        };
    }
}
