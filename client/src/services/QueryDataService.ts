import http from '../http-common'

class QueryDataService {
  getAll () {
    return http.get('/queries')
  }

  get (id: string) {
    const text = '/queries/' + id
    return http.get(text)
  }

  create (data: any) {
    return http.post('/queries', data)
  }

  update (id: any, data: any) {
    const text = '/queries/' + id
    return http.put(text, data)
  }

  delete (id: any) {
    const text = '/queries/' + id
    return http.delete(text)
  }

  deleteAll () {
    return http.delete('/queries')
  }

  findByTitle (title: string) {
    const text = '/queries?title=' + title
    return http.get(text)
  }
}

export default new QueryDataService()
