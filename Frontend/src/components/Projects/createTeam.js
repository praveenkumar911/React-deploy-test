import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
  Autocomplete,
  Checkbox,
  Chip, // Add Chip from MUI
} from '@mui/material';
import axios from 'axios';

const CheckBoxOutlineBlankIcon = () => <Checkbox icon={<span style={{ visibility: 'hidden' }}>1</span>} />;
const CheckBoxIcon = () => <Checkbox checked icon={<span style={{ visibility: 'hidden' }}>1</span>} />;

function CreateTeam() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [devTime, setDevTime] = useState('');
  const [skillsList, setSkillsList] = useState([]);
  const [customSkill, setCustomSkill] = useState(''); // Add customSkill state
  const [skillsRequired, setSkillsRequired] = useState([]); 
  const [OrgGitID,setOrgGitID]=useState()
  const permissionString = sessionStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const entityID=sessionStorage.getItem('entityID')
  useEffect(() => {
    // Fetch team members based on the entity ID
    const fetchTeamMembers = async () => {
      try {
        const res = await axios.get(`http://localhost:5030/get-users-by-org-for-team/${entityID}`);
        setTeamMembers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    

    fetchTeamMembers();
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5030/organizationbyid/${entityID}`);
        setOrgGitID(res.data['GitlabID']);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData()
  }, [entityID])

  console.log('hii',OrgGitID);
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get('http://localhost:5030/api/skills');
        setSkillsList(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSkills();
  }, []);

  const handleEnter = (event) => {
    if (event.key === 'Enter' && customSkill && skillsRequired.length < 10) {
      setSkillsRequired([...skillsRequired, { name: customSkill }]);
      setCustomSkill('');
    }
  };

  const handleCustomSkillInput = (event) => {
    if (skillsRequired.length < 10) {
      setCustomSkill(event.target.value);
    }
  };
  const handleAddTeam = async () => {
    try {
      // Step 1: Create subgroup with users
      const createSubgroupResponse = await axios.post(`http://localhost:5030/create-subgroup-with-users/${OrgGitID}`, {
        name: teamName.replace(/\s/g, "_") ,// Replace with an appropriate name
        description: 'RandomDescription', // Replace with an appropriate description
        userIds: selectedTeamMembers.map(member => member.GitlabID),
      });
  
      const gitgroupId = createSubgroupResponse.data.id;
      const GitWebUrl=createSubgroupResponse.data.web_url;
  
      // Step 2: Create team
      const createTeamResponse = await axios.post('http://localhost:5030/create-team', {
        TeamName: teamName, 
        UserIDs: selectedTeamMembers.map(member => member.userID),
        TeamGitID: gitgroupId,
        OrgId: entityID, // Replace with the appropriate OrgId
        AvailabilityTime: devTime,
        TeamSkills: skillsRequired.map(skill => skill.name),
        web_url: GitWebUrl, // Replace with an appropriate web_url
        AssignedModules: [], // You may include assigned modules if applicable
      }); 
  
      const teamId = createTeamResponse.data._id;
  
      // Step 3: Update team users
      const updateTeamUserResponse = await axios.put('http://localhost:5030/update-teamuser', {
        userIds: selectedTeamMembers.map(member => member._id),
        teamId: teamId,
      });
  
      console.log('Team created successfully!', updateTeamUserResponse.data);
      window.location.reload();
    } catch (error) {
      console.error('Error creating team:', error);
      // Handle errors as needed
    }
  };
  
  
  return (
    <Container>
      <Box mt={4}>
        <Card variant="outlined" sx={{ maxWidth: 500 }}>
          <CardContent>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              Add a new Team
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography style={{ minWidth: 120, fontWeight: 'bold' }}>
                  Team Name:
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Team Name"
                  variant="outlined"
                  fullWidth
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': {
                      height: '30px', // Adjust the height as needed
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 'none', // You can adjust the border radius or any other styles here
                    },
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'red', fontSize: '20px' }}
                >
                  *
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography style={{ minWidth: 120, fontWeight: 'bold' }}>
                  Select Members:
                </Typography>
                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  options={teamMembers}
                  disableCloseOnSelect
                  getOptionLabel={(option) =>
                    `${option.username}`
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon />}
                        checkedIcon={<CheckBoxIcon />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {`${option.username}`}
                    </li>
                  )}
                  style={{ width: 350 }}
                  onChange={(event, newValue) =>
                    setSelectedTeamMembers(newValue)
                  }
                  value={selectedTeamMembers}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Team Members"
                      placeholder="Team Members"
                    />
                  )}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'red', fontSize: '20px' }}
                >
                  *
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
        <Typography style={{ minWidth: 120, fontWeight: "bold" }}>Select Skills:</Typography>

        <Autocomplete
          multiple
          id="tags-standard"
          options={skillsList}
          getOptionLabel={(option) => option.name}
          value={skillsRequired}
          onChange={(_, v) => {
            setSkillsRequired(v);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              onKeyDown={handleEnter}
              onChange={handleCustomSkillInput}
              value={customSkill}
            />
          )}
          style={{ width: 300, maxHeight: 150, overflowY: 'auto' }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.name.length > 4 ? option.name.substring(0, 4) + ".." : option.name}
                {...getTagProps({ index })}
              />
            ))
          }
        />
        <Typography variant="subtitle2" sx={{ color: 'red', fontSize: '20px', marginLeft: "-0.2vw" }}>*</Typography>
      </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography style={{ minWidth: 120, fontWeight: 'bold' }}>
                  Availability
                </Typography>
                <TextField
                  id="outlined-basic"
                  label=" Availability(in hours)"
                  variant="outlined"
                  fullWidth
                  value={devTime}
                  onChange={(e) => setDevTime(e.target.value)}
                  sx={{
                    '& .MuiInputBase-input': {
                      height: '20px', // Adjust the height as needed
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 'none', // You can adjust the border radius or any other styles here
                    },
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'red', fontSize: '20px' }}
                >
                  *
                </Typography>
              </Box>

              <Box mt={2} display="flex" justifyContent="center">
          
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#0e66ac',
                    '&:hover': {
                      backgroundColor: '#66abe3',
                    },
                  }}
                  onClick={handleAddTeam}
                >
                  Add Team
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default CreateTeam;
