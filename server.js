const express = require ('express'); 
const { fstat } = require('fs');
const path = require ('path');
const { allowedNodeEnvironmentFlags } = require('process');
const db = require('./db/db.json')
var uniqid = require('uniqid');
// const script = require("./public/assets/js/index");
const fs= require("fs");
const { parse } = require('path');
const app = express();
const PORT = process.env.PORT || 3001; 

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(express.static('public'));

app.get('/', (req, res) => 
    res.send(path.join(__dirname,"public/index.html"))
);


app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname,"public/notes.html"))
);

app.use('/api/notes', (req, res) =>{
    res.sendFile(path.join(__dirname,"db/db.json"));
    // res.json(require("./db.json"));
    // res.json(`${req.method} request received to get reviews`);

    // Log our request to the terminal
    console.info(`${req.method} request received to get reviews`);
}
);


app.post('/notes', (req, res)=> {
    const { title, text } = req.body;

    if (title && text){
        const newNote = {
            title,
            text,
            id:  uniqid()
        };
        fs.readFile('./db/db.json', 'utf8', (err, data) => {

            if(err){
                console.error(err);
            } else {
                
                const parsedNotes = JSON.parse(data);
                // parsedNotes.push(newNote);
                console.log(parsedNotes);
                console.log(newNote);
                parsedNotes.push(newNote);
                console.log(parsedNotes)

                
    
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) =>
            err
                ? console.error(err)
                : console.log(
                    'New note has been written'
                )
            )
    
            const response = {
                status: 'success',
                body: parsedNotes,
            };
    
            console.log(response)
            res.status(201).json(response)
            }
        }   );

    }

})


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
