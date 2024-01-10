const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleID: String,
  roleName: String,
});

const permissionSchema = new mongoose.Schema({
  permissionID: String,
  permissionName: String,
  description: String,
});

const rolePermissionSchema = new mongoose.Schema({
  roleID: String, 
  permissionID: [String],
});

const userSchema = new mongoose.Schema({
  userID: String,
  username: String,
  email: String,
  password: String,
  roleID: String,
  GitlabID:String,
  OrgID:String,
  teamId:Array,
});

const Role = mongoose.model('Role', roleSchema);
const Permission = mongoose.model('Permission', permissionSchema);
const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Role, Permission, RolePermission, User };
