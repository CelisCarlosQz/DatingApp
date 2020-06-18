import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photoeditor',
  templateUrl: './photoeditor.component.html',
  styleUrls: ['./photoeditor.component.css']
})
export class PhotoeditorComponent implements OnInit {

  @Input() photos: Photo[];
  baseUrl = environment.apiUrl;

  uploader:FileUploader;
  hasBaseDropZoneOver:boolean = false;

  currentMain: Photo;

  constructor(private authService: AuthService, private userService: UserService,
      private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e : any):void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.getUserId() + '/uploadphoto',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response){
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          description: res.description,
          dateAdded: res.dateAdded,
          isMain: res.isMain
        };
        this.photos.push(photo);

        var index = this.photos.findIndex(p => p.description == 'DF_DELETE_IS_OK');
        if(index == 0){
          this.authService.changesNavPhoto(photo.url);
          localStorage.setItem('url', photo.url);
          this.photos.splice(this.photos.findIndex(p => p.description == 'DF_DELETE_IS_OK'), 1);
        }   
      }
    };
  }

  setMainPhoto(photo: Photo) {
    
    this.userService.setMainPhoto(this.authService.getUserId(), photo.id).subscribe(
      () => {
        this.currentMain = this.photos.filter(p => p.isMain == true)[0];
        this.currentMain.isMain = false;

        photo.isMain = true;
        this.authService.changesNavPhoto(photo.url);
        localStorage.setItem('url', photo.url);
      }, error => {
        this.alertify.error(error);
      }
    );
  }

  deletePhoto(id: number){
    this.alertify.confirm('Seguro que deseas borrar la foto?', () => {
      this.userService.deletePhoto(this.authService.getUserId(), id).subscribe(
        () => {
          this.photos.splice(this.photos.findIndex(p => p.id == id), 1);
          this.alertify.success('Eliminada correctamente');
        }, error => {
          this.alertify.error('No se pudo eliminar');
        }
      );
    });
  }
}