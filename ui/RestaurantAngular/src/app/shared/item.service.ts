import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http:HttpClient) { }

  getItemList(){
    return this.http.get(environment.apiURL+'/Item').toPromise();
  }
}
