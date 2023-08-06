import lodash from 'lodash';

// 给每一列造个key，需要兼容只传slot不传key的情况和操作列传slot的情况
export function buildKey(item) {
    // function guid() {
    //     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //         var r = (Math.random() * 16) | 0,
    //             v = c == 'x' ? r : (r & 0x3) | 0x8;
    //         return v.toString(16);
    //     });
    // }
    if (item.key) {
        return item.key;
    } else if (item.scopedSlots && item.scopedSlots.customRender === 'action') {
        return 'weint-operation';
    } else if (item.scopedSlots && item.scopedSlots.customRender) {
        // return guid() + '-' + item.scopedSlots.customRender;
        return 'weint-table-key-' + item.scopedSlots.customRender; // 由于Column组件和weint-table组件中都需要生成key，所以不能用uuid，改成加固定前缀
    }
    return;
}

// 将原始的columns格式化成需要的showColList
export function formatColumnsDeep(columns) {
    let result = lodash.cloneDeep(columns.filter(v => !v.hidden));
    (function setAttr(data) {
        data.forEach((item, index) => {
            data[index] = {
                ...item,
                label: item.label,
                key: buildKey(item),
                checked: !item.hide,
                disabled: item.alwaysShow,
            };
            if (item.children) {
                setAttr(item.children);
            }
        });
    })(result);
    return result;
}

// 从对象中获取指定值，key支持xxx.xxx
export function getvFromObj(obj, key) {
    if (!obj || !key) {
        return null;
    }
    if (obj[key]) {
        return obj[key];
    }
    let keys = key.split('.');
    let result = obj;
    for (let i = 0; i < keys.length; i++) {
        result = result[keys[i]];
        if (!(result instanceof Object) || result instanceof Array) {
            break;
        }
    }
    return result;
}

// 深度查找集合
export function findDeep(list, cb, childKey = 'children') {
    let result;
    for (let index = 0; index < list.length; index++) {
        let item = list[index];
        if (cb(item, index)) {
            result = item;
            break;
        } else {
            if (item[childKey]) {
                result = findDeep(item[childKey], cb, childKey);
            }
        }
    }
    return result;
}

// 通过字典获取value对应的label
export function getLabel(value, mapper) {
    if (mapper) {
        let item = mapper.find(i => i.value == value);
        return item ? item.label : value;
    }
    return value;
}
