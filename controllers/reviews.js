const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let {id, reviewsId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewsId}});   //pull used to remove element from array
    await Review.findByIdAndDelete(reviewsId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/${id}`);
};