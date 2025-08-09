import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { User } from './components/user/user';
import { Worker } from './components/worker/worker';
import { NotFound } from './components/not-found/not-found';
import { Login } from './components/login/login';
import { RoleGuard } from './guards/role-guard';
import { Admin } from './components/admin/admin';
import { Unauthorized } from './components/unauthorized/unauthorized';
import { AdminLayout } from './components/layouts/admin-layout/admin-layout';
import { UserLayout } from './components/layouts/user-layout/user-layout';
import { WorkerLayout } from './components/layouts/worker-layout/worker-layout';

export const routes: Routes = [
    { path: '', component: Home },
    // 🔹 Admin layout + route
    {
        path: '',
        component: AdminLayout,
        canActivateChild: [RoleGuard],
        children: [
          {
            path: 'admin',
            component: Admin,
            data: { roles: ['ROLE_ADMIN'] } // ✅ Must be here
          }
        ]
      },
      {
        path: '',
        component: UserLayout,
        canActivateChild: [RoleGuard],
        children: [
          {
            path: 'user',
            component: User,
            data: { roles: ['ROLE_NORMAL'] } // ✅ Here
          }
        ]
      },
      {
        path: '',
        component: WorkerLayout,
        canActivateChild: [RoleGuard],
        children: [
          {
            path: 'worker',
            component: Worker,
            data: { roles: ['ROLE_WORKER'] } // ✅ Here
          }
        ]
      },
      
    { path: 'login', component: Login },
    { path: 'unauthorized', component: Unauthorized },
    { path: '**', component: NotFound }
];
