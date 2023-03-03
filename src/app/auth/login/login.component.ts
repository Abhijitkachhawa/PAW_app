import { IndexedDBService } from './../../../services/indexed-db.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private indexedDBService:IndexedDBService
  ) {

  }
  logForm!: FormGroup
  ngOnInit(): void {
    this.logForm = this.fb.group({
      email: new FormControl(''),
      password: new FormControl('')
    })
    this.printData()
  }

  login() {
    console.log(this.logForm.value);
    this.auth.login(this.logForm.value).subscribe((res) => {

    }, (err) => {
      if (!navigator.onLine) {
        const request = indexedDB.open('my-db');
        request.onerror = (event) => {
          console.log('Please allow my web app to use IndexedDB 😃>>>👻');
        };
        request.onsuccess = (event: any) => {
          const db = event.target.result;
          const transaction = db.transaction(['user']);
          const objectStore = transaction.objectStore('user');
          const request = objectStore.get(this.logForm.controls['email'].value);
          request.onerror = (errEvent: any) => {
            // Handle errors!
          };
          request.onsuccess = (succEvent: any) => {
            console.log('Name of the user is ' + request.result);
            // Do something with the request.result!
            const userData = request.result
            console.log("🚀 ~ file: login.component.ts:52 ~ LoginComponent ~ this.auth.login ~ request.result:", request.result)
            if (userData.password === this.logForm.controls['password'].value) {
              localStorage.setItem('userData', JSON.stringify(request.result))
              setTimeout(() => {
                this.router.navigate(['/page/profile'])
              }, 1000);

            }

          };
        };
      }
    })
  }
  fileArr: Observable<FileType>[][] = [[]]
  urlArr:string[] =[]
  printData() {

    this.http.get('https://bornsir.s3.amazonaws.com/static/566947fb-cee3-4b46-a374-967af33b76d2/764cb6ee-7a05-4899-a9d1-196c8966d1b4/2054854/manifest.json')
      .subscribe(async (res: any) => {
        this.urlArr = res.splice(0, 135)

        let index = 0
        let fileNo = 3
        this.urlArr.forEach((e, i) => {
          if (i <= fileNo) {

            this.fileArr[index].push(this.http.get(`https://bornsir.s3.amazonaws.com/static/566947fb-cee3-4b46-a374-967af33b76d2/764cb6ee-7a05-4899-a9d1-196c8966d1b4/2054854/` + e, {
              observe: 'response',
              responseType: 'blob'
            }).pipe(map(x => ({ name: e, file: x.body}))))
          }
          if (fileNo === i) {
            fileNo = fileNo + 4
            index = index + 1
            this.fileArr[index] = []
          }
        })

        await this.apicall()

      })

  }
  count=1
  indData: FileType[] = []


  async apicall() {
    for (const file of this.fileArr) {
      if (this.indData.length === 20 ) {
         
         this.indexedDBService.addApiData(this.indData)
        this.indData = []
        this.count++
      }else if( Math.ceil(this.urlArr.length / 20) === this.count){
      setTimeout(() => {
        this.indexedDBService.addApiData(this.indData)
      }, 1000);
      }
      try {
        await new Promise((resolve, reject) => {

          forkJoin(file).subscribe((e) => {
            for (let index = 0; index < e.length; index++) {
              this.indData.push({...e[index],key:`Batch#${this.count}`} )


            }

            resolve('')
          }, (err) => {
            console.log("🚀 ~ file: login.component.ts:116 ~ LoginComponent ~ forkJoin ~ err:", err)
            reject(false)
          })


        })
      } catch (error) {
        console.log("🚀 ~ file: login.component.ts:124 ~ LoginComponent ~ apicall ~ error:", error)

      }








      // await new Promise((resolve, reject)=>{

      //      this.http.get(`https://bornsir.s3.amazonaws.com/static/566947fb-cee3-4b46-a374-967af33b76d2/764cb6ee-7a05-4899-a9d1-196c8966d1b4/2054854/`+file,{
      //      observe:'response',
      //      responseType:'blob'
      //     }).subscribe((res)=>{
      //       if(res.status===200){
      //         console.log('Successfully downloaded');
      //         resolve("")

      //        }else{
      //         console.log('Not downloaded');
      //        }
      //     },(error)=>{
      //       reject('')
      //       console.log(error)
      //       console.log('Not downloaded');
      //     })


      // })

    }


  }



}

interface FileType { name:string, file:Blob | null,key?:string }
