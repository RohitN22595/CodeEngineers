"use client";
import Footer from "./components/Footer";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at top */}
      <header>
        <Nav onHandleSelect={() => {}} defaultHandle="" />
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Add your homepage content here */}
      </main>

      {/* Footer at bottom */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
