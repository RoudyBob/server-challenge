let router = require("express").Router(); //here
let User = require("../db").import("../models/user"); //here
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { restart } = require("nodemon");

router.post('/create', function(req, res) {
    User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 13)
    })
    .then(
        function createSuccess(user){
            let token = jwt.sign({id: user.id}, "super_secret", {expiresIn: 60 * 60 * 24});
            res.status(200).json({
                user: user,
                token: token
            })
        }
    ).catch(err => res.status(500).json({error: err}));
})

router.post('/login', function(req, res) {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(
        function loginSuccess(user) {
            if(user) {
                bcrypt.compare(req.body.password,user.password, function (err, matches) {
                    if(matches) {
                        let token = jwt.sign({id: user.id}, "super_secret", {expiresIn: 60 * 60 * 24});
                        res.status(200).json({
                            user: user,
                            token: token
                        })
                    } else {
                        res.status(502).json({error: "Login failed."})
                    }
                });
            } else {
                res.status(500).json({error: "User not found."})
            };
        }
    ).catch(err => res.status(500).json({error: err}));
});

module.exports = router;
