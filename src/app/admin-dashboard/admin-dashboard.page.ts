import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { LoginStatusService } from '../login-status.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import {Router} from '@angular/router';
import { FormGroup,Validators,FormBuilder } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { GeneralMethodsService } from '../general-methods.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit {

userAssigned:any=[]
loginData:any
scannedData:any=[]
deviceDetails:any


  constructor(
    private api:ApiService,
    private login:LoginStatusService,
    private router:Router,
    private qrScanner: QRScanner,
    private barcodeScanner: BarcodeScanner,
    private fb:FormBuilder,
    private generalServices:GeneralMethodsService,
    ) {
      this.deviceDetails=this.fb.group({
        deviceId:['',Validators.required],
        deviceName:['',Validators.required],

      })

    }

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


brCodeScanner(){
  this.barcodeScanner.scan().then(barcodeData => {
   console.log('Barcode data', barcodeData);
   this.deviceDetails.patchValue({
     deviceId:barcodeData.text
   })
  }).catch(err => {
      console.log('Error', err);
  });
}




qrCodeScanner(){
  console.log("scan try")
  this.qrScanner.prepare()
  .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted
       console.log("scan inside")

       // start scanning
       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         console.log('Scanned something', text);
         this.scannedData=text
         this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
         console.log("scan inside closed")
       });

     } else if (status.denied) {
       console.log("scan not allowed")
       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there.
     } else {
       console.log("scan else loop")
       // permission was denied, but not permanently. You can ask for permission again at a later time.
     }
  })
  .catch((e: any) => console.log('Error is', e));

}

submit(data){
  this.returnUserId()

   data.userId=this.loginData.userId
   console.log("submit data===",data)
  this.api.assignUser(data).then((res:any)=>{
    console.log("res====",res)
    if(res.status){
      this.generalServices.toast("User updated successfully...!!!")
    }
    else if(!res.status && res.alreadyExisted){
      this.generalServices.toast("Device already assigned, Try different device")
    }
    else if(!res.status && res.nameAlreadyExisted){
      this.generalServices.toast("User already assigned, Try different user")
    }
  })
}

logout(){
  this.login.logout()
  this.router.navigate(['/admin-login'])
}


}
