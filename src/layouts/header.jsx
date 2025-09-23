import { useTheme } from "@/hooks/use-theme";
import { Bell, ChevronsLeft, Moon, Search, Sun,Menu, } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import axios from "axios"; // Import Axios for API request

import ProfileImg from '../../src/assets/user-1.jpg';
import PropTypes from "prop-types";
import HederProfile from "../components/HederProfile";
import ThemeSelector from "../components/ThemeSelector";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();


    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4  transition-colors dark:bg-slate-950">
            <div className="flex items-center gap-x-3">
                <button className="btn-ghost size-10 ml-2 " onClick={() => setCollapsed(!collapsed)}>
                    <Menu className={collapsed && "rotate-180"} />
                </button>
            </div>
            <div className="flex items-center gap-x-3">
            <button
  className={`btn-ghost size-10 ${theme === "dark" ? "" : ""}`}
  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
>
  <Sun size={20} className="dark:hidden" />
  <Moon size={20} className="hidden dark:block" />
</button>
       <div className="flex items-center gap-x-3">
                    <ThemeSelector/>
                </div>
                <div className="flex items-center gap-x-3">
                    <HederProfile/>
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};

