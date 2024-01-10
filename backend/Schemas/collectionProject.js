const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const projectsSchema = new mongoose.Schema(
    {
        // projectCreatedBy:{type:ObjectId,ref:"collectionUser"},
        projectCreatedBy: String,
        projectDateCreated: Date,
        projectName: String,
        projectField: String,
        projectDescription: String,
        projectOwner: String,
        projectManager: String,
        projectDateStart: Date,
        projectDateEnd: Date,
        skillsRequired: Array,
        totalDevTimeRequired: Number,
        GitlabID: String,
        GitWebUrl: String,
        Gitprojectname: String,
        ModuleIds: Array,
        GitGroupID: String,
        Assignedto:String,
    },
    {
        collection: "projects", 
    }
);

mongoose.model("projects", projectsSchema);

module.exports = projectsSchema;
