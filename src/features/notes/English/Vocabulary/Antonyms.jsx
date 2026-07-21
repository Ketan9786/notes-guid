
import antonymsData from "../../../../data/english/vocabulary/top-100-antonyms-1-100.json";
import StudyDeck from "./StudyDeck";
const tableHeader = ["SN", "Phrase / Meaning", "One Word (PoS)", "Hindi / Marathi"];
const Antonyms = () => <StudyDeck data={antonymsData} tableHeader={tableHeader} />;

export default Antonyms;