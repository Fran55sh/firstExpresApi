const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let authors = [
  {
    id: 1,
    nombre: "Jorge Luis",
    apellido: "Borges",
    fechaDeNacimiento: "24/08/1899",
    libros: [
      {
        id: 1,
        titulo: "Ficciones",
        descripcion: "Se trata de uno de sus mas... ",
        anioPublicacion: 1944,
      },
      {
        id: 2,
        titulo: "El Aleph",
        descripcion: "Otra recopilacion de cuentos...",
        anioPublicacion: 1949,
      },
    ],
  },
];

function userExist(req, res, next) {
  const author = authors.find((element) => element.id == req.params.id);
  if (!author) {
    return res.status(404).json({
      status: 404,
      error: "Author not found",
    });
  }
  req.author = author;
  next();
}

function bookExist(req, res, next){
  const authorIndex = authors.findIndex((element) => element.id === req.author.id);
  const book = authors[authorIndex].libros.find((element) => element.id === Number(req.params.idBook));
  if(!book){
    return res.status(404).json({
      status: 404,
      error: 'Book not found'
    });
  }
  next();
}

app.get("/author", (req, res) => {
  return res.json({
    status: 200,
    data: authors,
  });
});

app.post("/author", (req, res) => {
  const { nombre, apellido, fechaDeNacimiento } = req.body;
  const id = authors[authors.length - 1].id + 1;
  authors.push({ id, nombre, apellido, fechaDeNacimiento, libros: [] });
  return res.status(201).json({
    status: 201,  
    message: "author created",
  });
});

app.get("/author/:id", userExist, (req, res) => {
  return res.json({
    status: 200,
    data: req.author,
  });
});

app.patch("/author/:id", userExist, (req, res) => {
  const { nombre, apellido, fechaDeNacimiento } = req.body;
  const authorIndex = authors.findIndex((element) => element.id === req.author.id);
  authors[authorIndex].nombre = nombre ? nombre : authors[authorIndex].nombre;
  authors[authorIndex].apellido = apellido ? apellido : authors[authorIndex].apellido;
  authors[authorIndex].fechaDeNacimiento = fechaDeNacimiento ? fechaDeNacimiento : authors[authorIndex].fechaDeNacimiento;

  return res.json({
    status: 200,
    message: "author updated",
  });
});

app.delete("/author/:id", userExist, (req, res) => {
  authors = authors.filter((element) => element.id !== req.author.id);
  authors.forEach((element , i) => {
    element.id = (i + 1)
  });

  res.status(200).json({
    status: 200,
    message: `author id ${req.params.id} deleted`,
    data: authors,
  });
});

app.get("/author/:id/books", userExist, (req, res) => {
  const authorIndex = authors.findIndex((element) => element.id === req.author.id);

  return res.json({
    status: 200,
    data: authors[authorIndex].libros,
  });
});


app.post("/author/:id/books", userExist, (req, res) => {
  const authorIndex = authors.findIndex((element) => element.id === req.author.id);
  const {titulo, descripcion, anioPublicacion} = req.body;
  const id = ((authors[authorIndex].libros.length)+1)
  authors[authorIndex].libros.push({id, titulo, descripcion, anioPublicacion})

  return res.status(201).json({
    status: 201,
    message: `book created on author ${(authorIndex + 1)}`
  })
});

app.get('/author/:id/books/:idBook', userExist, bookExist,  (req, res) =>{
  const authorIndex = authors.findIndex((element) => element.id === req.author.id);
  const bookIndex = authors[authorIndex].libros.findIndex((element) => element.id === Number(req.params.idBook));

  return res.status(200).json({
    status: 200,
    data: authors[authorIndex].libros[bookIndex]
  })
});

app.patch('/author/:id/books/:idBook', userExist,bookExist, (req, res) => {
  const {titulo, descripcion, anioPublicacion} = req.body;
  const authorIndex = authors.findIndex((element) => element.id === req.author.id);
  const bookIndex = authors[authorIndex].libros.findIndex((element) => element.id === Number(req.params.idBook));
  authors[authorIndex].libros[bookIndex].titulo = titulo ? titulo : authors[authorIndex].libros[bookIndex].titulo;
  authors[authorIndex].libros[bookIndex].descripcion = descripcion ? descripcion : authors[authorIndex].libros[bookIndex].descripcion;
  authors[authorIndex].libros[bookIndex].anioPublicacion = anioPublicacion ? anioPublicacion : authors[authorIndex].libros[bookIndex].anioPublicacion;

  return res.json({
    status: 200,
    message: "author updated",
    data: authors[authorIndex].libros[bookIndex]
  });
});

app.delete('/author/:id/books/:idBook', userExist, bookExist, (req, res) => {
  const authorIndex = authors.findIndex((element) => element.id === req.author.id);
  authors[authorIndex].libros = (authors[authorIndex].libros).filter((element) => element.id !== Number(req.params.idBook));
  authors[authorIndex].libros.forEach((element , i) => {
    element.id = (i + 1)
  });

  res.status(200).json({
    status: 200,
    message: `book id ${req.params.idBook} deleted from author ${req.params.id}`,
    data: authors,
  });
});


const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
