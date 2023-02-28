import { ToastrService } from 'ngx-toastr';
import { IndexedDBService } from './../../../services/indexed-db.service';
import { AuthService } from './../../auth/auth.service';
import { AuthGuard } from './../../../guard/auth.guard';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
 constructor(private fb :FormBuilder,
  private auth :AuthService,
  private indexedDBService : IndexedDBService,
  
  private toastr :ToastrService){

 }
 userData!:any
  imageUrl:any

  profile!: FormGroup;
  ngOnInit(): void {
    
    const data  = localStorage.getItem('userData')
    this.userData =JSON.parse(data || '{}')
    
    this.profile= this.fb.group({
      profileImg: new FormControl(''),
      name: new FormControl(''),
      lastName: new FormControl(''),
      about: new FormControl(''),
      experience: new FormControl(''),
      education : new FormControl(''),
      email: new FormControl(''),

    })
let userProfileData
    const request = indexedDB.open('my-db');
    request.onerror = (event) => {
      console.log('Please allow my web app to use IndexedDB 😃>>>👻');
    };
    request.onsuccess = (event:any) => {
     const db = event.target.result;
     const transaction = db.transaction(['profile']);
     const objectStore = transaction.objectStore('profile');
     const request = objectStore.get(this.userData.email);
     request.onerror = (errEvent:any) => {
       // Handle errors!
     };
     request.onsuccess = (succEvent:any) => {
       // Do something with the request.result!
       console.log('Name of the user is ' + request.result);
          userProfileData = JSON.parse(request?.result || null)
       if(userProfileData!==null){
        console.log(true);
        
        this.profile.patchValue(userProfileData)
       }else{
        console.log(false);
        this.profile.patchValue(this.userData)
       }
     };
    };

   
  }

  uploadFile(event:any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.profile.patchValue({
          profileImg: reader.result,
        });
        console.log(this.profile.value);
      };
    }
  }
  save(){
        this.auth.profileUpdate(this.profile.value).subscribe((res)=>{

        },(err)=>{
          if (!navigator.onLine) {
            this.indexedDBService
        .addProfile(this.profile.value)
        .then((e)=>{
          this.backgroundSync()
          this.toastr.success('Updated succesful', `Succesful`); 
        })
        .catch(console.log);
       }
          }
        )  
  }


  backgroundSync() {
    navigator.serviceWorker.ready
      .then((swRegistration:any) => {
       return swRegistration.sync.register('profileUpdate')
      
      })
      .catch(console.log);
  
  }

  logout(){
    localStorage.clear()
    location.reload()
  }
}
