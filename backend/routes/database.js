const { json } = require('express');
const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const csv = require('csv-parser');
const fs = require('fs');
const modules = mongoose.model('modules') 
const projects = mongoose.model("projects") 
const tasks = mongoose.model('tasks')
const Skill = mongoose.model('Skill', { name: String });
const Organization =require('../Schemas/collectionOrg');
const collectionWorkspace = require('../Schemas/collectionWorkspace');

const Team = mongoose.model('teams');
const User=mongoose.model('User')

// PROJECT ROUTES

// Route to create a new project in MongoD
router.post('/create-project-DB', (req, res) => {
    // Create a new instance of the projects model
    const newProject = new projects({
      projectCreatedBy: req.body.projectCreatedBy,
      projectDateCreated: new Date(),
      projectName: req.body.projectName,
      projectField: req.body.projectField,
      projectDescription: req.body.projectDescription,
      projectOwner: req.body.projectOwner,
      projectManager: req.body.projectManager,
      projectDateStart: req.body.projectDateStart,
      projectDateEnd: req.body.projectDateEnd,
      skillsRequired: req.body.skillsRequired,
      totalDevTimeRequired: req.body.totalDevTimeRequired,
      GitlabID:req.body.GitlabID,
      GitWebUrl:req.body.GitWebUrl,
      Gitprojectname:req.body.Gitprojectname,
      GitGroupID:req.body.GitGroupID
    });
  
    // Save the new project to the projects collection
    newProject.save((err,project) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while saving the project to the database.');
      } else {
        console.log("New project added to projects collection!");
        res.status(200).send(project);
      }
    });
  });
  
  // Route to edit an existing project in MongoDB
  router.put('/edit-project-DB/:projectId', (req, res) => {
    const { projectId } = req.params;
    const projectData = req.body;
    console.log(projectId, projectData);
    projects.findOneAndUpdate({ _id: projectId }, projectData, (err, project) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while updating the project.');
      } else if (!project) {
        res.status(404).send('Project not found.');
      } else {
        console.log("Project updated!");
        res.status(200).send('Project updated!');
      }
    });
  });
  
  // Route to delete a project from MongoDB
  router.delete('/delete-project/:projectId', (req, res) => {
    const projectId = req.params.projectId;
  
    projects.findOneAndDelete({ _id: projectId }, (err, project) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while deleting the project.');
      } else if (!project) {
        res.status(404).send('Project not found.');
      } else {
        console.log("Project deleted!");
        res.status(200).send('Project deleted!');
      }
    });
  });
  
  // Route to get all projects from MongoDB
  router.get("/get-project-DB", async (req, res) => {
    try {
      const project = await projects.find().sort({ projectDateCreated: -1 });
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  // Route to get a project by ID from MongoDB
  router.post("/get-projectdata", async (req, res) => {
    try {
      const id = await req.body.id;  // Get the ID from the request body
      projects.findOne({ _id: id }, (err, us) => {  // Modify the query to use _id
        if (err) {
          console.log(err);
        } else if (us) {
          const myarr = [];
          myarr.push(us);
          res.send(myarr);
        } else {
          res.send("Not Found");
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
  router.get('/get-project/:id', async (req, res) => {
    try {
      const projectId = req.params.id;
      const project = await projects.findOne({ _id: projectId });
      if (project) {
        res.send(project);
      } else {
        res.status(404).send('Project not found');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  });
router.get('/get-projects-by-org/:projectOwner', async (req, res) => {
    try {
        const projectOwner = req.params.projectOwner        ;
  
        // Find the organization by OrgName
        const project = await projects.findOne({ projectOwner });
  
        // Check if the organization exists
        if (!project) {
            return res.status(404).json({ message: 'projects not found.' });
        }
  
        // Return the organization data in the response
        res.json(project);
    } catch (error) {
        console.error('Error retrieving organization data by OrgName:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
  });
  router.get('/get-projects-by-assignee/:assignedToId', async (req, res) => {
    try {
        const assignedToId = req.params.assignedToId;
  
        // Find projects where Assignedto field matches the given ID
        const projectsList = await projects.find({ Assignedto: assignedToId });
  
        // Check if any projects are found
        if (projectsList.length === 0) {
            return res.status(404).json({ message: 'No projects found for the given assignedToId.' });
        }
  
        // Return the list of projects in the response
        res.json(projectsList);
    } catch (error) {
        console.error('Error retrieving projects data by assignedToId:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

  // MODULE ROUTES
  
  // Route to create a new module in MongoDB
  router.post('/create-module-DB', (req, res) => {
    // Create a new instance of the modules model
    const newModule = new modules({
      // projectObjectId: req.body.projectObjectId ? ObjectId(req.body.projectObjectId) : null,
      projectid : req.body.projectid,
      moduleCreatedBy: req.body.moduleCreatedBy,
      assignedTeam: req.body.assignedTeam,
      moduleDateCreated: new Date(req.body.moduleDateCreated),
      moduleName: req.body.moduleName,
      moduleDescription: req.body.moduleDescription,
      moduleDateStart: new Date(req.body.moduleDateStart),
      moduleDateEnd: new Date(req.body.moduleDateEnd),
      skillsRequired: req.body.skillsRequired,
      totalDevTimeRequired: req.body.totalDevTimeRequired,
      moduleComplexity: req.body.moduleComplexity,
      modulefield:req.body.modulefield,
      assigned:req.body.assigned,
      unassigned:req.body.unassigned,
      completed:req.body.completed,
      GitlabID:req.body.GitlabID, 
      GitWebUrl:req.body.GitWebUrl,
      Gitmodulename:req.body.Gitprojectname,
      RequirementsDocument:req.body.requirementsDocument,
      UIMocks:req.body.uiMocks, 
      APIDocument:req.body.apiDocument,
      DBDocument:req.body.dbDocument,
      TeamsAssigned:req.body.TeamsAssigned,
      OrgID:req.body.OrgID
    });
  
    // Save the new module to the modules collection
    newModule.save((err,Module) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while saving the module to the database.');
      } else {
        console.log("New module added to modules collection!");
        res.status(200).send(Module);
      }
    });
  });
  
  // Route to edit an existing module in MongoDB
  router.put('/edit-moduleDB/:moduleID', async (req, res) => {
    try {
      const moduleID = req.params.moduleID;
      const data = req.body;
  
      // Attempt to update module data
      const module = await modules.findByIdAndUpdate(moduleID, data, { new: true });
  
      // If module is not found, attempt to update data in workspace
      if (!module) {
        const workspaceModule = await collectionWorkspace.findByIdAndUpdate(moduleID, data, { new: true });
        if (!workspaceModule) {
          return res.status(404).send('Module not found in both modules and workspaceModules.');
        }
        res.send(workspaceModule);
      } else {
        res.send(module);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('An error occurred while updating the module data.');
    }
  });
  
  
  // Route to delete a module from MongoDB
router.delete('/delete-module/:moduleId', (req, res) => {
    const moduleId = req.params.moduleId;
  
    modules.findOneAndDelete({ _id: moduleId }, (err,module) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while deleting the module.');
      } else if (!module) {
        res.status(404).send('Module not found.');
      } else {
        console.log("Module deleted!");
        res.status(200).send('Module deleted!');
      }
    });
  });
// PUT API to append team IDs into TeamsAssigned
router.put("/append-teams/:moduleId", async (req, res) => {
  const moduleId = req.params.moduleId;
  const teamIds = req.body.teamIds; // An array of team IDs to append

  try {
    // Find the module by ID
    const module = await modules.findById(moduleId); // Assuming your model is named 'modules'

    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Append team IDs to TeamsAssigned
    module.TeamsAssigned = module.TeamsAssigned.concat(teamIds);

    // Save the updated module
    const updatedModule = await module.save(); // Fix: Change 'modules' to 'module'

    res.json(updatedModule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  // Route to get all modules for a project from MongoDB
  router.post("/get-module-DB", async (req,res) => {
    const projectid = await req.body.projid; 
    // console.log(name)
    modules.find({projectid:projectid},(err,us) => {
      if (err) {
        console.log(err);
      }
      if (us) {
        res.send(us);
      } else {
        console.log("not found");
      }
    });
  });
  
  // Route to get module data by ID from MongoDB
  router.post("/get-moduleData",async(req,res) => {
    try{
      const name = await req.body.moduleid;
      //const projname = await req.body.projname;
      // console.log(projname,name)
      modules.findOne({ _id : name},async(err,us) => {
        if (err) {
          console.log(err);
        } else if (await us) {
          const myarr = [];
          myarr.push(await us);
          // console.log(myarr)
          res.send(myarr);
        } else {
          console.log("not found");
        }
      });
    }
    catch(err){
      console.log(err);
    }
  });
  router.get("/modules/:moduleID", async (req, res) => {
    try {
      // Try to find the module in the modules collection
      let module = await modules.findById(req.params.moduleID);
  
      // If the module is not found in modules, try to find it in workspaces
      if (!module) {
        module = await collectionWorkspace.findById(req.params.moduleID);
      }
  
      if (!module) {
        // If the module is still not found, return a 404 response
        return res.status(404).send('Module not found.');
      }
  
      res.send(module);
    } catch (error) {
      console.log(error);
      res.status(500).send('An error occurred while fetching the module data.');
    }
  });
  
  // Route to get all modules from MongoDB
  router.get('/get-allmodules', async (req,res) => {
    const data = await modules.find({})
    try{
      res.status(200).json({
        data
      })
    } catch(err){
      res.status(500).json({
        status: 'Failed',
        message: err
      })
    }
  });
  router.post('/add-module-ids/:projectId', (req, res) => {
    const { projectId } = req.params;
    const { moduleIds } = req.body;

    projects.findByIdAndUpdate(projectId, { $push: { ModuleIds: moduleIds } }, (err, updatedProject) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while adding module ids to the project.');
        } else {
            console.log("Module ids added to the project!");
            res.status(200).send(updatedProject);
        }
    });
});


router.put('/delete-module-ids/:projectId', (req, res) => {
  const { projectId } = req.params;
  const { moduleIds } = req.body;

  projects.findByIdAndUpdate(projectId, { $pull: { ModuleIds: moduleIds } }, (err, updatedProject) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred while deleting module ids from the project.');
      } else {
          console.log("Module ids deleted from the project!");
          res.status(200).send(updatedProject);
      }
  });
});
  // TASK ROUTES
  
  // Route to create a new task in MongoDB
  router.post('/create-task-DB', (req, res) => {
    // Create a new instance of the tasks model
    const newTask = new tasks({
      // moduleObjectId: req.body.moduleObjectId ? ObjectId(req.body.moduleObjectId) : null,
      // projectObjectId: req.body.projectObjectId ? ObjectId(req.body.projectObjectId) : null,
      projectid : req.body.projectid,
      moduleid : req.body.moduleid,
      taskCreatedBy: req.body.taskCreatedBy,
      taskDateCreated: new Date(),
      taskName: req.body.taskName, 
      taskTime:req.body.taskTime,
      // taskAssigned: req.body.taskAssigned,
      // taskCompleted: req.body.taskCompleted,
      taskDescription: req.body.taskDescription,
      GitlabID:req.body.gitlabIssueId,
      GitWebUrl:req.body.gitlabIssueUrl,
      completed:req.body.completed,
      assigned:req.body.assigned,
      unassigned:req.body.unassigned
      // assignedUserObjectId: req.body.assignedUserObjectId ? ObjectId(req.body.assignedUserObjectId) : null
    });
  
    // Save the new task to the tasks collection
    newTask.save((err,Task) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while saving the task to the database.');
      } else {
        console.log("New task added to tasks collection!");
        res.status(200).send(Task);
      }
    });
  });
  router.post("/get-Taskby-id",async(req,res) => {
    try{
      const name = await req.body.taskId;
      //const projname = await req.body.projname;
      // console.log(projname,name)
      tasks.findOne({ _id : name},async(err,us) => {
        if (err) {
          console.log(err);
        } else if (await us) {
          const myarr = [];
          myarr.push(await us);
          // console.log(myarr)
          res.send(myarr);
        } else {
          console.log("not found");
        }
      });
    }
    catch(err){
      console.log(err);
    }
  });
  
  // Route to edit an existing task in MongoDB
  router.put('/edit-task-DB', (req, res) => {
    const task = req.body.taskid;
    const data = req.body.tasksdata;
    console.log(task,data);
    tasks.findOneAndUpdate( {_id : task}, data ,(err, task) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while updating theTask.');
      } else if (!task) {
        res.status(404).send('Task not found.');
      } else {
        console.log("Task updated!");
        res.status(200).send('Task updated!');
      }
    });
  });
  
  // Route to delete a task from MongoDB
  router.delete('/delete-task/:taskId', (req, res) => {
    const taskId = req.params.taskId;
  
    tasks.findOneAndDelete({ _id: taskId }, (err, task) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while deleting the task.');
      } else if (!task) {
        res.status(404).send('Task not found.');
      } else {
        console.log("Task deleted!");
        res.status(200).send('Task deleted!');
      }
    });
  });
  
  // Route to get all tasks from MongoDB
  router.get('/get-alltask', async (req,res) => {
    const data = await tasks.find({})
    try{
      res.status(200).json({
        data
      })
    } catch(err){
      res.status(500).json({
        status: 'Failed',
        message: err
      })
    }
  });
  
  // Route to get a project's tasks from MongoDB
  router.post("/get-task-DB", async (req, res) => {
    try {
      const { moduleid } = req.body;
      tasks.find({  moduleid: moduleid }, (err, tasks) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else if (tasks.length > 0) {
          res.send(tasks);
        } else {
          res.status(404).send("Tasks not found");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err.message });
    }
  });
  // Route to push task object IDs to a module's taskIds array in MongoDB
  router.put('/module/:moduleID/tasks', async (req, res) => {
    try {
      const { moduleID } = req.params;
      const { taskIds } = req.body;
  
      // Try to find the module in the modules collection
      let module = await modules.findById(moduleID);
  
      // If the module is not found in modules, try to find it in workspaces
      if (!module) {
        module = await collectionWorkspace.findById(moduleID);
      }
  
      if (!module) {
        // If the module is still not found, return a 404 response
        return res.status(404).send('Module not found.');
      }
  
      // Add taskIds to the module
      module.taskIds.push(...taskIds);
  
      // Save the updated module
      const updatedModule = await module.save();
  
      res.send(updatedModule);
    } catch (error) {
      console.log(error);
      res.status(500).send('An error occurred while pushing task IDs to the module.');
    }
  });
  

// Route to pull task object IDs from a module's taskIds array in MongoDB
router.put('/module/:moduleID/removeTasks', async (req, res) => {
  try {
      const { moduleID } = req.params;
      const { taskIds } = req.body;

      const module = await modules.findById(moduleID);
      module.taskIds = module.taskIds.filter(id => !taskIds.includes(id.toString()));

      const updatedModule = await module.save();

      res.send(updatedModule);
  } catch (error) {
      console.log(error);
      res.status(500).send('An error occurred while pulling task IDs from the module.');
  }
});

  
  // SKILL ROUTES
 
  // Route to get all skills from MongoDB
  router.get('/api/skills', async (req, res) => {
    try {
      const skills = await Skill.find();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching skills' });
    }
  });
  
  // Route to create a new skill in MongoDB
  router.post('/api/skills', async (req, res) => {
    try {
      const { name } = req.body;
      const newSkill = new Skill({ name });
      await newSkill.save();
      res.status(201).json(newSkill);
    } catch (error) {
      res.status(500).json({ message: 'Error adding skill' });
    }
  });

router.get("/filter-project-DB", async (req, res) => {
    try {
      const { projectOwner, totalDevTimeRequired, projectField, skillsRequired, searchQuery } = req.query;
  
      // Build the filter object based on the available fields
      const filterObject = {};
  
      if (projectOwner) {
        filterObject.projectOwner = projectOwner;
      }
  
      if (totalDevTimeRequired) {
        // Parse the array of time range values
        const [minTime, maxTime] = totalDevTimeRequired.split('-');
  
        // Check if both minTime and maxTime are available and numeric
        if (!isNaN(minTime) && !isNaN(maxTime)) {
          filterObject.totalDevTimeRequired = {
            $gte: parseInt(minTime),
            $lte: parseInt(maxTime),
          };
        } else if (!isNaN(minTime)) {
          filterObject.totalDevTimeRequired = { $gte: parseInt(minTime) };
        } else if (!isNaN(maxTime)) {
          filterObject.totalDevTimeRequired = { $lte: parseInt(maxTime) };
        }
      }
  
      if (projectField) {
        filterObject.projectField = projectField;
      }
  
      if (skillsRequired) {
        // Use an array filter to match skillsRequired by name
        filterObject.skillsRequired = { $elemMatch: { name: skillsRequired } };
      }
  
      if (searchQuery) {
        // Add a condition to search by project name
        filterObject.projectName = { $regex: new RegExp(searchQuery, 'i') };
      }
  
      const project = await projects.find(filterObject).sort({ projectDateCreated: -1 });
  
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // Org routes
  router.get('/org', async (req, res) => {
    try {
      const roleID = req.query.roleId; // Assuming the roleId is provided as a query parameter
  
      let filter = {roleID:"R002-B" } // Default filter for roleId: "4"
  
      if (roleID && roleID ==="R002-B" ) {
        // If roleId is provided and equals "2", update filter condition
        filter = { roleID:"R002-B"}}
  
      const Organizations = await Organization.find(filter);
      res.json(Organizations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching organizations', error: error.message });
    }
  });
  router.get('/org/role2', async (req, res) => {
    try {
      const Organizations = await Organization.find({ roleID:"R002-B",access:'True' });
      res.json(Organizations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching organizations with roleId', error: error.message });
    }
  });
  router.get('/get-org/:orgId', async (req, res) => {
    try {
        const orgId = req.params.orgId;

        // Assuming 'orgID' is a unique field in your organization schema
        const organization = await Organization.findOne({ orgID: orgId });

        if (organization) { 
            res.send(organization);
        } else {
            res.status(404).send('Organization not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

router.get('/get-orgID/:owner', async (req, res) => {
  try {
      const OrgName = req.params.owner;

      // Assuming 'orgID' is a unique field in your organization schema
      const organization = await Organization.findOne({ OrgName: OrgName });

      if (organization) { 
          res.send(organization);
      } else {
          res.status(404).send('Organization not found');
      }
  } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
  }
});
  router.post('/create-ngoDB', async(req, res) => {
    const { OrgName, projectId } = req.body;
    try {
      const ngo = await Organization.findOne({ OrgName });
      if (ngo) {
        ngo.projects.push(projectId);
        await ngo.save();
        res.status(200).send(`Project added to existing NGO ${OrgName}`);
      } else {
        const newNGO = new Organization({
          ngoName: ngoName,
          projects: [projectId]
        });
        await newNGO.save();
        res.status(200).send(`New NGO created with project ${projectId}`);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('An error occurred while saving data to the database.');
    }
  });
  router.delete('/delete-project-from-ngo/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const ngo = await Organization.findOne({
        projects: {
          $elemMatch: {
            $eq: id
          }
        }
      });
      if (ngo) {
        ngo.projects = ngo.projects.filter(project => project !== id);
        await ngo.save();
        res.status(200).send(`Project ${id} removed from NGO ${ngo.OrgName}.`);
      } else {
        res.status(404).send(`Project ${id} not found in any NGO.`);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while deleting data from the database.');
    }
  });
 //TEams 

 router.post('/create-team', async (req, res) => {
  const { TeamName, UserIDs,TeamGitID ,OrgId,AvailabilityTime,TeamSkills,web_url,AssignedModules} = req.body;

  try {
      // Create a new instance of the Team model
      const newTeam = new Team({
          TeamName: TeamName,
          UserIDs: UserIDs,
          OrgId:OrgId,
          TeamGitID:TeamGitID ,
          TeamSkills:TeamSkills,
          AvailabilityTime:AvailabilityTime,
          web_url:web_url,
          createdDateTime: new Date(),
          updateDateTime: new Date(),
          AssignedModules: AssignedModules
      });

      // Save the new team to the teams collection
      await newTeam.save();

      res.status(200).json(newTeam);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while saving the team to the database.' });
  }
}); 

router.put('/update-teamuser', async (req, res) => {
  const { userIds, teamId } = req.body;

  try {
    if (userIds.length > 0) {
      // Check if the users exist
      const users = await User.find({ _id: { $in: userIds } });
      if (users.length !== userIds.length) {
        console.error('Users not found. Users:', users);
        console.error('User IDs:', userIds);
        return res.status(404).json({ message: 'One or more users not found.' });
      }

      // Use $set to update the TeamId for all users
      await User.updateMany({ _id: { $in: userIds } }, { $set: { teamId: [teamId] } });

      // Fetch the updated users
      const updatedUsers = await User.find({ _id: { $in: userIds } });

      // Remove sensitive information before sending the response
      updatedUsers.forEach(user => {
        user.password = undefined;
      });

      return res.status(200).json({ message: 'Users teams updated successfully.', users: updatedUsers });
    } else {
      return res.status(400).json({ message: 'UserIds array is empty.' });
    }
  } catch (error) {
    console.error('Error during updating user teams:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});



// Route to get users by OrgID from MongoDB
router.get('/get-users-by-org/:orgId', async (req, res) => {
  try {
    const orgId = req.params.orgId;

    // Find users based on the OrgID
    const users = await User.find({ OrgID: orgId });

    if (users.length > 0) {
      users.forEach(user => {
        user.password = undefined;
      });

      res.status(200).json(users);
    } else {
      res.status(404).send('No users found for the specified OrgID.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});
router.get('/get-users-by-org-for-team/:orgId', async (req, res) => {
  try {
    const orgId = req.params.orgId;

    // Find users based on the OrgID and TeamIds length 
    const users = await User.find({ OrgID: orgId, teamId: { $size: 0 } });

    if (users.length > 0) {
      users.forEach(user => {
        user.password = undefined;
      });

      res.status(200).json(users);
    } else {
      res.status(404).send('No users found for the specified OrgID and TeamIds length.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
})
router.get('/organization/:orgName', async (req, res) => {
  try {
      const OrgName = req.params.orgName;

      // Find the organization by OrgName
      const organization = await Organization.findOne({ OrgName });

      // Check if the organization exists
      if (!organization) {
          return res.status(404).json({ message: 'Organization not found.' });
      }

      // Return the organization data in the response
      res.json(organization);
  } catch (error) {
      console.error('Error retrieving organization data by OrgName:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});
router.get('/organizationbyid/:orgID', async (req, res) => {
  try {
    const orgID = req.params.orgID;

    // Find the organization by _id
    const organization = await Organization.findOne({ orgID: orgID });

    // Check if the organization exists
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found.' });
    }

    // Return the organization data in the response
    res.json(organization);
  } catch (error) {
    console.error('Error retrieving organization data by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Route to get all teams from MongoDB
router.get('/get-all-teams', async (req, res) => {
  try {
    // Find all teams
    const teams = await Team.find(); 
 
    if (teams.length > 0) {
      res.status(200).json(teams);
    } else {
      res.status(404).send('No teams found.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});
//Route to get data by user id
router.get('/get-user-teams/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Find teams where the user is a part of based on either userId or OrgID
    const teams = await Team.find({
      $or: [
        { 'UserIDs': id },
        { 'OrgId': id }
      ]
    });

    if (teams.length > 0) {
      res.status(200).json(teams);
    } else {
      res.status(404).send('User is not part of any teams.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

router.get('/get-teams-by-id/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Find teams where the provided id is present in either UserIDs or OrgId
    const teams = await Team.find({
      $or: [
        { 'UserIDs': id },
        { 'OrgId': id }
      ]
    });

    if (teams.length > 0) {
      const teamIds = teams.map(team => team._id);
      res.status(200).json({ teamIds });
    } else {
      res.status(404).send('No teams found for the provided id.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

router.get('/get-user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find teams where the user is a part of
    const teams = await User.find({ 'userID': userId });

    if (teams.length > 0) {
      res.status(200).json(teams);
    } else {
      res.status(404).send('User is not present.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});
// Route to get a team by ID from MongoDB
router.get('/get-team-by-id/:teamId', async (req, res) => {
  try {
    const teamId = req.params.teamId;

    // Find the team by ID
    const team = await Team.findById(teamId);

    if (team) {
      res.status(200).json(team);
    } else {
      res.status(404).send('Team not found for the specified ID.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

router.get('/get-teams-by-orgId/:orgId', async (req, res) => {
  try {
    // Extract OrgId from the request parameters
    const orgId = req.params.orgId;
    // Find teams by OrgId
    const teams = await Team.find({ OrgId: orgId });

    if (teams.length > 0) {
      res.status(200).json(teams);
    } else {
      res.status(404).send('No teams found for the given OrgId.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});
// workspace 
router.post('/create-workspace', async (req, res) => {
  try {
    const {
      projectObjectId,
      projectid,
      moduleCreatedBy,
      assignedTeam,
      moduleDateCreated,
      moduleName,
      moduleDescription,
      moduleDateStart,
      moduleDateEnd,
      skillsRequired,
      totalDevTimeRequired,
      moduleComplexity,
      forkedGitlabID,
      forkedGitlabUrl,
      Gitmodulename,
      numberOfTask,
      modulefield,
      assigned,
      unassigned,
      completed,
      taskIds,
    } = req.body;

    // Create a new workspace
    const newWorkspace = new collectionWorkspace({
      projectObjectId,
      projectid,
      moduleCreatedBy,
      assignedTeam,
      moduleDateCreated,
      moduleName,
      moduleDescription,
      moduleDateStart,
      moduleDateEnd,
      skillsRequired,
      totalDevTimeRequired, 
      moduleComplexity,
      forkedGitlabID,
      forkedGitlabUrl,
      Gitmodulename,
      numberOfTask,
      modulefield,
      assigned,
      unassigned,
      completed,
      taskIds,
    });

    // Save the workspace to the database
    const savedWorkspace = await newWorkspace.save();

    res.status(201).json(savedWorkspace);
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
router.post('/get-workspaces-by-teamids', async (req, res) => {
  try {
    const { teamIds } = req.body;

    // Find workspaces based on teamIds
    const workspaces = await collectionWorkspace.find({ assignedTeam: { $in: teamIds } });

    res.status(200).json({ workspaces });
  } catch (error) {
    console.error('Error fetching workspaces by team IDs:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.get('/get-all-workspaces', async (req, res) => {
  try {

    // Find workspaces based on teamIds
    const workspaces = await collectionWorkspace.find();

    res.status(200).json({ workspaces });
  } catch (error) {
    console.error('Error fetching workspaces by team IDs:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
// Route to get module data by ID from MongoDB
router.post("/get-workspaceData",async(req,res) => {
  try{
    const name = await req.body.moduleid;
    //const projname = await req.body.projname;
    // console.log(projname,name)
    collectionWorkspace.findOne({ _id : name},async(err,us) => {
      if (err) {
        console.log(err);
      } else if (await us) {
        const myarr = [];
        myarr.push(await us);
        // console.log(myarr)
        res.send(myarr);
      } else {
        console.log("not found");
      }
    });
  }
  catch(err){
    console.log(err);
  }
});
router.put("/update-assigned-modules/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    const { assignedModule } = req.body;

    if (!teamId || !assignedModule) {
      return res.status(400).json({ error: "Team ID and assignedModule are required." });
    }

    // Find the team by ID
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    // Push the assignedModule to the AssignedModules array
    team.AssignedModules.push(assignedModule);

    // Save the updated team
    const updatedTeam = await team.save();

    res.json(updatedTeam);
  } catch (error) {
    console.error("Error updating assigned modules:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;