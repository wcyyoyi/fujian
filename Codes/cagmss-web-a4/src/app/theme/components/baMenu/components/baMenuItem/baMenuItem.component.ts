import { Component, Input, Output, EventEmitter } from '@angular/core';

import 'style-loader!./baMenuItem.scss';
import { ApiService } from '../../../../../pages/services';

@Component({
  selector: 'ba-menu-item',
  templateUrl: './baMenuItem.html'
})
export class BaMenuItem {
  level: number = 1;
  classLevel: string = 'al-sidebar-list-link-level1'
  @Input() menuItem: any;
  @Input() child: boolean = false;

  @Output() itemHover = new EventEmitter<any>();
  @Output() toggleSubMenu = new EventEmitter<any>();

  constructor(private apiService: ApiService) {
  }

  public ngOnInit(): void {
    this.level = this.apiService.level;
    this.classLevel = 'al-sidebar-list-link-level' + this.level;
  }

  public onHoverItem($event): void {
    this.itemHover.emit($event);
    // alert(JSON.stringify(this.menuItem));
  }

  public onToggleSubMenu($event, item): boolean {
    $event.item = item;
    this.toggleSubMenu.emit($event);
    return false;
  }
}
