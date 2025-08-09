import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { User } from './components/user/user';
import { Worker } from './components/worker/worker';
import { NotFound } from './components/not-found/not-found';
import { Login } from './components/login/login';
import { RoleGuard } from './guards/role-guard';
import { Admin } from './components/admin/admin';
import { Unauthorized } from './components/unauthorized/unauthorized';

export const routes: Routes = [
    {path:'' , component:Home},
    {
        path: 'admin',
        component: Admin,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'user',
        component: User,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_NORMAL'] }
      },
      {
        path: 'worker',
        component: Worker,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_WORKER'] }
      },
    {path: 'login', component:Login},
    {path: 'unauthorized', component:Unauthorized},
    {path: '**', component:NotFound}
];
