
import synonymousData from "../../../../data/english/vocabulary/top-100-synonyms-1-100.json";
import StudyDeck from "./StudyDeck";
const tableHeader = ["SN", "Phrase / Meaning", "One Word (PoS)", "Hindi / Marathi"];
const Synonymous = () => <StudyDeck data={synonymousData} tableHeader={tableHeader} />;

export default Synonymous;