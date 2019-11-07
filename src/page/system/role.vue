<template>
  <div>
    <div class="container">
      <div class="search-box">
        <el-input
          v-model="query.name"
          placeholder="请输入权限名称"
          size="medium"
          class="search-input mr10"
        ></el-input>
        <el-button type="primary" size="medium" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column prop="name" label="角色名称" width="200" align="center"></el-table-column>
          <el-table-column prop="code" label="角色代码" width="200" align="center"></el-table-column>
          <el-table-column prop="description" label="角色描述"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status=='1'?'success':(scope.row.status=='2'?'danger':'')"
              >{{scope.row.status=='1'?'启用':'禁用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <!-- <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit-outline"
                @click="handleRoleResource(scope.$index, scope.row)"
              >权限配置</el-button>
              <el-button
                type="text"
                icon="el-icon-edit-outline"
                @click="handleRoleResource(scope.$index, scope.row)"
              >关联员工</el-button>
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
            </template>-->
            <template slot-scope="scope">
              <el-dropdown
                size="mini"
                trigger="click"
                split-button
                type="primary"
                @click="handleRelationEmployee(scope.$index, scope.row)"
              >
                关联员工
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleRoleResource(scope.$index, scope.row)">权限配置</el-dropdown-item>
                  <el-dropdown-item @click.native="handleEdit(scope.$index, scope.row)">编辑</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next"
          :page-size="query.pageSize"
          :current-page="query.pageNumber"
          :total="total"
        ></el-pagination>
      </div>

      <el-dialog
        title="权限配置"
        :visible.sync="roleDialogVisible"
        width="30%"
        :lock-scroll="true"
        :close-on-click-modal="false"
      >
        <div class="dialog-body">
          <el-form ref="form" :model="form" label-width="70px" class="dialog-form">
            <el-tree
              ref="resourceTree"
              :data="treeData"
              show-checkbox
              node-key="id"
              default-expand-all
              :default-checked-keys="checkIds"
              :props="defaultProps"
            ></el-tree>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveResourceRole">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="关联员工"
        :visible.sync="relationEmployeeDialogVisible"
        width="30%"
        :lock-scroll="true"
        :close-on-click-modal="false"
      >
        <div class="dialog-body-user">
          <el-form ref="employeeForm" :model="form" label-width="70px" class="dialog-form">
            <el-select
              v-model="userIds"
              placeholder="请选择"
              filterable
              multiple
              class="employee-select"
            >
              <el-option-group v-for="group in employeeData" :key="group.id" :label="group.name">
                <el-option
                  v-for="item in group.users"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="relationEmployeeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="relationEmployee">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getRoleData,
  saveOrUpdateRole,
  configResourceRole,
  initEmployee,
  saveRoleUser
} from "../../api/system/role";
import { initTree } from "../../api/system/resource";
export default {
  name: "system-role",
  data: function() {
    return {
      query: {
        name: "",
        pageSize: 15,
        pageNumber: 1
      },
      total: 0,
      form: {},
      tableData: [],
      roleDialogVisible: false, //权限配置dialog
      treeData: [], //权限树 数据
      checkIds: [], //权限树选中id
      defaultProps: {
        //权限树
        children: "childrens",
        label: "name"
      },
      roleId: "", //配置权限的时候传入dialog
      relationEmployeeDialogVisible: false, //关联员工
      employeeData: [], //关联员工  部门员工数据
      userIds: []
    };
  },
  created() {
    //第一次获取表格数据
    this.getData();
  },
  methods: {
    getData() {
      console.log(this.query);
      getRoleData(this.query).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.total || 0;
      });
    },

    handleSearch() {
      this.$set(this.query, "pageNumber", 1);
      this.getData();
    },

    handleCurrentChange(val) {
      this.$set(this.query, "pageNumber", val);
      this.getData();
    },
    handleAdd() {},
    handleEdit(index, row) {},
    handleRoleResource(index, row) {
      let params = { roleId: row.id };
      this.roleId = row.id;
      initTree(params).then(res => {
        this.treeData = [];
        this.checkIds = [];
        this.checkIds = res.data.checkIds;
        this.treeData.push(res.data.tree);
        this.roleDialogVisible = true;
      });
    },
    saveResourceRole() {
      //只是返回选中的叶子节点  数组
      console.log(this.$refs.resourceTree.getCheckedNodes(true));
      //将叶子节点的id拼接成字符串逗号隔开传到后台处理
      let checkNodes = this.$refs.resourceTree.getCheckedNodes(true);
      let checkIds = "";
      checkNodes.forEach(function(val, index, arr) {
        checkIds = checkIds + val.id + ",";
      });

      let params = { checkIds: checkIds, roleId: this.roleId };
      configResourceRole(params).then(res => {
        this.$message.success("操作成功");
        this.roleDialogVisible = false;
      });
    },
    handleRelationEmployee(index, row) {
      //关联员工
      let params = { roleId: row.id };
      this.roleId = row.id;
      initEmployee(params).then(res => {
        this.employeeData = [];
        this.employeeData = res.data.sysDeptVOList;
        this.userIds = res.data.checkUser;
        
        this.relationEmployeeDialogVisible = true;
      });
    },
    relationEmployee() {
      //关联员工--确定
      let params = { roleId: this.roleId, userIds: this.userIds.join(',') };
      console.log(params)
      saveRoleUser(params).then(res => {
        this.$message.success("操作成功");
        this.relationEmployeeDialogVisible = false;
      });
    }
  }
};
</script>

<style scoped>
.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
  display: inline-block;
}
.mr10 {
  margin-right: 10px;
}
.dialog-body {
  max-height: 500px;
  overflow: auto;
}
.dialog-form {
  margin-right: 5px;
}

.employee-select {
  width: 100%;
}
</style>