import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BomService } from './bom.service';

describe('BomService', () => {
    let service: BomService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BomService]
        });
        service = TestBed.inject(BomService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch car list', () => {
        const mockCars = [{ _id: '1', modelName: 'Test Car', carNumber: 1, chassisAssetId: { _id: 'as1' } } as any];

        service.getCars().subscribe(cars => {
            expect(cars.length).toBe(1);
            expect(cars[0].modelName).toBe('Test Car');
        });

        const req = httpMock.expectOne('http://localhost:3000/api/cars');
        expect(req.request.method).toBe('GET');
        req.flush(mockCars);
    });

    it('should fetch asset tree', () => {
        const mockData = { asset: { _id: 'as1' }, children: [] };

        service.getAssetTree('as1').subscribe(data => {
            expect(data.asset._id).toBe('as1');
        });

        const req = httpMock.expectOne('http://localhost:3000/api/assets/as1');
        req.flush(mockData);
    });
});
