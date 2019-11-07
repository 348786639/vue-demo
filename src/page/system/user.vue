<template>
  <div>
    <div class="container">
      <div class="search-box">
        <el-input
          v-model="query.nickName"
          placeholder="请输入昵称"
          size="medium"
          class="search-input mr10"
        ></el-input>
        <el-button type="success" size="medium" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
      <div class="table-box">
        <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="jobNumber" label="工号" width="100" align="center"></el-table-column>
          <el-table-column prop="nickName" label="昵称" width="100" align="center"></el-table-column>
          <el-table-column prop="nickName" label="汇报人" width="100" align="center"></el-table-column>
          <!-- <el-table-column prop="dept" label="部门" width="180" align="center"></el-table-column> -->
          <el-table-column prop="phone" label="手机" width="200" align="center"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="200" align="center"></el-table-column>
          <el-table-column prop="createTime" label="入职日期" width="200" align="center"></el-table-column>
          <el-table-column prop="workPlace" label="工作地址" align="center" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status=='1'?'success':(scope.row.status=='2'?'danger':'')"
              >{{scope.row.status=='1'?'启用':'禁用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <!-- <el-button
                type="text"
                icon="el-icon-delete"
                class="red"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button> -->
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
        :title="title"
        :visible.sync="editDialogVisible"
        width="30%"
        :lock-scroll="true"
        :close-on-click-modal="false"
        :destroy-on-close="true"
      >
        <div class="dialog-body">
          <el-form ref="form" :model="form" label-width="70px" class="dialog-form">
            <el-form-item label="工号">
              <el-input
                v-model="form.jobNumber"
                autocomplete="off"
                :disabled="title=='新增'?false:true"
              ></el-input>
            </el-form-item>

            <el-form-item label="登陆名">
              <el-input v-model="form.userName" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="密码">
              <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="昵称">
              <el-input v-model="form.nickName" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="汇报人">
              <el-input v-model="form.nickName" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="手机号">
              <el-input v-model="form.phone" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="入职日期">
              <el-input
                v-model="form.createTime"
                autocomplete="off"
                :disabled="title=='新增'?false:true"
              ></el-input>
            </el-form-item>

            <el-form-item label="工作地址">
              <el-select v-model="form.workPlace" placeholder="请选择工作地址">
                <el-option
                  v-for="item in workPlaceList"
                  :key="item.val"
                  :label="item.keyName"
                  :value="item.val"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option key="1" label="启用" value="1"></el-option>
                <el-option key="0" label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveUser">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getUserData,
  getWorkPlace,
  saveOrUpdateUser
} from "../../api/system/user";

export default {
  name: "system-user",
  data: function() {
    return {
      query: {
        nickName: "",
        pageSize: 15,
        pageNumber: 1
      },
      total: 100,
      multipleSelection: [],
      editDialogVisible: false,
      form: {},
      tableData: [],
      title: "新增",
      workPlaceList: []
    };
  },
  created() {
    //第一次获取表格数据
    this.getData();
    getWorkPlace().then(res => {
      this.workPlaceList = res.data;
    });
  },
  methods: {
    getData() {
      console.log(this.query);
      getUserData(this.query).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.total || 0;
      });
    },

    handleSearch() {
      this.$set(this.query, "pageNumber", 1);
      this.getData();
    },
    handleSelectionChange(val) {
      console.log(val);
    },
    handleCurrentChange(val) {
      this.$set(this.query, "pageNumber", val);
      this.getData();
    },
    handleAdd() {
      this.title = "新增";
      this.form = {};
      this.editDialogVisible = true;
    },
    handleEdit(index, row) {
      this.title = "编辑";
      //this.form = row;  对象不要直接赋值（只是赋值地址）  vue双向绑定会跟着变化
      this.form = JSON.parse(JSON.stringify(row));
      //貌似要转成字符串才能选中
      this.$set(this.form, "status", this.form.status + "");
      this.editDialogVisible = true;
    },
    handleDelete(index, row) {
      this.$message.success("删除功能没做");
    },
    saveUser() {
      saveOrUpdateUser(this.form).then(res => {
        this.$message.success(this.form.id ? "编辑成功" : "新增成功");
        this.editDialogVisible = false;
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
  height: 500px;
  overflow: auto;
}
.dialog-form{
  margin-right: 5px;
}
</style>