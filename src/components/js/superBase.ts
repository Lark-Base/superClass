import { bitable, FieldType, ITable } from "@lark-base-open/js-sdk";
import { classArr } from "./common";
import { ref } from "vue";
import { Message } from "@arco-design/web-vue";
let bit_table: ITable;
const bit_loading = ref(false);
const bit_all_fieldList = ref<any>([{ name: "ddd", id: "111", type: 1 }]);
const bit_all_table = ref<any>([]);
const bit_select_dic = ref<any>({
  baseId: "",
  fieldId: "",
  recordId: "",
  tableId: "",
  viewId: "",
});
const bit_export_dic = ref({ date: "" });

const import_table_id = ref(""); //导入人员时的表
const export_table_id = ref(""); //导出人员时的表

bitable.base.onSelectionChange((event) => {
  // initBaeData();
  if (event.data.tableId != bit_select_dic.value.tableId) {
    initBaeData();
  }
  bit_select_dic.value = event.data;
});
bitable.base.onTableDelete(async (event) => {
  getAllTable()
  console.log('table deleted')
})

async function initBaeData() {
  bit_loading.value = true;
  bit_table = await bitable.base.getActiveTable();
  bit_select_dic.value.tableId = bit_table.id;
  console.log("dd", bit_table);
  getAllField(true);
}
async function getAllField(loadCache = false) {
  bit_loading.value = true;
  const fieldMetaList = await bit_table.getFieldMetaList();
  console.log("所有的字段", fieldMetaList);
  bit_all_fieldList.value = fieldMetaList;
  bit_loading.value = false;
}
initBaeData();
export { initBaeData, getAllField, import_table_id, export_table_id, bit_export_dic };
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// 新增字段
async function addBitNewField(fileName, fieldType = FieldType.Text) {
  const czItem = bit_all_fieldList.value.find((a) => a["name"] == fileName);
  if (czItem) {
    return "";
  } else {
    const fileId = await bit_table.addField({
      type: fieldType,
      name: fileName,
    });
    await getAllField();
    return fileId;
  }
}
// 新增记录
async function addBitRecord(arr) {
  const res = await bit_table.addRecords(arr);
  //   {
  //     fields: {
  //       [field.id]: 'new text field value1'
  //     }
  //   },
  //   {
  //     fields: {
  //       [field.id]: 'new text field value2'
  //     }
  //   },
}

export { bit_all_fieldList, bit_loading, bit_table, addBitNewField, addBitRecord };

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 获取所有的表格
async function getAllTable(loadCache = false) {
  bit_loading.value = true;

  bit_all_table.value = await bitable.base.getTableMetaList();
  if (export_table_id.value) {
    debugger
    const cz = bit_all_table.value.findIndex((a) => a['id'] == export_table_id.value)
    if (cz < 0) {
      export_table_id.value = ''
      for (let key in bit_export_dic.value) {
        bit_export_dic.value[key] = ''
      }


    }
  }
  bit_loading.value = false;

}
async function addBitNewTable(name) {
  try {
    const { tableId, index } = await bitable.base.addTable({ name: name, fields: [] });
    await getAllTable();
    await bitable.ui.switchToTable(tableId);
  } catch (e) { }
}
async function switchTable(tableId) {
  await bitable.ui.switchToTable(tableId);
  initBaeData();
}
getAllTable();
export { getAllTable, bit_all_table, bit_select_dic, addBitNewTable, switchTable };

// ----------------------------------一键创建配置表

async function oneStepCreateManConfig() {
  const tableName = "排班助手-人员配置表";
  const tableList = await bitable.base.getTableMetaList();
  const isExit = tableList.find((a) => a["name"] == tableName);
  if (isExit) {
    switchTable(isExit.id);
    Message.info('已创建人员配置表')
    return;
  }

  const { tableId, index } = await bitable.base.addTable({ name: tableName, fields: [] });
  const table = await bitable.base.getTableById(tableId);

  let dic = {};
  const name_id = await table.addField({ type: FieldType.Text, name: "姓名", description: { content: "插件[排班助手]与姓名(人员)二选一" } });
  const name_man = await table.addField({ type: FieldType.User, name: "姓名(人员)", description: { content: "插件[排班助手]与姓名二选一" } });
  dic[name_id] = "测试-张三";
  const sex_id = await table.addField({ type: FieldType.SingleSelect, name: "性别", description: { content: "插件[排班助手]不填写默认为男性" } });
  const sex_filed = await table.getField(sex_id);
  await sex_filed.addOptions([{ name: "男" }, { name: "女" }]);
  const sex_optione = await sex_filed.getOptions();
  dic[sex_id] = sex_optione[0];

  const canwork_id = await table.addField({ type: FieldType.SingleSelect, name: "是否参与排班", description: { content: "插件[排班助手]不填写默认为参加" } });
  const canwork_filed = await table.getField(canwork_id);
  await canwork_filed.addOptions([{ name: "是" }, { name: "否" }]);
  const can_optione = await canwork_filed.getOptions();
  dic[canwork_id] = can_optione[0];
  const superwork_id = await table.addField({ type: FieldType.SingleSelect, name: "是否允许加班", description: { content: "插件[排班助手]不填写默认为是 " } });
  const superwork_filed = await table.getField(superwork_id);
  await superwork_filed.addOptions([{ name: "是" }, { name: "否" }]);
  const superwork_optione = await superwork_filed.getOptions();
  dic[superwork_id] = superwork_optione[0];

  const workdate_id = await table.addField({ type: FieldType.Text, name: "预设工作日期", description: { content: "插件[排班助手]多个日期用因为逗号','隔开" } });
  const freedate_id = await table.addField({ type: FieldType.Text, name: "预设休息日期", description: { content: "插件[排班助手]多个日期用因为逗号','隔开" } });
  dic[workdate_id] = "2024-01-01,2024-01-02";
  dic[freedate_id] = "2024-01-03,2024-01-04";
  table.addRecord({ fields: dic });
  switchTable(tableId);
}
// ----------------------------------一键创建导出表

async function oneStepCreateResutTable() {
  const tableName = "排班助手-排班结果";
  const tableList = await bitable.base.getTableMetaList();
  const isExit = tableList.find((a) => a["name"] == tableName);
  let dic = {};

  if (isExit) {
    export_table_id.value = isExit.id
    const result_table = await bitable.base.getTableById(isExit.id);
    const fieldMetaList = await result_table.getFieldMetaList();
    for (let item of classArr.value) {
      const czItem = fieldMetaList.find((a) => a["name"] == item["node"]);
      if (czItem) {
        dic[item["field"]] = czItem.id;
      } else {
        const class_id = await result_table.addField({ type: FieldType.Text, name: item.node, description: { content: item.dateRange.join("~") } });
        dic[item["field"]] = class_id;
      }
    }
    switchTable(isExit.id);
    return dic
  }
  const { tableId, index } = await bitable.base.addTable({ name: tableName, fields: [] });
  export_table_id.value = tableId

  const table = await bitable.base.getTableById(tableId);
  const date_id = await table.addField({ type: FieldType.Text, name: "日期", description: { content: "" } });
  dic["date"] = date_id;
  for (let item of classArr.value) {
    const class_id = await table.addField({ type: FieldType.Text, name: item.node, description: { content: item.dateRange.join("~") } });
    dic[item["field"]] = class_id;
  }
  await switchTable(tableId);
  await getAllTable()
  return dic

}
export { oneStepCreateManConfig, oneStepCreateResutTable };
