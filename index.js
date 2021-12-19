const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

// Middlewares
app.use(express.static('build'));
app.use(express.json());
app.use(cors());

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('----');
  next();
};

app.use(requestLogger);

// Get all persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

// Person detail
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Add person
app.post('/api/persons', (req, res, next) => {
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
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson.toJSON());
    })
    .catch((err) => next(err));
});

// Update person
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

// Delete person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

// Get info
app.get('/api/info', (req, res) => {
  Person.find({}).then((persons) => {
    const date = new Date();
    res.send(
      `Phonebook has info for ${persons.length} people. <br> <br> ${date}`
    );
  });
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
