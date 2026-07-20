
import phrasalVerbData from "../../../../data/english/vocabulary/phrasal-verbs-1-245.json";
import StudyDeck from "./StudyDeck";
const tableHeader = ["SN", "Phrase / Meaning", "One Word (PoS)", "Hindi / Marathi"];
const PhrasalVerb = () => <StudyDeck data={phrasalVerbData} tableHeader={tableHeader} />;

export default PhrasalVerb;