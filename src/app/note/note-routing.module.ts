import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotePage } from './note.page';

const routes: Routes = [
  {
    path: '',
    component: NotePage
  },
  {
    path: 'invite',
    loadChildren: () => import('./invite/invite.module').then( m => m.InvitePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotePageRoutingModule {}
