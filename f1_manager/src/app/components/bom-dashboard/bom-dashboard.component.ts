import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

    constructor(private bomService: BomService) { }

    ngOnInit(): void {
        this.loadCars();
        this.loadRecentComponents();
    }

    loadCars(): void {
        this.bomService.getCars().subscribe(cars => this.cars = cars);
    }

    loadRecentComponents(): void {
        this.bomService.getComponents().subscribe(comps => this.components = comps);
    }

    onSearch(): void {
        if (this.searchQuery.trim()) {
            this.bomService.getComponents(this.searchQuery).subscribe(comps => this.components = comps);
        } else {
            this.loadRecentComponents();
        }
    }
}
