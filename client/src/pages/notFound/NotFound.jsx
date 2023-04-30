import { Link } from "react-router-dom";
import "./notFound.scss";

export default function NotFound() {
    return (
        <section className="notfound_container">
            <div className="container notfound_page">
                <h1>Page Not Found</h1>
                <Link to="/" className="notfound_btn">Go Back Home</Link>
            </div>
        </section>
    )
}
