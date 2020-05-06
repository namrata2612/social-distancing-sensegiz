import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { LoginStatusService } from '../login-status.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import {Router} from '@angular/router'

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit {

userAssigned:any=[]
loginData:any

  constructor(
    private api:ApiService,
    private login:LoginStatusService,
    private router:Router,
    private qrScanner: QRScanner,
    ) { }

  ngOnInit() {
    var status = this.login.adminLoginStatus()
    if(status){
    }
    else{
      this.router.navigate(['/admin-login'])
    }


    this.loginData = this.login.getAdminLogin()
    this.loginData = JSON.parse(this.loginData)
    this.refreshUserAssigned()
  }

returnUserId(){
  this.loginData = this.login.getAdminLogin()
  this.loginData = JSON.parse(this.loginData)
}

refreshUserAssigned()
{
  this.returnUserId()
  var data={
    userId:this.loginData.userId
  }
	this.api.getUserAssigned(data).then((res:any)=>{
    console.log("res====",res)
		if(res.status){
			this.userAssigned=res.success
		}
	})
}


scanner(){
  this.qrScanner.prepare()
  .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted


       // start scanning
       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         console.log('Scanned something', text);

         this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
       });

     } else if (status.denied) {
       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there
     } else {
       // permission was denied, but not permanently. You can ask for permission again at a later time.
     }
  })
  .catch((e: any) => console.log('Error is', e));

}



logout(){
  this.login.logout()
  this.router.navigate(['/admin-login'])
}



}
