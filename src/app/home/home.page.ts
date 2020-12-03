import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Cita } from '../citas';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  arrayColeccionCitas: any = [{
    id: "",
    data: {} as Cita
   }];

  citaEditando: Cita;  

  idCitaSelec: string;


  constructor(private firestoreService: FirestoreService) {

    this.citaEditando = {} as Cita;
    this.obtenerListaCitas();

  } 
  
  clicBotonInsertar() {
    this.firestoreService.insertar("citas", this.citaEditando).then(() => {
      console.log('Jugador creado correctamente!');
      this.citaEditando= {} as Cita;
    }, (error) => {
      console.error(error);
    });
  }
  
  obtenerListaCitas(){
    this.firestoreService.consultar("citas").subscribe((resultadoConsultaCitas) => {
      this.arrayColeccionCitas = [];
      resultadoConsultaCitas.forEach((datosCita: any) => {
        this.arrayColeccionCitas.push({
          id: datosCita.payload.doc.id,
          data: datosCita.payload.doc.data()
        });
      })
    });
  }

  selecCita(citaSelec) {
    console.log("Cita seleccionada: ");
    console.log(citaSelec);
    this.idCitaSelec = citaSelec.id;
    this.citaEditando.nombre = citaSelec.data.nombre;
    this.citaEditando.numeroTlf = citaSelec.data.numeroTlf;
    this.citaEditando.dia = citaSelec.data.dia;

  }

  clicBotonBorrar() {
    this.firestoreService.borrar("citas", this.idCitaSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaCitas();
      // Limpiar datos de pantalla
      this.citaEditando = {} as Cita;
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("citas", this.idCitaSelec, this.citaEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaCitas();
      // Limpiar datos de pantalla
      this.citaEditando = {} as Cita;
    })
  }

  
}