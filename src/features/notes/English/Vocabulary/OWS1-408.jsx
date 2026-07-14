
import owsData from "../../../../data/english/vocabulary/OWS/ows-1-408.json";
import StudyDeck from "./StudyDeck";
const tableHeader = ["SN", "Phrase / Meaning", "One Word (PoS)", "Hindi / Marathi"];
const OWS_1_408 = () => <StudyDeck data={owsData} tableHeader={tableHeader} />;

export default OWS_1_408;