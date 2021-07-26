import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { Tab1receivePage } from '../tab1receive/tab1receive.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: '../welcome/welcome.module#WelcomePageModule'
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: '../tab3sending/tab3sending.module#Tab3sendingPageModule'
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            component: Tab1receivePage
          }
        ]
      },
      {
        path: 'tab3/:contract',
        children: [
          {
            path: '',
            component: Tab1receivePage
          }, 
        ]
      },
      {
           path: 'tab3/:contract/:pin',
           component: Tab1receivePage
      },
      {
        path: 'tab4',
        children: [
          {
            path: '',
            loadChildren: '../tab4wallet/tab4.module#Tab4PageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      },
     { path: '**', redirectTo: '/tabs/tab1' },

    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
