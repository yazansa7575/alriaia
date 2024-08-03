import { useEffect, useState } from "react";
import ReportForm from "./Component/ReportForm";

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme); // حفظ الثيم في اللوكـال ستورج
  };

  // استرجاع الثيم من اللوكـال ستورج عند تحميل الصفحة
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <>
      <button onClick={toggleTheme}>
        تغيير الثيم إلى {theme === "light" ? "داكن" : "فاتح"}
      </button>
      <ReportForm />
    </>
  );
}

export default App;
