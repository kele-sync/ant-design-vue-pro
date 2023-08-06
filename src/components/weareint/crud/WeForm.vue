<template>
  <a-form-model
    layout="inline"
    v-bind="defaultFormStyle"
    labelAlign="left"
    :model="dialogForm"
    :labelCol="computeColNum === 1 ? { span: 24 } : { span: 22, offset: 1 }"
    :wrapperCol="computeColNum === 1 ? { span: 24 } : { span: 22, offset: 1 }"
    ref="weForm"
  >
    <!-- 查看时显示描述信息 -->
    <template v-if="(oper === 'DETAIL' || detail) && !detailNotChange">
      <template v-for="(item, i) in checkFormList">
        <div v-if="item[0].component == 'a-divider'" :key="i">
          <a-divider orientation="left">
            <a-icon type="tags" />
            {{ item[0].title }}
          </a-divider>
        </div>
        <div v-else-if="item[0].dividerSlot" :key="item[0].dividerSlot">
          <slot :name="item[0].dividerSlot"> </slot>
        </div>
        <a-descriptions
          :style="{
            '--detailLabelWidth':
              (item.detailLabelWidth || 40) /
                (item.length < computeColNum ? item.length : computeColNum) +
              '%',
            '--detailValueWidth':
              (item.detailLabelWidth ? 100 - item.detailLabelWidth : 60) /
                (item.length < computeColNum ? item.length : computeColNum) +
              '%',
            width: `${
              item.length < computeColNum
                ? (item.length * 100) / computeColNum
                : '100'
            }%`,
          }"
          title=""
          size="middle"
          bordered
          v-else
          :key="item[0].key"
          :column="visiableFormList.detailColNum || computeColNum"
          class="detail-container"
        >
          <template v-for="x in item">
            <a-descriptions-item
              v-if="!x.hidden"
              :key="x.key"
              :label="x.label || x.labelText"
              :span="(x.detailAttr && x.detailAttr.span) || 1"
            >
              <!-- slot -->
              <slot
                v-if="x.detailAttr && x.detailAttr.slot"
                :name="x.detailAttr.slot"
                v-bind="{ value: dialogForm[x.key] }"
              >
              </slot>
              <!-- 图片 -->
              <template v-else-if="x.detailAttr && x.detailAttr.isImg">
                <img preview="1" class="img" :src="dialogForm[x.key]" />
              </template>
              <!-- 文件 -->
              <template v-else-if="x.detailAttr && x.detailAttr.isFile">
                <a :href="dialogForm[x.key]" download>点击下载</a>
              </template>
              <span v-else-if="x.component === 'a-tree-select'" class="text">
                <span>{{
                  getLabelFromTreedata(
                    x.attr.treeData,
                    dialogForm[x.key],
                    x.attr.childrenName,
                    x.key
                  ) !== ""
                    ? getLabelFromTreedata(
                        x.attr.treeData,
                        dialogForm[x.key],
                        x.attr.childrenName,
                        x.key
                      )
                    : "--"
                }}</span>
              </span>
              <span v-else-if="x.component === 'a-switch'" class="text">
                <span>{{
                  dialogForm[x.key]
                    ? x.attr.checkedChildren
                    : x.attr.unCheckedChildren
                }}</span>
              </span>
              <!-- 文本 -->
              <span v-else class="text">
                <span>{{
                  x.fomartValueFuc
                    ? x.fomartValueFuc(x, dialogForm)
                    : getLabelFromOptions(x.options, dialogForm[x.key], x) !==
                      ""
                    ? getLabelFromOptions(x.options, dialogForm[x.key], x)
                    : "--"
                }}</span>
              </span>
            </a-descriptions-item>
          </template>
        </a-descriptions>
      </template>
    </template>

    <template v-else v-for="item in visiableFormList">
      <div v-if="item.component == 'a-divider'" :key="item.title">
        <a-divider orientation="left">
          <a-icon type="tags" />
          {{ item.title }}
        </a-divider>
      </div>
      <div v-else-if="item.dividerSlot" :key="item.dividerSlot">
        <slot :name="item.dividerSlot"> </slot>
      </div>
      <a-form-model-item
        :key="item.key"
        v-else-if="!item.hidden"
        v-bind="{ ...item, label: item.tooltip ? undefined : item.label }"
        :style="`width:${
          item.funcWidth
            ? item.funcWidth
              ? item.funcWidth + '%'
              : formItemWidth
            : formItemWidth
        };${
          item.component === ComponentSet.CHECKBOX
            ? 'verticalAlign: bottom'
            : ''
        }`"
        :class="{
          'textarea-class': item.funcWidth, //自定义宽度
        }"
        :prop="item.key"
        :rules="generateRules(item)"
        :required="false"
      >
        <span slot="label" v-if="item.tooltip">
          {{ item.label }}&nbsp;
          <a-tooltip :title="item.tooltip">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <slot v-if="item.scopedSlot" :name="item.scopedSlot"> </slot>
        <div v-else>
          <a-checkbox
            v-if="item.component === ComponentSet.CHECKBOX"
            v-model="dialogForm[item.key]"
            :disabled="countDisabled(item)"
            @change="
              (value, labelText, extra) =>
                callback(item, value, labelText, extra)
            "
            :style="item.style"
          >
            {{ item.labelText }}
          </a-checkbox>
          <a-tooltip placement="topRight" v-else>
            <template
              slot="title"
              v-if="item.haveToolip && dialogForm[item.key]"
            >
              <div style="max-height: 400px; overflow: auto">
                {{
                  item.component === ComponentSet.SELECT
                    ? item.options.find((e) => e.value == dialogForm[item.key])
                        .label
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
              v-bind="item.attr"
              @dropdownVisibleChange="(e) => dropdownVisibleChange(e, item)"
              :disabled="countDisabled(item)"
              @change="
                (value, label, extra) => callback(item, value, label, extra)
              "
              @blur="itemBlur(item)"
            >
              <template v-if="item.component === ComponentSet.SELECT">
                <a-select-option
                  v-for="i in item.ownOptionKey
                    ? dialogForm[item.ownOptionKey]
                    : item.options"
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

            <span
              v-if="item.unit"
              :style="{ width: item.unitWidth || '30px' }"
              >{{ item.unit }}</span
            >
          </a-tooltip>
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
let timeout = null;
export default {
  name: "WeForm",
  props: {
    formStyle: Object,
    isInline: Boolean,
    formList: Array,
    dialogForm: Object,
    oper: String,
    rowIndex: Number, //列表类Form,简单的form数列可用，复杂的建议重写组件。
    colNum: Number,
    detailNotChange: Boolean,
  },
  computed: {
    visiableFormList() {
      return this.formList.filter((item) => !item.hidden);
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
      return this.isInline ? "200px" : null;
    },
    formItemWidth() {
      return Math.floor(100 / this.computeColNum) + "%";
    },
  },
  data() {
    return {
      treeItem: {},
      ComponentSet,
      disabled: false,
      detail: false,
      computeColNum: 1,
      checkFormList: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      const formWidth = this.$refs.weForm.$el.offsetWidth;
      this.computeColNum =
        this.colNum || (formWidth <= 750 ? 1 : formWidth >= 1150 ? 3 : 2);
      window.addEventListener("resize", this.resetFormItemWidth);
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.resetFormItemWidth);
  },
  methods: {
    blurAllComponents() {
      this.$refs.component && this.$refs.component.forEach((e) => e.blur());
      this.$nextTick(() => {
        this.resetFormValidate();
      });
    },
    resetFormItemWidth() {
      const _this = this;
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const formWidth = _this.$refs.weForm.$el.offsetWidth;
        if (formWidth > 0) {
          _this.computeColNum =
            _this.colNum || (formWidth <= 750 ? 1 : formWidth >= 1150 ? 3 : 2);
        }
      }, 50);
    },
    countMaxLength,
    resetFormValidate() {
      this.$refs.weForm.clearValidate();
    },
    validateState(func) {
      return this.$refs.weForm.validate(func);
    },
    checkData(rule, value, callback) {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error("不能包含中文!"));
        } else {
          callback();
        }
      }
      callback();
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
    // 获得普通枚举的label
    getLabelFromOptions(options, value, item) {
      if (!options) {
        return value;
      } else {
        if (item.attr && item.attr.mode == "multiple") {
          if (value && value.length > 0) {
            return options
              .filter((v) => value.indexOf(v.value) != -1)
              .map((e) => e.label)
              .join(",");
          } else {
            return "";
          }
        } else {
          let res = options.find((v) => v.value === value);
          return res ? res.label : value;
        }
      }
    },
    getLabelFromTreedata(tree, value, childrenName = "childs", key) {
      this.getTreedata(tree, value, childrenName, key);
      return this.treeItem[key];
    },

    // 获得树形结构的label
    getTreedata(tree, value, childrenName = "childs", key) {
      for (let item of tree) {
        if (!item[childrenName] && item.id !== value) {
          continue;
        }
        if (item.id === value) {
          this.$set(this.treeItem, key, item.name);
        } else {
          this.getTreedata(item[childrenName], value, childrenName, key);
        }
      }
    },
    generateRules(i) {
      const requiredRule = {
        required: !!i.required,
        message: i.label + "不能为空",
        trigger: "blur",
      };
      const patterns = this.$_.cloneDeep(i.patterns) || [];
      if (i.required && i.component === ComponentSet.INPUT) {
        requiredRule.pattern = "[^ \x22]+";
      }
      patterns.push(requiredRule);
      const rules = i.rules ? i.rules : patterns;
      if (i.forbidenChinese) {
        rules.push({ validator: this.checkData, trigger: "blur" });
      }
      return rules;
    },
    disabledAll() {
      this.disabled = true;
      this.detail = true;
      // 适配查看窗口中有分割线的数据
      if (
        this.visiableFormList.some(
          (item) => item.component === "a-divider" || item.dividerSlot
        )
      ) {
        let i = 0,
          arr = [];
        this.visiableFormList.map((item) => {
          if (item.component === "a-divider" || item.dividerSlot) {
            if (i === 0 && !arr[i]) {
              arr[i] = [item];
              i++;
            } else if (i === 0 && arr[i]) {
              arr[++i] = [item];
              i++;
            } else {
              arr[++i] = [item];
              i++;
            }
          } else {
            arr[i] ? arr[i].push(item) : (arr[i] = [item]);
          }
        });
        this.checkFormList = arr;
      } else {
        this.checkFormList = [this.visiableFormList];
      }
    },
    disabledAllOper() {
      this.disabled = true;
      this.detail = false;
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
      return (
        (item.attr && item.attr.disabled) ||
        (this.oper == "EDIT" && item.editDisabled) ||
        this.disabled
      );
    },
    itemBlur(item) {
      this.$nextTick(() => {
        this.$refs.weForm.validateField([item.key], (msg) => {
          console.log(msg);
        });
      });
      return item.blur && item.blur();
    },
    callback(item, value, label, extra) {
      this.$nextTick(() => {
        this.$refs.weForm.validateField([item.key], (msg) => {
          console.log(msg);
        });
      });
      item.optionValue = item.optionValue || "value";
      if (item.cb) {
        if (item.options && item.optionValue) {
          let find = item.options.find((e) => e[item.optionValue] == value);
          find = find ? find : {};
          return item.cb(value, find, label, extra, this.rowIndex);
        } else {
          return item.cb(value, label, extra, this.rowIndex);
        }
      }
    },
  },
};
</script>

<style lang="less" scope>
.textarea-class {
  .ant-col-offset-1 {
    margin-left: 2%;
  }
  .ant-col-22 {
    width: 96%;
  }
}
form textarea.ant-input {
  margin-bottom: 0 !important;
  position: relative;
  top: 4px;
}
.ant-form-inline .ant-form-item {
  margin-bottom: 8px;
  margin-right: 0;
  // min-height: 60px;
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
// form表单多列的时候会多一个冒号
.ant-form-item-label > label::after {
  content: "";
}

// 查看弹窗中的样式
.detail-container {
  margin-bottom: 20px;
  .img {
    height: 60px;
    width: 100px;
    object-fit: cover;
  }
  .ant-descriptions-item-label {
    text-align: center;
    font-weight: bold;
    width: var(--detailLabelWidth);
  }
  .ant-descriptions-item-content {
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // word-break: break-word;
    width: var(--detailValueWidth);
    > .text {
      display: block;
      max-height: 250px;
      overflow-y: auto;
    }
  }
}
</style>
