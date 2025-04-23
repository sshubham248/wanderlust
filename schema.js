const Joi = require("joi");
const review = require("./model/review");


module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        title: Joi.string().allow("",null),
        image: Joi.object({   // ✅ Allow `image.filename`
            filename: Joi.string().allow(""), 
            url: Joi.string().uri().allow("")
        }).optional()
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        comment : Joi.string().required(),
        rating : Joi.number().required().min(0).max(5),
        
    }).required(),
});