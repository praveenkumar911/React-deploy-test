import React from "react";
import { Card, CardContent, DialogContent, Typography } from '@mui/material';
import gitlab from "../project/gitlab.svg";
import { Grid,Dialog } from "@mui/material";
import notes from "../project/notes.svg";
import trash from "../project/trash.svg";
import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";
import EditProject1 from "./editproject1";
const ModifiedCard = (props) => { 
  const permissionString = sessionStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const entityID=sessionStorage.getItem('entityID')
  const isP001Allowed = permissions.includes('P001');
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004');
  const[projectarray,setprojectarray]=useState() 
    useEffect(() => {
      if (isP001Allowed) {
        const fetchNgosForEntity = async () => {
          try {
            const res = await axios.get(`http://localhost:5030/get-org/${entityID}`);
            // Automatically set the project owner based on the fetched organization name
            if (res.data && res.data['projects']) {
              setprojectarray(res.data['projects']);
            }
          } catch (error) {
            console.log(error);
          }
        };
        fetchNgosForEntity();
      }
    }, [isP001Allowed, entityID]);
   console.log(projectarray);
  const project=props.project
  console.log(project)
  const isbelongsto = projectarray && projectarray.includes(project);
  const navigate=useNavigate()
  const[usefulData,setusefulData]=useState();
  const[open,setOpen]=useState(false);
  const[projectData,setProjectData]=useState()
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    axios
      .post("http://localhost:5030/get-projectdata", { id: project })
      .then(async (res) => {
        setusefulData(res.data[0]);
        setProjectData(res.data);
       
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(usefulData)
  console.log(projectData)
  const handleDeleteProject = async () => {
    const projectId = usefulData._id;
  
    try {
      // Delete project in GitLab
      const response = await axios.delete(`http://localhost:5030/delete-group/${usefulData.GitlabID}`);
      console.log(response.data);
  
      // Delete project in database
      await axios.delete(`http://localhost:5030/delete-project/${projectId}`);
      console.log(`Project with ID ${projectId} deleted from database`);
  
      // Delete project ID from NGO collection
      await axios.delete(`http://localhost:5030/delete-project-from-ngo/${projectId}`);
      console.log(`Project with ID ${projectId} removed from NGO collection`);
  
      // Log successful project deletion
      const logData = {
        index: "badal",
        data: {
          message: `Project "${usefulData.projectName}" deleted successfully from GitLab, local database, and NGO collection`,
          timestamp: new Date(),
        },
      };
      await axios.post(`http://localhost:5030/log`, logData);
  
      // Redirect to dashboard
      navigate('/project')
    } catch (err) {
      console.log(err);
  
      // Log the error
      const logData = {
        index: "badal",
        data: {
          message: `Error deleting project "${usefulData.projectName}": ${err.message}`,
          timestamp: new Date(),
        },
      }; 
      await axios.post(`http://localhost:5030/log`, logData);
  
      // Show an error alert to the user
      alert(`Error deleting project "${usefulData.projectName}": ${err.message}`);
    }
  };
  return (
    <>
    {projectData && projectData.map((projects) => (
    <div style={{ display: 'flex', alignItems: 'center',}}>
      <Card style={{ width: '68%', height: '400px', position: 'relative', border: '1px dotted #000' }} sx={{ '@media (max-width: 850px)': {
                  minWidth: '1000px',
                  overflowX: 'auto', 
                  
                },}}>
        <CardContent style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <Grid container style={{ height: '100%' }}>
            {/* Top Left */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography align="left" style={{fontWeight:"bold"}}>Description</Typography>
            <Typography style={{ marginLeft: '100px', width:"150%" }}> {projects.projectDescription}</Typography>
          </Grid>
            {/* Top Right */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
      <Typography align="right">
        <span style={{ fontWeight: 'bold' }}>Date Added : </span>
        <span style={{  }}>{projects.projectDateCreated.substring(0, 10)}</span>
      </Typography>
    </Grid>
            {/* Bottom Left */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
            <div style={{ marginTop: 'auto' }}>
                <Typography align="left" style={{fontWeight:"bold"}}>Skills Required</Typography>
                {projects.skillsRequired.map((skill) => (
                <div style={{ display: "inline-block", margin: "5px", overflowX: "auto" }}>
                  <div
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
                     {skill.name}
                  </div>
                </div>
               ) )}
                <div style={{display: "flex",flexDirection: "row" ,paddingTop:" 3vh"}}>
                <div><p style={{ fontSize: "14px", alignContent: "center", alignItems: "center", fontWeight: "bold" ,  }}>TOTAL DEV <br />TIME <br /> REQUIRED</p></div>
                
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p style={{ fontSize: "32px", fontWeight: '500', margin: 0 }}>{projects.totalDevTimeRequired}</p>
                  <p style={{ fontSize: "14px", marginLeft: "5px", margin: 0 }}>hours</p>
                </div>
                </div>
                
                {/* Additional elements */}
              </div>
            </Grid>
            {/* Bottom Right */}
            <Grid item xs={6} style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <Typography align="right">
                
                <img src={gitlab} alt="GitLab" style={{ width: "48px", height: "48px", cursor: 'pointer' }} onClick={() => { window.open(projects.GitWebUrl, '_blank')}}></img>
                {isP001Allowed && isbelongsto && isP002Allowed && isP003Allowed &&(
                <img src={notes} alt="notes" style={{ width: "48px", height: "48px", cursor: 'pointer' }} onClick={handleOpen} />)}
                {isP001Allowed  && isbelongsto && isP002Allowed && isP004Allowed &&(
                <img src={trash} alt="trash" style={{ width: "48px", height: "48px", cursor: 'pointer' }} onClick={handleDeleteProject}></img>)}
              </Typography> 
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card style={{ width: '20%', height: '400px', marginLeft: '20px', border: '1px dotted #000'  }} sx={{ '@media (max-width: 850px)': {
                  minWidth: '300px',
                  overflowX: 'auto', 
                },}}></Card>
    </div>
          ))}
          <Dialog open={open} onClose={handleClose} maxWidth="md" responsive>
            <DialogContent>
        <EditProject1 projectId={project} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModifiedCard;
