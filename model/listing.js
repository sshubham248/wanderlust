const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const imageSchema = new Schema({
    filename: {
      type: String,
     
     // required: true
    },
    url: {
      type: String,
      
    }
  });
const listingSchema = new Schema({
    title : {
        type :String,
        required : true
    },
    description :{
        type :  String,
    },
    image : {
        type : imageSchema,
        
    },
    price : {
      type : Number,
      default:1000,
      set : (v) => v ===""?"1000":v,
    },
    location : String,
    country : String,
    geometry : {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    reviews :[
      {
        type : Schema.Types.ObjectId,
        ref : "Review"
      },
    ],
    owner : {
     type: Schema.Types.ObjectId,
     ref : "User"
    }
});

listingSchema.post("findOneAndDelete", async(listing) =>{
  if(listing){
    await Review.deleteMany({reviews :{$in :listing.reviews}});
  }
  
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;