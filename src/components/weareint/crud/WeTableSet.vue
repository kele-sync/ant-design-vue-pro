<template>
  <div class="btn-table-set">
    <a-button @click="handleSet" type="info" icon="setting">配置表格</a-button>
    <a-modal
      width="700px"
      v-drag-modal
      :dialog-style="{ top: '20px' }"
      :visible.sync="modalVisble"
      title="表格配置"
      :maskClosable="false"
      @ok="confirm"
      @cancel="close"
    >
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">原始列名</th>
            <th scope="col">自定义别名</th>
            <th scope="col">是否显示</th>
          </tr>
        </thead>
        <draggable v-model="copyColumns" tag="tbody">
          <tr v-for="item in copyColumns" :key="item.name">
            <td scope="row">{{ item.title }}</td>
            <td draggable="false">
              <a-input v-model="item.alias" draggable="false"></a-input>
            </td>
            <td><a-checkbox v-model="item.enable"></a-checkbox></td>
          </tr>
        </draggable>
      </table>
    </a-modal>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "WeTableSet",
  props: {
    columns: Array,
  },
  inject: ["pageName"],
  components: {
    draggable,
  },
  mounted() {},
  computed: {
    storageKey() {
      return this.$route.path + ":" + this.pageName;
    },
  },
  data() {
    return {
      modalVisble: false,
      copyColumns: [],
    };
  },
  methods: {
    handleSet() {
      this.generateColumns();
      this.modalVisble = true;
    },
    checkColUnUpdate(storageColumn) {
      return !this.columns.find(
        (col) =>
          !storageColumn.find(
            (item) => item.key == col.key && item.title == col.label
          )
      );
    },
    generateColumns() {
      let storageColumn = this.$lockr.get(this.storageKey);
      if (storageColumn && this.checkColUnUpdate(storageColumn)) {
        this.copyColumns = storageColumn;
      } else {
        this.copyColumns = this.columns.map((item) => {
          return {
            title: item.label,
            alias: item.label,
            key: item.key,
            enable: true,
          };
        });
      }
    },
    confirm() {
      if (!this.copyColumns.find((item) => item.enable)) {
        return this.$message.error("不能一列都不选");
      }
      this.$lockr.set(this.storageKey, this.copyColumns);
      this.$emit("changeColumns", this.copyColumns);
      this.close();
    },
    close() {
      this.modalVisble = false;
    },
  },
};
</script>

<style lang="less" scoped>
.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}
.table .thead-dark th {
  color: #fff;
  background-color: #343a40;
  border-color: #454d55;
}
.table td,
.table th {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
  cursor: pointer;
}
.btn-table-set {
  margin-top: 10px;
  float: left;
}
</style>
