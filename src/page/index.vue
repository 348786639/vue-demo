<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <v-content></v-content>
  </div>
</template>


<script>

//组件名大小写  https://cn.vuejs.org/v2/guide/components-registration.html#%E7%BB%84%E4%BB%B6%E5%90%8D%E5%A4%A7%E5%B0%8F%E5%86%99
import VHead from './common/header.vue'
import VSidebar from './common/sidebar.vue'
import VContent from './common/content.vue'
export default {
  data: function(){
    return {

    }
  },
  components:{
    VHead,
    VSidebar,
    VContent

  }
  
}
</script>

<style scoped>




</style>