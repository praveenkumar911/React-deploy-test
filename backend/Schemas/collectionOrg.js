const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const organizationSchema = new mongoose.Schema(
    {
        OrgName: String, 
        orgID: String,
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        projects: Array,
        WebsiteUrl:String,
        roleID: String, //this can be captured by NGO yes or NO in checkbox frontend 
        GitlabID:String,
        ImgUrl:String,
        Address1:String,
        Address2:String,
        AreaName:String,
        City:String,
        state:String,
        country:String,
        pincode:String,
        access:String,
        IsNgo:String
    },
    {
        collection: "organizations",
    }
);

module.exports = mongoose.model("organizations", organizationSchema);
