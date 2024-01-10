const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const teamsSchema = new mongoose.Schema(
    {
        TeamName: String,
        UserIDs: Array,
        OrgId: String,
        TeamGitID:String,
        AssignedModules:Array,
        TeamSkills:Array, 
        createdDateTime: Date,
        updateDateTime: Date,
        AvailabilityTime:String,
        web_url:String
    },
    {
        collection: "teams",
    }
);

mongoose.model("teams", teamsSchema);

module.exports = teamsSchema;
