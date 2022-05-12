import http from "../http-common";

class TutorialDataService {
  getAll() {
    return http.get("/webpages");
  }

  get(id: string) {
    return http.get(`/webpages/${id}`);
  }

  create(data: any) {
    return http.post("/webpages", data);
  }

  update(id: any, data: any) {
    return http.put(`/webpages/${id}`, data);
  }

  delete(id: any) {
    return http.delete(`/webpages/${id}`);
  }

  deleteAll() {
    return http.delete(`/webpages`);
  }

  findByTitle(title: string) {
    return http.get(`/webpages?title=${title}`);
  }
}

export default new TutorialDataService();