import { IndexedDBService } from './../../../services/indexed-db.service';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  rform!: FormGroup
  pass:any;
  confirmPass:any
  constructor( private fb : FormBuilder,
   private authService :AuthService,
   private indexedDBService :IndexedDBService){

  }
ngOnInit(): void {
 this.rform = this.fb.group({
  name: new FormControl(''),
  lastName:new FormControl(''),
  email:new FormControl(''),
  password:new FormControl(''),
  confirmPassword:new FormControl('')
 })
 
}

submit(){
   if(this.rform.controls['password'].value === this.rform.controls['confirmPassword'].value){

    this.rform.controls['password'].patchValue(this.pass)
    this.postSync(this.rform.value)
    
  }
   }


   postSync(data:any) {
    
    //api call

    this.authService.register(this.rform.value).subscribe(
      (res:any) => {
        console.log(res);
      },
      (err:any) => {
        console.log("🚀 ~ file: register.component.ts:59 ~ RegisterComponent ~ postSync ~ err:", err)
        this.indexedDBService
          .addUser(data)
          .then(this.backgroundSync)
          .catch(console.log);
        //this.backgroundSync();
      }
    );
  }
      

  backgroundSync() {
    navigator.serviceWorker.ready
      .then((swRegistration:any) => swRegistration.sync.register('register'))
      .catch(console.log);
  }
   
}
