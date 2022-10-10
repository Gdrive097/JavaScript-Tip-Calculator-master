import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserprofileRoutingModule } from './userprofile-routing.module';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { UserprofileComponent } from './userprofile.component';
import { SharedModule } from 'projects/sharedbusiness/src/app/sharedModule';
import { MasterSharedModule } from '../master-shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ViewComponent,
    EditComponent,
    AddComponent,
    UserprofileComponent
  ],
  imports: [
    CommonModule,
    UserprofileRoutingModule,
    SharedModule,
    MasterSharedModule,
    ReactiveFormsModule
  // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 

  ]
})
export class UserprofileModule { }
