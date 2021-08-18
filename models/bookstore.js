const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const BookstoreSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

BookstoreSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Bookstore', BookstoreSchema);