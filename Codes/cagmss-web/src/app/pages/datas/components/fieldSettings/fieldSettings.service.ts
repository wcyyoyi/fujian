import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

@Injectable()
export class FieldSettingService {
    private fields: Subject<any> = new Subject<any>();

    constructor() { }

    public setPoint(value: any): void {
        this.fields.next(value);
    }
    public currentPoint(): Observable<any> {
        return this.fields.asObservable();
    }
}