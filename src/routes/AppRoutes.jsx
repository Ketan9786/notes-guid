import { Routes, Route } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Noun from "../features/notes/English/part-of-speech/Noun";
import Pronoun from "../features/notes/English/part-of-speech/Pronoun";
import Verb from "../features/notes/English/part-of-speech/Verb";
import SubjectiveVerb from "../features/notes/English/part-of-speech/SubjectiveVerb";
import Percentage from "../features/notes/Maths/Airthmetic/Percentage";
import Mensuration2D from "../features/notes/Maths/Advance/Mensuration2D";
import AncientHistory from "../features/gk/history/AncientHistory";
import Adjective from "../features/notes/English/part-of-speech/Adjective";
import Sports from "../features/gk/static/Sports";
import MedievalHistory from "../features/gk/history/MedievalHistory";
import ModernHistory from "../features/gk/history/MordernHistory";
import Adverb from "../features/notes/English/part-of-speech/Adverb";
import ProfitAndLoss from "../features/notes/Maths/Airthmetic/ProfitAndLoss";
import Discount from "../features/notes/Maths/Airthmetic/Discount";
import SimpleInterest from "../features/notes/Maths/Airthmetic/SimpleInterest";
import RatioAndProportion from "../features/notes/Maths/Airthmetic/RationAndProportion";
import Partnership from "../features/notes/Maths/Airthmetic/Partnership";
import Article from "../features/notes/English/part-of-speech/Article";
import Preposition from "../features/notes/English/part-of-speech/Preposition";
import Physics from "../features/gk/Physisc";
import Geography from "../features/gk/Geogrphy";
import Economics from "../features/gk/Economics";
import Conjunction from "../features/notes/English/part-of-speech/Conjunction";
import Simplification from "../features/notes/Maths/Advance/Simplification";
import OWS_1_408 from "../features/notes/English/Vocabulary/OWS1-408";
import Idioms_1_388 from "../features/notes/English/Vocabulary/Idioms-1-338";
import Tenses from "../features/notes/English/part-of-speech/Tenses";
import QuestionTag from "../features/notes/English/part-of-speech/QuestionTags";
import VocabularyTable from "../features/notes/English/Vocabulary/VocabularyTable";
import RuleBookApp from "../features/notes/English/RULE/RuleBookApp";
import PhrasalVerb from "../features/notes/English/Vocabulary/PhrasalVerb";


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
          <Route
            path="/english/grammar/pos/article"
            element={<Article />}
          />
           <Route
            path="/english/grammar/pos/preposition"
            element={<Preposition />}
          /> 
           <Route
            path="/english/grammar/pos/conjunction"
            element={<Conjunction />}
          /> 
           <Route
            path="/english/grammar/pos/tenses"
            element={<Tenses />}
          /> 
           <Route
            path="/english/grammar/pos/question-tag"
            element={<QuestionTag />}
          /> 

          {/* Vocabulary ROUTES  */}
           <Route
            path="/english/vocabulary/ows/1-408"
            element={<OWS_1_408 />}
          /> 
           <Route
            path="/english/vocabulary/idioms-and-phrases/1-388"
            element={<Idioms_1_388 />}
          /> 
           <Route
            path="/english/vocabulary/phrasal-verb"
            element={<PhrasalVerb/>}
          /> 
           <Route
            path="/english/vocab/imp"
            element={<VocabularyTable />}
          /> 
           <Route
            path="/english/grammar/rule/120"
            element={<RuleBookApp />}
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
           <Route
            path="/gk/geography/geography"
            element={<Geography />}
          />
          <Route
            path="/gk/economics/economics"
            element={<Economics />}
          />

           <Route
            path="/gk/physics/physics"
            element={<Physics />}
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
          <Route
            path="/maths/arithmetic/simple-interest"
            element={<SimpleInterest />}
          />
          <Route
            path="/maths/arithmetic/ratio-and-proportion"
            element={<RatioAndProportion />}
          />
          <Route
            path="/maths/arithmetic/partnership"
            element={<Partnership />}
          />

          {/* Advance */}
            <Route
            path="/maths/advanced/mensuration2d"
            element={<Mensuration2D />}
          />


            <Route
            path="/maths/advanced/simplification"
            element={<Simplification />}
          />


         
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;