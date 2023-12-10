const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
const secretKey="iedbwb67698$%$#@%^&ghgevhgfi"
mongoose.connect('mongodb://0.0.0.0:27017/roleAuth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      roleId: { type: String, required: true },
      password: { type: String, required: true },
    },
    { timestamps: true }
  );

  const User = mongoose.model('User', userSchema);

  const roleSchema = new mongoose.Schema(
    {
      roleName: { type: String, required: true, unique: true },
      roleId: { type: String, required: true, unique: true },
    },
    { timestamps: true }
  );

  const Role = mongoose.model('Role', roleSchema);

  const rolesExist = await mongoose.connection.db.listCollections({ name: 'roles' }).hasNext();

  if (!rolesExist) {
    const rolesData = [
      { roleName: 'Dev', roleId: '1' },
      { roleName: 'Org', roleId: '2' },
      { roleName: 'Core', roleId: '3' },
      { roleName: 'NGO', roleId: '4' },
    ];

    try {
      await Role.insertMany(rolesData);
      console.log('Roles collection created and roles saved.');
    } catch (error) {
      console.error('Error creating Roles collection:', error);
    }
  }

  app.use(bodyParser.json());

  const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return res.status(403).send('Invalid token.');

      req.user = decoded;
      next();
    });
  };

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // Include roleId in the signed token
      const token = jwt.sign({ email: user.email, roleId: user.roleId }, secretKey, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
  app.post('/signup', async (req, res) => {
    const { name, email, role, password } = req.body;

    if (!name || !email || !role || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email is already registered.' });
      }

      const roleData = await Role.findOne({ roleName: role });
      if (!roleData) {
        return res.status(404).json({ message: 'Role not found.' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = new User({
        name,
        email,
        role: roleData.roleName,
        roleId: roleData.roleId,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
app.get('/data', verifyToken, async (req, res) => {
    try {
      let data;
     console.log(req.user.roleId);
      switch (req.user.roleId) {
        case '3': // Assuming Core roleId is '3'
          data = {
            role: 'CORE',
            developers: await User.find({ roleId: '1' }), // Dev roleId is '1'
            organizations: await User.find({ roleId: '2' }), // Org roleId is '2'
            ngo: await User.find({ roleId: '4' }), // NGO roleId is '4'
          };
          break;
  
        case '2': // Assuming Org roleId is '2'
          data = {
            role: 'ORG',
            developers: await User.find({ roleId: '1' }), // Dev roleId is '1'
            ngo: await User.find({ roleId: '4' }), // NGO roleId is '4'
          };
          break;
  
        case '4': // Assuming NGO roleId is '4'
          data = {
            role: 'NGO',
            developers: await User.find({ roleId: '1' }), // Dev roleId is '1'
            organizations: await User.find({ roleId: '2' }), // Org roleId is '2'
          };
          break;
  
        case '1': // Assuming Dev roleId is '1'
          data = {
            role: 'Dev',
          };
          break;
  
        default:
          return res.status(403).send('Permission denied.');
      }
  
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
