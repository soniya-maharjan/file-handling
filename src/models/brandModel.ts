import mongoose, { Schema } from "mongoose";
import { IBrand } from "../interfaces/brand";
import slugify from "slugify";

const brandSchema = new Schema<IBrand>(
    {
        image: { type: String, required: true },
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true},
    },
    { timestamps: true } //generates createdAt and updatedAt
);

brandSchema.pre('validate', function (next) {
    this.slug = slugify(this.name, {lower: true, strict: true});
    next();
});

brandSchema.post('findOneAndUpdate', async (document) => {
    if(document.name){
        document.slug = slugify(document.name, {lower: true, strict: true});
    }
});

//model creation
const Brand = mongoose.model('Brand', brandSchema);

export default Brand;