import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BomService } from '../../services/bom.service';
import { Car, Component as F1Component } from '../../models/f1-bom.model';

@Component({
    selector: 'app-bom-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './bom-dashboard.component.html',
    styleUrls: ['./bom-dashboard.component.css']
})
export class BomDashboardComponent implements OnInit {
    cars: Car[] = [];
    components: F1Component[] = [];
    searchQuery: string = '';

    constructor(
        private bomService: BomService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCars();
        this.loadRecentComponents();
    }

    loadCars(): void {
        this.bomService.getCars().subscribe(cars => {
            console.log('Cars loaded:', cars);
            if (cars.length > 0) {
                console.log('Car 0 chassis ID structure:', JSON.stringify(cars[0].chassisAssetId));
            }
            this.cars = cars;
        });
    }

    loadRecentComponents(): void {
        this.bomService.getComponents().subscribe(comps => {
            console.log('Recent components loaded:', comps.length);
            if (comps.length > 0) {
                console.log('First component ID sample:', comps[0]._id);
            }
            this.components = comps;
        });
    }

    editComponent(id: string | undefined): void {
        console.log('Navigating to component edit:', id);
        if (id) {
            this.router.navigate(['/component', id]);
        }
    }

    onSearch(): void {
        if (this.searchQuery.trim()) {
            this.bomService.getComponents(this.searchQuery).subscribe(comps => this.components = comps);
        } else {
            this.loadRecentComponents();
        }
    }
}
