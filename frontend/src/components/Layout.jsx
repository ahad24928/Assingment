import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {children}
      </div>
    </>
  );
}