import { Router, Routes } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
   private indexedDBService :IndexedDBService,
   private toastr :ToastrService,
   private router: Router){

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
      if( !navigator.onLine){
      let  alreadyUser :any;
         this.indexedDBService.getDBDate('user',data.email).then((e)=>{
          alreadyUser =e
          console.log("🚀 ~ file: register.component.ts:56 ~ RegisterComponent ~ postSync ~ alreadyUser:", alreadyUser)
          if(alreadyUser?.email === data?.email){
            this.toastr.error('Email already exists', `Error`); 
          }else{
            this.indexedDBService
            .addUser(data)
            .then((e)=>{
              this.backgroundSync()
              this.toastr.success('Registration succesful', `Succesful`); 
              this.router.navigate(['/auth/login'])
            })
            .catch(console.log);
          }
      })
     


       
       }

      }
    );
  }
      

  backgroundSync() {
    navigator.serviceWorker.ready
      .then((swRegistration:any) => {
       return swRegistration.sync.register('register')
      
      })
      .catch(console.log);
  
  }
   
}
