export class Utils {
    public code2Label(list: Array<any>, codeField: string, codeValue: any, returnLabelField: string) {
        if (!list || list.length <= 0) {
            return null;
        }
        let obj = list.find(item => item[codeField] === codeValue);
        return obj[returnLabelField];
    }
}
