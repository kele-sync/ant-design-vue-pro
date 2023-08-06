<template>
  <div class="components-input-demo-presuffix">
    <a-tooltip placement="topLeft">
      <template slot="title">
        <p>{{ cronExplain }}</p>
        <!-- <p>{{ cron }}</p> -->
      </template>
      <a-input
        @click="openModal"
        placeholder="corn表达式"
        v-model="cronExplain"
        readOnly

        :disabled="disabled"
        @change="handleOK"
      >
        <a-icon slot="prefix" type="schedule" title="corn控件" />
        <!-- <a-icon
          v-if="cron"
          slot="suffix"
          type="close-circle"
          @click="handleEmpty"
          title="清空"
        /> -->
      </a-input>
    </a-tooltip>

    <JCronModal ref="innerVueCron" :data="cron" @ok="handleOK"></JCronModal>
  </div>
</template>
<script>
import JCronModal from "./WeCronModal.vue";
export default {
  name: "WeCron",
  components: {
    JCronModal,
  },
  props: {
    value: {
      required: false,
      type: String,
      default: () => {
        return "0 0 8,12,16,20 1/1 1/1 ?";
      },
    },
    valueExplain: {
      required: false,
      type: String,
      default: () => {
        return "每天8点、12点、16点、20点";
      },
    },
    disabled: Boolean,
  },
  data() {
    return {
      cron: "",
      cronExplain: this.valueExplain,
    };
  },
  mounted() {
    this.$set(this, "cron", this.value);
    this.$emit("change", this.cron);
  },
  watch: {
    value(val) {
      this.$set(this, "cron", val);
    },
  },
  methods: {
    openModal() {
      this.$refs.innerVueCron.show();
    },
    handleOK(val) {
      this.$http(
        `/technology-manager/openapi/utility/getCronDescription`,
        "get",
        { cron: val }
      ).then((res) => {
        this.cronExplain = res.data;
      });
      this.$set(this, "cron", val);
      this.$emit("change", this.cron);
    },
    handleEmpty() {
      this.handleOK("");
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
};
</script>
<style scoped>
.components-input-demo-presuffix .anticon-close-circle {
  cursor: pointer;
  color: #ccc;
  transition: color 0.3s;
  font-size: 12px;
}
.components-input-demo-presuffix .anticon-close-circle:hover {
  color: #f5222d;
}
.components-input-demo-presuffix .anticon-close-circle:active {
  color: #666;
}
</style>
