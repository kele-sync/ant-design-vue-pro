<template>
  <div>
    <we-search :searchs="searchs" :searchForm="searchForm" @onSearchQuery="onSearchQuery"
      @onSearchReset="onSearchReset" />
    <a-card>
      <we-operation :menus="[ComponentOpr.ADD]" @onOperation="handleOperation">

      </we-operation>

      <we-table :columns="tableColumns" :tableData="tableData" :loading="tableDataLoading" :pagination="tablePagination"
        :addSerial="true" :selectedRows="[]" @onPaginationChange="refreshTableData">
        <template slot="action" slot-scope="{ record }">
          <we-operation :menus="[
            ComponentOpr.DETAIL,
            // ComponentOpr.EDIT,
            ComponentOpr.DELETE,
          ]" @onOperation="(data) => handleOperation(data, record)">

          </we-operation>
        </template>



      </we-table>

      <we-dialog :width="500" :dialogInfo="activeOperDialogInfo" @onConfirm="onDialogConfirm" @onClose="closeDialog"
        :confirmLoading="confirmLoading">
        <we-form :formList="dialogFormSetting" :dialogForm="dialogForm" :isInline="true" :oper="activeOperDialogInfo.Oper"
          ref="weForm" :colNum="1"></we-form>
        <we-table v-if="activeOperDialogInfo.Oper == 'DETAIL'" :columns="detailColumn" :tableData="detaildata"
          :selectedRows="[]"></we-table>
      </we-dialog>
    </a-card>
  </div>
</template>

<script>
import WeCurdMixin from "@/components/weareint/crud/WeCrudMixin";
import Curd from "./index"; import storage from 'store'
import { ComponentOpr } from "@/components/weareint/properties";
export default {
  name: "User",
  mixins: [WeCurdMixin],
  data() {
    return {
      Curd,
      detailColumn: [{
        key: "paramName", label: "paramName"
      }, {
        key: "paramId", label: "paramId"
      }, {
        key: "value", label: "value"
      }, {
        key: "unit", label: "unit"
      }, {
        key: "maxValue", label: "maxValue"
      }, {
        key: "minValue", label: "minValue"
      }, {
        key: "valueTime", label: "valueTime"
      }],
      detaildata: []
    };
  },
  methods: {
    ["confirm" + ComponentOpr.ADD](params) {

      console.log(this.apis);
      this.$refs.weForm.validateState((res) => {
        console.log(res);
        if (res) {
          this.confirmLoading = true;
          this.apis
            .add(params)
            .then(({ data }) => {
              if (data.code === 0) {
                this.closeDialog();
                this.refreshTableData();
              } else {
                console.log(333);
                this.$message.error(data.msg)
              }
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        }
      });
    },
    [ComponentOpr.DETAIL](row) {
      console.log(row);
      this.apis.queryParamsValueByDtu({ devCode: row.devCode }).then(({ data }) => {
        this.detaildata = data.data
      })
      this.dialogForm = Object.assign(this.Curd.getDefaultDialogForm(), row);
      this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
      this.openDialog();
      this.$nextTick(() => {
        if (this.$refs.weForm) {
          this.$refs.weForm.disabledAll();
        }
      });
    },
    [ComponentOpr.DELETE](row) {
      this.$confirm({
        title: "提示",
        content: "是否确认删除",
        onOk: () => {
          this.apis.delete({ devCode: row.devCode }).then(({ data }) => {

            this.refreshTableData();

          });
        },
        onCancel: () => {
          this.$message.info("已取消");
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.role {
  max-height: 300px;
  overflow-y: auto;
}
</style>
