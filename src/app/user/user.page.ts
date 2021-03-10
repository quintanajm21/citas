import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Cita } from '../citas';
import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

// import { threadId } from "worker_threads";




@Component({
  selector: "app-user",
  templateUrl: "./user.page.html",
  styleUrls: ["./user.page.scss"]
})
export class UserPage implements OnInit {
  id = null;

  document: any = {
    id: "",
    data: {} as Cita
  };

  citaEditando: Cita;

  idCitaSelec: string;




  constructor(private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router,
    public alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker,
    private socialSharing: SocialSharing
    ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.firestoreService.consultarPorId("citas", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id

        this.document.data = resultado.payload.data();
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Cita;
      } 
    });
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

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¡Cuidado!',
      message: '¿Estás seguro que quieres borrar la cita?',
     buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            if(this.document.data.corte != null ){
              this.firestoreService.deleteFileFromURL(this.document.data.corte);

            }

                      
            this.firestoreService.borrar("citas", this.id).then(() => {
              this.router.navigate(["/home/"]);
              })
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async uploadImagePicker(){

    //Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    //Mensaje de finalizacion de subida de la imagen
    const toast = await this.toastController.create({
      message:'Image was updated successfully',
      duration:300
    });

    //Comprobar si la aplicacion tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        //Si no tiene permiso de lectura se solicita al usuario
        if(result== false){
          this.imagePicker.requestReadPermission();
        
        }else{
        //Abrir selector de imagenes (ImagePicker)
        this.imagePicker.getPictures({
          maximumImagesCount: 1,  //Permitir solo 1 imagen
          outputType:1            //1= Base64
        }).then(
          (results)=> {  // En la variable results estan las imagenes seleccionadas
          
            //Carpeta del Storage donde se almacenara la imagen
            let nombreCarpeta= "imagenesQuintana";
            //Recorrer todas las imagenes que haya seleccionado el usuario aunque realmente solo sera 1 como se ha indicado en las opciones
            for(var i=0; i<results.length; i++){
              //Mostrar el mensaje de espera
              loading.present();
              //Asignar el nombre de la imagen en funcion de la hora actual para evitar duplicidades
              let nombreImagen =`${new Date().getTime()}`;
              //Llamar al metodo que sube la imagen al storage
              this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i])
              .then(snapshot=> {
                snapshot.ref.getDownloadURL()
                .then(downloadURL =>{
                  this.document.data.corte=downloadURL;
                  //En la variable downloadURL de tiene la descarga de la imagen
                  console.log("downloadURL:" + downloadURL);
                  //Mostrar el mensaje de finalizacion de la subida
                  toast.present();
                  //Ocultar mensaje de espera
                  loading.dismiss();
                })
              })
            }
          },
          (err)=>{
            console.log(err)
          }
        );
      }
    }, (err) =>{
      console.log(err);
    });

  }

  regularSharing() {
    let msg = "¡Hola, somos Peluquería!." + "\n" + "La fecha de tu cita es el" + this.document.data.dia + "." + "\n" + "Su corte de pelo lo puede ver en el siguiente enlace -->  " + this.document.data.corte + "\n" + "Muchas gracias por confiar en nosotros, un saludo.";
    this.socialSharing.share(msg, null, null, null).then(() => {
      console.log("Se ha compartido correctamente");
    }).catch((error) => {
      console.log("Se ha producido un error: " + error);
    });
  }

  facebookShare(){
    let msg = "¡Hola, somos Peluquería!." + "\n" + "La fecha de tu cita es el" + this.document.data.dia + "." + "\n" + "Su corte de pelo lo puede ver en el siguiente enlace -->  " + this.document.data.corte + "\n" + "Muchas gracias por confiar en nosotros, un saludo.";
    this.socialSharing.shareViaFacebook(msg, null, null);
   }

   
  twitterShare(){
    let msg = "¡Hola, somos Peluquería!." + "\n" + "La fecha de tu cita es el" + this.document.data.dia + "." + "\n" + "Su corte de pelo lo puede ver en el siguiente enlace -->  " + this.document.data.corte + "\n" + "Muchas gracias por confiar en nosotros, un saludo.";
    this.socialSharing.shareViaTwitter(msg, null, null);
  }



  async deleteFile(fileURL){
    const toast = await this.toastController.create({
      message: 'Imagen borrada',
      duration: 3000
    });

    this.firestoreService.deleteFileFromURL(fileURL)
      .then(()=>{
        toast.present();
      }, (err)=>{
        console.log(err);
      });
  }



  clicBotonInsertar() {
    this.firestoreService.insertar("citas", this.document.data).then(() => {
      console.log('Cita creado correctamente!');
      this.citaEditando= {} as Cita;
    }, (error) => {
      console.error(error);
    });
    this.router.navigate(["/home/"]);

  }


  // clicBotonBorrar() {
  //   this.firestoreService.borrar("citas", this.id).then(() => {
  //   this.router.navigate(["/user/"]);
  //   })
  // }

  clicBotonModificar() {
    this.firestoreService.actualizar("citas", this.id, this.document.data).then(() => {
      // Limpiar datos de pantalla
      this.citaEditando = {} as Cita;
      this.router.navigate(["/home/"]);

    })
  }



  
}
