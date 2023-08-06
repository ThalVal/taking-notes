const router = require('express').Router();
const path = require('path')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid')
const db = require('../db/db.json')

router.get('/notes', (req, res) => {
    res.json(db)
});

router.post('/notes', (req, res) => {
    const newNote = req.body
    newNote.id = uuidv4()
    db.push(newNote)
    console.log(db)
    fs.writeFileSync(
        "./db/db.json", JSON.stringify(db),
        (err) => err && console.error(err));
    res.json(db)
});

router.delete('/notes/:id', (req, res) => {
    for (let i = 0; i < db.length; i++) {
        if (req.params.id === db[i].id) {
            db.splice(i, 1)
            fs.writeFileSync(
                "./db/db.json", JSON.stringify(newNote),
                (err) => err && console.error(err));
            break;
        }
    }
    res.json(true)
})


module.exports = router;

