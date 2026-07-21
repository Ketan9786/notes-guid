
import synoantoComData from "../../../../data/english/vocabulary/top-100-syno-anto-1-100.json";
import StudyDeck from "./StudyDeck";
const tableHeader = ["SN", "Phrase / Meaning", "One Word (PoS)", "Hindi / Marathi"];
const SynoAntoCom = () => <StudyDeck data={synoantoComData} tableHeader={tableHeader} />;

export default SynoAntoCom;