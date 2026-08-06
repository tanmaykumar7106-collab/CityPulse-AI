import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
    <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main>
        <Outlet />
        </main>

        <Footer />
    </div>
    );
}

export default MainLayout;