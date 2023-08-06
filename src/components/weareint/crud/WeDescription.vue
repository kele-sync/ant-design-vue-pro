<template>
  <a-descriptions :title="title" :column="attr.column || 3" v-bind="attr">
    <a-descriptions-item
      :label="item.label"
      :span="item.span || 1"
      v-for="item in dataList"
      :key="item.key"
    >
      <a-badge
        :color="getColor(item)"
        :text="getValue(item)"
        v-if="item.mapper && item.badgeColors"
      ></a-badge>
      <template v-else>
        {{ getValue(item) || "--" }}
      </template>
    </a-descriptions-item>
  </a-descriptions>
</template>

<script>
import moment from "moment";
import { ComponentSet } from "@/components/weareint/properties";

const defaultTimeFormat = "YYYY-MM-DD HH:mm:ss";
export default {
  components: {},
  name: "WeDescription",
  props: {
    attr: {
      type: [Object, null],
      default: () => ({}),
    },
    title: {
      type: String,
      default: "",
    },
    list: {
      type: Array,
      default: () => [],
      // [{ label: 'label', key: 'key', span: 2 }]
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  computed: {
    dataList() {
      return this.list.filter((item) => !item.hidden && item.label !== "操作");
    },
  },
  methods: {
    getValue(item) {
      const { key, mapper, options, component, timeFormat } = item;
      const value = this.data[key];
      if (timeFormat || component === ComponentSet.DATEPICKER) {
        return value
          ? moment(value).format(timeFormat || defaultTimeFormat)
          : "";
      } else if (mapper || options) {
        return (mapper.find((e) => e.value === value) || {}).label;
      }
      return value;
    },
    getColor(item) {
      const { key, mapper, badgeColors } = item;
      const list = mapper.map((item, index) => ({
        ...item,
        color: badgeColors[index],
      }));
      const value = this.data[key];
      return (list.find((e) => e.value === value) || {}).color;
    },
  },
};
</script>

<style lang="less" scoped></style>
