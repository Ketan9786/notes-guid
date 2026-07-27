
import antonymsData from "../../../../data/english/vocabulary/top-100-antonyms-1-100.json";
// import StudyDeck from "./StudyDeck";
import StudyDeck2 from "./StudyDesk2";
const tableHeader = ["SN", "Word", "Hindi Meaning", "Part of Speech"];
const Antonyms = () => <StudyDeck2 data={antonymsData} tableHeader={tableHeader} />;

export default Antonyms;