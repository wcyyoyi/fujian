import {Component, Input} from '@angular/core';

@Component({
  selector: 'ba-card',
  templateUrl: './baCard.html',
})
export class BaCard {
  @Input() iconClass:String;
  @Input() title:String;
  @Input() baCardClass:String;
  @Input() cardType:String;
}
