<template>
    <b-container>
      <p>historz</p>
    </b-container>
</template>

<script>
import router from '../router'
export default {
  name: 'Query',
  components: {
  },
  sockets: {
  },
  computed: {
  },
  mounted () {
    console.log('AA')
  },
  data: () => ({
  }),
  methods: {
    click: function () {
      router.push('/')
    }
  }
}
</script>

<style>
.mujContainer {
  font-size: 0.8em;
  font-style: normal;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
