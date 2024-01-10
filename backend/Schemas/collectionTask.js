const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const tasksSchema = new mongoose.Schema(
    {
        // moduleObjectId: { type: ObjectId, ref: "modules" }, // Assuming "modules" is the new collection name
        // projectObjectId: { type: ObjectId, ref: "projects" }, // Assuming "projects" is the new collection name
        // taskCreatedBy: { type: ObjectId, ref: "users" }, // Assuming "users" is the new collection name
        moduleid: String,
        projectid: String,
        taskDateCreated: Date,
        taskCreatedBy: String,
        taskName: String,
        taskTime: String,
        assigned: String,
        completed: String,
        unassigned: String,
        taskDescription: String,
        GitlabID: String,
        GitWebUrl: String,
        // assignedUserObjectId: { type: ObjectId, ref: "users" }, // Assuming "users" is the new collection name
    },
    {
        collection: "tasks", // Change the collection name to "tasks"
    }
);

mongoose.model("tasks", tasksSchema);

module.exports = tasksSchema;
