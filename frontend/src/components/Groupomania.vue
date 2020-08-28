<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Ce site est en phase beta et encore en construction !
    </p>
    
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

a {
  color: #42b983;
}
</style>