const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

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

/* escribe en el archivo */
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});


app.get('/canciones', (req, res) => {
    const datafile = readFile();
    res.json(datafile); //Envia la respuesta en formato json del listado de canciones
});

app.post('/canciones', (req, res) => {
    writeFile('post', req.body);
    res.status(201).json({ message: 'Canción agregada correctamente' });
});

app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params; // Destructuring id
    const datafile = readFile(); // Lee el archivo
    const updatedData = datafile.filter((d) => d.id !== Number(id)); // Filtra el id
    writeFile('delete', updatedData); // Escribe los datos actualizados
    res.json({ message: 'Canción eliminada correctamente' });
});

app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const cancion = req.body;
    cancion.id = Number(id); // si no, lo guarda como texto.
    const datafile = readFile(); // Lee el archivo
    const index = datafile.findIndex(p => p.id === Number(id)); // Encuentra el índice de la canción
    if (index !== -1) {
        datafile[index] = cancion; // Actualiza la canción
        console.log(datafile);
        writeFile('put', datafile); // Escribe los datos actualizados
        res.json({ message: 'Canción actualizada correctamente' });
    } else {
        res.status(404).json({ message: 'Canción no encontrada' });
    }
});