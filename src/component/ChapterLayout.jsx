import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import MindMapPage from "../features/mindMap/MindMap";
import QuickRevisionPage from "../features/QuickRevesion";
import NotesPage2 from "../features/notes/NotesPage2";
import NotesPage3 from "../features/notes/NotesPage3";




const ChapterLayout = ({ data ,type}) => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Notes" />
        <Tab label="Mind Map" />
        <Tab label="Quick Revision" />
        <Tab label="PYQ" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tab === 0 && type === "2" ? (
          <NotesPage2 data={data} />
) : (
       tab === 0 && <NotesPage3 data={data} />
)}
        {tab === 1 && <MindMapPage data={data} />}
        {tab === 2 && <QuickRevisionPage data={data}/>}
        {tab === 3 && <Box>PYQ</Box>}
      </Box>
    </Box>
  );
};

export default ChapterLayout;