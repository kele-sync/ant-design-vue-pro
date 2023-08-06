<template>
  <div>
    <a-auto-complete
      :placeholder="placeholder"
      :value="value"
      :style="{ width: width ? width : '100%' }"
      :data-source="dataSource.map((e) => e.label)"
      @change="handleChange"
    />
  </div>
</template>

<script>
export default {
  name: "WeTabs",
  props: {
    options: Array,
    value: String,
    placeholder: String,
    disabled: Boolean,
    attr: Object,
    width: [String, Number],
  },
  data() {
    return {
      dataSource: [],
    };
  },
  mounted() {
    this.dataSource = this.options;
  },
  methods: {
    changeValue(e) {
      this.$emit("input", e.target.value);
    },
    handleChange(value) {
      const options = this.$_.cloneDeep(this.options);
      this.dataSource = options.filter((e) => e.label.indexOf(value) >= 0);
      this.$emit("input", value);
    },
  },
};
</script>

<style lang="less"></style>
