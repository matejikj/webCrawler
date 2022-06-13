import http from '../http-common'

class ExecutionDataService {
  getAll () {
    return http.get('/executions')
  }

  create (data: any) {
    console.log(data)
    return http.post('/executions', data)
  }
}

export default new ExecutionDataService()
