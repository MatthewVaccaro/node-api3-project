const express = require("express");
const db = require("./userDb");
const dbPost = require("../posts/postDb");

const router = express.Router();

router.get("/", (req, res) => {
  return db.get().then(users => {
    res.status(200).json(users);
  });
});

router.post("/", validateUser(), (req, res) => {
  const newUser = req.body;
  return db
    .insert(newUser)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json({ message: "Something went wrong" });
    });
});

router.post("/:id/posts", validateUser(), (req, res) => {
  const newPost = { user_id: parseInt(req.params.id), text: req.body.text };
  console.log(newPost);
  dbPost
    .insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({ message: "Error creating new post", err });
    });
});

router.get("/:id", validateUserId(), (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId(), (req, res) => {
  db.getUserPosts(req.params.id).then(post => {
    return res.status(200).json(post);
  });
});

router.delete("/:id", validateUserId(), (req, res) => {
  db.getById(req.params.id).then(user => {
    const foundUser = user;
    db.remove(req.params.id).then(user => {
      res.status(200).json(foundUser);
    });
  });
});

router.put("/:id", validateUserId(), (req, res) => {
  const userID = req.params.id;
  const changes = req.body;
  db.update(userID, changes)
    .then(newuser => {
      db.getById(userID)
        .then(obj => {
          res.status(200).json(obj);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//custom middleware

function validateUserId() {
  return (req, res, next) => {
    db.getById(req.params.id)
      .then(user => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(404).json({ message: "Shoot, couldn't find that!" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: "Something went very wrong, yikes!" });
      });
  };
}

function validateUser() {
  return (req, res, next) => {
    const info = req.body;
    info ? next() : res.status(400).json({ message: "Missing text on body" });
  };
}

function validatePost() {
  return (req, res, next) => {
    const info = req.body;
    info ? next() : res.status(400).json({ message: "Missing text on body" });
  };
}

module.exports = router;
