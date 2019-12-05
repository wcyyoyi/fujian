import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { ApiService } from './api.service'

@Injectable()
export class IndexEventService extends ApiService {

    constructor(http: Http) {
        super(http);
    }

    getByFilter(startDate: Date, endDate: Date) {
        let eventDate = new Date().toDateString();
        let url = this.data_url + '/agme/idxs/events/query?vAlertLevel=' + 0
            + '&vstart=' + startDate.getTime() + '&vend=' + endDate.getTime();

        return this.http.get(url, this.jwt())
            .toPromise()
            .then((response: Response) => {
                var text = response.text();
                var data = JSON.parse(text, this.dateReviver);
                return data;
            })
            .catch(this.handleError);
    }

    private dateReviver(key, value) {
        if(key === 'dEventtime'){
            return new Date(value);
        }
        return value;
    }

    private handleError(error: any): Promise<any> {
        console.error('IndexEventService an error occurred', error);
        return Promise.resolve(null);
    }
}