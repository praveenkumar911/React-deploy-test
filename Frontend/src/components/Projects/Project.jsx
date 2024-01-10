import * as React from "react";
import TopBar from "../TopBar/TopBar";
import Grid from "@mui/material/Grid";
import healthcare from "../project/healthcare.svg";
import education from "../project/education.svg";
import Livelihood1 from "../project/rural.svg"
import Vector from "../project/Vector.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import gitlab from "../project/gitlab.svg";
import { Box, Dialog,DialogContent, } from "@mui/material";
import { useNavigate } from "react-router-dom";

import './project.css'
import Button from '@mui/material/Button';
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import PieChartsRow from "./Chart";
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

import InputAdornment from '@mui/material/InputAdornment';
import Page from "./createproject";
export const Project = () => {
  
  const [moduleDetails, setModuleDetails] = useState([]);
  const [projectdata, setProjectData] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterMenuShown, setIsFilterMenuShown] = useState(false);
  const [originalProjectData, setOriginalProjectData] = useState([]); 
  const [filteredProjectData, setFilteredProjectData] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [orgImgUrl, setOrgImgUrl] = useState({});
  const [projectdata1,setProjectData1]=useState([]);
  const permissionString = sessionStorage.getItem('permissions');
  const entityID=sessionStorage.getItem('entityID')
  const permissions = permissionString ? permissionString.split(',') : [];
  const [orgproject,setOrgproject]=useState()
  console.log(permissions);
  console.log("dfghjk",orgproject);
  const isP001Allowed = permissions.includes('P001'); 
  const isP002Allowed = permissions.includes('P002');
  const isP003Allowed = permissions.includes('P003');
  const isP004Allowed = permissions.includes('P004');

  const [selectedFilters, setSelectedFilters] = useState({
    projectOwner: "",
    totalDevTimeRequired: "",
    projectField: "",
    skillsRequired: "",
  });
  /* const handleSearch = () => {
    axios
      .get("http://localhost:5030/filter-project-DB", {
        params: { ...selectedFilters, searchQuery },
      })
      .then((response) => {
        setFilteredProjectData(response.data);
        setIsFilterApplied(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }; */
/* 
  const handleApplyFilter = () => {
    axios
      .get("http://localhost:5030/filter-project-DB", {
        params: { ...selectedFilters, searchQuery },
      })
      .then((response) => {
        setFilteredProjectData(response.data);
       // setIsFilterApplied(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }; */
  const handleSearch = () => {
    if (isP002Allowed && !isP001Allowed && !isP003Allowed && !isP004Allowed) {
      axios
        .get(`http://localhost:5030/get-user/${entityID}`)
        .then((userResponse) => {
          const userOrgID = userResponse.data[0].OrgID;
  
          axios
            .get("http://localhost:5030/filter-project-DB", {
              params: { ...selectedFilters, searchQuery },
            })
            .then((response) => {
              // Filter the results based on the user's organization ID
              const filtered = response.data.filter((project) => {
                return orgproject[project.projectOwner] === userOrgID;
              });
  
              setFilteredProjectData(filtered);
              setIsFilterApplied(true);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error('Error getting user data:', error);
        });
    } else if (isP001Allowed) {
      axios
        .get("http://localhost:5030/filter-project-DB", {
          params: { ...selectedFilters, searchQuery },
        })
        .then((response) => {
          setFilteredProjectData(response.data);
          setIsFilterApplied(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  
  const handleApplyFilter = () => {
    if (isP002Allowed && !isP001Allowed && !isP003Allowed && !isP004Allowed) {
      axios
        .get(`http://localhost:5030/get-user/${entityID}`)
        .then((userResponse) => {
          const userOrgID = userResponse.data[0].OrgID;
  
          axios
            .get("http://localhost:5030/filter-project-DB", {
              params: { ...selectedFilters, searchQuery },
            })
            .then((response) => {
              // Filter the results based on the user's organization ID
              const filtered = response.data.filter((project) => {
                return orgproject[project.projectOwner] === userOrgID;
              });
  
              setFilteredProjectData(filtered);
              // setIsFilterApplied(true);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error('Error getting user data:', error);
        });
    } else if (isP001Allowed) {
      axios
        .get("http://localhost:5030/filter-project-DB", {
          params: { ...selectedFilters, searchQuery },
        })
        .then((response) => {
          setFilteredProjectData(response.data);
          // setIsFilterApplied(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
   

  useEffect(() => {
    handleSearch();
  }, [selectedFilters]); 

  const handleSearchEnter = (e) => {
  if (e.key === 'Enter') {
    handleApplyFilter();
    setIsFilterApplied(true);
  }
};

const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
  if (e.target.value === '') {
    // If the search query is empty, reset the view
    setFilteredProjectData(originalProjectData);
    setIsFilterApplied(false);
  }
};

  

  const handleFilterIconClick = () => {
    setIsFilterMenuShown(!isFilterMenuShown);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  React.useEffect(() => {
    axios
      .get("http://localhost:5030/get-allmodules")
      .then((res) => {
        setModuleDetails(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

   useEffect(() => {
    axios
      .get("http://localhost:5030/get-project-DB")
      .then((response) => {
        // setOriginalProjectData(response.data);
         setFilteredProjectData(response.data); 
        setProjectData1(response.data)
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); 
  useEffect(() => {
    // Fetch user data based on the entity ID
    axios
      .get(`http://localhost:5030/get-user/${entityID}`)
      .then((userResponse) => {
        const userOrgID = userResponse.data[0].OrgID;

        if (isP002Allowed && !isP001Allowed && !isP003Allowed && !isP004Allowed) {
          // Fetch projects based on the user's organization ID
          axios
            .get("http://localhost:5030/get-project-DB")
            .then((response) => {
              //setProjectData1(response.data)
              const filtered = response.data.filter((project) => {
                return orgproject[project.projectOwner] === userOrgID;
              });
              console.log(filtered);
              setOriginalProjectData(filtered);
              setFilteredProjectData(filtered);
              setProjectData(filtered);
            })
            .catch((error) => {
              console.error(error);
            });
        } else if (isP001Allowed) {
          // Fetch all projects
          axios
            .get("http://localhost:5030/get-project-DB")
            .then((response) => {
              setOriginalProjectData(response.data);
              setFilteredProjectData(response.data);
              setProjectData(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        }
        // Add more conditions as needed for other permissions

      })
      .catch((error) => {
        console.error('Error getting user data:', error);
      });
  }, [entityID, orgproject, isP001Allowed, isP002Allowed, isP003Allowed, isP004Allowed]);

  useEffect(() => {
    // Fetch organization data for each project
    projectdata1.forEach((project) => {
      const projectOwner = project.projectOwner;
      if (projectOwner) {
        axios
          .get(`http://localhost:5030/organization/${projectOwner}`)
          .then((response) => {
            const imgUrl = response.data.ImgUrl;
            const orgID=response.data.orgID;
            // Use the imgUrl appropriately, e.g., store it in a state variable or use it directly
            // For simplicity, let's assume you want to store the imgUrl for each project
            setOrgImgUrl((prevOrgImgUrl) => ({
              ...prevOrgImgUrl,
              [projectOwner]: imgUrl,
            }));
            setOrgproject((prevOrgproject) => ({
              ...prevOrgproject,
              [projectOwner]: orgID,
            }));
          })
          .catch((error) => {
            console.error('Error getting organization data:', error);
          });
      }
    });
  }, [projectdata1]);
  
  
  const [isAlignCenter, setIsAlignCenter] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    organisations: [],
    fields: [],
    skills: [],
    timeRequired: [],
  });
  

  // Update filter options when projectdata prop changes
  React.useEffect(() => {
    const orgSet = new Set();
    const fieldSet = new Set();
    const skillSet = new Set();
    const timeSet = new Set();
    projectdata1.forEach((project) => {
      orgSet.add(project.projectOwner);
      fieldSet.add(project.projectField);
      project.skillsRequired.forEach((skill) => skillSet.add(skill.name));
      timeSet.add(project.totalDevTimeRequired);
    });
    setFilterOptions({
      organisations: orgSet,
      fields: fieldSet,
      skills: skillSet,
      timeRequired: timeSet,
    });
  }, [projectdata1]);
  
    const handleClearFilters = () => {
      setSelectedFilters({
        projectOwner: "",
        totalDevTimeRequired: "",
        projectField: "",
        skillsRequired: "",
      });
    
      // Reset filtered data to original data
      //setSearchQuery('')
    
    
    
  
    // Reset filter options to default values
    const orgSet = new Set();
    const fieldSet = new Set();
    const skillSet = new Set();
    const timeSet = new Set();
    projectdata1.forEach((project) => {
      orgSet.add(project.projectOwner);
      fieldSet.add(project.projectField);
      project.skillsRequired.forEach((skill) => skillSet.add(skill.name));
      timeSet.add(project.totalDevTimeRequired);
    });
  
    setFilterOptions({
      organisations: orgSet,
      fields: fieldSet,
      skills: skillSet,
      timeRequired: timeSet,
    });
  
    // Fetch all projects again
    /* axios
      .get("http://localhost:5030/filter-project-DB", {
        params: { ...selectedFilters, searchQuery },
      })
      .then((response) => {
       
        setFilteredProjectData(response.data);
       // setIsFilterApplied(true);
      })
      .catch((error) => {
        console.error(error);
      }); */
      
  };
  
  
 
  const boxStyle = {
    border: '1px dashed #000',
    padding: '10px',
    margin: '10px',
    width: '71.9vw',
    height: '20.5vh', 
    background: '#4E4E4E',
    display: 'flex',
    flexDirection: 'row',// Change to row to display boxes side by side
    justifyContent: 'center', // Center the boxes horizontally
    alignItems: 'center',
    borderRadius: '8px',
    marginLeft: '10vw',
    marginTop: '-1vw',
    '@media (max-width: 1000px)': {
      minWidth: '1000px',
      overflowX: 'auto',
      overflowY:"hidden" 
    },
  };

  const buttonStyle = {
    width: '92px',
    height: '32px',
    borderRadius: '15px',
    border: '1px solid #000',
    background: '#D9D9D9',
    '@media (max-width: 800px)': {
      minWidth: '1200px',
      overflowX: 'auto',
      overflowY:"hidden" 
    },
    
  };

  const squareStyle1 = {
    width: '71.4vw',
    height: '10.2vh',
    background: '#fff',
    margin: '0 2%', // Decrease the margin between boxes
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed #000',
    borderRadius: '8px',
    '@media (max-width: 800px)': {
      minWidth: '800px',
      overflowX: 'auto',
      overflowY:"hidden" 
    },
  };

  const radioContainerStyle = {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  };

  const radioStyle = {
    transform: 'scale(1.5)',
    marginRight: '10px',
  };

  const labelStyle = {
    display: 'inline-block',
    padding: '3px 10px',
    backgroundColor: '#FFF',
    color: '#000',
    border: '1px solid #000',
    borderRadius: '20px',
    marginRight: '10px',
    fontSize: '12px',
    textAlign: 'center',
    fontWeight: 400,
    lineHeight: '1',
    width: '120px',
    '@media (max-width: 800px)': {
      minWidth: '1200px',
      overflowX: 'auto',
      overflowY:"hidden" 
    },
  };
  

  return (
    
    <div >
      <TopBar style={{ width: '100%' }}/>
      {isP001Allowed && (
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
      Create Project
    </Button>)}

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      <TextField
      type="text"
      placeholder="Search"
      value={searchQuery}
      onChange={handleSearchChange}
      onKeyDown={handleSearchEnter}
      variant="outlined"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <FilterListOutlinedIcon onClick={handleFilterIconClick} />
          </InputAdornment>
        ),
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
        {isFilterMenuShown && (
       <Grid sx={boxStyle}>
       <Grid sx={{ ...squareStyle1, textAlign: 'left' }}>
         <h4 style={{  }}>Filter By:</h4>
         <div style={{ ...radioContainerStyle,  }}>
           <div style={radioStyle}>
           </div>
           <label>
             <select style={labelStyle} name="labelDropdown" value={selectedFilters.projectOwner}  onChange={(e) =>
      setSelectedFilters({ ...selectedFilters, projectOwner: e.target.value })
    } >
               <option value="" >Organisation</option>
               {[...filterOptions.organisations].map((value) => (
                 <option key={value} value={value} >
                   {value}
                 </option>
               ))}
             </select> 
           </label>
         </div>
         <div style={{ ...radioContainerStyle,  }}>
           <div style={radioStyle}>
           </div>
           <label>
             <select style={labelStyle} name="labelDropdown" value={selectedFilters.projectField} onChange={(e) =>
      setSelectedFilters({ ...selectedFilters, projectField: e.target.value })
    } >
               <option value="">Field</option>
               {[...filterOptions.fields].map((value) => (
                 <option key={value} value={value}>
                   {value}
                 </option>
               ))}
             </select>
           </label>
         </div>
         <div style={{ ...radioContainerStyle, }}>
           <div style={radioStyle}>
           </div>
           <label>
             <select style={labelStyle} name="labelDropdown" value={selectedFilters.skillsRequired}  onChange={(e) =>
      setSelectedFilters({ ...selectedFilters, skillsRequired: e.target.value })
    } >
               <option value="">Skills Required</option>
               {[...filterOptions.skills].map((value) => (
                 <option key={value} value={value}>
                   {value}
                 </option>
               ))}
             </select>
           </label>
         </div>
         <div style={{ ...radioContainerStyle,  }}>
           <div style={{ ...radioStyle, marginTop: '-4px' }}>
           </div>
           <label>
           <select style={labelStyle} name="labelDropdown" value={selectedFilters.totalDevTimeRequired} onChange={(e) =>
      setSelectedFilters({ ...selectedFilters, totalDevTimeRequired: e.target.value })
    }>
    <option value="">Total Time Required</option>
  <option value="0-50">0-50</option>
  <option value="50-100">50-100</option>
  <option value="100-150">100-150</option>
  <option value="150-250">150-250</option>
  <option value="250-20000">{'>250'}</option>
</select> 

           </label>
         </div>
       </Grid>
       <div style={{marginLeft:"1vw"}}> 
       <button style={{...buttonStyle ,marginTop:'2px'}} onClick={handleClearFilters}>
           Clear
         </button><br/>
         {/* <button style={{...buttonStyle,marginTop:'35px'}} onClick={handleApplyFilter}>
           Apply
         </button> */}
       
        </div>
       </Grid>      )}</div>

              {isFilterApplied && (searchQuery || Object.values(selectedFilters).some((filter) => filter !== "")) && (
  <div>
    <h7 style={{marginLeft:"5vw"}}>
      Filtered Results: {searchQuery}
      {Object.entries(selectedFilters).map(([label, filter]) => {
        if (filter) {
          let labelText = "";
          switch (label) {
            case "projectOwner":
              labelText = "Organization";
              break;
            case "projectField":
              labelText = "Field";
              break;
            case "skillsRequired":
              labelText = "Skills";
              break;
            case "totalDevTimeRequired":
              labelText = "Total Time";
              break;
            default:
              break;
          }
          return `, ${labelText}: ${filter}`;
        }
        return null;
      })}
    </h7>
  </div>
)}



      <div>
        <div>
        {filteredProjectData &&
  filteredProjectData.map((project) => (
              <Grid
                container
                spacing={0}
                key={project.projectCreatedBy}
                sx={{
                  width: "94%",
                  height:"240px",
                  maxWidth: "79.17vw",
                  marginLeft: "5vw",
                  marginTop: "2vw",
                  border: "2px dotted #000", // add dotted border
                  borderRadius: "8px",
                  marginRight: "1vw", // add border radius
                  '@media (max-width: 1000px)': {
                    minWidth: '1200px',
                    overflowX: 'auto',
                    overflowY:"hidden" 
                  },
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={1.5}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#D9D9D9",
                    borderRadius: "8px 0 0 8px",
                  }}
                >
                  <img
    src={
      project.projectField === 'education'
        ? education
        : project.projectField === 'livelihood'
        ? Livelihood1
        : project.projectField === 'healthcare'
        ? healthcare
        : '' // You can specify a default image if none of the conditions match.
    }
    alt={
      project.projectField === 'education'
        ? 'Education'
        : project.projectField === 'livelihood'
        ? 'Livelihood'
        : project.projectField === 'healthcare'
        ? 'Healthcare'
        : 'Default Alt Text' // Set a default alt text.
    }
    style={{
      width: '15vw',
      height: '15vh',
      maxWidth: '100%',
      maxHeight: '100%',
      cursor:'pointer',
    }}
    onClick={() => {
      navigate("/module/" + project._id);
    }}
  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={3.5}
                  sx={{
                    borderLeft: "1px dashed #000",
                    borderRight: ["none", "1px dashed #000"],
                    padding: ["8px", "10px", "12px"],
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start", // Align items to the top
                    
                  }}
                >
                  <div sx={{ textAlign: "left" }}>
                    <h4
                      style={{  margin: "-10px 8px 12px -10px" ,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'text-decoration 0.3s ease-in-out',
                      marginLeft:'0.2vw' // Optional for smooth transition
                    }}
                    onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                    onClick={() => {
                      navigate("/module/" + project._id);
                    }}
                    >
                      {project.projectName}
                    </h4>

                    <div style={{minHeight: "120px",overflowX:"scroll"}}>
                    <div style={{height: "20px"}}>

                    <p
                      sx={{
                      //   margin: "6px 4px 0 4px",
                      cursor:'pointer',
                        width: "50px",
                    
                    
                      }}
                      onClick={() => {
                        navigate("/module/" + project._id);
                      }}
                    >
                      {project &&
                      project.projectDescription &&
                      project.projectDescription.length > 250
                        ? project.projectDescription.substring(0, 250) + "..."
                        : project.projectDescription}
                    </p>
                    </div>
                   
                    </div>
                    <img
                      src={gitlab}
                      alt="GitLab"
                      style={{ width: "24px", height: "24px", marginTop: "20px" ,cursor:'pointer'}}
                      onClick={() => {
                        window.open(project.GitWebUrl, "_blank");
                      }}
                    />
                  </div>
                  {/* <p style={{alignContent:"right", marginLeft:"40px"}}>
                    Date created: {new Date(project.projectDateCreated).toLocaleDateString()}
                  </p> */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  sx={{
                    borderRight: ["none", "1px dashed #000"],
                    position: "relative",
                    textAlign: ["left", "center"],
                    display: "flex",
                    flexDirection: "column", // add flex direction
                    justifyContent: "space-between", // add justify content
                  }}
                >
                  <div
                    style={{
                      height: "40%",
                      borderBottom: "1px dashed #000",
                      display: "flex",
                      flexDirection: "column",
                      margin: "0 0 4px 0",
                      alignItems: "flex-start", // align text to left
                      justifyContent: "flex-start",
                      cursor:'pointer' // align text to top
                    }}
                    onClick={() => {
                      navigate("/module/" + project._id);
                    }}
                  >
                    <p
                      style={{
                        paddingLeft: "10px",
                        paddingTop: "10px",
                        marginTop: "-6px", // move "Skills Required" text up
                        marginBottom: "4px",
                        fontWeight: "500",
                      }}
                    >
                      Skills Required
                    </p>
                    <div
                     className="scrollable"
                      style=
                      {{
                        display: "flex",
                        height: "40px",
                        width: "91%",
                       // overflow:"auto",
                        marginTop: "10px",
                        marginLeft: "20px",
                      }}
                    >
                      {project.skillsRequired.map((item) => (
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
                  <div style={{ height: "60%" }}>
                    <div
                      style={{
                        width: "25%",
                        height: "100%",
                        float: "left",
                        borderRight: "1px dashed #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        textAlign: ["left", "center"],
                        cursor:'pointer'
                      }}
                      onClick={() => {
                        navigate("/module/" + project._id);
                      }}
                    >
                      <span
                        style={{
                          fontSize: ["16px", "20px"],
                          marginTop: "0.5vh",
                          marginBottom: "0",
                          marginRight: ["-4px", "-10px", "-16px"],
                          cursor:'pointer'
                        }}
                        onClick={() => {
                          navigate("/module/" + project._id);
                        }}
                      >
                        Total Dev time Required{" "}
                      </span>
                      <span
                        style={{
                          fontSize: ["32px"],
                          marginTop: ["-8px", "-16px"],
                          marginLeft: ["-8px", "-12px"],
                          fontWeight: "500",
                        }}
                      >
                        {project.totalDevTimeRequired}
                      </span>
                      <span
                        style={{
                          fontSize: ["16px", "20px"],
                          marginTop: ["-8px", "-16px"],
                          marginLeft: ["-8px", "-12px"],
                        }}
                      >
                        hours
                      </span>
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
                        Status
                      </span>
                      <img
                        src={Vector}
                        style={{
                          marginBottom: "0.5vh",
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
                   {moduleDetails 
                        .filter((details) => details.projectid === project._id)
                        .map((details, index) => (
                          <PieChartsRow  moduleName={"Module" +(index + 1)}  time={details.totalDevTimeRequired} completed={20} assigned={30} unassigned={70} />
                        ))}
                        </div> 
                    
                </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#D9D9D9",
                    borderRadius: "0 8px 8px 0",
                    cursor:'pointer',
                  }}
                  onClick={() => {
                    navigate("/module/" + project._id);
                  }}
                >
                  <img
                   src={orgImgUrl[project.projectOwner]}
                   alt="Organization Logo"
                    style={{
                      width: '15vw',
                      height: '15vh',
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }}
              />
                </Grid>
              </Grid>
            ))}
        </div>
        <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
          <Page />
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default Project;
