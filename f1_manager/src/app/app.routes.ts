import { Routes } from '@angular/router';
import { BomDashboardComponent } from './components/bom-dashboard/bom-dashboard.component';
import { BomDetailComponent } from './components/bom-detail/bom-detail.component';

export const routes: Routes = [
    { path: '', component: BomDashboardComponent },
    { path: 'component/:id', component: BomDetailComponent },
    { path: '**', redirectTo: '' }
];
