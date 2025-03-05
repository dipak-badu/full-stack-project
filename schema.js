const Joi = require('joi');

module.exports.listingSchema = Joi.object({
   
        title:Joi.string().min(3).max(200).required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image: Joi.string().allow("" , null)
    
  })

  module.exports.reviewSchema =  Joi.object({
    review:Joi.object({
      rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
  })