import About from "./Components/About/About";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Portfolio from "./Components/Portfolio/Portfolio.jsx";
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
			<Portfolio />
		</>
	);
}

export default App;
