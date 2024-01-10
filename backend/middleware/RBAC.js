const express = require('express');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendRegistrationEmail } = require('./nodemailer');
const router = express.Router();
const secretKey = "iedbwb67698$%$#@%^&ghgevhgfi";
const { Role, Permission, RolePermission, User } = require('../Schemas/collectionUser'); 
const Organization =require('../Schemas/collectionOrg');
const bodyParser = require('body-parser');
  router.use(bodyParser.json());
  async function createCollections() { 
    try {
      const rolesCount = await Role.countDocuments();
      const permissionsCount = await Permission.countDocuments();
      const rolePermissionsCount = await RolePermission.countDocuments();
  
      if (rolesCount === 0 && permissionsCount === 0 && rolePermissionsCount === 0) {
        await Role.insertMany([
          { roleID: 'R001', roleName: 'Admin' },
          { roleID: 'R002', roleName: 'Manager' },
          { roleID: 'R002-A', roleName: 'CoreManager' },
          { roleID: 'R002-B', roleName: 'OrgManager' },
          { roleID: 'R003', roleName: 'Developer' },
          { roleID: 'R003-A', roleName: 'CoreDeveloper' },
          { roleID: 'R003-B', roleName: 'OrgDeveloper' },
        ]);
  
        await Permission.insertMany([
          { permissionID: 'P001', permissionName: 'Create', description: 'Allows the role to create Project, Module, Task, & Team' },
          { permissionID: 'P002', permissionName: 'Read', description: 'Allows the role to have a component visible or not for Project, Module, Task, & Team' },
          { permissionID: 'P003', permissionName: 'Update', description: 'Allows the role to update Project, Module, Task, & Team' },
          { permissionID: 'P004', permissionName: 'Delete', description: 'Allows the role to delete Project, Module, Task, & Team' },
        ]);
  
        await RolePermission.insertMany([
          { roleID: 'R001', permissionID: ['P001', 'P002', 'P003'] },
          { roleID: 'R002', permissionID: ['P001', 'P002', 'P003', 'P004'] },
          { roleID: 'R002-A', permissionID: ['P001', 'P002', 'P003', 'P004']},
          { roleID: 'R002-B', permissionID: ['P001', 'P002', 'P003', 'P004']},
          { roleID: 'R003', permissionID: ['P002'] },
          { roleID: 'R003-A', permissionID: ['P002']},
          { roleID: 'R003-B', permissionID: ['P002'] }
        ]);
      }
  
      console.log('Collections and initial data created successfully.');
    } catch (error) {
      console.error('Error creating collections and initial data:', error);
      throw error;
    }
  }
  
  router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, roleName,GitlabID,OrgID,teamId} = req.body;  

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Find roleID based on roleName
        const role = await Role.findOne({ roleName });
        if (!role) {
            return res.status(400).json({ error: 'Invalid role name' });
        }

        // Count existing users
        const userCount = await User.countDocuments();

        // Generate userID based on userCount
        const userID = `U${String(userCount + 1).padStart(3, '0')}`;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            userID,
            username,
            email,
            password: hashedPassword,
            roleID: role.roleID,
            GitlabID,
            OrgID,
            teamId
        });

        res.json({ userID: user.userID, username: user.username, email: user.email, roleID: user.roleID });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/org-signup', async (req, res) => {
    try {
        const {
            OrgName,
            email,
            password,
            projects,
            WebsiteUrl,
            GitlabID,
            ImgUrl,
            Address1,
            Address2,
            AreaName,
            City,
            state,
            country,
            pincode,
            access,
            roleName,
            IsNgo // Make sure this field is present in your request body
        } = req.body;

        // Check if email already exists
        const existingOrganization = await Organization.findOne({ email });
        if (existingOrganization) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Find roleID based on roleName
        const role = await Role.findOne({ roleName });
        if (!role) {
            return res.status(400).json({ error: 'Invalid role name' });
        }

        // Count existing organizations
        const orgCount = await Organization.countDocuments();

        // Generate organizationID based on orgCount
        const orgID = `ORG${String(orgCount + 1).padStart(3, '0')}`;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create organization
        const organization = await Organization.create({
            orgID,
            OrgName,
            email,
            password: hashedPassword,
            projects,
            WebsiteUrl,
            roleID: role.roleID, // Corrected field name
            GitlabID,
            ImgUrl,
            Address1,
            Address2,
            AreaName,
            City,
            state,
            country,
            pincode,
            access,
            IsNgo
        });

        res.json({
            orgID: organization.orgID,
            OrgName: organization.OrgName,
            email: organization.email,
            roleID: organization.roleID, // Corrected field name
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

   
router.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;

      // Try to find the user in the User collection
      const user = await User.findOne({ email });
      if (user) {
          // Compare passwords
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
              // Generate JWT token for user
              const token = jwt.sign({ id: user._id, userType: 'user' }, secretKey, { expiresIn: '1h' });
              return res.json({ token });
          }
      }

      // Try to find the organization in the Organization collection
      const organization = await Organization.findOne({ email });
      if (organization) {
          // Compare passwords
          const isPasswordValid = await bcrypt.compare(password, organization.password);
          if (isPasswordValid) {
              // Generate JWT token for organization
              const token = jwt.sign({ id: organization._id, userType: 'organization' }, secretKey, { expiresIn: '1h' });
              return res.json({ token });
          }
      }

      // If no user or organization is found, return an error
      res.status(401).json({ error: 'Invalid email or password' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
router.get('/get-permissions', async (req, res) => {
    try {
        // Check if the Authorization header is present
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }

        // Extract the token from the request headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token
        const decodedToken = jwt.verify(token, secretKey);

        // Check the user type (either 'user' or 'organization')
        const { userType, id } = decodedToken;

        // Find permissions based on the user type and get the corresponding ID
        let entity, entityID;
        if (userType === 'user') {
            entity = await User.findById(id);
            entityID = entity.userID; // Assuming your User model has a 'userID' field
        } else if (userType === 'organization') {
            entity = await Organization.findById(id);
            entityID = entity.orgID; // Assuming your Organization model has an 'orgID' field
        } else {
            return res.status(401).json({ error: 'Invalid user type' });
        }

        // Fetch the role ID from the entity
        const roleID = entity.roleID;

        // Find permissions based on the role ID
        const rolePermissions = await RolePermission.findOne({ roleID });

        if (!rolePermissions) {
            return res.status(404).json({ error: 'Permissions not found for the given role ID' });
        }

        res.json({ entityID, permissions: rolePermissions.permissionID });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
  createCollections()
module.exports = router;
