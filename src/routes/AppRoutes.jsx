import { Routes, Route } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Noun from "../features/notes/English/part-of-speech/Noun";
import Pronoun from "../features/notes/English/part-of-speech/Pronoun";
import Verb from "../features/notes/English/part-of-speech/Verb";
import SubjectiveVerb from "../features/notes/English/part-of-speech/SubjectiveVerb";
import Percentage from "../features/notes/Maths/Airthmetic/Percentage";
import Menusration2D from "../features/notes/Maths/Advance/Mensuration2D";
import AncientHistory from "../features/gk/history/AncientHistory";
import Adjective from "../features/notes/English/part-of-speech/Adjective";
import Sports from "../features/gk/static/Sports";
import MedievalHistory from "../features/gk/history/MedievalHistory";
import ModernHistory from "../features/gk/history/MordernHistory";
import Adverb from "../features/notes/English/part-of-speech/Adverb";
import ProfitAndLoss from "../features/notes/Maths/Airthmetic/ProfitAndLoss";
import Discount from "../features/notes/Maths/Airthmetic/Discount";


const AppRoutes = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          overflowX: "hidden",
        }}
      >
        <Routes>
          <Route
            path="/english/grammar/pos/noun"
            element={<Noun />}
          />
           <Route
            path="/english/grammar/pos/pronoun"
            element={<Pronoun />}
          />
         <Route
            path="/english/grammar/pos/verb"
            element={<Verb />}
          />

          <Route
            path="/english/grammar/pos/sva"
            element={<SubjectiveVerb />}
          />
          <Route
            path="/english/grammar/pos/adjective"
            element={<Adjective />}
          />

          <Route
            path="/english/grammar/pos/adverb"
            element={<Adverb />}
          />

 {/* GK NOTES */}
          <Route
            path="/gk/history/ancient"
            element={<AncientHistory />}
          />
          <Route
            path="/gk/history/medieval"
            element={<MedievalHistory />}
          />
           <Route
            path="/gk/history/modern"
            element={<ModernHistory />}
          />
      


      {/* GK NOTES Static */}

          <Route
            path="/gk/static/sports"
            element={<Sports />}
          />

{/* MATHS ROUTES  */}
{/* Airthematic */}

          <Route
            path="/maths/arithmetic/percentage"
            element={<Percentage />}
          />
          <Route
            path="/maths/arithmetic/profit-and-loss"
            element={<ProfitAndLoss />}
          />
          <Route
            path="/maths/arithmetic/discount"
            element={<Discount />}
          />

          {/* Advance */}
            <Route
            path="/maths/arithmetic/mensuration2d"
            element={<Menusration2D />}
          />


         
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;