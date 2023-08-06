<template>
  <div>
    <we-search :searchs="searchs" :searchForm="searchForm" @onSearchQuery="onSearchQuery"
      @onSearchReset="onSearchReset" />
    <a-card>
      <!-- <we-operation :menus="[ComponentOpr.ADD]" @onOperation="handleOperation">

      </we-operation> -->

      <we-table :columns="tableColumns" :tableData="tableData" :loading="tableDataLoading" :pagination="tablePagination"
        :addSerial="true" :selectedRows.sync="selectedRows" @onPaginationChange="refreshTableData">
        <template slot="action" slot-scope="{ record }">
          <we-operation :menus="[
            ComponentOpr.DETAIL,
            ComponentOpr.EDIT,
            ComponentOpr.DELETE,
          ]" @onOperation="(data) => handleOperation(data, record)">
          </we-operation>
        </template>



      </we-table>

      <we-dialog :width="1300" :dialogInfo="activeOperDialogInfo" @onConfirm="onDialogConfirm" @onClose="closeDialog"
        :confirmLoading="confirmLoading">
        <we-form :formList="dialogFormSetting" :dialogForm="dialogForm" :isInline="true" :oper="activeOperDialogInfo.Oper"
          ref="weForm" :colNum="3"></we-form>
      </we-dialog>
    </a-card>
  </div>
</template>

<script>
import WeCurdMixin from "@/components/weareint/crud/WeCrudMixin";
import Curd from "./index";
export default {
  name: "User",
  mixins: [WeCurdMixin],
  data() {
    return {
      Curd,
    };
  },

};
</script>

<style lang="less" scoped>
.role {
  max-height: 300px;
  overflow-y: auto;
}
</style>
