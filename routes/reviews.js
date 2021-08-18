const express = require('express');
const router = express.Router({ mergeParams: true });

const Bookstore = require('../models/bookstore');

const { reviewSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.post('/', validateReview, catchAsync(async(req, res) => {
    const bookstore = await Bookstore.findById(req.params.id);
    const review = new Review(req.body.review);
    bookstore.reviews.push(review);
    await review.save();
    await bookstore.save();
    req.flash('success', 'Created new Review!')
    res.redirect(`/bookstores/${bookstore._id}`);
}))


router.delete('/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Bookstore.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted Review')
    res.redirect(`/bookstores/${id}`)
}));

module.exports  = router;