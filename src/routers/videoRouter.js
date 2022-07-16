import express from "express";
import { watch, getEdit, postEdit, getUpload, postUpload, deleteVideo, getBbs, postBbs,dashboard,watchBbs } from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.get("/dashboard", dashboard);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);
videoRouter
  .route("/bbs-upload")
  .all(protectorMiddleware)
  .get(getBbs)
  .post(postBbs);
videoRouter.get("/bbs/:id([0-9a-f]{24})", watchBbs);
export default videoRouter;