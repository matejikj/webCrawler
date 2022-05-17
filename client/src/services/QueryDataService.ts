import http from '../http-common'

class NodeDataService {
  getAll () {
    return http.get('/nodes')
  }

  get (id: string) {
    const text = '/nodes/' + id
    return http.get(text)
  }

  create (data: any) {
    return http.post('/nodes', data)
  }

  update (id: any, data: any) {
    const text = '/nodes/' + id
    return http.put(text, data)
  }

  delete (id: any) {
    const text = '/nodes/' + id
    return http.delete(text)
  }

  deleteAll () {
    return http.delete('/nodes')
  }

  findByTitle (title: string) {
    const text = '/nodes?title=' + title
    return http.get(text)
  }
}

export default new NodeDataService()
