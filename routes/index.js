const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../util/fsUtils');
const uuid = require('../util/uuid');

notes.get('/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
  
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

notes.post('/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to submit notes`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid()
      };
  
      readAndAppend(newNote, './db/db.json');
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      res.json(response);
    } else {
      res.json('Error in posting note');
    }
  });
  
  notes.delete('/notes/id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        var result = json.filter(function (note) {
          return note.id !== noteId;
        });
        
        writeToFile('./db/db.json', result);
    
        const response = {
          status: 'success'
        };
    
        res.json(response);
      });
  });


module.exports = notes;