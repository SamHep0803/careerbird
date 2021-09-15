import { Home } from "../components/Home";
import { Landing } from "../components/Landing";
import { NavBar } from "../components/NavBar";
import { useMeQuery } from "../generated/graphql";

const Index = () => {
	const { loading, error, data } = useMeQuery();
	return (
		<>
			<NavBar />
			{loading ? null : !data?.me ? <Landing /> : <Home />}
		</>
	);
};

export default Index;
