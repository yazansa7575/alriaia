import React, { useState, useEffect } from "react";
import "./styles/SetupSupervisor.css";

const SetupSupervisor = ({ onSetupComplete }) => {
  const [supervisorName, setSupervisorName] = useState("");

  useEffect(() => {
    // تحميل اسم المشرف من localStorage إذا كان موجوداً
    const storedName = localStorage.getItem("supervisorName");
    if (storedName) {
      onSetupComplete(storedName);
    }
  }, [onSetupComplete]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (supervisorName.trim()) {
      localStorage.setItem("supervisorName", supervisorName);
      onSetupComplete(supervisorName);
    }
  };

  return (
    <div className="SetupSupervisor">
      <h2>تسجيل اسم المشرف</h2>
      <form onSubmit={handleSubmit}>
        <div className="content">
          <label>اسم المشرف:</label>
          <input
            type="text"
            value={supervisorName}
            onChange={(e) => setSupervisorName(e.target.value)}
            placeholder="أدخل اسم المشرف"
          />
        </div>
        <button type="submit">تسجيل الاسم</button>
      </form>
    </div>
  );
};

export default SetupSupervisor;
