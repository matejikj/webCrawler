
<template>
    <v-container>

    </v-container>
</template>

<script>
import router from '../router'
export default {
  name: 'Home',
  components: {
  },
  sockets: {
  },
  computed: {
  },
  created () {
  },
  mounted () {
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
