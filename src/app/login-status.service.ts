import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginStatusService {

  constructor() { }

  loginstatus(){
  	var status = localStorage.getItem('sensegizLogin')
  	if(status){
  		return true
  	}
  	else{
  		return false
  	}
  }



  logout(){
  	localStorage.clear()
  }




}
