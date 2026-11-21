/**
 * School Management System — In-Memory & LocalStorage Data Engine
 * Full offline & Vercel compatible database simulation.
 * Zero database server required, completely secure, zero keys.
 */
const DEFAULT_SMS_DATA = {
    settings: {
        school_name: "Al-Hasan Model School",
        school_tagline: "Excellence in Education & Character Building",
        school_email: "info@alhasan.edu.pk",
        school_phone: "+92 51 9876543 / +92 300 1234567",
        school_address: "Plot 45-B, Sector G-10, Educational Enclave, Islamabad / Lahore, Pakistan",
        current_session: "2026-2027",
        currency_symbol: "Rs.",
        default_language: "en"
    },
    users: [
        { id: 1, username: "admin", role: "super_admin", name: "System Administrator", email: "admin@school.test", status: "approved" },
        { id: 2, username: "teacher1", role: "teacher", name: "Sir Muhammad Tariq", email: "teacher1@school.test", status: "approved" },
        { id: 3, username: "student1", role: "student", name: "Hamza Tariq", email: "student1@school.test", status: "approved" },
        { id: 4, username: "parent1", role: "parent", name: "Tariq Mahmood", email: "parent1@school.test", status: "approved" },
        { id: 5, username: "accountant1", role: "accountant", name: "Rashid Ali", email: "accountant1@school.test", status: "approved" }
    ],
    classes: [
        { id: 1, name: "Grade 1", numeric_name: 1 },
        { id: 2, name: "Grade 2", numeric_name: 2 },
        { id: 3, name: "Grade 3", numeric_name: 3 },
        { id: 4, name: "Grade 4", numeric_name: 4 },
        { id: 5, name: "Grade 5", numeric_name: 5 },
        { id: 6, name: "Grade 6", numeric_name: 6 },
        { id: 7, name: "Grade 7", numeric_name: 7 },
        { id: 8, name: "Grade 8", numeric_name: 8 },
        { id: 9, name: "Grade 9", numeric_name: 9 },
        { id: 10, name: "Grade 10", numeric_name: 10 }
    ],
    sections: [
        { id: 1, class_id: 10, name: "Section A", capacity: 40, room_no: "Room 101" },
        { id: 2, class_id: 10, name: "Section B", capacity: 40, room_no: "Room 102" },
        { id: 3, class_id: 9, name: "Section A", capacity: 40, room_no: "Room 201" },
        { id: 4, class_id: 8, name: "Section A", capacity: 40, room_no: "Room 202" }
    ],
    subjects: [
        { id: 1, name: "Mathematics", code: "MATH-10", type: "theory", total_marks: 100, pass_marks: 40 },
        { id: 2, name: "English Language", code: "ENG-10", type: "theory", total_marks: 100, pass_marks: 40 },
        { id: 3, name: "Urdu Adab", code: "URD-10", type: "theory", total_marks: 100, pass_marks: 40 },
        { id: 4, name: "Physics", code: "PHY-10", type: "theory", total_marks: 75, pass_marks: 25 },
        { id: 5, name: "Computer Science", code: "CS-10", type: "theory", total_marks: 100, pass_marks: 40 },
        { id: 6, name: "Islamic Studies", code: "ISL-10", type: "theory", total_marks: 100, pass_marks: 40 }
    ],
    teachers: [
        {
            id: 1,
            user_id: 2,
            employee_code: "EMP-101",
            name: "Sir Muhammad Tariq",
            email: "teacher1@school.test",
            phone: "+92 300 5551122",
            designation: "Senior Mathematics & Physics Faculty",
            qualification: "M.Phil Mathematics, QAU",
            status: "active"
        },
        {
            id: 2,
            user_id: 6,
            employee_code: "EMP-102",
            name: "Dr. Samina Altaf",
            email: "samina@school.test",
            phone: "+92 300 5552233",
            designation: "Head of Science Wing",
            qualification: "Ph.D Molecular Biology",
            status: "active"
        },
        {
            id: 3,
            user_id: 7,
            employee_code: "EMP-103",
            name: "Sir Asim Khan",
            email: "asim@school.test",
            phone: "+92 300 5553344",
            designation: "ICT & Computer Specialist",
            qualification: "M.S Computer Science",
            status: "active"
        }
    ],
    teacherAssignments: [
        { id: 1, teacher_id: 2, class_id: 10, section_id: 1, subject_id: 1, class_name: "Grade 10", section_name: "Section A", subject_name: "Mathematics" },
        { id: 2, teacher_id: 2, class_id: 10, section_id: 1, subject_id: 4, class_name: "Grade 10", section_name: "Section A", subject_name: "Physics" }
    ],
    parents: [
        { id: 1, user_id: 4, name: "Tariq Mahmood", email: "parent1@school.test", phone: "+92 321 9876543", occupation: "Senior Software Architect", relation: "Father" }
    ],
    students: [
        {
            id: 1,
            user_id: 3,
            name: "Hamza Tariq",
            email: "student1@school.test",
            admission_no: "ADM-2026-001",
            roll_no: "1",
            class_id: 10,
            section_id: 1,
            class_name: "Grade 10",
            section_name: "Section A",
            gender: "Male",
            blood_group: "B+",
            session_year: "2026-2027",
            dob: "2010-04-12",
            parent_user_id: 4,
            parent_name: "Tariq Mahmood",
            status: "active"
        },
        {
            id: 2,
            user_id: 8,
            name: "Ayesha Malik",
            email: "ayesha@school.test",
            admission_no: "ADM-2026-002",
            roll_no: "2",
            class_id: 10,
            section_id: 1,
            class_name: "Grade 10",
            section_name: "Section A",
            gender: "Female",
            blood_group: "O+",
            session_year: "2026-2027",
            parent_user_id: 0,
            status: "active"
        },
        {
            id: 3,
            user_id: 9,
            name: "Bilal Hassan",
            email: "bilal@school.test",
            admission_no: "ADM-2026-003",
            roll_no: "3",
            class_id: 10,
            section_id: 1,
            class_name: "Grade 10",
            section_name: "Section A",
            gender: "Male",
            blood_group: "A+",
            session_year: "2026-2027",
            parent_user_id: 0,
            status: "active"
        },
        {
            id: 4,
            user_id: 10,
            name: "Zainab Fatima",
            email: "zainab@school.test",
            admission_no: "ADM-2026-004",
            roll_no: "4",
            class_id: 10,
            section_id: 1,
            class_name: "Grade 10",
            section_name: "Section A",
            gender: "Female",
            blood_group: "AB+",
            session_year: "2026-2027",
            parent_user_id: 0,
            status: "active"
        }
    ],
    attendance: [
        { student_id: 1, class_id: 10, section_id: 1, date: "2026-09-17", status: "present", remarks: "On time" },
        { student_id: 1, class_id: 10, section_id: 1, date: "2026-09-16", status: "present", remarks: "" },
        { student_id: 1, class_id: 10, section_id: 1, date: "2026-09-15", status: "present", remarks: "" },
        { student_id: 1, class_id: 10, section_id: 1, date: "2026-09-14", status: "absent", remarks: "Medical" },
        { student_id: 1, class_id: 10, section_id: 1, date: "2026-09-13", status: "present", remarks: "" },
        { student_id: 2, class_id: 10, section_id: 1, date: "2026-09-17", status: "present", remarks: "" },
        { student_id: 3, class_id: 10, section_id: 1, date: "2026-09-17", status: "late", remarks: "Traffic" },
        { student_id: 4, class_id: 10, section_id: 1, date: "2026-09-17", status: "present", remarks: "" }
    ],
    exams: [
        { id: 1, name: "Mid-Term Examination 2026", exam_term: "First Term", session_year: "2026-2027", start_date: "2026-10-10", end_date: "2026-10-25" },
        { id: 2, name: "Annual Examination 2026", exam_term: "Final Term", session_year: "2026-2027", start_date: "2026-12-05", end_date: "2026-12-20" }
    ],
    examResults: [
        { exam_id: 1, student_id: 1, class_id: 10, subject_id: 1, subject_name: "Mathematics", marks_obtained: 88, max_marks: 100, pass_marks: 40, grade: "A", remarks: "Great algebra skills" },
        { exam_id: 1, student_id: 1, class_id: 10, subject_id: 2, subject_name: "English Language", marks_obtained: 84, max_marks: 100, pass_marks: 40, grade: "A", remarks: "Very good essay" },
        { exam_id: 1, student_id: 1, class_id: 10, subject_id: 3, subject_name: "Urdu Adab", marks_obtained: 91, max_marks: 100, pass_marks: 40, grade: "A+", remarks: "Outstanding literature grasp" },
        { exam_id: 1, student_id: 1, class_id: 10, subject_id: 4, subject_name: "Physics", marks_obtained: 68, max_marks: 75, pass_marks: 25, grade: "A+", remarks: "Strong practical concepts" },
        { exam_id: 1, student_id: 1, class_id: 10, subject_id: 5, subject_name: "Computer Science", marks_obtained: 95, max_marks: 100, pass_marks: 40, grade: "A+", remarks: "Top in coding" },
        { exam_id: 1, student_id: 1, class_id: 10, subject_id: 6, subject_name: "Islamic Studies", marks_obtained: 90, max_marks: 100, pass_marks: 40, grade: "A+", remarks: "Excellent" }
    ],
    feeStructures: [
        { id: 1, title: "Class 10 Monthly Tuition Fee", class_id: 10, class_name: "Grade 10", amount: 6500, fee_type: "monthly", due_date: "2026-09-10" },
        { id: 2, title: "Annual Examination Fee", class_id: 10, class_name: "Grade 10", amount: 2000, fee_type: "exam", due_date: "2026-10-01" }
    ],
    invoices: [
        { id: 1, invoice_no: "INV-2026-001", student_id: 1, student_name: "Hamza Tariq", roll_no: "1", class_name: "Grade 10", title: "Tuition Fee - August 2026", total_amount: 6500, paid_amount: 6500, status: "paid", due_date: "2026-08-10" },
        { id: 2, invoice_no: "INV-2026-002", student_id: 1, student_name: "Hamza Tariq", roll_no: "1", class_name: "Grade 10", title: "Tuition Fee - September 2026", total_amount: 6500, paid_amount: 0, status: "unpaid", due_date: "2026-09-25" },
        { id: 3, invoice_no: "INV-2026-003", student_id: 2, student_name: "Ayesha Malik", roll_no: "2", class_name: "Grade 10", title: "Tuition Fee - September 2026", total_amount: 6500, paid_amount: 3000, status: "partial", due_date: "2026-09-25" }
    ],
    payments: [
        { id: 1, invoice_id: 1, payment_no: "PAY-882341", amount: 6500, payment_date: "2026-08-05", payment_method: "cash", transaction_ref: "RCP-001", notes: "Paid at accounts counter" }
    ],
    expenses: [
        { id: 1, title: "Science Lab Reagents & Apparatus", category: "Supplies", amount: 15400, expense_date: "2026-09-02", payment_method: "bank_transfer", receipt_ref: "BILL-849" },
        { id: 2, title: "Electricity & Solar Maintenance", category: "Utilities", amount: 28900, expense_date: "2026-09-08", payment_method: "bank_transfer", receipt_ref: "IESCO-921" },
        { id: 3, title: "Library Reference Volumes", category: "General", amount: 8500, expense_date: "2026-09-12", payment_method: "cash", receipt_ref: "RCP-441" }
    ],
    timetables: [
        { id: 1, class_id: 10, section_id: 1, class_name: "Grade 10", section_name: "Section A", subject_id: 1, subject_name: "Mathematics", teacher_id: 2, teacher_name: "Sir Muhammad Tariq", day_of_week: "Monday", start_time: "08:30", end_time: "09:15", room_no: "Room 101" },
        { id: 2, class_id: 10, section_id: 1, class_name: "Grade 10", section_name: "Section A", subject_id: 4, subject_name: "Physics", teacher_id: 2, teacher_name: "Sir Muhammad Tariq", day_of_week: "Monday", start_time: "09:15", end_time: "10:00", room_no: "Physics Lab" },
        { id: 3, class_id: 10, section_id: 1, class_name: "Grade 10", section_name: "Section A", subject_id: 5, subject_name: "Computer Science", teacher_id: 7, teacher_name: "Sir Asim Khan", day_of_week: "Tuesday", start_time: "08:30", end_time: "09:15", room_no: "ICT Lab" },
        { id: 4, class_id: 10, section_id: 1, class_name: "Grade 10", section_name: "Section A", subject_id: 2, subject_name: "English Language", teacher_id: 2, teacher_name: "Sir Muhammad Tariq", day_of_week: "Wednesday", start_time: "09:15", end_time: "10:00", room_no: "Room 101" }
    ],
    notices: [
        {
            id: 1,
            title: "Annual Sports Gala & Athletics Championship 2026",
            content: "The Annual Sports Week will commence from October 15th to October 20th. House teams are requested to submit final participant lists to the Directorate of Physical Education.",
            target_role: "all",
            priority: "urgent",
            publish_date: "2026-09-17"
        },
        {
            id: 2,
            title: "Parent-Teacher Meeting (PTM) for Grades 8, 9 & 10",
            content: "Quarterly parent-teacher conference is scheduled for Saturday, 10:00 AM to 2:00 PM. Parents will be provided with academic progress cards and individual faculty briefings.",
            target_role: "parents",
            priority: "normal",
            publish_date: "2026-09-15"
        },
        {
            id: 3,
            title: "Science & AI Innovation Exhibition Submissions",
            content: "Students interested in showcasing robotics, machine learning, and environmental science models can register their group proposals before the end of the month.",
            target_role: "students",
            priority: "normal",
            publish_date: "2026-09-14"
        }
    ],
    pendingUsers: [
        { id: 101, username: "teacher_faiza", name: "Faiza Noreen", email: "faiza@school.test", requested_role: "teacher", registered_at: "2026-09-16" }
    ]
};

class SMSData {
    static get() {
        const stored = localStorage.getItem('sms_database');
        if (!stored) {
            this.save(DEFAULT_SMS_DATA);
            return DEFAULT_SMS_DATA;
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            return DEFAULT_SMS_DATA;
        }
    }

    static save(data) {
        localStorage.setItem('sms_database', JSON.stringify(data));
    }

    static reset() {
        this.save(DEFAULT_SMS_DATA);
    }

    static calculateGrade(percentage) {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        if (percentage >= 40) return 'E';
        return 'F';
    }

    static getDashboardStats() {
        const db = this.get();
        const totalStudents = db.students.filter(s => s.status === 'active').length;
        const totalTeachers = db.teachers.filter(t => t.status === 'active').length;
        const totalClasses = db.classes.length;

        let pendingFees = 0;
        db.invoices.forEach(inv => {
            if (inv.status !== 'paid') {
                pendingFees += (inv.total_amount - inv.paid_amount);
            }
        });

        const today = new Date().toISOString().split('T')[0];
        const todayAtt = db.attendance.filter(a => a.date === today || a.date === '2026-09-17');
        const presentCount = todayAtt.filter(a => a.status === 'present').length;
        const totalToday = todayAtt.length || 1;
        const attRate = Math.round((presentCount / totalToday) * 100);

        let totalIncome = 0;
        db.payments.forEach(p => totalIncome += parseFloat(p.amount));
        let totalExpense = 0;
        db.expenses.forEach(e => totalExpense += parseFloat(e.amount));

        return {
            totalStudents,
            totalTeachers,
            totalClasses,
            pendingFees,
            todayAttendance: `${attRate}% (${presentCount}/${totalToday})`,
            pendingUsers: db.pendingUsers.length,
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense
        };
    }
}
