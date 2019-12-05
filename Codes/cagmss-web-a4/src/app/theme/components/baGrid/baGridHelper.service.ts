import { Injectable } from '@angular/core';

@Injectable()
export class BaGridHelper {

    constructor() { }

    initGridLocaleText(): any {
        return {
            page: "页",
            more: "更多",
            to: "To",
            of: "Of",
            next: "下一个",
            last: "最后一个",
            first: "第一个",
            previous: "预览",
            loadingOoo: "加载中...",
            selectAll: "全选",
            searchOoo: "查找中...",
            blanks: "空白",
            filterOoo: "筛选...",
            applyFilter: "应用条件",
            clearFilter: "清除条件",
            equals: "相等",
            notEqual: "不相等",
            lessThanOrEqual: "小于等于",
            greaterThanOrEqual: "大于等于",
            inRange: "范围",
            lessThan: "小于",
            greaterThan: "大于",
            contains: "包含",
            notContains: "不包含",
            startsWith: "起始于",
            endsWith: "结束于",
            group: "分组",
            columns: "列",
            rowGroupColumns: "Pivot Cols",
            rowGroupColumnsEmptyMessage: "please drag cols to group",
            valueColumns: "Value Cols",
            pivotMode: "Pivot-Mode",
            groups: "Groups",
            values: "Values",
            pivots: "Pivots",
            valueColumnsEmptyMessage: "drag cols to aggregate",
            pivotColumnsEmptyMessage: "drag here to pivot",
            noRowsToShow: "无数据",
            toolPanel: "工具栏",
            export: '导出',
            csvExport: '导出 CSV',
            excelExport: '导出 Excel',

            copy: "复制",
            ctrlC: "ctrl + C",
            paste: "粘贴",
            ctrlV: "ctrl + V",
        };
    }
}