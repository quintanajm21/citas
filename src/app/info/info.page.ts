import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(private firestoreService: FirestoreService, private router: Router) { 
  }

    clicBotonHome(){
      this.router.navigate(["/home/"]);
  
    }
  
    clicBotonInfo(){
      this.router.navigate(["/info/"]);
  
    }
  
    clicBotonMap(){
      this.router.navigate(["/map/"]);
  
    }
  

  ngOnInit() {
  }

  

}
