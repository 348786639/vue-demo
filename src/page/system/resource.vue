<template>
  <div class="system-resource-box">
    <!-- 权限树  开始 -->
    <div class="system-resource-tree">
      <el-tree
        :data="treeData"
        node-key="id"
        default-expand-all
        :props="defaultProps"
        highlight-current
        ref="tree"
        @node-click="changeRoleClick"
        :expand-on-click-node="false"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <img
            class="node-img"
            @click="handleExpand('close',node, data)"
            v-if="node.expanded"
            src="@/assets/image/fold.png"
          />
          <img
            class="node-img"
            @click="handleExpand('open',node, data)"
            v-if="!node.expanded"
            src="@/assets/image/unfold.png"
          />
          <div class="node-label">{{ node.label }}</div>
          <div class="node-label-set">
            <el-button type="text" size="mini" @click.stop="() => append(data)">
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button type="text" size="mini" @click.stop="() => edit(node, data)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button type="text" size="mini" @click.stop="() => remove(node, data)">
              <i class="el-icon-close"></i>
            </el-button>
          </div>
        </div>
      </el-tree>

      <el-dialog :title="title" :visible.sync="editDialogVisible" width="30%" :lock-scroll="true" :close-on-click-modal="false">
        <el-form ref="form" :model="form" label-width="70px">
          <el-form-item label="上级">
            <el-input v-model="form.parentName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="编码">
            <el-input v-model="form.code" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="排序">
            <el-input v-model="form.sort" autocomplete="off" placeholder="数字越小优先级越高"></el-input>
          </el-form-item>

          <el-form-item label="图标">
            <el-input v-model="form.icon" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="链接">
            <el-input v-model="form.url" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="类型">
            <el-select v-model="form.type" placeholder="请选择">
              <el-option key="1" label="菜单项" value="1"></el-option>
              <el-option key="2" label="操作项" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveResource">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 权限树  结束 -->
    <!-- 角色表  开始 -->
    <div class="system-resource-role">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="name" label="角色名称" width="200" align="center"></el-table-column>
        <el-table-column prop="code" label="角色代码" width="200" align="center"></el-table-column>
        <el-table-column prop="description" label="角色描述"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="200">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status=='1'?'success':(scope.row.status=='2'?'danger':'')"
            >{{scope.row.status=='1'?'启用':'禁用'}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
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
    </div>

    <!-- 权限树  结束 -->
  </div>
</template>

<script>
import {
  getResourceTree,
  saveOrUpdateResource,
  initTree
} from "../../api/system/resource";

import { getRoleDataByResourceId } from "../../api/system/role";
let id = 1000;

export default {
  name: "system-resource",
  data() {
    return {
      treeData: [],

      defaultProps: {
        children: "childrens",
        label: "name"
      },
      //权限弹窗
      title: "新增权限",
      editDialogVisible: false,
      form: {
        parentName: "",
        parentId: ""
      },
      //role
      tableData: [],
      total: 0,
      query: {
        pageSize: 15,
        pageNumber: 1,
        resourceId: "" //权限id
      }
    };
  },
  created() {
    getResourceTree().then(res => {
      this.treeData.push(res.data);
    });

    getRoleDataByResourceId(this.query).then(res => {
      this.tableData = res.data.list;
      this.total = res.data.total || 0;
    });
  },
  methods: {
    remove(node, data) {
      console.log(node);
    },
    changeRoleClick(data) {
      //点击权限查询role
      console.log(data);
      this.$set(this.query, "pageNumber", 1);
      this.$set(this.query, "resourceId", data.id);
      getRoleDataByResourceId(this.query).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.total || 0;
      });
    },

    handleExpand(type, node, data) {
      // 展开闭合操作
      console.log(data);
      if (type == "close") {
        if (data.childrens) {
          node.expanded = false;
        }
      } else if (type == "open") {
        node.expanded = true;
      }
    },
    append(data) {
      console.log(data);
      this.form = {};
      this.$set(this.form, "parentName", data.name);
      this.$set(this.form, "parentId", data.id);
      this.editDialogVisible = true;
    },
    edit(node, data) {
      this.form = {};
      this.form = JSON.parse(JSON.stringify(data));
      this.$set(this.form, "type", data.type + "");
      this.$set(this.form, "parentName", node.parent.data.name);
      this.$set(this.form, "parentId", node.parent.data.id);
      this.editDialogVisible = true;
    },
    saveResource() {
      saveOrUpdateResource(this.form).then(res => {
        this.treeData = [];
        this.treeData.push(res.data);
        this.editDialogVisible = false;
        this.$message.success("操作成功");
      });
    },
    handleCurrentChange(val) {
      this.$set(this.query, "pageNumber", val);
      getRoleData(this.query).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.total || 0;
      });
    }
  }
};
</script>
<style scoped>
.system-resource-box {
  height: 100%;
  display: flex;
}

/* 树形  开始*/
.system-resource-tree {
  width: 250px;
  height: 100%;
  overflow-x: scroll;
  overflow: auto;
  margin-right: 10px;
  background: #fff;
  border: 1px solid #e6e6e6;
  padding: 10px 0 0 10px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.node-img {
  width: 15px;
  height: 15px;
  vertical-align: middle;
  margin-right: 3px;
}

.node-label {
  display: inline-block;
  vertical-align: middle;
  font-family: 'Courier New', Courier, monospace
}
.node-label-set {
  display: none;
}

.el-tree-node__content:hover .node-label-set {
  display: inline-block;
}

/** 树形结构 隐藏箭头*/
.el-tree /deep/ .el-tree-node__expand-icon {
  display: none;
}
.el-tree /deep/ .el-tree-node__content {
  height: 30px;
}

/** 树形结构 当前选中的样式*/
.el-tree /deep/ .el-tree-node.is-current > .el-tree-node__content {
  background-color: #ebf3ff;
  border-right: 2px solid #46cdcf;
}
.system-resource-tree /deep/ .el-tree > .el-tree-node {
  min-width: 100%;
  display: inline-block !important;
}

.el-tree
  /deep/
  .el-tree-node.is-current
  > .el-tree-node__content
  .node-label-set {
  display: inline-block;
}

/** 横向滚动条*/
.system-resource-tree /deep/ .el-tree-node > .el-tree-node__children {
  overflow: visible;
}

/* 树形  结束*/
/** 角色表格   开始*/
.system-resource-role {
  flex: 1;
  background: #fff;
}

/** 角色表格   結束*/
</style>