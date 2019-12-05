export class SelectItem {
    code: string;
    desc: string;
}

export class CropItem {
    code: string;
    name: string;
    desc: string;
    stations: string;
    tag: any;
}

export class VaridevInfo {
    variCode: string;
    devCode: string;
    desc: string;
}

export class DistInfo {
    id: string;
    code: string;
    desc: string;
    indexValue: object;
}

export class CropInfo {
    id: string;
    start: string;
    end: string;
    varidevs: VaridevInfo[] = new Array<VaridevInfo>();
    nadvise: string;
    dists: DistInfo[] = new Array<DistInfo>();
    dadvise: string;
}

export class ClassesInfo {
    name: string;
    isValid: boolean = true;
    min: number;
    max: number;
    total: number = 1;
}

export class IndexInfo {
    type: string;
    eleCode: string;
    classes: number = 1;
    values: ClassesInfo[] = new Array<ClassesInfo>();
}

export class ExpEleInfo {
    cExpcode: string;
    cCropcode: string;
    v01000: string;
    c56002: string;
    dStartdate: number;
    dEnddate: number;
    cAdvise: string;
    cDadvise: string;
}

export class IdxEleInfo {
    cIdxcode: string;
    cExpcode: string;
    cDistcode: string;
    vIndextype: number;
    cElecode: string;
    vLevel: number;
    cValuerange: string;
    // cAdvise: string;
}

export class cropManage {
    cCode: string;
    cCrop: string;
    cCropmature: string;
    cCropname: number;
    cCropvirteties: string;
}
export class cropDelevolment {
    cCrop: string;
    cCode: string;
    cCorpdev: string;
}