<template>
  <div class="home">
    <img alt="Vue logo" class="logo" src="../assets/images/icon-above-font.png">
    <Groupomania msg="Bienvenue sur le site communautaire de la société Groupomania"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Groupomania from '@/components/Groupomania.vue'

export default {
  name: 'Home',
  components: {
    Groupomania
  }
}
</script>

<style lang=scss>
.logo {
  width:30%;
}
</style>