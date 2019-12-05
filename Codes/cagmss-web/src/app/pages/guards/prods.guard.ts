import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
import { ProdState } from './prods.state';

// import { BaMenuService } from '../../theme';

// import { PdfViews } from '../prods/components/pdfViews';

@Injectable()
export class ProdsGuard implements CanActivate {

    constructor(private router: Router, private state: ProdState) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let busiName = route.params['code'];
        let busiNames: string[] = busiName.split('_');
        //let settings = this.state[busiNames[0]];
        alert(route.url.toString());

        if (busiNames.length == 2 && busiNames[1].toLowerCase() != 'pdf')
            return true;


        // let rc = this.router.isActive(route.url.toString(), false);
        // alert(JSON.stringify(route.parent.routeConfig));
        
        this.router.navigate(['/pages/prods/words', busiName]);
        // return true;
    }
}