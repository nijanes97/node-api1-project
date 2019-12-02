// implement your API here
const express = require("express");

const db = require('./data/db.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/api/users', (req, res) => {
    db
        .find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log('error on get user', err)
            res.status(500).json({ error: "The users information could not be retrieved." })
        })
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db
        .findById(id)
        .then(user => {
            if(!user){
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            } else {
                res.status(200).json(user)
            }
        })
        .catch(err => {
            console.log('error on get userByID', err)
            res.status(500).json({ error: "The user information could not be retrieved." })
        })
})

server.post('/api/users', (req, res) => {
    const userData = req.body;
    if(!userData.name || !userData.bio){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
        db
            .insert(userData)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the user to the database" })
            })
    }
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db
        .remove(id)
        .then(removed => {
            if(!removed){
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            } else {
                res.status(200).json({ message: 'user removed succesfully' })
            }
        })
        .catch(err => {
            console.log('error on delete user', err)
            res.status(500).json({ error: "The user could not be removed" })
        })
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const userData = req.body;
    if(!userData.name || !userData.bio){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
        db
            .update(id, userData)
            .then(user => {
                if(!user){
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                } else {
                    res.status(200).json({ message: 'user updated succesfully' })
                }
            })
            .catch(err => {
                console.log('error on put user', err)
                res.status(500).json({ errorMessage: 'error updating user on database' })
            })
    }
})

const port = 4001;
server.listen(port, () => console.log(`\n API running on port ${port} **\n`));