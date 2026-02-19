import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BomService } from '../../services/bom.service';
import { Component as F1Component } from '../../models/f1-bom.model';

@Component({
    selector: 'app-bom-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './bom-detail.component.html',
    styleUrls: ['./bom-detail.component.css']
})
export class BomDetailComponent implements OnInit {
    compId: string | null = null;
    component: F1Component | null = null;
    loading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bomService: BomService
    ) { }

    ngOnInit(): void {
        this.compId = this.route.snapshot.paramMap.get('id');
        console.log('BomDetailComponent initialized with ID:', this.compId);
        if (this.compId) {
            this.loadComponent(this.compId);
        } else {
            console.warn('No component ID found in route!');
            this.loading = false;
        }
    }

    loadComponent(id: string): void {
        this.loading = true;
        this.bomService.getComponent(id).subscribe({
            next: (comp) => {
                this.component = comp;
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load component:', err);
                alert('Error loading component: ' + (err.error?.error || err.message));
                this.loading = false;
            }
        });
    }

    onSave(): void {
        if (this.component && this.compId) {
            // Create a copy and map subComponents to send only IDs back (avoiding Mongoose cast errors with populated objects)
            const payload: any = { ...this.component };
            if (payload.subComponents) {
                payload.subComponents = payload.subComponents.map((sub: any) => ({
                    ...sub,
                    componentId: sub.componentId?._id || sub.componentId
                }));
            }

            this.bomService.updateComponent(this.compId, payload).subscribe({
                next: () => {
                    alert('Component updated successfully!');
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    console.error('Update failed:', err);
                    alert('Update failed: ' + (err.error?.error || err.message));
                }
            });
        }
    }
}
