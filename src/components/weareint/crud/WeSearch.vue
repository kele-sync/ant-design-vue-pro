<template>
  <a-card
    class="search-card"
    :style="{
      '--maxLabelWidth': maxLabelWidth + 'px',
      '--formItemWidth': 100 / colNum + '%',
    }"
  >
    <a-form
      v-bind="defaultFormStyle"
      name="advanced_search"
      class="coverAnt"
      :model="searchForm"
      ref="searchForm"
    >
      <template v-for="(item, i) in visiableSearchs">
        <a-form-item
          :key="i"
          :name="item.key"
          :label="item.label"
          :style="{ ...item.style }"
          :wrapperCol="item.wrapperCol || wrapperCol"
          :labelCol="item.labelCol || labelCol"
        >
          <a-tooltip placement="topRight">
            <template
              slot="title"
              v-if="
                item.toolipFunc && item.toolipFunc(searchForm[item.key]).length
              "
            >
              <div style="max-height: 400px; overflow: auto">
                <p v-for="i in item.toolipFunc(searchForm[item.key])" :key="i">
                  {{ i }}
                </p>
              </div>
            </template>
            <component
              @input="(v) => item.cb && item.cb(v)"
              :is="item.component"
              :class="[item.selectAllStyle ? 'selectAllStyle' : '']"
              v-model.trim="searchForm[item.key]"
              v-bind="{ allowClear: true, ...item.attr }"
              :placeholder="
                item.placeholder
                  ? item.placeholder
                  : getPlaceholder(item.label, item.component)
              "
              optionFilterProp="label"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              :supplySearch="item.supplySearch || {}"
              @select="(v) => item.select && item.select(v, item.options)"
              @search="(v) => item.search && item.search(v, item.options)"
              @change="(v) => item.cb && item.cb(v, item.options)"
              @calendarChange="
                (v) =>
                  item.calendarChange && item.calendarChange(v, item.options)
              "
              @pressEnter="query"
              :style="{ width: item.width || '100%' }"
            >
              <template v-if="item.component === ComponentSet.SELECT">
                <a-select-option
                  v-for="v in getAddAllOption(
                    item.options,
                    item.customAllOptionLabel,
                    item.hideAll
                  )"
                  :key="v.value"
                  :value="v.value"
                  :label="v.label"
                  >{{ v.label }}</a-select-option
                >
              </template>
            </component>
          </a-tooltip>
        </a-form-item>
      </template>

      <a-form-item class="btns" :style="{ width: btnsWidth }">
        <a-button icon="search" type="primary" @click="query">查询</a-button>
        <a-button icon="reload" type="default" @click="reset">重置</a-button>
        <a
          v-if="searchs.filter((item) => !item.hidden).length > max"
          style="font-size: 12px"
          @click="expand = !expand"
        >
          {{ expand ? "收起" : "展开" }}
          <a-icon :type="expand ? 'up' : 'down'" />
        </a>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { getDefaultInlineFormStyle } from "./utils";
import { ComponentSet, ComponentPlaceholder } from "../properties";
let timeout;
export default {
  name: "WeSearch",
  props: {
    searchs: Array,
    searchForm: Object,
    max: {
      type: [Number, String],
      default: 3,
    },
    labelCol: {
      type: Object,
      default: () => ({ span: 6 }),
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 18, offset: 0 }),
    },
    defaultFormStyle: {
      type: Object,
      default: getDefaultInlineFormStyle,
    },
    itemMinWidth: {
      type: Number,
      default: 350,
    },
  },
  computed: {
    visiableSearchs() {
      return !this.expand
        ? this.searchs.filter((item) => !item.hidden).splice(0, this.max)
        : this.searchs.filter((item) => !item.hidden);
    },
    maxLabelWidth() {
      let widths = [0, 26, 40, 54, 68, 82, 96, 110];
      return (
        widths[
          this.visiableSearchs
            .map((item) => item.label?.length)
            .sort()
            .reverse()[0]
        ] || 96
      );
    },
    btnsWidth() {
      // 计算查询按钮所占宽度百分比
      let res,
        len = this.visiableSearchs.length,
        colNum = this.colNum;
      if (len < colNum) {
        res = (colNum - (len % colNum)) / this.colNum;
      } else if (len % colNum === 0) {
        res = 1;
      } else {
        res = (colNum - (len % colNum)) / this.colNum;
      }
      return res * 100 + "%";
    },
  },
  mounted() {
    setTimeout(() => {
      const formWidth = this.$refs.searchForm.$el.offsetWidth;
      formWidth > this.itemMinWidth &&
        (this.colNum = Math.floor(formWidth / this.itemMinWidth));
      window.addEventListener("resize", this.resetSearchItemWidth);
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.resetSearchItemWidth);
  },
  data() {
    return {
      ComponentSet,
      expand: false, // 是否展开
      colNum: 1,
    };
  },
  methods: {
    resetSearchItemWidth() {
      const _this = this;
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const formWidth = _this.$refs.searchForm.$el.offsetWidth;
        formWidth > this.itemMinWidth &&
          (this.colNum = Math.floor(formWidth / this.itemMinWidth));
      }, 10);
    },
    query() {
      this.$emit("onSearchQuery");
    },
    reset() {
      this.$emit("onSearchReset");
    },
    // 添加placeholder的提示
    getPlaceholder(label, method) {
      const placeholder = ComponentPlaceholder[method];
      return placeholder && placeholder.showLabel
        ? placeholder.name + label
        : placeholder.name;
    },
    // 在下拉框中添加全部选项，如果有自定义，用自定义label
    getAddAllOption(options, customAllOptionLabel, hideAll) {
      if (hideAll) {
        return options;
      }
      if (options && options.length) {
        return [
          {
            label: customAllOptionLabel || "全部",
            value: "",
          },
          ...options,
        ];
      } else {
        return [];
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ant-calendar-picker-input {
  padding: 4px 0;
}
/deep/ .ant-calendar-range-picker-input {
  width: calc(50% - 5px);
}
/deep/ .selectAllStyle {
  .ant-select-selection__placeholder {
    color: #595959;
  }
}

/deep/ .ant-select-open {
  .ant-select-selection__placeholder {
    color: #bfbfbf;
  }
}

.coverAnt {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-advanced-search-form .ant-form-item {
    margin-bottom: 0;
  }
}
.search-card {
  margin-bottom: 12px;
  /deep/ .ant-form-item-label {
    // text-align: justify;
    // text-align-last: justify;
    width: var(--maxLabelWidth);
    label::after {
      display: inline !important;
      content: ":";
      position: relative;
      top: -0.5px;
      margin: 0 8px 0 2px;
    }
  }
  @media (max-width: 575px) {
    /deep/ .ant-form-item-label {
      display: inline;
      margin: 0;
      padding: 0;
      line-height: 40px;
      white-space: nowrap;
      text-align: right;
    }
  }
  /deep/ .ant-card-body {
    padding: 20px;
    padding-bottom: 20px;
  }
  /deep/.ant-form-item {
    margin-bottom: 8px;
    padding-right: 20px;
    display: flex;
    width: var(--formItemWidth);
    height: 32px;
  }
  /deep/.ant-form-item > .ant-form-item-control-wrapper {
    flex-grow: 1;
    width: min-content;
  }
  .btns {
    position: relative;
    top: -1px;
    white-space: nowrap;
    text-align: right;
    /deep/ .ant-form-item-children > * {
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .ant-calendar-picker {
    width: 100% !important;
  }
}
</style>
