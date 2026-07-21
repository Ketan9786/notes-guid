
import homonymsData from "../../../../data/english/vocabulary/top-100-antonyms-1-100.json";
import StudyDeck from "./StudyDeck";
const tableHeader = ["SN", "Phrase / Meaning", "One Word (PoS)", "Hindi / Marathi"];
const Homonyms = () => <StudyDeck data={homonymsData} tableHeader={tableHeader} />;

export default Homonyms;