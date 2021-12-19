const mongoose = require('mongoose');

const password = process.argv[2];

const url = `mongodb+srv://fullstackopen:${password}@cluster0.hp9mt.mongodb.net/persons?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
  Person.find({}).then((result) => {
    result.forEach((each) => {
      console.log(each);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${person.name} ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
