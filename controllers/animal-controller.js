var express = require('express');
var router = express.Router();
var sequelize = require('../db');
const validateSession = require('../middleware/validate-session');
var Animal = sequelize.import('../models/animal');


router.post('/create', validateSession, function (req, res) {
    const name = req.body.name;
    const legNumber = req.body.legNumber;
    const predator = req.body.predator;
    const userId = req.body.userId;

    Animal.create({
        name: name,
        legNumber: legNumber,
        predator: predator,
        userID: req.user.id
    })
    .then(function createSuccess(animal) {
        res.status(200).json({
            animal: animal,
            message: "Animal saved to database",   
        });
    })
    .catch((err) => res.status(500).json({error:err}));
    });

    router.get("/", validateSession, function (req, res) {
        Animal.findAll()
            .then(animals => res.status(200).json(animals))
            .catch(err => res.status(500).json({ error: err }))
    });

    router.delete('/delete/:id', validateSession, function (req, res) {
        const query = { where: { id: req.params.id, userID: req.user.id } };

        Animal.destroy(query)
        .then((rowsAffected) => {
            if (rowsAffected >= 1) {
                res.status(200).json({ message: `${rowsAffected} animal entries deleted.` })
            } else {
                res.status(502). json({ message: `Record not found for your UserID.`})
            }
        })
        .catch((err) => res.status(500).json({ message: `Failed to delete animal.`, error: err }));
    });

    // Solution Answer for Challenge
    // router.delete('/:id', validateSession, (req, res) => {
    //     Animal.destroy({
    //         where: {
    //             id: req.params.id,
    //             // * new
    //             userID: req.user.id
    //         }
    //     })
    //         .then(
    //             deleteSuccess = recordsChanged => {
    //                 res.status(200).json({ message: `${recordsChanged} record(s) changes.` });
    //             },
    // ​
    //             deleteFail = err => {
    //                 res.status(500).json({ message: 'Failed to delete', error: err })
    //             }
    //         )
    // })

    // Kelly's Solution
    // router.delete('/delete/:id', validateSession, function (req, res) {
    //     const query = {
    //         where: {
    //             id: req.params.id,
    //             userID: req.user.id,
    //         },
    //     };
    //     Animal.findOne({
    //         where: {
    //             id: req.params.id,
    //             userID: req.user.id,
    //         },
    //     })
    //         .then(function findSuccess(animal) {
    //             if (animal) {
    //                 Animal.destroy(query)
    //                     .then(() => res.status(200).json({ message: 'Entry removed' }))
    //                     .catch((err) => res.status(500).json({ error: err }));
    //             } else {
    //                 //catches null and untrue values, where catch would not work. Returns when user is not in the db.
    //                 res.status(500).json({ error: 'Animal does not exist.' }); //sets status to 500 and sends an error message
    //             }
    //         })
    //         .catch((err) => res.status(500).json({ error: err })); //if promise is not successfully returned, fires a function that sends a JSON-ified error code
    // });

    router.put('/update/:id', validateSession, function (req, res) {
        const updateAnimalEntry = {
            name: req.body.name,
            legNumber: req.body.legNumber,
            predator: req.body.predator,
        };
    
        const query = { where: { id: req.params.id } };
    
        Animal.update(updateAnimalEntry, query)
            .then((animals) => res.status(200).json({"message": `Animal record ${req.params.id} updated.`}))
            .catch(err => res.status(500).json({ error: err }));
    });

    module.exports = router;