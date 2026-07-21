
import proVerbData from "../../../../data/english/vocabulary/proverbs-1-219.json";
import StudyDeck from "./StudyDeck";
const tableHeader = ["SN", "Phrase / Meaning", "One Word (PoS)", "Hindi / Marathi"];
const ProVerb = () => <StudyDeck data={proVerbData} tableHeader={tableHeader} />;

export default ProVerb;