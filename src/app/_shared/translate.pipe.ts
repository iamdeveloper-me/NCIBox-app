import { Pipe, PipeTransform } from '@angular/core';
import { LangService } from '../_services/lang.service'; // our translate service

@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {

    constructor(private langService: LangService) { }

    transform(value: string, args: any[]): any {
        if (!value) return;
        return this.langService.translate(value);
    }
}
