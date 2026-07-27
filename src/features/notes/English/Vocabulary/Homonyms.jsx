
import homonymsData from "../../../../data/english/vocabulary/top-100-antonyms-1-100.json";
import StudyDeck2 from "./StudyDesk2";
const tableHeader = ["SN", "Phrase / Meaning", "One Word (PoS)", "Hindi / Marathi"];
const Homonyms = () => <StudyDeck2 data={homonymsData} tableHeader={tableHeader} />;

export default Homonyms;