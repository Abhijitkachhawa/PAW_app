import { IndexedDBService } from './../services/indexed-db.service';
import { Component, OnInit ,AfterViewInit} from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit,AfterViewInit{
  constructor(private swUpdate: SwUpdate,
    private indexedDBService :IndexedDBService,
    private http: HttpClient
    ) { }
  ngOnInit(): void {
   
  }
  title = 'PWA_APP';


  ngAfterViewInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available
        .subscribe(() => {
          this.swUpdate
            .activateUpdate()
            .then(() => {
              window.location.reload();
            });
        });
    }
  } 


  postSync() {
    let obj = {
      name: 'Subrat',
    };
    //api call
    this.http.post('http://localhost:3000/data', obj).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        this.indexedDBService
          .addUser(obj.name)
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
