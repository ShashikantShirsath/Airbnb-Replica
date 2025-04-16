const Listing = require("../models/listing");
const NodeGeocoder = require("node-geocoder");

const options = {
    provider: 'opencage',
    apiKey: process.env.OPENCAGE_API_KEY, // Replace with your actual OpenCage API key
    formatter: null, // Default
};

const geocoder = NodeGeocoder(options);


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: "author" }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    const result = await geocoder.geocode({
        address: req.body.listing.location,
        limit: 1
      });
    let latitude = result[0].latitude;
    let longitude = result[0].longitude;
    
    let url = req.file.path;
    let filename = req.file.filename;  
    const newListing =  new Listing (req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = {type : "Point", coordinates : [longitude, latitude]};

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace(("/upload", "/upload/h_300,w_250"));
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/");
};