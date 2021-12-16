const express = require('express');
const { use } = require('express/lib/application');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

// Middlewares
app.use(express.json());
app.use(cors());
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(req.body),
    ].join(' ');
  })
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
];

// Get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// Person detail
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((each) => each.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// Add person
const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  return maxId + 1;
};
app.post('/api/persons', (req, res) => {
  const body = req.body;

  // Handling errors
  if (!body.name) {
    return res.status(400).json({
      error: 'name is required',
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: 'number is required',
    });
  } else if (persons.find((e) => e.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(persons);
});

// Delete person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((each) => each.id !== id);

  res.status(204).end();
});

// Get info
app.get('/api/info', (req, res) => {
  const countPersons = persons.length;
  const hour = new Date();

  const message = `Phonebook has info for ${countPersons} people.`;

  res.send(message + '<br>' + '<br>' + hour);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
