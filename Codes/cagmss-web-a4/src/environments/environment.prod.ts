import { WebSysConf } from "app/pages/models/sysConfig/WebSysConf";
import { SelectItem } from "app/pages/models";

export const environment = {
  production: false,
  webSysConf: new WebSysConf(),
  mosList:Array<SelectItem>(),
  dayList:Array<SelectItem>(),
  gridLocaleText: Object,
};
