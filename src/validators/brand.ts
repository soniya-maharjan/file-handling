import Joi from "joi";

export const brandSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    "any.required": `"" must ba a string`,
    "string.min": `"" must be at least 2 characters long`,
    "String.max": `"" must be at most 255 characters`,
  }),
  type: Joi.string().optional(),
  resize: Joi.boolean().optional(),
});

export const brandUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(255).optional().messages({
        "any.required": `"" must ba a string`,
        "string.min": `"" must be at least 2 characters long`,
        "String.max": `"" must be at most 255 characters`,
      }),
      type: Joi.string().optional(),
      resize: Joi.boolean().optional(),
})