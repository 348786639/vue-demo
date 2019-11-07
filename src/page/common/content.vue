<template>
  <div class="content-box" :class="{'content-collapse':collapse}">
    <v-tags></v-tags>
    <div class="content">
      <transition name="fade" mode="out-in">
        <keep-alive :include="tagsList">
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>


<script>
import VTags from "./tags.vue";
import bus from "../../utils/bus";
export default {
  data: function() {
    return {
      collapse: false,
      tagsList: []
    };
  },
  components: {
    VTags
  },
  created() {
    bus.$on("collapse-content", msg => {
      this.collapse = msg;
    });
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  }
};
</script>

<style scoped>
.content-box {
  position: absolute;
  left: 250px;
  right: 0;
  top: 70px;
  bottom: 0;
  padding-bottom: 30px;
  -webkit-transition: left 0.3s ease-in-out;
  transition: left 0.3s ease-in-out;
  background: #f0f0f0;
}

.content {
  width: auto;
  height: 100%;
  padding: 10px;
  overflow-y: scroll;
  box-sizing: border-box;
}
</style>