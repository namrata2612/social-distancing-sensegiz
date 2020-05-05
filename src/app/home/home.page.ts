import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { GeneralMethodsService } from '../general-methods.service';
import { LoginStatusService } from '../login-status.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	
  constructor(private qrScanner: QRScanner,
  private generalServices:GeneralMethodsService,
  private login:LoginStatusService,
  private router:Router) {
      var status = this.login.loginstatus()
        if(status){
          this.router.navigate(['/home'])
        }
        else{
          this.router.navigate(['/login'])

      }
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
  localStorage.clear()
  this.router.navigate(['/login'])
}

  	
}
