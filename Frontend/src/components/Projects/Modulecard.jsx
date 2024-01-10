import * as React from "react";
import Grid from '@mui/material/Grid';
import healthcare from "../project/healthcare.svg";
import Vector from "../project/Vector.svg";
import info from "../project/info.svg";
import gitlab from "../project/gitlab.svg";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PieChartsRow from "./Chart";
import './project.css'
import tickDecagram from '../project/mdi_tick-decagram.png';
import swal from "sweetalert2";


function Modulecard(props) {
  const navigate = useNavigate();
  const [moduledetails, setModuledetails] = useState([]);
  const [taskdetails, setTaskdetails] = useState([]);
  const project = props.project;
  const permissionString = sessionStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const entityID=sessionStorage.getItem('entityID')
  const isP001Allowed = permissions.includes('P001');
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004')
  var num = 1;
  function mapComplexityToNumber(complexity) {
    const complexityMap = {
      'a': 1,
      'b': 2,
      'c': 3,
      'd': 4,
      'e': 5,
    };
  
    return complexityMap[complexity] || 0;
  }
  
  const showTeamAlert = async (teams) => {
    const { value: selectedTeam } = await swal.fire({
      title: "Select a Team",
      input: "select",
      inputOptions: teams.reduce((options, team) => {
        options[team.TeamName] = team.TeamName;
        return options;
      }, {}),
      showCancelButton: true,
      inputPlaceholder: "Select a Team",
      confirmButtonText: "confirm",
    });

    if (selectedTeam) {
      // Handle the selected team (you can navigate or perform other actions)
      console.log(`Selected Team: ${selectedTeam}`);
    }
  };
  React.useEffect(() => {
    axios
      .get("http://10.8.0.13:5030/get-allmodules")
      .then((res) => {
        setModuledetails(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    axios
      .get("http://10.8.0.13:5030/get-alltask")
      .then((res) => {
        setTaskdetails(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [isChecked, setIsChecked] = useState(false);
 /*  const handleCircleClick = async (details) => {
    try {
      // Fetch user details based on entity ID
      const userResponse = await axios.get(`http://10.8.0.13:5030/get-user/${entityID}`);
      const user = userResponse.data;
  
      // Check if OrgID from user details matches OrgID in module details
      if (user && user[0].OrgID === details.OrgID) {
        const teamsResponse = await axios.get(`http://10.8.0.13:5030/get-user-teams/${entityID}`);
  
        if (teamsResponse.data && teamsResponse.data.length > 0) {
          const { value: selectedTeam } = await swal.fire({
            title: "Select a Team",
            input: "select",
            inputOptions: teamsResponse.data.reduce((options, team) => {
              options[team.TeamName] = team.TeamName;
              return options;
            }, {}),
            showCancelButton: true,
            inputPlaceholder: "Select a Team",
            confirmButtonText: "Confirm",
          });
  
          if (selectedTeam) {
            // Find the selected team in the teamsResponse.data
            const selectedTeamDetails = teamsResponse.data.find(team => team.TeamName === selectedTeam);
            console.log(selectedTeamDetails._id);
            if (selectedTeamDetails) {
              // You can get moduleGitID from your logic, assuming details._id is the moduleGitID
              const moduleGitID = details.GitlabID;
              const teamGitID = selectedTeamDetails.TeamGitID;
  
              // Make the API call to /fork-and-add-to-subgroup/modulegitid/teamgitid
              const forkAndAddToSubgroupResponse = await axios.post(
                `http://10.8.0.13:5030/fork-and-add-to-subgroup/${moduleGitID}/${teamGitID}`
              );
  
              // Handle the response and update forkedGitlabID and forkedGitlabUrl
              const { id, web_url } = forkAndAddToSubgroupResponse.data;
              console.log("Forked GitlabID:", id);
              console.log("Forked GitlabUrl:", web_url);
  
              // Create the payload for /create-workspace
              const createWorkspacePayload = {
                projectObjectId: details.projectObjectId,
                projectid: details.projectid,
                moduleCreatedBy: details.moduleCreatedBy,
                assignedTeam: selectedTeamDetails._id,
                moduleDateCreated: details.moduleDateCreated,
                moduleName: details.moduleName,
                moduleDescription: details.moduleDescription,
                moduleDateStart: details.moduleDateStart,
                moduleDateEnd: details.moduleDateEnd,
                skillsRequired: details.skillsRequired,
                totalDevTimeRequired: details.totalDevTimeRequired,
                moduleComplexity: details.moduleComplexity,
                forkedGitlabID: id, // Updated with forked GitlabID
                forkedGitlabUrl: web_url, // Updated with forked GitlabUrl
                Gitmodulename: details.Gitmodulename,
                numberOfTask: details.numberOfTask,
                modulefield: details.modulefield,
                assigned: details.assigned,
                unassigned: details.unassigned,
                completed: details.completed,
                taskIds: details.taskIds,
              };
  
              // Make the API call to /create-workspace with the payload
              const createWorkspaceResponse = await axios.post(
                "http://10.8.0.13:5030/create-workspace",
                createWorkspacePayload
              );
  
              // Handle the response from /create-workspace
              console.log("Create Workspace Response:", createWorkspaceResponse.data);
  
              // Obtain the _id from the createWorkspaceResponse
              const createdWorkspaceId = createWorkspaceResponse.data._id;
  
              // Make the API call to /update-assigned-modules/:teamId
              const updateAssignedModulesResponse = await axios.put(
                `http://10.8.0.13:5030/update-assigned-modules/${selectedTeamDetails._id}`,
                { assignedModule: createdWorkspaceId }
              );
  
              // Handle the response from /update-assigned-modules/:teamId
              console.log("Update Assigned Modules Response:", updateAssignedModulesResponse.data);
  
              const appendTeamsResponse = await axios.put(
                `http://10.8.0.13:5030/append-teams/${details._id}`,
                { teamIds: [selectedTeamDetails._id] }
              );
  
              // Handle the response from /append-teams
              console.log("Append Teams Response:", appendTeamsResponse.data);
  
              // Show success prompt
              swal.fire({
                icon: "success",
                title: "Success",
                text: "Workspace created successfully. Check your workspace.",
              });
  
              // You can update the state or perform other actions based on the response
            }
          }
        } else {
          swal.fire({
            icon: "info",
            title: "No Teams Found",
            text: "You are not part of any teams.",
          });
        }
      } else {
        swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You are not allowed to pick this module.",
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Handle errors as needed
    }
  }; */
  const handleCircleClick = async (details) => {
    try {
    
      // Check if OrgID from user details matches OrgID in module details
      if (isP001Allowed) {
        const teamsResponse = await axios.get(`http://10.8.0.13:5030/get-user-teams/${entityID}`);
  
        if (teamsResponse.data && teamsResponse.data.length > 0) {
          const { value: selectedTeam } = await swal.fire({
            title: "Select a Team",
            input: "select",
            inputOptions: teamsResponse.data.reduce((options, team) => {
              options[team.TeamName] = team.TeamName;
              return options;
            }, {}),
            showCancelButton: true,
            inputPlaceholder: "Select a Team",
            confirmButtonText: "Confirm",
          });
  
          if (selectedTeam) {
            // Find the selected team in the teamsResponse.data
            const selectedTeamDetails = teamsResponse.data.find(team => team.TeamName === selectedTeam);
            console.log(selectedTeamDetails._id);
            if (selectedTeamDetails) {
              // You can get moduleGitID from your logic, assuming details._id is the moduleGitID
              const moduleGitID = details.GitlabID;
              const teamGitID = selectedTeamDetails.TeamGitID;
  
              // Make the API call to /fork-and-add-to-subgroup/modulegitid/teamgitid
              const forkAndAddToSubgroupResponse = await axios.post(
                `http://10.8.0.13:5030/fork-and-add-to-subgroup/${moduleGitID}/${teamGitID}`
              );
  
              // Handle the response and update forkedGitlabID and forkedGitlabUrl
              const { id, web_url } = forkAndAddToSubgroupResponse.data;
              console.log("Forked GitlabID:", id);
              console.log("Forked GitlabUrl:", web_url);
  
              // Create the payload for /create-workspace
              const createWorkspacePayload = {
                projectObjectId: details.projectObjectId,
                projectid: details.projectid,
                moduleCreatedBy: details.moduleCreatedBy,
                assignedTeam: selectedTeamDetails._id,
                moduleDateCreated: details.moduleDateCreated,
                moduleName: details.moduleName,
                moduleDescription: details.moduleDescription,
                moduleDateStart: details.moduleDateStart,
                moduleDateEnd: details.moduleDateEnd,
                skillsRequired: details.skillsRequired,
                totalDevTimeRequired: details.totalDevTimeRequired,
                moduleComplexity: details.moduleComplexity,
                forkedGitlabID: id, // Updated with forked GitlabID
                forkedGitlabUrl: web_url, // Updated with forked GitlabUrl
                Gitmodulename: details.Gitmodulename,
                numberOfTask: details.numberOfTask,
                modulefield: details.modulefield,
                assigned: details.assigned,
                unassigned: details.unassigned,
                completed: details.completed,
                taskIds: details.taskIds,
              };
  
              // Make the API call to /create-workspace with the payload
              const createWorkspaceResponse = await axios.post(
                "http://10.8.0.13:5030/create-workspace",
                createWorkspacePayload
              );
  
              // Handle the response from /create-workspace
              console.log("Create Workspace Response:", createWorkspaceResponse.data);
  
              // Obtain the _id from the createWorkspaceResponse
              const createdWorkspaceId = createWorkspaceResponse.data._id;
  
              // Make the API call to /update-assigned-modules/:teamId
              const updateAssignedModulesResponse = await axios.put(
                `http://10.8.0.13:5030/update-assigned-modules/${selectedTeamDetails._id}`,
                { assignedModule: createdWorkspaceId }
              );
  
              // Handle the response from /update-assigned-modules/:teamId
              console.log("Update Assigned Modules Response:", updateAssignedModulesResponse.data);
  
              const appendTeamsResponse = await axios.put(
                `http://10.8.0.13:5030/append-teams/${details._id}`,
                { teamIds: [selectedTeamDetails._id] }
              );
  
              // Handle the response from /append-teams
              console.log("Append Teams Response:", appendTeamsResponse.data);
  
              // Show success prompt
              swal.fire({
                icon: "success",
                title: "Success",
                text: "Workspace created successfully. Check your workspace.",
              });
  
              // You can update the state or perform other actions based on the response
            }
          }
        } else {
          swal.fire({
            icon: "info",
            title: "No Teams Found",
            text: "You are not part of any teams.",
          });
        }
      } else {
        swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "You are not allowed to pick this module as a developer.",
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Handle errors as needed
    }
  };
  
  
  return (
    <div>
      <div>
        {moduledetails && moduledetails
          .filter((details) => details.projectid === project) 
          .map((details) => (
            <div key={details._id}>
              <Grid container spacing={0} sx={{
                maxWidth: '79.17vw',
                marginLeft: "8vw",
                marginRight: "1vw",
                marginTop: "2vw",
               
                border: '2px dotted #000',
                borderRadius: '8px',
                '@media (max-width: 1000px)': {
                  minWidth: '1200px',
                  overflowX: 'auto', 
                  overflowY: "hidden"
                },
              }}>
                <Grid
  item
  xs={12}
  sm={1.5}
  sx={{
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    width: '120px',
    height: '120px',
    position: 'relative', 
    marginTop:"2vw"
  }} 
  container
  justifyContent="center" // Center content horizontally within the grid
  alignItems="center" // Center content vertically within the grid
  onClick={() => {
    // Check if TeamsAssigned array length is less than 3
    if (details.TeamsAssigned.length < 3) {
      // Handle circle click logic here
      handleCircleClick(details);
    }
  }}
>
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill={isChecked ? '#FFF' : 'transparent'}
    stroke={isChecked ? '#000' : '#000'}
    strokeWidth="0.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    
  >
    <circle cx="12" cy="12" r="10" fill="#D5E8D4" />
  </svg>
  <img
    src={tickDecagram} 
    alt="Tick Decagram"
    style={{
      width: '50%',
      height: '50%',
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      display: isChecked ? 'block' : 'none', 
    }}
  />
</Grid>
              <Grid container xs={12} sm={3} sx={{
                borderLeft: '1px dashed #000',
                borderRight: ['none', '1px dashed #000'],
                padding: ['8px', '10px', '12px'],
                display: 'flex',
                alignItems: 'flex-start',
              }}>
                <Grid item xs={12} sm={12} md={12} xl={12}>
                  <div style={{ display: 'flex', justifyContent: 'space between', alignItems: 'center',cursor:'pointer' }} /* onClick={() => {
                        navigate("/task/" + project + "/" + details._id);
                      }} */>
                    <h4>{details.moduleName}</h4>
                    
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-end" }}>
                      <img src={info} style={{ height: "30px", width: "30px", cursor: "pointer"}} onClick={() => {
                       // navigate("/task/" + project + "/" + details._id);
                      }} />
                    </div>
                  <p sx={{ width: "5px" }}>{details.moduleDescription.length > 100 ? details.moduleDescription.substring(0, 100) + "..." : details.moduleDescription} </p>
                </Grid>
                <Grid item xs={12} sm={12} md={12} xl={12} sx={{display: "flex",justifyContent: "flex-end"}}>
                  <img src={gitlab} style={{ height: "30px", width: "30px",  cursor: 'pointer' }} onClick={() => { window.open(details.GitWebUrl, '_blank') }} />
                </Grid>
                {/* <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    moduleComplexity
                      {[1, 2, 3, 4, 5].map((index) => (
                      <Radio
                        key={index}
                        value={`radio${index}`}
                        control={<Radio />}
                        checked={index <= mapComplexityToNumber(details.moduleComplexity)}
                      />
                    ))}
                  </div> */} 
              </Grid>
              
              <Grid item xs={12} sm={5} sx={{
                borderLeft: ['none', '1px dashed #000'],
                borderRight: ['none', '1px dashed #000'],
                position: 'relative',
                textAlign: ['left', 'center'],
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space between',
              }}>
                <div style={{
                  height: '40%',
                  borderBottom: '1px dashed #000',
                  display: 'flex',
                  flexDirection: 'column',
                  margin: '0 0 4px 0',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                  <p style={{
                    paddingLeft: '0.52vw',
                    paddingTop: '1.08vh',
                    marginTop: '-6px',
                    marginBottom: '4px',
                    fontWeight: '500'
                  }}>Skills Required</p>
                  <div   className="scrollable"style={{ display: 'flex', height: '40px',width: "91%", marginTop: '10px', marginLeft: '20px' }}>
                    {details.skillsRequired.map((item) => (
                      <p
                        key={item._id}
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          backgroundColor: "#FFF",
                          color: "#000",
                          border: "1px solid #000",
                          borderRadius: "20px",
                          marginRight: "5px",
                          fontSize: "12px",
                          textAlign: "center",
                          fontWeight: 400,
                          lineHeight: "1",
                        }}
                      >
                        {item.name}
                      </p>
                    ))}
                  </div>
                </div>
                <div style={{ height: '60%' }}>
                  <div style={{
                    width: '25%',
                    height: '103%',
                    float: 'left',
                    borderRight: '1px dashed #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: ['left', 'center']
                  }}>
                    <span style={{
                      fontSize: ['16px', '20px'],
                      marginTop: '0.5vh',
                      marginBottom: '0',
                      marginRight: ['-4px', '-10px', '-16px']
                    }}>Total Dev time Required </span>
                    <span style={{
                      fontSize: ['32px'],
                      marginTop: ['-8px', '-16px'],
                      marginLeft: ['-8px', '-12px'],
                      fontWeight: '500'
                    }}>
                      {details.totalDevTimeRequired}
                    </span>
                    <span style={{
                      fontSize: ['16px', '20px'],
                      marginTop: ['-8px', '-16px'],
                      marginLeft: ['-8px', '-12px']
                    }}>hours</span>
                  </div>
                  <div
                      style={{
                        width: "10%",
                        height: "103%",
                        float: "left",
                        borderRight: "1px dashed #000",
                        backgroundColor: "#D9D9D9",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop: "-4px",
                      }}
                    >
                      <span
                        style={{
                          transform: "translateY(-60%) rotate(270deg)",
                          fontSize: ["21px"],
                          marginBottom: "1.6vh",
                          marginRight: "0.4vw",
                        }}
                      >
                          Status{" "}
                      </span>
                      <img
                        src={Vector}
                        style={{
                          marginBottom: "1vh",
                          // width: "1.25vw",
                          // height: "2.06vh",
                          height: "25px",
                          width: "25px"
                        }}
                      />
                    </div>
                

                   <div
                    className="scrollable"
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        // overflowX: "auto",
                        whiteSpace: "nowrap",
                        marginTop:"-1vw"
                      }}
                    >
                             {taskdetails
                              .filter((d) => d.moduleid === details._id)
                              .map((d, index) => (
                                <PieChartsRow
                              moduleName={"Task"+(index + 1)}
                              completed={20} assigned={30} unassigned={70} 
                              time={d.taskTime}
                            /> ))}
                </div> 
                </div>
                
              </Grid>
              <Grid item xs={12} sm={2.5} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#D9D9D9',
                borderRadius: '0 8px 8px 0',
              }}>
                <div style={{
                  color: '#4E4E4E',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  fontVariant: 'small-caps',
                  letterSpacing: '0.64px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  marginBottom: '8px',
                }}>
                  Due By
                </div>
                <div style={{
                  color: '#4E4E4E',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  fontVariant: 'small-caps',
                  letterSpacing: '0.64px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  marginTop: '8px',
                  marginBottom: '8px',
                }}>
                 {details.moduleDateEnd.substring(0, 10)}
                </div>
                <select
                  name="cars"
                  id="cars"
                  style={{
                    width: '145px',
                    height: '24px',
                    flexShrink: 0,
                    borderRadius: '4px',
                    background: '#FFF',
                    boxShadow:
                      '2px 2px 4px 0px rgba(0, 0, 0, 0.25) inset, -2px -2px 4px 0px rgba(0, 0, 0, 0.25) inset',
                  }}
                >
                  <option value="volvo">Team 1</option>
                  <option value="saab">Team 2</option>
                  <option value="opel">Team 3</option>
                </select>
              </Grid>
            </Grid>
            {/* <div style={{ marginTop: "-6.2vw" ,display: "flex", justifyContent: "flex-end"}}>
              <RadioGroup>
                <FormControlLabel value="radio1" control={<Radio />} />
                <FormControlLabel value="radio2" control={<Radio />} />
                <FormControlLabel value="radio3" control={<Radio />} />
              </RadioGroup>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Modulecard;
