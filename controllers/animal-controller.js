var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var Animal = sequelize.import('../models/animal');


router.post('/create', function (req, res) {
    const name = req.body.name;
    const legNumber = req.body.legNumber;
    const predator = req.body.predator;
    Animal.create({
        name: name,
        legNumber: legNumber,
        predator: predator
    })
    .then(function createSuccess(animal) {
        res.status(200).json({
            animal: animal,
            message: "Animal saved to database",   
        });
    })
    .catch((err) => res.status(500).json({error:err}));
    });

    router.get("/", (req, res) => {
        Animal.findAll()
            .then(animals => res.status(200).json(animals))
            .catch(err => res.status(500).json({ error: err }))
    });

    router.delete('/delete/:name', function (req, res) {
        const query = { where: { name: req.params.name } };
    
        Animal.destroy(query)
            .then(() => res.status(200).json({ message: "Animal entry deleted." }))
            .catch((err) => res.status(500).json({ error: err }));
    });

    router.put('/update/:id', function (req, res) {
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