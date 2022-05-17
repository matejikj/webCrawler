import http from '../http-common'

class WebpageDataService {
  getAll () {
    return http.get('/webpages')
  }

  get (id: string) {
    const text = '/webpages/' + id
    return http.get(text)
  }

  create (data: any) {
    console.log(data)
    return http.post('/webpages', data)
  }

  update (id: any, data: any) {
    const text = '/webpages/' + id
    return http.put(text, data)
  }

  delete (id: any) {
    const text = '/webpages/' + id
    return http.delete(text)
  }

  deleteAll () {
    return http.delete('/webpages')
  }

  findByTitle (title: string) {
    const text = '/webpages?title=' + title
    return http.get(text)
  }
}

export default new WebpageDataService()
