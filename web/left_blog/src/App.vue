<template>
  <div id="app">
    <el-row :gutter="20">
      <el-col :span="6"><div class="grid-content bg-purple">
        <el-input v-model="password" placeholder="password"></el-input>
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">
        <el-input v-model="password" placeholder="password"></el-input>
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">
        <el-button type="primary" plain  @click="login">登录</el-button>
      </div></el-col>
    </el-row>
  </div>

</template>

<script>


export default {
  name: 'App',
  components: {

  },
  data() {
    return {

      username: '',
      password: ''
    }
  },
  methods:{
    login(){
      this.$message({
        message: '登录成功',
        type: 'success'
      });

    }
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
