<template>
  <a-spin :loading="loading || bit_loading" style="width: 100%">
    <div class="row-between-center">
      <a-typography-text disabled>{{t('初次使用,请创建排班结果表')}}</a-typography-text>
      <a-popconfirm :content="t('确定创建')" @ok="createTabLeVoid">
        <a-button type="primary">{{t('创建排班结果表')}}</a-button>
      </a-popconfirm>
    </div>
    <div class="grid-one p-all-1 grid-gap-5">
      <SelectTableView
        :title="t('选择表')"
        v-model="export_table_id"
        canAdd
      ></SelectTableView>
      <SelectFieldView
        :title="t('日期')"
        v-model="bit_export_dic.date"
        :typeNumArr="[1, 5]"
        :preSetArr="[t('日期')]"
        :allFieldDic="bit_export_dic"
        canAdd
      ></SelectFieldView>

      <SelectFieldView
        v-for="(item, index) in classArr"
        :key="index"
        :title="item.node"
        v-model:model-value="bit_export_dic[item['field']]"
        :typeNumArr="[]"
        :preSetArr="[item['node']]"
        :allFieldDic="bit_export_dic"
        canAdd
      ></SelectFieldView>
    </div>
    <div class="row-center-center m-t-10">
      <a-button :disabled="!canImport" type="primary" @click="fixToBitData"
        >{{t('开始导入')}}</a-button
      >
    </div>
  </a-spin>
</template>
<script setup>
import { Message } from "@arco-design/web-vue";
import { computed, onMounted, ref } from "vue";
import { classArr, dataArr, computedWork, middleArr } from "../js/common";
import {
  bit_select_dic,
  addBitRecord,
  export_table_id,
  bit_table,
  bit_loading,
  oneStepCreateResutTable,
  bit_export_dic,
  bit_all_table,
  bit_all_fieldList,
} from "../js/superBase";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import SelectFieldView from "../superView/SelectField.vue";
import SelectTableView from "../superView/selectTable.vue";
const loading = ref(false);
onMounted(() => {
  for (let item of classArr.value) {
    bit_export_dic.value[item.field] = "";
  }
});
// 一键创建表
async function createTabLeVoid() {
  bit_loading.value = true;
  bit_export_dic.value = await oneStepCreateResutTable();
  bit_loading.value = false;
}

const canImport = computed(
  () =>
    !Object.values(bit_export_dic.value).includes("") &&
    dataArr.value.length > 0
);
async function fixToBitData() {
  if (dataArr.value.length == 0) {
    return Message.info("无可导入的数据");
  }
  loading.value = true;
  export_table_id.value = bit_table.id; //记录导入人员的表

  let fieldNameDic = {
    date: bit_export_dic.value.date,
    ...Object.fromEntries(
      classArr.value.map((item) => [
        item.node,
        bit_export_dic.value[item.field],
      ])
    ),
  };
  const dateFileDic = bit_all_fieldList.value.find(
    (a) => a["id"] == bit_export_dic.value.date
  );

  let arr = dataArr.value.map((item) => {
    const dic = { fields: {} };
    for (let [key, fieldName] of Object.entries(fieldNameDic)) {
      if (key !== "date") {
        let isManType = false;
        const manList = item[key].map((a) => {
          if (a.fieldType === 11) {
            isManType = true;
            return { id: a.id, name: a["name"] };
          } else {
            return a.name;
          }
        });
        dic.fields[fieldName] = isManType ? manList : manList.join(",");
      } else {
        if (dateFileDic.type == 5) {
          dic.fields[fieldName] = new Date(item[key]).getTime();
        } else {
          dic.fields[fieldName] = item[key]; //new Date(item[key]).getTime()
        }
      }
    }
    return dic;
  });
  await addBitRecord(arr, export_table_id.value);
  Message.success(t("导入成功"));
  loading.value = false;
}
</script>
<style scoped>
.labelText {
  width: 100px;
  flex-shrink: 0;
}
</style>
                                    
                        