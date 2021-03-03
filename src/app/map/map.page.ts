import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Cita } from '../citas';
import { Router } from "@angular/router";

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

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
