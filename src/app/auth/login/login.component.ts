import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private fb :FormBuilder,
    private auth : AuthService,
    private router : Router){

  }
  logForm!: FormGroup
ngOnInit(): void {
  this.logForm =this.fb.group({
      email: new FormControl(''),
      password: new FormControl('')
  })
}

login(){
  console.log(this.logForm.value);
  this.auth.login(this.logForm.value).subscribe((res)=>{

  },(err)=>{
    if(!navigator.onLine){
      const request = indexedDB.open('my-db');
      request.onerror = (event) => {
        console.log('Please allow my web app to use IndexedDB 😃>>>👻');
      };
      request.onsuccess = (event:any) => {
       const db = event.target.result;
       const transaction = db.transaction(['user']);
       const objectStore = transaction.objectStore('user');
       const request = objectStore.get(this.logForm.controls['email'].value);
       request.onerror = (errEvent:any) => {
         // Handle errors!
       };
       request.onsuccess = (succEvent:any) => {
        console.log('Name of the user is ' + request.result);
         // Do something with the request.result!
          const  userData = JSON.parse(request.result)
          if(userData.password === this.logForm.controls['password'].value ){
            localStorage.setItem('userData',request.result)
            this.router.navigate(['/page/profile'])
            
          }
        
       };
      };
    }
  })
}
}
