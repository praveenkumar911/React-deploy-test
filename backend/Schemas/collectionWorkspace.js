const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const workspaceSchema = new mongoose.Schema(
    {
        projectObjectId: { type: ObjectId, ref: "projects" },
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
        forkedGitlabID: String, // Updated field name
        forkedGitlabUrl: String, // Updated field name
        Gitmodulename: String,
        numberOfTask: Number,
        modulefield: String,
        assigned: String,
        unassigned: String,
        completed: String,
        taskIds: Array,
    },
    {
        collection: "workspaces", // Updated collection name to "workspaces"
    }
);

module.exports = mongoose.model("workspaces", workspaceSchema);

