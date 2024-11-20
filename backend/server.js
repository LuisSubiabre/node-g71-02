const express = require('express');
const fs = require('fs');

const app = express();
const fileName = 'repertorio.json';

app.use(express.json()); //Middleware para transformar el body en json


/* comprueba archivo */
const checkFile = () => {
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, '[]');
    }
}

/* escribe en archivo */
const writeFile = (data) => {
    const datafile = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    datafile.push(data);

    fs.writeFileSync(fileName, JSON.stringify(datafile));
};

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/canciones', (req, res) => {
    res.send('hello word');
    checkFile();
});

app.post('/canciones', (req, res) => {
    checkFile();
    //res.json(req.body);
    writeFile(req.body);

});