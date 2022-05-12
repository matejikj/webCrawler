import http from "../http-common";

class TutorialDataService {
  getAll() {
    return http.get("/queries");
  }

  get(id: string) {
    return http.get(`/queries/${id}`);
  }

  create(data: any) {
    return http.post("/queries", data);
  }

  update(id: any, data: any) {
    return http.put(`/queries/${id}`, data);
  }

  delete(id: any) {
    return http.delete(`/queries/${id}`);
  }

  deleteAll() {
    return http.delete(`/queries`);
  }

  findByTitle(title: string) {
    return http.get(`/queries?title=${title}`);
  }
}

export default new TutorialDataService();