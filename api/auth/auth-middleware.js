/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted() {
  const authError = {
    message: "You shall not pass!",
  };
  return async (req, res, next) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json(authError);
      }
    } catch (err) {
      next(err);
    }
  };
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
function checkUsernameFree() {
  const authError = {
    message: "Username taken",
  };
  return async (req, res, next) => {
    try {
      const { username } = req.body;
      const user = await module.findBy({ username });
      if (user.length > 0) {
        return res.status(422).json(authError);
      }
    } catch (err) {
      next(err);
    }
  };
}
/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists() {
  const authError = {
    message: "Invalid credentials",
  };
  return async (req, res, next) => {
    try {
      const { username } = req.body;
      const user = await module.findBy({ username });
      if (user.length < 1) {
        return res.status(401).json(authError);
      }
    } catch (err) {
      next(err);
    }
  };
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {
  const authError = {
    message: "Password must be longer than 3 chars",
  };
  return async (req, res, next) => {
    const password = req.body.password;
    try {
      if (!password || password <= 3) {
        return res.status(422).json(authError);
      }
    } catch (err) {
      next(err);
    }
  };
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
  restricted,
};
