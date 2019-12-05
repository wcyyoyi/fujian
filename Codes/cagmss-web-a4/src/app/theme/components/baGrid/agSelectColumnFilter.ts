import { Component, ViewChild, ViewContainerRef } from "@angular/core";

import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from "ag-grid";
import { IFilterAngularComp } from "ag-grid-angular";

export interface SelectFilterParams extends IFilterParams {
    selectItems: Array<any>
}

@Component({
    selector: 'filter-cell',
    template: `
          <select #select  style="width:100px;" (ngModelChange)="onChange($event)" [(ngModel)]="text" > 
            <option class="col-md-1" value="all" selected>全部</option>
            <option class="col-md-1" *ngFor="let item of options" [value]="item">{{item}}</option>
          </select>
    `
})

export class AgSelectColumnFilter implements IFilterAngularComp {
    private params: IFilterParams;
    private valueGetter: (rowNode: RowNode) => any;
    public text: string = 'all';

    private options = new Array();
    @ViewChild('select', { read: ViewContainerRef }) public select;

    agInit(params: SelectFilterParams): void {
        this.params = params;
        this.valueGetter = params.valueGetter;
        params.selectItems.forEach(item=>{
            if(item==null) return;
            this.options.push(item);
        })
    }

    isFilterActive(): boolean {
        return this.text !== null && this.text !== undefined && this.text !== '';
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        if(this.valueGetter(params.node)==null){
            return false;
        }
        return this.text
            .split(" ")
            .every((filterWord) => {
                if (filterWord == "all") { return true };
                return this.valueGetter(params.node).toString().indexOf(filterWord) >= 0;
            });
    }

    getModel(): any {
        return { value: this.text };
    }

    setModel(model: any): void {
        this.text = model ? model.value : '';
    }

    ngAfterViewInit(params: IAfterGuiAttachedParams): void {
        setTimeout(() => {
            this.select.element.nativeElement.focus();
        })
    }

    // noinspection JSMethodCanBeStatic
    componentMethod(message: string): void {
        alert(`Alert from PartialMatchFilterComponent ${message}`);
    }

    onChange(newValue): void {
        if (this.text !== newValue) {
            this.text = newValue;
            this.params.filterChangedCallback();
        }
    }
}