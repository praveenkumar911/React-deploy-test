const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const modulesSchema = new mongoose.Schema(
    {
        projectObjectId: { type: ObjectId, ref: "projects" }, // Assuming "projects" is the new collection name
        projectid: String,
        moduleCreatedBy: String,
        assignedTeam: String,
        moduleDateCreated: Date,
        moduleName: String,
        moduleDescription: String,
        moduleDateStart: Date,
        moduleDateEnd: Date,
        skillsRequired: Array,
        totalDevTimeRequired: Number,
        moduleComplexity: String,
        GitlabID: String,
        GitWebUrl: String,
        Gitmodulename: String,
        numberOfTask: Number,
        modulefield: String,
        assigned: String,
        unassigned: String,
        completed: String,
        taskIds: Array,
        RequirementsDocument:String,
        UIMocks:String,
        APIDocument:String,
        DBDocument:String,
        TeamsAssigned:Array,
        OrgID:String
    },
    {
        collection: "modules", // Change the collection name to "modules"
    }
);

mongoose.model("modules", modulesSchema);

module.exports = modulesSchema;
