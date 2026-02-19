import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Car, Component, Asset } from '../models/f1-bom.model';

@Injectable({
    providedIn: 'root'
})
export class BomService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    getCars(): Observable<Car[]> {
        return this.http.get<Car[]>(`${this.apiUrl}/cars`);
    }

    getComponent(id: string): Observable<Component> {
        return this.http.get<Component>(`${this.apiUrl}/components/${id}`);
    }

    getComponents(query?: string): Observable<Component[]> {
        const url = query ? `${this.apiUrl}/components?q=${query}` : `${this.apiUrl}/components`;
        return this.http.get<Component[]>(url);
    }

    updateComponent(id: string, data: Partial<Component>): Observable<Component> {
        return this.http.patch<Component>(`${this.apiUrl}/components/${id}`, data);
    }

    getAssetTree(id: string): Observable<{ asset: Asset, children: Asset[] }> {
        console.log(`BomService: Fetching asset tree for ${id}`);
        return this.http.get<{ asset: Asset, children: Asset[] }>(`${this.apiUrl}/assets/${id}`).pipe(
            tap((data: any) => console.log(`BomService: Data received for ${id}:`, data))
        );
    }
}
