import http from '../http-common'

class NodeDataService {
  getAll () {
    return http.get('/nodes')
  }
}

export default new NodeDataService()
