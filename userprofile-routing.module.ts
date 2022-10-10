import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { UserprofileComponent } from './userprofile.component';


const routes: Routes = [
  {
    path: 'list',
    component: UserprofileComponent,
    data: {
      moduleCode: 'Application Manager',
      displayName: 'appmaster.userprofile.title',
      title: 'appmaster.userprofile.title',
      urls: [{ icon: 'fa-home', url: '/masters/dashboard/userlanding' },
      { title: 'common.app-manager.app-manager', url: '/masters/dashboard/list' },
      { title: 'appmaster.userprofile.title' }]
    }
  },

  {
    path: 'add',
    component: AddComponent,
    data: {
      moduleCode: 'Application Manager',
      title: 'appmaster.userprofile.title',
      urls: [{ icon: 'fa-home', url: '/masters/dashboard/userlanding' },
      { title: 'common.app-manager.app-manager', url: '/masters/user-profile/list' },
      { title: 'appmaster.userprofile.title', url: '/masters/user-profile/list' }]
    }
  },
  {
    path: 'edit/:profileId',
    component: EditComponent,
    data: {
      moduleCode: 'Application Manager',
      title: 'appmaster.userprofile.title',
      urls: [{ icon: 'fa-home', url: '/masters/dashboard/userlanding' },
      { title: 'common.app-manager.app-manager', url: '/masters/user-profile/list' },
      { title: 'appmaster.userprofile.title', url: '/masters/user-profile/list' }]
    }
  },
  {
    path: 'view',
    component: ViewComponent,
    data: {
      moduleCode: 'Application Manager',
      title: 'appmaster.userprofile.title',
      urls: [{ icon: 'fa-home', url: '/masters/dashboard/userlanding' },
      { title: 'common.app-manager.app-manager', url: '/masters/user-profile/list' },
      { title: 'appmaster.userprofile.title', url: '/masters/user-profile/list' }]
    }
  },
  {
    path: 'view/:profileId',
    component: ViewComponent,
    data: {
      moduleCode: 'Application Manager',
      title: 'appmaster.userprofile.title',
      urls: [{ icon: 'fa-home', url: '/masters/dashboard/userlanding' },
      { title: 'common.app-manager.app-manager', url: '/masters/user-profile/list' },
      { title: 'appmaster.userprofile.title', url: '/masters/user-profile/list' }]
    }
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserprofileRoutingModule { }
