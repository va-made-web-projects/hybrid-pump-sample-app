import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'pump',
        loadChildren: () => import('../pages/pump/pump.module').then(m => m.PumpPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'data',
        loadChildren: () => import('../pages/data/data.module').then(m => m.DataPageModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('../pages/admin/admin.module').then(m => m.AdminPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/pump',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/pump',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
