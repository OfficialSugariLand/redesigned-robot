import "./header.scss";

export default function Header({ title, image, children }) {
    return (
        <header className="header">
            <div className="header_container">
                <div className="header_background">
                    <img src={image} alt="Header Image" />
                </div>
                <div className="header_content">
                    <h2>{title}</h2>
                    <p>{children}</p>
                </div>
            </div>
        </header>
    )
}
