<template>
  <div>
    <v-app-bar
      dense
      height="26px"
    >
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn color="grey accent-4" v-for="item in menu" :key="item.title" :to="item.link">{{
          item.title
        }}</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-menu
        class="hidden-md-and-up"
        left
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
          <v-list>
          <v-list-item
            v-for="n in menu"
            :key="n.title"
            :to="n.link"
          >
            <v-list-item-title>{{ n.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import router from '../router'
import store from '../store'

export default {
  name: 'AppNavBar',
  data: () => ({
    menu: [
      { title: 'Záznamy', link: '/' },
      { title: 'Exekuce', link: '/executions' },
      { title: 'Vizualizace', link: '/visualisation' }
    ]
  }),
  computed: {
  },
  methods: {
    navToAluminium: function () {
      router.push('/hlinik')
    }
  }
}
</script>
