# Beacon Light International Academy — School Management System (Vercel Edition)

A complete, modern, responsive, and production-ready **School Management System** built with clean HTML5, CSS3, and JavaScript, specifically structured for 1-click zero-configuration deployment to **Vercel** or **GitHub Pages**.

> **100% Client-Side Architecture & Privacy-First:**
> - Zero PHP or MySQL server dependency required for deployment.
> - Zero API keys, passwords, or secret credentials embedded.
> - Full offline & browser persistence powered by `localStorage` and `sessionStorage`.
> - Instant English ⇄ Urdu (RTL) live bilingual switching.

---

## اردو ہدایات (Urdu Deployment Guide)

### 1. گٹ ہب (GitHub) پر اپلوڈ کرنے کا طریقہ
1. اپنے کمپیوٹر پر اس فولڈر کو ان زپ (Unzip) کر لیں۔
2. اپنے [GitHub.com](https://github.com) اکاؤنٹ میں لاگ ان کریں اور **New Repository** بنائیں۔
3. ریپوزیٹری کا کوئی بھی نام رکھیں (مثلاً: `school-management-system`) اور **Public** منتخب کریں۔
4. اپنے کمپیوٹر پر ٹرمینل یا کمانڈ پرامپٹ کھولیں اور اس فولڈر کے اندر یہ کمانڈز چلائیں:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - School Management System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/school-management-system.git
   git push -u origin main
   ```
   *(یا آپ GitHub ویب سائٹ پر جا کر **Upload files** کا بٹن دبا کر تمام فائلیں ڈریگ اینڈ ڈراپ کر سکتے ہیں)*

---

### 2. ورسل (Vercel) پر لائیو کرنے کا طریقہ (1-Click Deploy)
1. [Vercel.com](https://vercel.com) پر جائیں اور اپنے GitHub اکاؤنٹ سے لاگ ان کریں۔
2. ڈیش بورڈ پر **"Add New..."** پر کلک کر کے **"Project"** منتخب کریں۔
3. اپنی گٹ ہب ریپوزیٹری (`school-management-system`) کو سلیکٹ کریں اور **"Import"** پر کلک کریں۔
4. ورسل خود بخود پروجیکٹ کو بطور `Static Project` پہچان لے گا۔
5. کسی سیٹنگ کو تبدیل کرنے کی ضرورت نہیں، بس **"Deploy"** بٹن پر کلک کریں۔
6. 10 سے 20 سیکنڈ کے اندر آپ کا پروجیکٹ لائیو ہو جائے گا اور آپ کو فری لائیو ڈومین مل جائے گی (مثلاً: `https://your-school.vercel.app`)!

---

## Features Overview (نمایاں خصوصیات)

| فیچر | تفصیل |
|---|---|
| **Public Landing Page** | مکمل اسکول ہوم پیج، ہیرو سیکشن، اکیڈمکس، فیکلٹی، سہولیات، لائیو نوٹس بورڈ، اور آن لائن رابطہ فارم |
| **Bilingual (Urdu / English)** | فل سکرین مکمل اردو (RTL) اور انگلش لینگویج سوئچر ایک کلک پر |
| **5 Role-Based Dashboards** | ایڈمن، اساتذہ، طلباء، والدین، اور اکاؤنٹنٹ کے لیے الگ الگ مخصوص پورٹلز |
| **Interactive Fee System** | فیس ووچر، پارشل پیمنٹ کلیکشن، فیس ریکارڈ، اور پرنٹ کے قابل آفیشل رسید |
| **Examinations & Marksheets** | امتحان کا شیڈول، نمبرات کا اندراج، جی پی اے اور گریڈ کیلکولیشن، اور پرنٹ ایبل رزلٹ کارڈ |
| **Attendance Management** | طلباء اور اساتذہ کی روزانہ حاضری، رول کال اور اسٹیٹس رپورٹس |
| **User Approvals** | نئے رجسٹر ہونے والے طلباء، اساتذہ اور والدین کی ایڈمن ویریفکیشن اور اپروول سسٹم |

---

## Demo Login Credentials (ڈیمو لاگ ان معلومات)

پورٹل میں فوری رسائی کے لیے درج ذیل ڈیمو اکاؤنٹس موجود ہیں (لاگ ان اسکرین پر **1-Click Demo Access** پر کلک کرنے سے خود بخود بھر جاتے ہیں):

* **Super Admin / Principal:** `admin` / `admin`
* **Faculty Teacher:** `teacher1` / `teacher123`
* **Student:** `student1` / `student123`
* **Parent:** `parent1` / `parent123`
* **Accountant:** `accountant1` / `accountant123`

---

## File Structure (فائلوں کی ساخت)

```text
├── index.html              # پبلک اسکول لینڈنگ پیج
├── portal.html             # اسکول مینیجمنٹ سسٹم پورٹل (ڈیش بورڈز اور لاگ ان)
├── vercel.json             # ورسل ہوسٹنگ راؤٹنگ اور سیکیورٹی کنفگریشن
├── assets/
│   ├── css/
│   │   ├── dashicons.min.css # ورڈپریس ڈیش آئیکونز
│   │   ├── landing.css       # لینڈنگ پیج اسٹائلز
│   │   ├── portal.css        # پورٹل اور ڈیش بورڈز اسٹائلز
│   │   └── rtl.css           # اردو زبان کے لیے RTL لے آؤٹ اسٹائلز
│   ├── fonts/              # ڈیش آئیکونز کے تمام فونٹس (eot, svg, ttf, woff, woff2)
│   └── js/
│       ├── i18n.js           # اردو اور انگریزی ڈکشنری اور ڈائنامک ٹرانسلیٹر
│       ├── data.js           # اسکول کا ڈیٹا بیس اور لوکل اسٹوریج ہینڈلر
│       ├── landing.js        # لینڈنگ پیج انٹرایکشنز
│       └── portal.js         # پورٹل، ماڈلز، فیس اور رزلٹ لاجک
└── README.md               # انسٹالیشن اور تعیناتی گائیڈ
```

---

## Security & Verification (سیکیورٹی کی یقین دہانی)
- کوئی بھی ڈیٹابیس پاسورڈ یا خفیہ `keys` اس فولڈر میں موجود نہیں ہے۔
- کوئی بھی ورڈپریس کا کور یا پی ایچ پی فائل شامل نہیں کی گئی، لہٰذا ورسل پر ہوسٹ کرتے وقت کوئی سیکیورٹی رسک یا رن ٹائم ایرر نہیں آئے گا۔
