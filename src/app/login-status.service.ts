import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginStatusService {

  constructor() { }

  adminLoginStatus(){
  	var status = localStorage.getItem('sensegizAdminLogin')
  	if(status){
  		return true
  	}
  	else{
  		return false
  	}
  }


  getAdminLogin(){
    var status = localStorage.getItem('sensegizAdminLogin')
    console.log("login==",status)
    if(status){
      return status
    }
    else{
      return false
    }
  }



  logout(){
  	localStorage.clear()
  }




}
