import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
    return (
        <>
            <h1>Ride Companion</h1>
            <h2>
                <Link href="/route">
                    <a>Route</a>
                </Link>
            </h2>
            <p>some info on route formats</p>
            <hr />
            <h2>
                <Link href="/results">
                    <a>Results</a>
                </Link>
            </h2>
            <p>some info on results formats</p>
        </>
    );
};

export default Home;
