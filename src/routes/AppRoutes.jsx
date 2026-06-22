import { Routes, Route } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Noun from "../features/notes/English/part-of-speech/Noun";
import Pronoun from "../features/notes/English/part-of-speech/Pronoun";
import Verb from "../features/notes/English/part-of-speech/Verb";
import SubjectiveVerb from "../features/notes/English/part-of-speech/SubjectiveVerb";
import Percentage from "../features/notes/Maths/Airthmetic/Percentage";
import Menusration2D from "../features/notes/Maths/Advance/Mensuration2D";


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



{/* MATHS ROUTES  */}
{/* Airthematic */}

          <Route
            path="/maths/arithmetic/percentage"
            element={<Percentage />}
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