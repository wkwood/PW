import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'safeStatus',
    standalone: true
})
export class SafeStatusPipe implements PipeTransform {
    transform(value: any): string[] {
        if (!value || typeof value !== 'string') return [];
        return value.toLowerCase().split(' ');
    }
}
