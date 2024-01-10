import * as React from "react";
import TopBar from "../TopBar/TopBar";
import Grid from "@mui/material/Grid";
import Vector from "../project/Vector.svg";
import { useState,useEffect} from "react";
import axios from "axios";
import gitlab from "../project/gitlab.svg";
import {Dialog,DialogContent, } from "@mui/material";

import notes from "../project/notes.svg";
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

import CreateTeam from "../Projects/createTeam";
const Groups = () => {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [orgdata,setOrgdata]=useState()
  const permissionString = sessionStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const entityID=sessionStorage.getItem('entityID')
  const isP001Allowed = permissions.includes('P001');
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004')
  const handleOpen = () => {
    setOpen(true); 
  };

  const handleClose = () => { 
    setOpen(false);
  };
  useEffect(() => {
    // Fetch all teams data 
    axios.get(`http://localhost:5030/get-org/${entityID}`)
      .then(response => {
        setOrgdata(response.data);
      })
      .catch(error => {
        console.error('Error fetching teams data:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch all teams data 
    axios.get('http://localhost:5030/get-all-teams')
      .then(response => {
        setTeams(response.data);
      })
      .catch(error => {
        console.error('Error fetching teams data:', error);
      });
  }, []);
  return (
    <>
    <div >
      <TopBar style={{ width: '100%' }}/>
     {( isP001Allowed &&
      <Button
      variant="outlined"
      sx={{
        // size:"xl",
        width: '95vw',
        height: 'auto',
        maxWidth: '79.17vw',
        minHeight: '4.5vh',
        borderRadius: '4px',
        background: '#D9D9D9',
        boxShadow:
          '2px 2px 4px 0px rgba(0, 0, 0, 0.25) inset, -2px -2px 4px 0px rgba(0, 0, 0, 0.25) inset',
        marginTop: '2vw',
        marginLeft: '5vw',
        marginRight: '5vw', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        '@media (max-width: 1000px)': {
          minWidth: '1200px',
          overflowX: 'auto',
          overflowY: 'hidden'
        },
     
      }}
      startIcon={<AddIcon fontSize="large"  />}
      onClick={handleOpen}
      style={{ color: 'black' }}
    >
      Add team
    </Button>

     )}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      <TextField
      type="text"
      placeholder="Search"
      variant="outlined"
      fullWidth
      InputProps={{
        sx: {
          width: '95%',
          height: '4vh',
          maxWidth: '79.17vw',
          borderRadius: '32px',
          marginTop: '2vw',
          marginLeft: '5vw',
          marginRight: '1vw',
          marginBottom: '1vw',
          fontSize: '16px',
          paddingLeft: '0.52vw',
          paddingBottom: '0.87vh',
          paddingTop: '0.87px',
           cursor: 'pointer',
          '@media (max-width: 1000px)': {
            minWidth: '1200px',
            overflowX: 'auto', 
            overflowY: 'hidden'
          },
        },
      }}
    />
</div>

 


<div>
  <Grid >
  {teams.map((team, index) => (
     (entityID === team.OrgId || team.UserIDs.includes(entityID)) && (isP002Allowed) &&
    <div key={index}>
      <Grid container spacing={1.5} sx={{
        maxWidth: '79vw',
        margin: '2vw auto',
        border: '2px dotted #000',
        borderRadius: '8px',
        height: '82px',
        maxHeight:"90px",
        marginLeft: "5vw",
        position: 'relative',
        '@media (max-width: 1000px)': { 
          minWidth: '1200px',
          overflowX: 'auto',
          overflowY: 'hidden'
        },
      }}>
         <Grid item xs={2} sm={1} sx={{
          position: "sticky",
          top: 0,
          borderRight: '1px dashed #000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          borderRadius: '8px 0 0 8px',
          position: 'relative',
          backgroundColor: "#D9D9D9"
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', }}>
       Company Logo
          </div>
        </Grid>
        <Grid item xs={2} sm={2} sx={{
          borderLeft: '1px dashed #000',
          borderRight: '1px dashed #000',
          padding: ['8px', '10px', '12px'],
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          overflowX: "auto" 
        }}>
         
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: "flex-start",
            justifyContent: "center",
            color: '#4E4E4E',
            fontSize: "20px",
            fontFamily: "roboto",
            fontWeight: "500",
            marginTop: "-8px",
          }}>
         {team.TeamName}
           
           <div style={{display: "flex",alignItems: "center",justifyContent: "center"}}>
           {team.UserIDs.map((userId, idIndex) => (
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
              marginTop:"10px"
            }}
            >
              {userId}
    {/* {data1.taskDescription.length > 220 ? data1.taskDescription.substring(0, 60) + "..." : data1.taskDescription} */}
</div>
  ))}
</div>

          </div>
         
        </Grid>
        <Grid item xs={2} sm={3} sx={{
  borderRight: '1px dashed #000',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  borderRadius: '0',
  padding: '8px',
}}>
  <div style={{ display: "flex", flexDirection: "column", marginTop: "-8px", maxWidth: "100%", overflowX: "auto" }}>
    <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between", gap: "10px" }}>
      <div style={{ color: "#4e4e4e", fontSize: "18px", fontWeight: "500", fontFamily: "roboto" }}>
        Skills
      </div>
      <div style={{ flexWrap: "nowrap" }}>
        {/* Adjustments to prevent elements from dropping down */}
       
        <div style={{ display: "flex", gap: "5px" }}>
        {team.TeamSkills.map((skill, skillIndex) => (
          <div
            key={skillIndex}
            style={{
              padding: "4px 12px",
              backgroundColor: "#FFF",
              color: "#000",
              border: "1px solid #000",
              borderRadius: "20px",
              fontSize: "12px",
              textAlign: "center",
              fontWeight: 400,
              lineHeight: "1",
              whiteSpace: "nowrap",
              margin: "0 5px",
            }}
          >
            {skill}
          </div>
        ))}
      </div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-start", flexDirection: "row", gap: "25px", marginTop: "10px" }}>
      <div>
        <img
          src={Vector}
          style={{
            marginBottom: "0.5vh",
            height: "25px",
            width: "25px"
          }}
        />
      </div>
      <div style={{ color: '#4E4E4E', fontSize: 16, fontFamily: 'Roboto', fontWeight: '400', textTransform: 'capitalize' }}>
        {team.AvailabilityTime} Hours per Month
      </div>
    </div>
  </div>
</Grid>

        <Grid item xs={2} sm={4.5} sx={{
  borderLeft: '1px dashed #000',
  borderRight: '1px dashed #000',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: "center",
  borderRadius: '0',
  padding: '8px',
  // backgroundColor: "#D9D9D9"
}}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", }}>
    <div style={{ color: "#4e4e4e", fontFamily: "roboto", fontSize: "20px", whiteSpace:"nowrap" }}>
      Active Projects 1

    </div>
    <div style={{ color: "#4e4e4e", fontFamily: "roboto", fontSize: "20px",whiteSpace:"nowrap"  }}>
      Completed Projects 2
     
    </div>
  </div>
</Grid>

        <Grid item xs={2} sm={1.5} sx={{
          borderLeft: '1px dashed #000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: "center",
          borderRadius: '0 8px 8px 0',
          padding: '8px',
          backgroundColor: "#4E4E4E"
        }}>
          <div style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
           {/*  <img src={notes} alt="Notes" style={{ width: '48px', height: '48px', marginTop: '-5px',cursor:'pointer',color: "#F6F4F4" }} /> */}
            <img src={gitlab} alt="GitLab" style={{ width: '48px', height: '48px', marginTop: '-5px',cursor:'pointer' }}  onClick={() => {
                        window.open(team.web_url, "_blank");
                      }}  />
          </div>
        </Grid>
      </Grid> 
    </div>
      ))}
  </Grid>

</div>


   
        <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
     
       <CreateTeam/>
     
        </DialogContent>
      </Dialog>
      </div>
  </>
  );
};

export default Groups;