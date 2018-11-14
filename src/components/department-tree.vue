<template>
    <div class="department-tree">
        <div class="left department">
            <el-input placeholder="输入部门关键字进行过滤" v-model="filterText">
            </el-input>
            <el-tree class="filter-tree" :data="departmentData" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="departmentTree">
            </el-tree>
        </div>
        <div class="right departmentStaff">

        </div>
    </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      filterText: "",
      departmentData: [
        {
          id: 1,
          name: "一级 1",
          children: [
            {
              id: 4,
              name: "二级 1-1",
              children: [
                {
                  id: 9,
                  name: "三级 1-1-1"
                },
                {
                  id: 10,
                  name: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: "一级 2",
          children: [
            {
              id: 5,
              name: "二级 2-1"
            },
            {
              id: 6,
              name: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          name: "一级 3",
          children: [
            {
              id: 7,
              name: "二级 3-1"
            },
            {
              id: 8,
              name: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: "isLeaf",
        disabled: "disabled"
      }
    };
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.departmentTree.filter(val);
    }
  }
};
</script>
    <style lang="less">
.department-tree {
  padding: 20px;
  display: flex;
  .left {
    width: 300px;
    padding-right: 20px;
    // border: 1px solid #000;
  }
  .right {
    flex: 1;
    border: 1px solid #000;
  }
}
</style>