import Video from "../models/Video";
import User from "../models/User";
import Bbs from "../models/Bbs";

export const home = async (req, res) => {
    const videos = await Video.find({})
        .sort({ createdAt: "desc" })
        .populate("owner");
    return res.render("home", {pageTitle : "Home", videos});
}
export const watch = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id).populate("owner");
    //const video = await Video.findById(id);
    //const owner = await User.findById(video.owner);
    //console.log(video);
    if(!video) {
        return res.render("404", {pageTitle: "Video not found"});  
    }
    return res.render("watch", { pageTitle: video.title, video });
}
export const getEdit = async(req, res) => {
    const {id} = req.params;
    const {
        user: { _id },
      } = req.session;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    //console.log(typeof video.owner, typeof _id);
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
      }
    return res.render("edit", {pageTitle: `Edit: ${video.title}`, video});
}

export const postEdit = async(req, res) => {
    const {
        user: { _id },
      } = req.session;
  const {id} = req.params;
  const {title, description, hashtags} = req.body;
  const video = await Video.exists({_id:id});
  if(!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
      title,
      description, 
      hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUpload = async (req, res) => {
    const {
        user: { _id },
      } = req.session;
    console.log(req.file);
    const { path: fileUrl } = req.file;
    const {title, description, hashtags} = req.body;
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl,
            owner: _id, //유저 아이디를 비디오 모델에 저장
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch(error) {
        console.log(error);
        return res.status(400).render("upload", {pageTitle: "Upload Video", errorMessage: error._message});
    }
};

export const deleteVideo = async (req, res) => {
    const {id} = req.params;
    const {
        user: { _id },
      } = req.session;
      const video = await Video.findById(id);
      if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
      }
      if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
      }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}

export const search = async (req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"),
            },
        }).populate("owner");
    }
    return res.render("search", {pageTitle: "Search", videos});
}

export const getBbs = (req, res) => {
    return res.render("getBbs", {pageTitle: "BBS"});
};

export const postBbs = async (req, res) => {
    const {
        user: { _id },
      } = req.session;
    const {title, text} = req.body;
    try {
        const newBbs = await Bbs.create({
            title,
            text,
            owner: _id, //유저 아이디를 비디오 모델에 저장
        });
        const user = await User.findById(_id);
        user.bbses.push(newBbs._id);
        user.save();
        return res.redirect("dashboard", bbses);
    } catch(error) {
        console.log(error);
        return res.status(400).render("getBbs", {pageTitle: "BBS", errorMessage: error._message});
    }
};

export const dashboard = async (req, res) => {
    const {
      session: {
        user: { _id },
      },
    } = req;
    const user = await User.findById(_id).populate({
      path: "videos",
      populate: {
        path: "owner",
        model: "User",
      },
    });
    const bbses = await Bbs.find({})
          .sort({ createdAt: "desc" })
          .populate("owner");
    if (!user) {
      return res.status(404).render("404", { pageTitle: "User not found." });
    }
    return res.render("users/dashboard", {
      pageTitle: "Dashboard", 
      user,
      bbses,
    });
  };

export const watchBbs = async (req,res) => {
    const {
        session: {
          user: { _id },
        },
      } = req;
    const bbs = await Bbs.findById(_id).populate("owner");
    //const video = await Video.findById(id);
    //const owner = await User.findById(video.owner);
    //console.log(video);
    if(!bbs) {
        return res.render("404", {pageTitle: "Text not found"});  
    }
    return res.render("watchBbs", { pageTitle: bbs.title, bbs });
};