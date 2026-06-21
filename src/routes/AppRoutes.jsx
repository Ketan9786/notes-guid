import { Routes, Route } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Noun from "../features/notes/English/part-of-speech/Noun";
import Pronoun from "../features/notes/English/part-of-speech/Pronoun";
import Verb from "../features/notes/English/part-of-speech/Verb";
import SubjectiveVerb from "../features/notes/English/part-of-speech/SubjectiveVerb";


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
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;