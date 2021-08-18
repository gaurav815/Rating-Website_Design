const express = require('express');
const router = express.Router();
const Bookstore = require('../models/bookstore');
const { bookstoreSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const validateBookstore = (req, res, next) => {
    const { error } = bookstoreSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const bookstores = await Bookstore.find({});
    res.render('bookstores/index', { bookstores })
}));


router.get('/new', (req, res) => {
    res.render('bookstores/new');
})


router.post('/', validateBookstore, catchAsync(async (req, res) => {
    const bookstore = new Bookstore(req.body.bookstore);
    await bookstore.save();
    res.redirect(`/bookstores/${bookstore._id}`)
}));


router.get('/:id', catchAsync(async (req, res,) => {
    const bookstore = await Bookstore.findById(req.params.id).populate('reviews')
    res.render('bookstores/show', { bookstore });
}));


router.get('/:id/edit',  catchAsync(async (req, res) => {
    const bookstore = await Bookstore.findById(req.params.id)
    res.render('bookstores/edit', { bookstore });
}));


router.put('/:id', validateBookstore, catchAsync(async (req, res) => {
    const { id } = req.params;
    const bookstore = await Bookstore.findByIdAndUpdate(id, { ...req.body.bookstore });
    res.redirect(`/bookstores/${bookstore._id}`)
}));


router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Bookstore.findByIdAndDelete(id);
    res.redirect('/bookstores');
}));

module.exports = router;


