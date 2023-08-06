<template>
  <a-form-model
    v-bind="defaultFormStyle"
    labelAlign="right"
    labelWrap
    :model="dialogForm"
    ref="weForm"
  >
    <template v-for="item in visiableFormList">
      <div v-if="item.component == 'a-divider'" :key="item.title">
        <a-divider orientation="left">
          <a-icon type="tags" style="color: green" />
          {{ item.title }}
        </a-divider>
      </div>
      <a-form-model-item
        :key="item.key"
        v-else
        v-bind="item"
        style="margin: 10px"
        :prop="item.key"
        :rules="generateRules(item)"
        :required="false"
      >
        <div style="display: flex">
          <component
            :allowClear="item.allowClear === false ? item.allowClear : true"
            :is="item.component"
            v-model="dialogForm[item.key]"
            :placeholder="generatePlaceholder(item)"
            :style="{
              width: item.width || defaultFormStyle.inputWidth || defaultWidth,
            }"
            :maxLength="countMaxLength(item)"
            :cptKey="item.key"
            :cptTitle="item.label"
            v-bind="item.attr"
            @dropdownVisibleChange="(e) => dropdownVisibleChange(e, item)"
            :disabled="countDisabled(item)"
            @change="
              (value, label, extra) => callback(item, value, label, extra)
            "
          >
            <template v-if="item.component === ComponentSet.SELECT">
              <a-select-option
                v-for="i in item.ownOptionKey
                  ? dialogForm[item.ownOptionKey]
                  : item.options"
                :key="i.value"
                :value="i.value"
                :disabled="i.disabled"
              >
                {{ i.label }}
              </a-select-option>
            </template>
            <template v-if="item.component === ComponentSet.RADIOGROUP">
              <a-radio
                v-for="item in item.options"
                :key="item.value"
                :value="item.value"
                :label="v.label"
              >
                {{ item.label }}
              </a-radio>
            </template>
          </component>
          <span v-if="item.unit">{{ item.unit }}</span>
        </div>
      </a-form-model-item>
    </template>
  </a-form-model>
</template>

<script>
import {
  getDefaultFormStyle,
  getDefaultDialogFormStyle,
  countMaxLength,
} from "./utils";
import { ComponentSet, ComponentPlaceholder } from "../properties";
export default {
  name: "WeForm",
  props: {
    formStyle: Object,
    isInline: Boolean,
    formList: Array,
    dialogForm: Object,
    oper: String,
    rowIndex: Number, //列表类Form,简单的form数列可用，复杂的建议重写组件。
  },
  computed: {
    visiableFormList() {
      return this.formList.filter((item) => {
        if (item.hiddenKey) {
          return this.dialogForm[item.hiddenKey];
        }
        return !item.hidden;
      });
    },
    defaultFormStyle() {
      if (this.formStyle) {
        return this.formStyle;
      }
      return this.isInline
        ? getDefaultDialogFormStyle()
        : getDefaultFormStyle();
    },
    defaultWidth() {
      return "200px";
    },
  },
  data() {
    return {
      ComponentSet,
      disabled: false,
    };
  },
  methods: {
    countMaxLength,
    resetFormValidate() {
      this.$refs.weForm.clearValidate();
    },
    validateState(func) {
      return this.$refs.weForm.validate(func);
    },
    generatePlaceholder(item) {
      const placeholder = ComponentPlaceholder[item.component];
      if (item.placeholder) {
        return item.placeholder;
      }
      return placeholder.showLabel
        ? placeholder.name + item.label
        : placeholder.name;
    },

    generateRules(i) {
      let required;
      if (typeof i.required === "function") {
        required = !!i.required(i, this.dialogForm);
      } else {
        required = !!i.required;
      }
      const requiredRule = {
        required: required,
        message: i.label + "不能为空",
        trigger: "blur",
      };

      if (i.required && i.component === ComponentSet.INPUT) {
        requiredRule.pattern = "[^ \x22]+";
      }

      const rules = i.rules ? i.rules : [requiredRule];
      return rules;
    },
    disabledAll() {
      this.disabled = true;
    },
    dropdownVisibleChange(e, item) {
      if (e && item.dropdownVisibleChange) {
        item.dropdownVisibleChange(e, item, this.rowIndex);
      }
    },
    disableReset() {
      this.disabled = false;
    },
    countDisabled(item) {
      if (item.disabledFuc) {
        return item.disabledFuc(item, this.dialogForm);
      }
      if (item.disableKey) {
        return this.dialogForm[item.disableKey];
      }
      return (
        (item.attr && item.attr.disabled) ||
        (this.oper == "EDIT" && item.editDisabled) ||
        this.disabled
      );
    },
    callback(item, value, label, extra) {
      if (item.cb) {
        if (item.options && item.optionValue) {
          let find;
          if (item.ownOptionKey) {
            find = this.dialogForm[item.ownOptionKey].find(
              (e) => e[item.optionValue] == value
            );
          } else {
            find = item.options.find((e) => e[item.optionValue] == value);
          }
          find = find ? find : {};
          return item.cb(value, find, label, this.rowIndex);
        } else {
          return item.cb(value, label, extra, this.rowIndex);
        }
      }
    },
  },
};
</script>

<style lang="less" scope>
</style>
