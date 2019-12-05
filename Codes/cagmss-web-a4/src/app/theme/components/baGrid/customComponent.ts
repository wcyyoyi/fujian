import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'child-cell',
    templateUrl: 'customComponent.html',
})
export class CustomComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
        this.createElements(params.data, params.colDef.cellRendererParams, params.rowIndex);
    }

    refresh(): boolean {
        return false;
    }

    createElements(data, elements, rowIndex) {
        let mainDiv = document.getElementById('mainDiv');
        mainDiv.id = 'row' + rowIndex;
        elements.forEach(element => {
            let doc = document.createElement('a');
            doc.innerHTML = element.value;
            doc.style.cursor = 'pointer';
            doc.style.color = '#4444d5';
            doc.style.marginRight = '10px';
            doc.addEventListener('click', (e) => {
                if (element.callBackFunction) {
                    element.callBackFunction(data);
                }
            });
            doc.addEventListener('mouseover', (e) => {
                doc.style.color = '#007bff'
            });
            doc.addEventListener('mouseout', (e) => {
                doc.style.color = '#4444d5'
            });
            mainDiv.appendChild(doc);
        });
    }

}