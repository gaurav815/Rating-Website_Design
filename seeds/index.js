const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Bookstore = require('../models/bookstore');


mongoose.connect('mongodb://localhost:27017/novel-Tea', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Bookstore.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const store = new Bookstore({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://images.unsplash.com/photo-1551040921-22a8552acb0d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80',
            // image: 'https://images.unsplash.com/photo-1601583732131-273f7867aa2e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=376&q=80',
            description: 'In faucibus turpis ac arcu interdum, ut lacinia ligula varius. Maecenas in bibendum enim, a auctor nibh. Aliquam tempor id nunc vitae laoreet. Nunc egestas nibh nisl, in vulputate lorem venenatis in. Curabitur porta velit eu leo maximus, eget tempor velit malesuada. Maecenas ut venenatis diam, in scelerisque tellus. Nullam iaculis commodo nulla in auctor. Praesent accumsan cursus risus. Nunc quis lacus urna.'
        })
        await store.save();
    }
    console.log("This Ran Fine");
}

seedDB().then(() => {
    mongoose.connection.close();
})


