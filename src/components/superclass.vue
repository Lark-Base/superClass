<template>
  <div>
    <a-tabs
      :default-active-key="0"
      v-model:active-key="stepNumIndex"
      @tab-click="changeTabIndex"
    >
      <a-tab-pane :key="0">
        <template #title> <icon-calendar /> {{t('设置班次')}} </template>
        <ClassSet></ClassSet>
      </a-tab-pane>
      <a-tab-pane :key="1">
        <template #title>
          <icon-settings />
          {{t('工作设置')}}
        </template>
        <WorkSet></WorkSet>
      </a-tab-pane>
      <a-tab-pane :key="2">
        <template #title>
          <icon-download />
          {{t('加载人员设置')}}
        </template>
        <ImportData></ImportData>
      </a-tab-pane>
      <!-- <a-tab-pane :key="3" title="预设">
      <template #title>
        <icon-check-square />
        预设
      </template>
      <ManSet></ManSet>
    </a-tab-pane> -->
      <a-tab-pane :key="4" :title="t('排班结果')">
        <template #title>
          <icon-select-all />
          {{t('排班结果')}}
        </template>
        <ResultView></ResultView>
      </a-tab-pane>
      <a-tab-pane :key="5" :title="t('导入表格')">
        <template #title> <icon-translate />{{t('导入表格')}}  </template>
        <ImportResult></ImportResult>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
 <script setup>
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import ClassSet from "./subview/ClassSet.vue";
import ManSet from "./subview/ManSet.vue";
import ResultView from "./subview/Result.vue";
import WorkSet from "./subview/WorkSet.vue";
import ImportData from "./subview/ImportData.vue";
import ImportResult from "./subview/ImportResult.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import {
  manArr,
  dateRangeArr,
  maxWorkNum,
  maxFreeNum,
  orderMode,
  noWorkDateArr,
  stepNumIndex,
} from "./js/common";
function changeTabIndex(e) {
  console.log("ddd", e);
}
</script>
<style scoped>
.labelText {
  width: 100px;
  flex-shrink: 0;
}
</style>
                        
            