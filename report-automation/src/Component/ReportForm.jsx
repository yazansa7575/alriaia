import React, { useState, useEffect } from "react";
import SetupSupervisor from "./SetupSupervisor";
import { motion } from "framer-motion";
import "./styles/ReportForm.css";
import { scheduleReminder } from "../utils";

const initialFormData = {
  supervisorName: "",
  day: "",
  date: "",
  shift: "",
  childrenCount: "",
  visits: "",
  behaviorGeneral: "",
  behaviorNotes: "",
  urinationCases: "",
  cleanliness: "",
  brushingTeeth: "",
  brushingReasons: "",
  generalCleanliness: "",
  healthConditions: "",
  medicationFollowUp: "",
  educationalFollowUp: "",
  educationalNotes: "",
  activities: "",
  caseManagement: "",
  logisticalNeeds: "",
  other: "",
};

const ReportForm = () => {
  const [isSetup, setIsSetup] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [formData, setFormData] = useState(initialFormData);

  // مفاتيح التخزين المحلي
  const FORM_DATA_KEY = "formData";
  const REPORTS_COUNT_KEY = "monthlyReportCount";
  const SUPERVISOR_NAME_KEY = "supervisorName";

  useEffect(() => {
    // استعادة اسم المشرف من localStorage
    const storedName = localStorage.getItem(SUPERVISOR_NAME_KEY);
    if (storedName) {
      setFormData((prevData) => ({
        ...prevData,
        supervisorName: storedName,
      }));
      setIsSetup(true);
    }

    // استعادة بيانات النموذج من localStorage
    const storedFormData = localStorage.getItem(FORM_DATA_KEY);
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }

    // تعيين اليوم الحالي تلقائيًا
    const days = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    const today = new Date();
    const dayName = days[today.getDay()];
    setFormData((prevData) => ({
      ...prevData,
      day: dayName,
    }));

    // استرجاع عدد التقارير المرسلة من التخزين المحلي
    const storedCount = localStorage.getItem(REPORTS_COUNT_KEY);
    if (storedCount) {
      setReportCount(Number(storedCount));
    } else {
      // إذا لم يكن هناك عدد مخزن، ابدأ من 0
      localStorage.setItem(REPORTS_COUNT_KEY, "0");
    }

      // تحديد مدة التذكير بـ 5 دقائق
      const reminderTime = 2 * 60 * 60 * 1000; // 2 ساعة
      scheduleReminder("لا تنسى إكمال التقرير!", reminderTime);

  }, []);

  const handleSetupComplete = (name) => {
    setFormData((prevData) => ({
      ...prevData,
      supervisorName: name,
    }));
    setIsSetup(true);
  };

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    localStorage.setItem("formData", JSON.stringify(newFormData)); // حفظ البيانات في localStorage
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // تنسيق النص ليشبه النموذج المطلوب
    const message = `
  فورم تقرير المناوبة اليومي:
  
  اسم المشرف: ${formData.supervisorName}
  اليوم: ${formData.day}
  التاريخ: ${formData.date}
  المناوبة: ${formData.shift}
  
  # عدد الأطفال: ${formData.childrenCount}
  # الزيارات: ${formData.visits}
  
  # سلوكياً:
  - سلوك المستفيدين بشكل عام: ${formData.behaviorGeneral}
  - ملاحظات خاصة حول المستفيدين: ${formData.behaviorNotes}
  - حالات التبول في حال وجودها: ${formData.urinationCases}
  
  # النظافة:
  ** نظافة المستفيدين: ${formData.cleanliness}
  ** تفريش الأسنان:
  - التزام: ${formData.brushingTeeth === "التزام" ? "نعم" : "لا"}
  - عدم التزام: ${formData.brushingReasons}
  ** نظافة عامة تخص الفئة: ${formData.generalCleanliness}
  
  # صحياً:
  - ذكر الحالات المرضية: ${formData.healthConditions}
  - ذكر المتابعات الدوائية: ${formData.medicationFollowUp}
  
  # تعليمياً:
  - المتابعات التعليمية التي تتم: ${formData.educationalFollowUp}
  - الملاحظات في حال وجودها: ${formData.educationalNotes}
  
  # الأنشطة المنفذة:
  -  النشاط: ${formData.activities}
  
  # خدمات إدارة الحالة:
  ${formData.caseManagement}
  
  # لوجستياً:
   ${formData.logisticalNeeds}
  
  # غير ذلك:
  ${formData.other}
    `;

    // ترميز النص ليكون مناسباً لواجهة URL
    const encodedMessage = encodeURIComponent(message);

    // رقم الهاتف المستهدف
    const phoneNumber = "0958887575";

    // رابط واتساب لإرسال الرسالة
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // فتح الرابط لإرسال الرسالة
    window.open(whatsappURL, "_blank");

    // تحديث عدد التقارير المرسلة
    const newCount = reportCount + 1;
    setReportCount(newCount);
    localStorage.setItem(REPORTS_COUNT_KEY, newCount.toString());
  };

  const handleReset = () => {
    setFormData(initialFormData);
    localStorage.removeItem("formData");
    localStorage.removeItem("supervisorName");
  };

  return (
    <div>
      {!isSetup ? (
        <SetupSupervisor onSetupComplete={handleSetupComplete} />
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-header">
            <h2>تقرير المناوبة اليومي</h2>
            <button type="button" onClick={handleReset}>
              إعادة تعيين
            </button>
          </div>

          <label>اسم المشرف:</label>
          <input
            type="text"
            name="supervisorName"
            value={formData.supervisorName}
            onChange={handleChange}
            placeholder="اسم المشرف"
          />

          <label>اليوم:</label>
          <input
            type="text"
            name="day"
            value={formData.day}
            onChange={handleChange}
          />

          <label>التاريخ:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <label>المناوبة:</label>
          <select name="shift" value={formData.shift} onChange={handleChange}>
            <option value="">اختر</option>
            <option value="صباحية">صباحية</option>
            <option value="مسائية">مسائية</option>
            <option value="صباحية مسائية">صباحية مسائية</option>
          </select>

          <h3># عدد الأطفال</h3>
          <input
            type="number"
            name="childrenCount"
            value={formData.childrenCount}
            onChange={handleChange}
            min={1}
          />

          <h3># الزيارات</h3>
          <input
            name="visits"
            value={formData.visits}
            onChange={handleChange}
          />

          <h3># سلوكياً</h3>
          <label>سلوك المستفيدين بشكل عام:</label>
          <textarea
            name="behaviorGeneral"
            value={formData.behaviorGeneral}
            onChange={handleChange}
          ></textarea>

          <label>ملاحظات خاصة حول المستفيدين:</label>
          <textarea
            name="behaviorNotes"
            value={formData.behaviorNotes}
            onChange={handleChange}
          ></textarea>

          <label>حالات التبول في حال وجودها:</label>
          <textarea
            name="urinationCases"
            value={formData.urinationCases}
            onChange={handleChange}
          ></textarea>

          <h3># النظافة</h3>
          <label>نظافة المستفيدين:</label>
          <textarea
            name="cleanliness"
            value={formData.cleanliness}
            onChange={handleChange}
          ></textarea>

          <label>تفريش الأسنان:</label>
          <select
            name="brushingTeeth"
            value={formData.brushingTeeth}
            onChange={handleChange}
          >
            <option value="">اختر</option>
            <option value="التزام">التزام</option>
            <option value="عدم التزام">عدم التزام</option>
          </select>

          <label>نظافة عامة تخص الفئة:</label>
          <textarea
            name="generalCleanliness"
            value={formData.generalCleanliness}
            onChange={handleChange}
          ></textarea>

          <h3># صحياً</h3>
          <label>ذكر الحالات المرضية:</label>
          <textarea
            name="healthConditions"
            value={formData.healthConditions}
            onChange={handleChange}
          ></textarea>

          <label>ذكر المتابعات الدوائية:</label>
          <textarea
            name="medicationFollowUp"
            value={formData.medicationFollowUp}
            onChange={handleChange}
          ></textarea>

          <h3># تعليمياً</h3>
          <label>المتابعات التعليمية:</label>
          <textarea
            name="educationalFollowUp"
            value={formData.educationalFollowUp}
            onChange={handleChange}
          ></textarea>

          <label>الملاحظات في حال وجودها:</label>
          <textarea
            name="educationalNotes"
            value={formData.educationalNotes}
            onChange={handleChange}
          ></textarea>

          <h3># الأنشطة المنفذة</h3>
          <label> النشاط:</label>
          <textarea
            name="activities"
            value={formData.activities}
            onChange={handleChange}
          ></textarea>

          <h3># خدمات إدارة الحالة</h3>
          <textarea
            name="caseManagement"
            value={formData.caseManagement}
            onChange={handleChange}
          ></textarea>

          <h3># لوجستياً</h3>
          <textarea
            name="logisticalNeeds"
            value={formData.logisticalNeeds}
            onChange={handleChange}
          ></textarea>

          <h3># غير ذلك</h3>
          <textarea
            name="other"
            value={formData.other}
            onChange={handleChange}
          ></textarea>

          <button type="submit">إرسال التقرير</button>
        </motion.form>
      )}
      <motion.footer
        className="footer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <p>
          <a
            href="https://yazan-sa-portfolio.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portofolio{" "}
          </a>
          || R: {reportCount}
        </p>
      </motion.footer>
    </div>
  );
};

export default ReportForm;
