/**
 * 常用的正则校验
 * 后面如果需要新增，在该对象中加上就行了
 * 使用方式示例：forbidenChinese: true
 */
export default {
    forbidenChinese: (rule, value, callback) => {
        if (value) {
            if (/[\u4E00-\u9FA5]/g.test(value)) {
                callback(new Error('不能包含中文!'));
            } else {
                callback();
            }
        }
        callback();
    },
};
