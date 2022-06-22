import http from '../http-common'

class NodeDataService {
  // getAll (data: any) {
  //   return http.get('/nodes')
  // }
  getAll (data: any) {
    console.log(data)
    return http.post('/nodes', data)
  }
}

export default new NodeDataService()
