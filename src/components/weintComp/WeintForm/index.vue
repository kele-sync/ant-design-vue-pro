<template>
    <a-form-model
        layout="inline"
        labelAlign="left"
        :labelCol="{ span: 24 }"
        :wrapperCol="{ span: 24 }"
        :model="dialogForm"
        ref="weForm"
    >
        <!-- 查看时显示描述信息 -->
        <Detail
            v-if="(dialogInfo.Oper === 'DETAIL' || oper === 'DETAIL') && !detailNotChange"
            :visiableFormList="visiableFormList"
            :computeColNum="computeColNum"
            :dialogForm="dialogForm"
        >
            <slot
                v-for="slot in Object.keys($scopedSlots)"
                :name="slot"
                :slot="slot"
                :value="value"
                slot-scope="{ value }"
            ></slot>
        </Detail>

        <!-- 表单 -->
        <template v-else v-for="item in visiableFormList">
            <!-- 分割线 -->
            <div v-if="item.component == 'a-divider'" :key="item.title">
                <a-divider orientation="center">
                    <a-icon type="tags" />
                    {{ item.title }}
                </a-divider>
            </div>
            <!-- 分割线插槽 -->
            <div v-else-if="item.dividerSlot" :key="item.dividerSlot">
                <slot :name="item.dividerSlot"></slot>
            </div>
            <!-- 表单信息 -->
            <a-form-model-item
                :key="item.key"
                v-else
                v-bind="{ ...item, label: item.tooltip ? undefined : item.label }"
                :style="{ width: formItemWidth, ...item.style }"
                :prop="item.key"
                :rules="generateRules(item)"
                :required="false"
            >
                <!-- label的tooltip -->
                <span slot="label" v-if="item.tooltip">
                    {{ item.label }}&nbsp;
                    <a-tooltip :title="item.tooltip">
                        <a-icon type="question-circle-o" />
                    </a-tooltip>
                </span>
                <!-- 插槽兼容两个属性名 -->
                <slot v-if="item.scopedSlot" :name="item.scopedSlot"></slot>
                <slot v-else-if="item.formItemSlot" :name="item.formItemSlot"></slot>
                <div v-else>
                    <a-checkbox
                        v-if="item.component === ComponentSet.CHECKBOX"
                        v-model="dialogForm[item.key]"
                        :disabled="getDisabled(item)"
                        @change="(value, labelText, extra) => callback(item, value, labelText, extra)"
                        :style="item.style"
                    >
                        {{ item.labelText }}
                    </a-checkbox>
                    <a-tooltip placement="topRight" v-else>
                        <!-- 表单控件的tooltip -->
                        <template slot="title" v-if="item.haveToolip && dialogForm[item.key]">
                            <div style="max-height: 400px; overflow: auto">
                                {{
                                    item.component === ComponentSet.SELECT
                                        ? item.options.find(e => e.value == dialogForm[item.key]).label
                                        : item.haveToolipFunc
                                        ? item.haveToolipFunc(dialogForm[item.key])
                                        : dialogForm[item.key]
                                }}
                            </div>
                        </template>
                        <component
                            :allowClear="item.allowClear === false ? item.allowClear : true"
                            :is="item.component"
                            v-model="dialogForm[item.key]"
                            :placeholder="generatePlaceholder(item)"
                            :style="{
                                width: '100%',
                                ...(item.attr || {}).style,
                            }"
                            ref="component"
                            :maxLength="countMaxLength(item)"
                            :cptKey="item.key"
                            :cptTitle="item.label"
                            optionFilterProp="label"
                            :disabled="getDisabled(item)"
                            @change="(value, label, extra) => controlEvent(item, value, label, extra, 'cb')"
                            @search="(value, label, extra) => controlEvent(item, value, label, extra, 'search')"
                            @blur="(value, label, extra) => controlEvent(item, value, label, extra, 'blur')"
                            v-bind="{ ...$attrs, ...item.attr }"
                            v-on="{ ...$listeners, ...item.events }"
                        >
                            <!-- 组件内部的自定义插槽，slot的值传配置项的key和组件插槽名，通过逗号','分隔 -->
                            <template v-for="slot in Object.keys($scopedSlots)">
                                <slot
                                    :name="slot"
                                    :slot="slot.split(',')[1]"
                                    :item="item"
                                    v-if="slot.split(',')[0] === item.key && slot.split(',')[1]"
                                ></slot>
                            </template>
                            <template v-if="item.component === ComponentSet.SELECT">
                                <a-select-option
                                    v-for="i in item.ownOptionKey ? dialogForm[item.ownOptionKey] : item.options"
                                    :key="i.value"
                                    :value="i.value"
                                    :disabled="i.disabled"
                                    :label="i.label"
                                >
                                    {{ i.label }}
                                </a-select-option>
                            </template>
                            <template v-if="item.component === ComponentSet.RADIOGROUP">
                                <a-radio
                                    v-for="item in item.options"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                >
                                    {{ item.label }}
                                </a-radio>
                            </template>
                        </component>
                    </a-tooltip>
                </div>
            </a-form-model-item>
        </template>
    </a-form-model>
</template>

<script>
import { ComponentSet, ComponentPlaceholder } from '../properties';
import patternsConf from './patterns';
import Detail from './detail';
import lodash from 'lodash';
let timeout = null;
export default {
    name: 'WeintForm',
    components: { Detail },
    props: {
        formList: Array, // 表单配置
        dialogForm: Object, // 表单数据模型
        dialogInfo: { type: Object, default: () => ({}) }, // 弹窗信息
        oper: String, // 弹窗中的操作信息（兼容老版本组件）
        colNum: Number, // 表单展示列数（不传则根据容器大小自动计算）
        detailNotChange: Boolean, // 查看时依然展示表单控件
        rowIndex: Number, // 老版本属性，作用未知
    },
    computed: {
        visiableFormList() {
            // 兼容两种数据格式
            let res = [];
            this.formList.forEach(v => {
                if (v.list && v.list instanceof Array) {
                    if (v.title) {
                        res.push({ title: v.title, component: 'a-divider' });
                    }
                    res = [...res, ...v.list.filter(item => !item.hidden)];
                } else {
                    !v.hidden && res.push(v);
                }
            });
            return res;
        },

        // 表单控件宽度
        formItemWidth() {
            return 100 / this.computeColNum - 1 + '%';
        },
    },
    data() {
        return {
            ComponentSet,
            computeColNum: 1,
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.resetFormItemWidth();
            window.addEventListener('resize', this.resetFormItemWidth);
        });
    },
    destroyed() {
        window.removeEventListener('resize', this.resetFormItemWidth);
    },
    methods: {
        // 根据表单容器宽度计算表单展示列数
        resetFormItemWidth() {
            if (timeout !== null) clearTimeout(timeout);
            timeout = setTimeout(() => {
                const formWidth = this.$refs.weForm.$el.offsetWidth;
                if (formWidth > 0) {
                    this.computeColNum = this.colNum || (formWidth <= 750 ? 1 : formWidth >= 1150 ? 3 : 2);
                }
            }, 50);
        },
        // 校验表单信息
        validateState(func) {
            return this.$refs.weForm.validate(func);
        },
        // 重置表单校验信息
        resetFormValidate() {
            this.$refs.weForm.clearValidate();
        },
        // 重置表单校验信息并失焦
        blurAllComponents() {
            this.$refs.component && this.$refs.component.forEach(e => e.blur());
            this.$nextTick(() => this.resetFormValidate());
        },
        // 获取placeholder
        generatePlaceholder(item) {
            if (item.placeholder) return item.placeholder;
            const placeholder = ComponentPlaceholder[item.component];
            if (!placeholder) return '';
            return placeholder.showLabel ? placeholder.name + item.label : placeholder.name;
        },
        // 表单校验规则
        generateRules(i) {
            const requiredRule = {
                required: !!i.required,
                message: i.label + '不能为空',
                trigger: 'blur',
            };
            const patterns = lodash.cloneDeep(i.patterns) || [];
            if (i.required && i.component === ComponentSet.INPUT) {
                requiredRule.pattern = '[^ \x22]+';
            }
            patterns.push(requiredRule);
            const rules = i.rules ? i.rules : patterns;
            for (let k in patternsConf) {
                i[k] && rules.push({ validator: patternsConf[k] });
            }
            return rules;
        },
        // 获取控件禁用状态，disabled可以传布尔值或Oper数组
        getDisabled(item) {
            let bool;
            if (item.attr && item.attr.disabled !== undefined) {
                item.disabled = item.attr.disabled;
            }
            if (typeof item.disabled === 'boolean') {
                bool = item.disabled;
            } else if (item.disabled instanceof Array) {
                bool = item.disabled.includes(this.dialogInfo.Oper);
            }
            return bool;
        },
        // 表单控件事件回调函数
        controlEvent(item, value, label, extra, type = 'cb') {
            this.$nextTick(() => this.$refs.weForm.validateField([item.key]));
            item.optionValue = item.optionValue || 'value';
            if (item[type]) {
                if (item.options && item.optionValue) {
                    let find = item.options.find(e => e[item.optionValue] == value) || {};
                    return item[type](value, find, label, extra, this.rowIndex);
                } else {
                    return item[type](value, label, extra, this.rowIndex);
                }
            }
        },
        // 输入控件最大输入字数
        countMaxLength(item) {
            if (item.maxLength) {
                return item.maxLength;
            }
            if (item.component == ComponentSet.INPUT) {
                return 50;
            }
            if (item.component == ComponentSet.TEXTAREA) {
                return 200;
            }
        },
    },
};
</script>

<style lang="less" scoped>
form textarea.ant-input {
    margin-bottom: 0 !important;
    position: relative;
    top: 4px;
}
.ant-form-inline .ant-form-item {
    margin-bottom: 8px;
    margin-left: 0.5%;
    margin-right: 0.5%;
}
.ant-form-inline .ant-form-item-with-help {
    margin-bottom: 5px;
}
/deep/ .ant-form-explain {
    min-height: 18px;
    height: 18px;
}
.ant-upload-picture-card-wrapper {
    position: relative;
    top: 10px;
}
.ant-form-item-label-left {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.5;
    padding: 0 !important;
}
.ant-form-item-label > label::after {
    content: '';
}
.ant-divider {
    font-size: 14px !important;
}
// 查看弹窗中的样式
.weint-form-detail-container {
    // margin-bottom: 0 !important;
    .img {
        height: 60px;
        width: 100px;
        object-fit: cover;
    }
}
</style>
