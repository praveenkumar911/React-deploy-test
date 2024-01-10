import React, { useState } from "react";
import Topbar2 from "./Topbar2";
import { useParams } from "react-router-dom";
import Modulecard from "./Modulecard";
import healthcare from "../project/healthcare.svg";
import trash from "../project/trash.svg";
import notes from "../project/notes.svg";
import gitlab from "../project/gitlab.svg";
import { Grid,Dialog,DialogContent, } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ModifiedCard from "./modifiedcard";
import Button from '@mui/material/Button';
import ModulePage from "./createmodule";

export const Module = () => {
  const { project } = useParams();
  const[open,setOpen]=useState(false);
  const[open1,setOpen1]=useState(false);
  const permissionString = sessionStorage.getItem('permissions');
  const permissions = permissionString ? permissionString.split(',') : [];
  const entityID=sessionStorage.getItem('entityID')
  const isP001Allowed = permissions.includes('P001');
  const[projectarray,setprojectarray]=useState() 
  useEffect(() => {
    if (isP001Allowed) {
      const fetchNgosForEntity = async () => {
        try {
          const res = await axios.get(`http://10.8.0.13:5030/get-org/${entityID}`);
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
  const isbelongsto = projectarray && projectarray.includes(project);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };
 
  return (
    <div>
      <Topbar2/>
      <Grid container xs={12} md={12} xl={12} sm={12} >
          <Grid item xs={12} md={7.25} xl={12} sm={7.25} style={{ marginLeft: "8vw", marginTop: "5vh", }} sx={{'@media (max-width: 1550px)': {
            minWidth: '1200px',
            overflowX: 'auto', 
            overflowY: 'hidden'
          },}} >
          
   <ModifiedCard project={project}/>
            
          </Grid>

        

        </Grid>
     
        {isP001Allowed && isbelongsto &&( 
    
     <Button
        sx={{
          width: '94%',
          height: 'auto',
          maxWidth: '79.17vw',
          minHeight: '42px',
          borderRadius: '4px',
          background: '#D9D9D9',
          boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.25) inset, -2px -2px 4px 0px rgba(0, 0, 0, 0.25) inset',
          marginTop: '2vw',
          marginLeft: '8vw',
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
        onClick={handleOpen1}
        // onClick={togglePopup}
      >
          <span style={{ marginRight: '0.42vw', fontSize: '24px', color: 'black' }}>+ ADD Module</span>
      </Button>
        )}
      <Dialog open={open1} onClose={handleClose1} maxWidth="xl" >
      <DialogContent>
  <ModulePage projectId={project}  responsive/>
  </DialogContent>
  
</Dialog>
      <Modulecard project={project} />
    </div>
  );
};  