//获取默认dialog配置信息
export function getDefaultDailogInfo() {
    return {
        visible: false,
        title: undefined,
        Oper: undefined,
    };
}

//获取默认列表分页配置
export function getDefaultTablePagination() {
    return {
        current: 1,
        size: 20,
        total: 0,
    };
}
