import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetDetailComponent } from './asset-detail.component';
import { BomService } from '../../services/bom.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('AssetDetailComponent', () => {
    let component: AssetDetailComponent;
    let fixture: ComponentFixture<AssetDetailComponent>;
    let bomServiceSpy: jasmine.SpyObj<BomService>;

    beforeEach(async () => {
        bomServiceSpy = jasmine.createSpyObj('BomService', ['getAssetTree']);

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, AssetDetailComponent],
            providers: [
                { provide: BomService, useValue: bomServiceSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of({ get: (key: string) => 'test-asset-123' })
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

    it('should display loading state initially', () => {
        // We don't call ngOnInit yet or we return a delayed obs
        expect(fixture.nativeElement.textContent).toContain('Scanning car hierarchy...');
    });

    it('should display asset data after loading', () => {
        const mockData = {
            asset: { _id: 'as1', status: 'In Use', componentId: { name: 'Chassis', partNumber: 'CP-001' } },
            children: [
                { _id: 'as2', status: 'In Use', componentId: { name: 'Engine', partNumber: 'E-001' } }
            ]
        } as any;

        bomServiceSpy.getAssetTree.and.returnValue(of(mockData));

        fixture.detectChanges(); // Trigger ngOnInit

        expect(component.loading).toBeFalse();
        expect(component.rootAsset).toBeTruthy();

        fixture.detectChanges(); // Render template

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('Live BOM: Chassis');
        expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
        expect(compiled.querySelector('.sn').textContent).toBeDefined();
    });
});
