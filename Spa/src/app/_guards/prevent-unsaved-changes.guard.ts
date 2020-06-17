import { Injectable } from "@angular/core";
import { CanDeactivate } from '@angular/router';
import { EditComponent } from '../nav/edit/edit.component';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()

export class PreventUnsavedChanges implements CanDeactivate<EditComponent> {

    constructor(private alertify: AlertifyService){}

    canDeactivate(component: EditComponent){
        if(component.editForm.dirty){
            return confirm('Esta seguro que desea salir del formulario?');
        }
        return true;
    }
}