import React, { Component, Suspense } from "react";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import useSWR from "swr";

function Subreddit() {
  const { subreddit } = useParams();
  const { data } = useSWR(subreddit, fetcher, { suspense: true });

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>
          <a href={post.url} target="_blank" rel="noopener noreferrer">
            {post.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="loader">
            <ClipLoader />
          </div>
        }
      >
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <section className="links">
                    <Link to={"all"}>r/{"all"}</Link>
                    <Link to={"reactjs"}>r/{"reactjs"}</Link>
                    <Link to={"rxjs"}>r/{"rxjs"}</Link>
                    <Link to={"javascript"}>r/{"javascript"}</Link>
                    <Link to={"node"}>r/{"node"}</Link>
                  </section>
                  <Outlet />
                </div>
              }
            >
              <Route path="/:subreddit" element={<Subreddit />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

async function fetcher(key) {
  const url = `https://www.reddit.com/r/${key}.json`;
  const errorMessage = "This subreddit is not available";
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json.data.children.map(({ data }) => data);
  } catch {
    throw Error(errorMessage);
  }
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error) {
    this.setState({ message: error.message, hasError: true });
  }
  render() {
    if (this.state.hasError) return <h1>{this.state.message}</h1>;
    return this.props.children;
  }
}
