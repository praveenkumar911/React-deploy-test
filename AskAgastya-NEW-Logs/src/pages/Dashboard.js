import * as React from 'react';
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';
import {
  Button,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ReactPlayer from 'react-player';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import UndoIcon from '@mui/icons-material/Undo';
import './data.css';
import axios from 'axios'

const useStyles = makeStyles({
  wrapText: {
    whiteSpace: 'normal !important',
    wordWrap: 'break-word !important',
  },
});

const SpeechFile = ({ audioUrl }) => {
  const [playing, setPlaying] = React.useState(false);

  const togglePlaying = () => {
    setPlaying(!playing);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton color="primary" onClick={togglePlaying}>
        {playing ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <ReactPlayer
        url={audioUrl}
        width="0px"
        height="0px"
        playing={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </div>
  );
};

const TtsOutput = ({ audioUrl }) => {
  const [playing, setPlaying] = React.useState(false);

  const togglePlaying = () => {
    setPlaying(!playing);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton color="primary" onClick={togglePlaying}>
        {playing ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <ReactPlayer
        url={audioUrl}
        width="0px"
        height="0px"
        playing={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </div>
  );
};
const CustomCheckbox = ({ checked, onChange }) => {
  const [isChecked, setIsChecked] = React.useState(checked);
  const [thumbUpColor, setThumbUpColor] = React.useState('disabled');
  const [thumbDownColor, setThumbDownColor] = React.useState('disabled');

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
    onChange(event.target.checked);
  };

  const handleThumbUpClick = () => {
    setThumbUpColor('success');
    setThumbDownColor('disabled');
  };

  const handleThumbDownClick = () => {
    setThumbDownColor('error');
    setThumbUpColor('disabled');
  };

  const handleUndoClick = () => {
    setThumbUpColor('disabled');
    setThumbDownColor('disabled');
    setIsChecked(false);
    onChange(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {isChecked ? (
        <IconButton color="undo" onClick={handleUndoClick}>
          <UndoIcon />
        </IconButton>
      ) : (
        <>
          <IconButton color={thumbUpColor} onClick={handleThumbUpClick}>
            <ThumbUpIcon />
          </IconButton>
          <IconButton color={thumbDownColor} onClick={handleThumbDownClick}>
            <ThumbDownIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};


export default function DataTable() {
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadedPages, setLoadedPages] = React.useState([]);
  
const columns = [
  {
    field: 'date',
    headerName: 'Date',
    width: 95,
    sortable: false,
  },
  {
    field: 'time',
    headerName: 'Time',
    width: 95,
    sortable: false,
  },
  {
    field: 'from_mobile',
    headerName: 'Caller-Number',
    width: 120,
    cellClassName: 'wrap-text',
    sortable: false,
  },
  {
    field: 'grade',
    headerName: 'Class',
    width: 60,
    sortable: false,
  },
  {
    field: 'subject',
    headerName: 'Subject',
    width: 70,
    sortable: false,
  },
  {
    field: 'audio_url',
    headerName: 'Speech File',
    width: 100,
    renderCell: (params) => <SpeechFile audioUrl={params.value} />,
    sortable: false,
  },
  {
    field: 'thumbs',
    headerName: '',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <CustomCheckbox
        checked={params.row.thumbs}
      />
    ),
  },
  {
    field: 'original_asr',
    headerName: 'Asr Telugu Text',
    width: 250,
    headerClassName: 'wrap-text',
    cellClassName: 'wrap-text auto-expand',
    sortable: false,
  },
  {
    field: 'thumbs',
    headerName: '',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <CustomCheckbox
        checked={params.row.thumbs}
      />
    ),
  },
  {
    field: 'original_translation',
    headerName: 'MT English Text',
    width: 250,
    headerClassName: 'wrap-text',
    cellClassName: 'wrap-text auto-expand',
    sortable: false,
  },
  {
    field: 'thumbs',
    headerName: '',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <CustomCheckbox
        checked={params.row.thumbs}
      
      />
    ),
  },
  {
    field: 'subtl_summ',
    headerName: 'Doc AI response',
    width: 250,
    headerClassName: 'wrap-text',
    cellClassName: 'wrap-text auto-expand',
    sortable: false,
  },
  {
    field: 'thumbs',
    headerName: '',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <CustomCheckbox
        checked={params.row.thumbs}
      
      />
    ),
  },
  {
    field: 'subtl_summ_vern',
    headerName: 'MT Text Telugu',
    width: 250,
    headerClassName: 'wrap-text',
    cellClassName: 'wrap-text auto-expand',
    sortable: false,
  },
  {
    field: 'thumbs',
    headerName: '',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <CustomCheckbox
        checked={params.row.thumbs}
      
      />
    ),
  },
  {
    field: 'subtl_summ_vern_audio_url',
    headerName: 'TTS output',
    width: 100,
    cellClassName: 'wrap-text',
    renderCell: (params) => <TtsOutput audioUrl={params.value} />,
    sortable: false,
  },

  {
    field: 'thumbs',
    headerName: '',
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <CustomCheckbox
        checked={params.row.thumbs}
      
      />
    ),
  },
  
];
const fetchData = async (page, maxPages) => {
  if (page > maxPages) {
    return;
  }

  // Generate a unique cache-busting query parameter
  const cacheBuster = Date.now();

  const apiUrl = `http://askagastya.iiithcanvas.com/questions/answers/correct`;
  const params = {
    page,
    size: 100,
    rated: false,
    _cb: cacheBuster, // Add the cache-buster to the query parameters
  };
  const response = await fetch(`${apiUrl}?${new URLSearchParams(params)}`);
  const result = await response.json();
  const formattedData = result.items.map((item) => {
    const timestamp = new Date(item.timestamp);
    const day = timestamp.getDate().toString().padStart(2, '0');
    const month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
    const year = timestamp.getFullYear();
    const date = `${day}/${month}/${year}`;
    return {
      ...item,
      date,
      time: timestamp.toLocaleTimeString(),
      thumbs: false,
    };
  });
  setData((prevData) => {
    const mergedData = [...prevData, ...formattedData];
    // Remove duplicates based on ID
    return mergedData.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );
  });
  setLoading(false);
  if (result.items.length === 0) {
    return;
  }
  await fetchData(page + 1, maxPages);
};

React.useEffect(() => {
  fetchData(1, 100000000000).catch((error) => console.error(error));
}, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ height: "100%", width: '95%', justifyContent: 'center', alignItems: 'center', marginRight: '5vw' }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          disableSelectionOnClick
          disableColumnMenu
          getRowHeight={() => 'auto'}
          slots={{ toolbar: GridToolbar, export: GridToolbarExport, container: GridToolbarContainer }}
        />
      </div>
    </div>
  );
}