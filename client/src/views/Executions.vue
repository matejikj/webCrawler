<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="executions"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Executions</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import ExecutionDataService from '../services/ExecutionDataService'

export default {
  name: 'Query',
  components: {
  },
  sockets: {
  },
  methods: {
    initialize () {
      ExecutionDataService.getAll().then((data) => {
        this.executions = []
        data.data.forEach(x => {
          const label = x.label
          x.executions.forEach(y => {
            y.label = label
            this.executions.push(y)
          })
        })
      })
    }
  },
  created () {
    this.initialize()
  },
  mounted () {
    console.log('AA')
  },
  data: () => ({
    headers: [
      { text: 'label', value: 'label' },
      { text: 'status', value: 'status' },
      { text: 'start', value: 'start' },
      { text: 'end', value: 'end' },
      { text: 'sitesCrawled', value: 'sitesCrawled' }
      // { text: 'Actions', value: 'actions', sortable: false }
    ],
    executions: []
  })
}
</script>

<style>
.mujContainer {
  font-size: 0.8em;
  font-style: normal;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
