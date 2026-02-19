import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BomService } from '../../services/bom.service';
import { Asset, Component as F1Component } from '../../models/f1-bom.model';

@Component({
    selector: 'app-asset-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './asset-detail.component.html',
    styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {
    assetId: string | null = null;
    rootAsset: Asset | null = null;
    children: Asset[] = [];
    loading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private bomService: BomService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.assetId = params.get('id');
            console.log('AssetDetailComponent initialized with ID:', this.assetId);
            if (this.assetId) {
                this.loadAssetTree(this.assetId);
            }
        });
    }

    loadAssetTree(id: string): void {
        this.loading = true;
        console.log('Fetching asset tree for:', id);
        this.bomService.getAssetTree(id).subscribe({
            next: (data) => {
                console.log('Asset tree data received:', data);
                this.rootAsset = data.asset;
                this.children = data.children;
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load asset tree:', err);
                alert('Error loading asset tree: ' + (err.error?.error || err.message));
                this.loading = false;
            }
        });
    }

    getComponent(asset: Asset | null): any {
        if (!asset || !asset.componentId) return { name: 'Unknown', partNumber: 'N/A' };
        return asset.componentId;
    }
}
