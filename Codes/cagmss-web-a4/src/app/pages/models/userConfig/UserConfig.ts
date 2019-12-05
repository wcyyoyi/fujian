import { Area } from './Area';
import { Model } from './Model';
import { PersonalSettings } from './PersonalSettings';

export class UserConfig {
    name: string;
    area: Area = new Area();
    models: Array<Model> = new Array<Model>();
    personalSettings: PersonalSettings = new PersonalSettings();
}
