import { SKILLS } from "./utilities/Constant/Data/Skills/skills";

function App() {
	return (
		<div className="text-4xl font-bold font-signature">
			<img src={SKILLS[0].icon__url} width="100px"></img>
		</div>
	);
}

export default App;
