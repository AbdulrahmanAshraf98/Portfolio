import About from "./Components/About/About";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Resume from "./Components/Resume/Resume";
import Skills from "./Components/Skills/Skills";

function App() {
	return (
		<>
			<Navbar />
			<Home />
			<About />
			<Resume />
			<Skills />
		</>
	);
}

export default App;
