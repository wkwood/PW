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
        if (this.compId) {
            this.loadComponent(this.compId);
        }
    }

    loadComponent(id: string): void {
        this.loading = true;
        this.bomService.getComponent(id).subscribe(comp => {
            this.component = comp;
            this.loading = false;
        });
    }

    onSave(): void {
        if (this.component && this.compId) {
            this.bomService.updateComponent(this.compId, this.component).subscribe(() => {
                alert('Component updated successfully!');
                this.router.navigate(['/']);
            });
        }
    }
}
