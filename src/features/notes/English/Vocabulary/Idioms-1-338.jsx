
import idiomsData from "../../../../data/english/vocabulary/idioms-phrases/idioms-1-388.json";
import StudyDeck from "./StudyDeck";
const tableHeader = ["SN", "English Meaning", "Idioms/Phrases", "Hindi / Marathi"];
const Idioms_1_388 = () => <StudyDeck data={idiomsData} tableHeader={tableHeader} />;

export default Idioms_1_388;