const express = require('express');
const path = require('path');
const fs = require("fs");
const { off } = require('process');
// const { clog } = require('./middleware/clog');


const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
// app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);

app.use(express.static('public'));

// GET Route for notes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './db/db.json'))
);

app.get('/api/notes/:id', (req, res) => {
    let dbnotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    res.json(dbnotes[Number(req.params.id)]);
}

);

// GET Route for all other routes sending index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// route for /api/notes, tbd
app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))
);
// post Route for /notes 
app.post('/api/notes', (req, res) => {
    let dbnotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    let incomingNote = req.body;
    let newId = dbnotes.length.toString();
    incomingNote.id = newId;
    dbnotes.push(incomingNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(dbnotes));
    res.json(dbnotes);
}
);


// delete Route for /notes/:id
app.delete('/api/notes/:id', (req, res) => {
    let dbnotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    let incomingId = req.params.id;
    let newId = 0;
    dbnotes = dbnotes.filter((thisNote) => {
        return thisNote.id !=incomingId;
    });

    for (thisNote of dbnotes){
        thisNote.id = newId.toString();
        newId ++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(dbnotes));
    res.json(dbnotes);
}
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);