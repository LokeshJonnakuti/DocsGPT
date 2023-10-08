import jsonServer from "json-server";
import routes from "./mocks/routes.json" assert { type: "json" };
import { v4 as uuid } from "uuid";

const server = jsonServer.create();
const router = jsonServer.router("./src/mocks/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
  if (req.method === "POST") {
    if (req.url.includes("/delete_conversation")) {
      req.method = "DELETE";
    } else if (req.url === "/upload") {
      const taskId = uuid();
      localStorage.setItem(taskId, true);
    }
  }
  next();
});

server.use(jsonServer.rewriter(routes));

router.render = (req, res) => {
  if (req.url === "/feedback") {
    res.status(200).jsonp({ status: "ok" });
  } else if (req.url.includes("/task_status")) {
    const taskId = req.query["task_id"];
    const taskIdExists = localStorage.getItem(taskId);
    if (taskIdExists) {
      res.status(200).jsonp({
        result: {
          directory: "temp",
          filename: "install.rst",
          formats: [".rst", ".md", ".pdf"],
          name_job: "somename",
          user: "local",
        },
        status: "SUCCESS",
      });
    } else {
      res.status(404);
    }
  }
};

server.use(router);

server.listen(7091, () => {
  console.log("JSON Server is running");
});
