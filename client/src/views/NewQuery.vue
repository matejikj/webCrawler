
<template>
    <v-container>
      <h1>Web crawler</h1>
      <v-row>
        <v-col>
          <v-text-field
            v-model="start"
            label="Start"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="regexp"
            label="RegExp"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-checkbox
            v-model="active"
            label="active?"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="labels"
            label="Labels"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-select
            :items="items"
            label="Periodicity"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="tags"
            label="Tags"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-btn v-on:click="clicked()">
          Odeslat
        </v-btn>
      </v-row>
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
    start: '',
    labels: '',
    regexp: '',
    tags: '',
    active: false,
    items: ['second', 'minute', 'hour', 'day']

  }),
  methods: {
    clicked: function () {
      // router.push('/')
      console.log('fdas')
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
