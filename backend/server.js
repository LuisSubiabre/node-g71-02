const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const fileName = 'repertorio.json';

app.use(express.json()); //Middleware para transformar el body en json
app.use(cors()); //Middleware para habilitar CORS

/* comprueba archivo */
const checkFile = () => {
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, '[]');
    }
}

/* escribe en archivo */
const writeFile = (method, data) => {
    checkFile();
    console.log(method, data);
    const datafile = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    if (method === 'post') {
        datafile.push(data);
        fs.writeFileSync(fileName, JSON.stringify(datafile));
    }
    if (method === 'delete') {

        fs.writeFileSync(fileName, JSON.stringify(data));
    }
    if (method === 'put') {
        fs.writeFileSync(fileName, JSON.stringify(data));
    }

};

/* lee archivo */
const readFile = () => {
    checkFile();
    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


/* Logica y rutas */
app.get('/canciones', (req, res) => {
    const datafile = readFile();
    res.json(datafile); //Envia la respuesta en formato json del listado de canciones
});

app.post('/canciones', (req, res) => {
    writeFile('post', req.body);
});

app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params; //destructuring id
    const datafile = readFile(); //lee archivo
    const index = datafile.filter((d) => d.id !== Number(id)); //filtra por id
    writeFile('delete', index);
    res.send('DELETE request to the homepage');

});

app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const cancion = req.body;
    const datafile = readFile(); //lee archivo
    const index = datafile.findIndex(p => p.id == id);
    datafile[index] = cancion;
    writeFile('put', datafile);
    res.send('UPDATE request to the homepage');

});