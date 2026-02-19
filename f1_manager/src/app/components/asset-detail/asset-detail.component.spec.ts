import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetDetailComponent } from './asset-detail.component';
import { BomService } from '../../services/bom.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { SafeStatusPipe } from '../../pipes/safe-status.pipe';

describe('AssetDetailComponent', () => {
    let component: AssetDetailComponent;
    let fixture: ComponentFixture<AssetDetailComponent>;
    let mockBomService: any;

    beforeEach(async () => {
        mockBomService = {
            getAssetTree: vi.fn().mockReturnValue(of({ asset: null, children: [] }))
        };

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, AssetDetailComponent, SafeStatusPipe],
            providers: [
                { provide: BomService, useValue: mockBomService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of(new Map([['id', 'test-asset-123']]))
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AssetDetailComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show spinner while loading', () => {
        component.loading = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.loader')).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('Scanning car hierarchy...');
    });

    it('should transition to display state when data is received', () => {
        const mockData = {
            asset: { _id: 'as1', status: 'In Use', componentId: { name: 'Chassis', partNumber: 'CP-001' } },
            children: [{ _id: 'as2', status: 'In Use', componentId: { name: 'Engine', partNumber: 'E-001' } }]
        };

        mockBomService.getAssetTree.mockReturnValue(of(mockData));

        // Simulate ngOnInit
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.loading).toBeFalsy();
        expect(component.rootAsset).toBeTruthy();

        const compiled = fixture.nativeElement;
        // Check for hierarchy content
        expect(compiled.querySelector('h1').textContent).toContain('Live BOM: Chassis');
        expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    });

    it('should show error state if asset is not found', () => {
        mockBomService.getAssetTree.mockReturnValue(of({ asset: null, children: [] }));

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.loading).toBeFalsy();
        expect(fixture.nativeElement.textContent).toContain('Asset Not Found');
    });
});
