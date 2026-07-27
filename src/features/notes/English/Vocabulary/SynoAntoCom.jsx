
import synoantoComData from "../../../../data/english/vocabulary/top-100-syno-anto-1-100.json";
import StudyDeck2 from "./StudyDesk2";
const tableHeader = ["SN", "Phrase / Meaning", "One Word (PoS)", "Hindi / Marathi"];
const SynoAntoCom = () => <StudyDeck2 data={synoantoComData} tableHeader={tableHeader} />;

export default SynoAntoCom;