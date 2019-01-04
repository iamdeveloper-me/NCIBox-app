import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phone',
    pure: false
})
export class PhonePipe implements PipeTransform {

    constructor() { }

    transform(value: string, args: any[]): any {
        return value.charAt(0) !== '+' ? '+' + value : '' + value;
    }
}

