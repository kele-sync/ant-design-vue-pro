export const TimeFormatSet = {
    DAY: 'yyyy-MM-DD',
    SECOND: 'yyyy-MM-DD HH:mm:ss',
};

export const ComponentSet = {
    INPUT: 'a-input',
    TEXTAREA: 'a-textarea',
    INPUTNUMBER: 'a-input-number',
    SELECT: 'a-select',
    RADIOGROUP: 'a-radio-group',
    SLIDER: 'a-slider',
    SWITCH: 'a-switch',
    DATEPICKER: 'a-date-picker',
    DATERANGEPICKER: 'a-range-picker',
    TIMEPICKER: 'a-time-picker',
    TREESELECT: 'a-tree-select',
    NUMBER: 'a-input-number',
    PASSWORD: 'a-input-password',
    WESELECT: 'we-select',
    WEPROCESSSELECT: 'we-process-select', // 工艺工序有固定联动 单独划出一个组件
    WEINPUTNUMBERRANGE: 'input-number-range', // 数字range组件
    WESELECTINPUT: 'we-select-input', // select-input 组合 组件
    TAG: 'a-tag',
    WeMultiSelect: 'we-multi-select',
    WEINTSELECT: 'weint-select',
};

export const ComponentPlaceholder = {
    'a-input': { name: '请输入', showLabel: true },
    'a-textarea': { name: '请输入', showLabel: true },
    'a-select': { name: '请选择', showLabel: true },
    'a-input-number': { name: '请输入', showLabel: true },
    'a-radio-group': { name: '' },
    'a-slider': { name: '' },
    'a-switch': { name: '' },
    'a-date-picker': { name: '请选择', showLabel: true },
    'a-range-picker': { name: ['开始日期', '结束日期'] },
    'a-time-picker': { name: '请选择', showLabel: true },
    'a-time-range-picker': { name: ['开始时间', '结束时间'] },
    'a-tree-select': { name: '请选择', showLabel: true },
    'weint-select': { name: '请选择', showLabel: true },
};

export const ComponentOpr = {
    ADD: 'ADD',
    DELETE: 'DELETE',
    EDIT: 'EDIT',
    DETAIL: 'DETAIL',
    DISABLE: 'DISABLE',
    ENABLE: 'ENABLE',
    ENBEDDELETE: 'ENBEDDELETE',
    ENBEDCOPY: 'ENBEDCOPY',
};

export const ComponentOprList = {
    ADD: {
        name: '新增',
        type: 'primary',
        icon: 'plus',
    },
    DELETE: {
        name: '删除',
        type: 'danger',
        icon: 'delete',
    },
    EDIT: {
        name: '编辑',
        type: 'primary',
        icon: 'edit',
    },
    DETAIL: {
        name: '查看',
        type: 'primary',
        icon: 'eye',
    },
    DISABLE: {
        name: '禁用',
        type: 'danger',
        icon: 'stop',
    },
    ENABLE: {
        name: '启用',
        type: 'primary',
        icon: 'check-circle',
    },
    ENBEDDELETE: {
        name: '删除',
        type: 'danger',
        icon: 'delete',
    },
    ENBEDCOPY: {
        name: '复制',
        type: 'primary',
        icon: 'copy',
    },
};
