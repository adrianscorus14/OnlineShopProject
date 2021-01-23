import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {


  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryShortName: string): Observable<State[]> {
    //search url
    const searchStateUrl = `${this.statesUrl}/search/findByCountryShortName?shortname=${countryShortName}`;
    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
      map(response => response._embedded.states)
    );


  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    //build an array for the dropdown list
    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    //build an array for the dropdown list
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 20;
    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }

    return of(data);
  }
}


interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}
interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
