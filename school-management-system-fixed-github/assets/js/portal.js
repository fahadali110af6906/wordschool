/**
 * School Management System — Portal & Dashboards Interactive Engine
 * 100% Client-side, Vercel & GitHub Pages compatible with LocalStorage persistence.
 */
let currentUser = null;
let currentTab = 'overview';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check existing session
    const savedUser = sessionStorage.getItem('sms_current_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (e) {
            currentUser = null;
        }
    }

    // 2. Render initial view
    if (!currentUser) {
        renderAuthView();
    } else {
        renderPortalView();
    }

    // 3. Setup event delegations
    setupEventListeners();
});

function renderAuthView() {
    document.getElementById('smsAuthContainer').style.display = 'block';
    document.getElementById('smsPortalContainer').style.display = 'none';

    // Reset login form
    const loginForm = document.getElementById('smsLoginForm');
    if (loginForm) loginForm.reset();
}

function renderPortalView() {
    document.getElementById('smsAuthContainer').style.display = 'none';
    const portalContainer = document.getElementById('smsPortalContainer');
    portalContainer.style.display = 'block';

    const db = SMSData.get();
    const settings = db.settings;

    // Top navbar profile info
    document.getElementById('navSchoolName').textContent = settings.school_name;
    document.getElementById('navSession').textContent = `Session: ${settings.current_session}`;
    document.getElementById('navUserName').textContent = currentUser.name;
    document.getElementById('navUserAvatar').textContent = currentUser.name.substring(0, 2).toUpperCase();

    const roleBadges = {
        super_admin: SMS_I18n.__('role_super_admin'),
        admin: SMS_I18n.__('role_admin'),
        teacher: SMS_I18n.__('role_teacher'),
        student: SMS_I18n.__('role_student'),
        parent: SMS_I18n.__('role_parent'),
        accountant: SMS_I18n.__('role_accountant')
    };
    const roleTag = document.getElementById('navUserRole');
    roleTag.textContent = roleBadges[currentUser.role] || currentUser.role;
    roleTag.className = `user-role-badge role-${currentUser.role}`;

    // Set default tab based on role
    if (!currentTab || currentTab === 'overview') {
        if (currentUser.role === 'teacher') currentTab = 'teacher_dashboard';
        else if (currentUser.role === 'student') currentTab = 'student_dashboard';
        else if (currentUser.role === 'parent') currentTab = 'parent_dashboard';
        else if (currentUser.role === 'accountant') currentTab = 'accountant_dashboard';
        else currentTab = 'overview';
    }

    renderSidebar();
    renderActiveTab();
}

function renderSidebar() {
    const sidebar = document.getElementById('smsSidebarMenu');
    if (!sidebar) return;

    const role = currentUser.role;
    const db = SMSData.get();
    const pendingCount = db.pendingUsers.length;

    let menuHTML = '';

    if (role === 'super_admin' || role === 'admin') {
        menuHTML = `
            <div class="menu-heading">Main Navigation</div>
            <a href="javascript:void(0)" onclick="switchTab('overview')" class="menu-item ${currentTab === 'overview' ? 'active' : ''}">
                <i class="dashicons dashicons-dashboard"></i>
                <span>${SMS_I18n.__('overview')}</span>
            </a>

            <div class="menu-heading">Academic Management</div>
            <a href="javascript:void(0)" onclick="switchTab('students')" class="menu-item ${currentTab === 'students' ? 'active' : ''}">
                <i class="dashicons dashicons-groups"></i>
                <span>${SMS_I18n.__('students')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('teachers')" class="menu-item ${currentTab === 'teachers' ? 'active' : ''}">
                <i class="dashicons dashicons-businessman"></i>
                <span>${SMS_I18n.__('teachers')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('classes_sections')" class="menu-item ${currentTab === 'classes_sections' ? 'active' : ''}">
                <i class="dashicons dashicons-welcome-learn-more"></i>
                <span>${SMS_I18n.__('classes_sections')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('subjects')" class="menu-item ${currentTab === 'subjects' ? 'active' : ''}">
                <i class="dashicons dashicons-book-alt"></i>
                <span>${SMS_I18n.__('subjects')}</span>
            </a>

            <div class="menu-heading">Operations</div>
            <a href="javascript:void(0)" onclick="switchTab('attendance')" class="menu-item ${currentTab === 'attendance' ? 'active' : ''}">
                <i class="dashicons dashicons-calendar-alt"></i>
                <span>${SMS_I18n.__('attendance')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('examinations')" class="menu-item ${currentTab === 'examinations' ? 'active' : ''}">
                <i class="dashicons dashicons-awards"></i>
                <span>${SMS_I18n.__('examinations')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('timetable')" class="menu-item ${currentTab === 'timetable' ? 'active' : ''}">
                <i class="dashicons dashicons-clock"></i>
                <span>${SMS_I18n.__('timetable')}</span>
            </a>

            <div class="menu-heading">Financials</div>
            <a href="javascript:void(0)" onclick="switchTab('fees_finance')" class="menu-item ${currentTab === 'fees_finance' ? 'active' : ''}">
                <i class="dashicons dashicons-money-alt"></i>
                <span>${SMS_I18n.__('fees_finance')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('expenses')" class="menu-item ${currentTab === 'expenses' ? 'active' : ''}">
                <i class="dashicons dashicons-cart"></i>
                <span>${SMS_I18n.__('expenses')}</span>
            </a>

            <div class="menu-heading">Administration</div>
            <a href="javascript:void(0)" onclick="switchTab('announcements')" class="menu-item ${currentTab === 'announcements' ? 'active' : ''}">
                <i class="dashicons dashicons-megaphone"></i>
                <span>${SMS_I18n.__('announcements')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('user_approvals')" class="menu-item ${currentTab === 'user_approvals' ? 'active' : ''}">
                <i class="dashicons dashicons-id"></i>
                <span>${SMS_I18n.__('user_approvals')}</span>
                ${pendingCount > 0 ? `<span class="sms-badge badge-urgent count-pill">${pendingCount}</span>` : ''}
            </a>
            <a href="javascript:void(0)" onclick="switchTab('settings')" class="menu-item ${currentTab === 'settings' ? 'active' : ''}">
                <i class="dashicons dashicons-admin-generic"></i>
                <span>${SMS_I18n.__('settings')}</span>
            </a>
        `;
    } else if (role === 'teacher') {
        menuHTML = `
            <div class="menu-heading">Faculty Console</div>
            <a href="javascript:void(0)" onclick="switchTab('teacher_dashboard')" class="menu-item ${currentTab === 'teacher_dashboard' ? 'active' : ''}">
                <i class="dashicons dashicons-dashboard"></i>
                <span>${SMS_I18n.__('dashboard')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('attendance')" class="menu-item ${currentTab === 'attendance' ? 'active' : ''}">
                <i class="dashicons dashicons-calendar-alt"></i>
                <span>${SMS_I18n.__('mark_attendance')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('examinations')" class="menu-item ${currentTab === 'examinations' ? 'active' : ''}">
                <i class="dashicons dashicons-awards"></i>
                <span>${SMS_I18n.__('enter_marks')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('timetable')" class="menu-item ${currentTab === 'timetable' ? 'active' : ''}">
                <i class="dashicons dashicons-clock"></i>
                <span>${SMS_I18n.__('timetable')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('announcements')" class="menu-item ${currentTab === 'announcements' ? 'active' : ''}">
                <i class="dashicons dashicons-megaphone"></i>
                <span>${SMS_I18n.__('announcements')}</span>
            </a>
        `;
    } else if (role === 'student') {
        menuHTML = `
            <div class="menu-heading">Student Portal</div>
            <a href="javascript:void(0)" onclick="switchTab('student_dashboard')" class="menu-item ${currentTab === 'student_dashboard' ? 'active' : ''}">
                <i class="dashicons dashicons-dashboard"></i>
                <span>${SMS_I18n.__('dashboard')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('examinations')" class="menu-item ${currentTab === 'examinations' ? 'active' : ''}">
                <i class="dashicons dashicons-awards"></i>
                <span>${SMS_I18n.__('report_card')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('fees_finance')" class="menu-item ${currentTab === 'fees_finance' ? 'active' : ''}">
                <i class="dashicons dashicons-money-alt"></i>
                <span>${SMS_I18n.__('fee_history')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('timetable')" class="menu-item ${currentTab === 'timetable' ? 'active' : ''}">
                <i class="dashicons dashicons-clock"></i>
                <span>${SMS_I18n.__('timetable')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('announcements')" class="menu-item ${currentTab === 'announcements' ? 'active' : ''}">
                <i class="dashicons dashicons-megaphone"></i>
                <span>${SMS_I18n.__('announcements')}</span>
            </a>
        `;
    } else if (role === 'parent') {
        menuHTML = `
            <div class="menu-heading">Parent Portal</div>
            <a href="javascript:void(0)" onclick="switchTab('parent_dashboard')" class="menu-item ${currentTab === 'parent_dashboard' ? 'active' : ''}">
                <i class="dashicons dashicons-dashboard"></i>
                <span>${SMS_I18n.__('dashboard')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('examinations')" class="menu-item ${currentTab === 'examinations' ? 'active' : ''}">
                <i class="dashicons dashicons-awards"></i>
                <span>${SMS_I18n.__('exam_results')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('fees_finance')" class="menu-item ${currentTab === 'fees_finance' ? 'active' : ''}">
                <i class="dashicons dashicons-money-alt"></i>
                <span>${SMS_I18n.__('fees_finance')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('announcements')" class="menu-item ${currentTab === 'announcements' ? 'active' : ''}">
                <i class="dashicons dashicons-megaphone"></i>
                <span>${SMS_I18n.__('announcements')}</span>
            </a>
        `;
    } else if (role === 'accountant') {
        menuHTML = `
            <div class="menu-heading">Accounts Console</div>
            <a href="javascript:void(0)" onclick="switchTab('accountant_dashboard')" class="menu-item ${currentTab === 'accountant_dashboard' ? 'active' : ''}">
                <i class="dashicons dashicons-dashboard"></i>
                <span>${SMS_I18n.__('dashboard')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('fees_finance')" class="menu-item ${currentTab === 'fees_finance' ? 'active' : ''}">
                <i class="dashicons dashicons-money-alt"></i>
                <span>${SMS_I18n.__('collect_fee')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('expenses')" class="menu-item ${currentTab === 'expenses' ? 'active' : ''}">
                <i class="dashicons dashicons-cart"></i>
                <span>${SMS_I18n.__('expenses')}</span>
            </a>
            <a href="javascript:void(0)" onclick="switchTab('announcements')" class="menu-item ${currentTab === 'announcements' ? 'active' : ''}">
                <i class="dashicons dashicons-megaphone"></i>
                <span>${SMS_I18n.__('announcements')}</span>
            </a>
        `;
    }

    sidebar.innerHTML = menuHTML;
}

function switchTab(tabName) {
    currentTab = tabName;
    renderSidebar();
    renderActiveTab();

    // Close mobile sidebar if open
    const sidebar = document.getElementById('smsSidebar');
    if (sidebar) sidebar.classList.remove('open');
}

function renderActiveTab() {
    const main = document.getElementById('smsTabContent');
    if (!main) return;

    const db = SMSData.get();
    const stats = SMSData.getDashboardStats();
    const currency = db.settings.currency_symbol || 'Rs.';

    switch (currentTab) {
        case 'overview':
            main.innerHTML = getOverviewHTML(db, stats, currency);
            break;
        case 'students':
            main.innerHTML = getStudentsHTML(db);
            break;
        case 'teachers':
            main.innerHTML = getTeachersHTML(db);
            break;
        case 'classes_sections':
            main.innerHTML = getClassesSectionsHTML(db);
            break;
        case 'subjects':
            main.innerHTML = getSubjectsHTML(db);
            break;
        case 'attendance':
            main.innerHTML = getAttendanceHTML(db);
            initAttendanceSheet();
            break;
        case 'examinations':
            main.innerHTML = getExaminationsHTML(db);
            initMarksSheet();
            break;
        case 'timetable':
            main.innerHTML = getTimetableHTML(db);
            initTimetableGrid();
            break;
        case 'fees_finance':
            main.innerHTML = getFeesHTML(db, currency);
            break;
        case 'expenses':
            main.innerHTML = getExpensesHTML(db, stats, currency);
            break;
        case 'announcements':
            main.innerHTML = getAnnouncementsHTML(db);
            break;
        case 'user_approvals':
            main.innerHTML = getUserApprovalsHTML(db);
            break;
        case 'settings':
            main.innerHTML = getSettingsHTML(db);
            break;
        case 'teacher_dashboard':
            main.innerHTML = getTeacherDashboardHTML(db);
            break;
        case 'student_dashboard':
            main.innerHTML = getStudentDashboardHTML(db);
            break;
        case 'parent_dashboard':
            main.innerHTML = getParentDashboardHTML(db);
            break;
        case 'accountant_dashboard':
            main.innerHTML = getAccountantDashboardHTML(db, stats, currency);
            break;
        default:
            main.innerHTML = getOverviewHTML(db, stats, currency);
            break;
    }
}

/* ==========================================================================
   TAB HTML BUILDERS
   ========================================================================== */
function getOverviewHTML(db, stats, currency) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('overview')}</h2>
                <p class="text-muted">Welcome to the central administrative hub of ${escapeHTML(db.settings.school_name)}.</p>
            </div>
            <div class="header-actions">
                <button type="button" class="sms-btn sms-btn-primary" onclick="openModal('modalAddStudent')">
                    <i class="dashicons dashicons-plus"></i> ${SMS_I18n.__('add_new_student')}
                </button>
                <button type="button" class="sms-btn sms-btn-outline" onclick="switchTab('attendance')">
                    <i class="dashicons dashicons-yes-alt"></i> ${SMS_I18n.__('mark_attendance')}
                </button>
            </div>
        </div>

        <div class="sms-stat-cards-grid">
            <div class="sms-stat-card card-blue">
                <div class="stat-icon"><i class="dashicons dashicons-groups"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('total_students')}</span>
                    <h3 class="stat-value">${stats.totalStudents}</h3>
                </div>
            </div>
            <div class="sms-stat-card card-green">
                <div class="stat-icon"><i class="dashicons dashicons-businessman"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('total_teachers')}</span>
                    <h3 class="stat-value">${stats.totalTeachers}</h3>
                </div>
            </div>
            <div class="sms-stat-card card-purple">
                <div class="stat-icon"><i class="dashicons dashicons-welcome-learn-more"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('total_classes')}</span>
                    <h3 class="stat-value">${stats.totalClasses}</h3>
                </div>
            </div>
            <div class="sms-stat-card card-orange">
                <div class="stat-icon"><i class="dashicons dashicons-money-alt"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('pending_fees')}</span>
                    <h3 class="stat-value">${currency} ${formatNumber(stats.pendingFees)}</h3>
                </div>
            </div>
            <div class="sms-stat-card card-teal">
                <div class="stat-icon"><i class="dashicons dashicons-calendar-alt"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('today_attendance')}</span>
                    <h3 class="stat-value">${stats.todayAttendance}</h3>
                </div>
            </div>
            <div class="sms-stat-card card-red">
                <div class="stat-icon"><i class="dashicons dashicons-id"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('pending_registrations')}</span>
                    <h3 class="stat-value">${stats.pendingUsers}</h3>
                </div>
            </div>
        </div>

        <div class="sms-grid-2" style="margin-top:24px;">
            <div class="sms-panel">
                <div class="sms-panel-header">
                    <h3><i class="dashicons dashicons-chart-area"></i> ${SMS_I18n.__('financial_summary')}</h3>
                    <a href="javascript:void(0)" onclick="switchTab('fees_finance')" class="sms-btn-link">View Ledger</a>
                </div>
                <div class="sms-panel-body">
                    <div class="sms-fin-overview">
                        <div class="fin-box fin-income">
                            <span class="label">${SMS_I18n.__('total_revenue')}</span>
                            <span class="amount">${currency} ${formatNumber(stats.totalIncome)}</span>
                        </div>
                        <div class="fin-box fin-expense">
                            <span class="label">${SMS_I18n.__('total_expenses')}</span>
                            <span class="amount">${currency} ${formatNumber(stats.totalExpense)}</span>
                        </div>
                        <div class="fin-box fin-net">
                            <span class="label">${SMS_I18n.__('net_balance')}</span>
                            <span class="amount">${currency} ${formatNumber(stats.netBalance)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sms-panel">
                <div class="sms-panel-header">
                    <h3><i class="dashicons dashicons-megaphone"></i> ${SMS_I18n.__('recent_notices')}</h3>
                    <a href="javascript:void(0)" onclick="switchTab('announcements')" class="sms-btn-link">${SMS_I18n.__('post_notice')}</a>
                </div>
                <div class="sms-panel-body">
                    <ul class="sms-quick-notices">
                        ${db.notices.slice(0, 4).map(n => `
                            <li style="margin-bottom:12px; border-bottom:1px solid #f1f5f9; padding-bottom:8px;">
                                <div style="display:flex; justify-content:space-between;">
                                    <strong>${escapeHTML(n.title)}</strong>
                                    <span class="sms-badge badge-${n.priority}">${n.priority.toUpperCase()}</span>
                                </div>
                                <p class="text-muted text-sm" style="margin-top:4px;">${escapeHTML(n.content.substring(0, 80))}...</p>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function getStudentsHTML(db) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('students')}</h2>
                <p class="text-muted">Manage student admissions, profiles, parent linkages, and dossiers.</p>
            </div>
            <div class="header-actions">
                <button type="button" class="sms-btn sms-btn-primary" onclick="openModal('modalAddStudent')">
                    <i class="dashicons dashicons-plus"></i> ${SMS_I18n.__('add_new_student')}
                </button>
            </div>
        </div>

        <div class="sms-panel sms-table-responsive">
            <table class="sms-table">
                <thead>
                    <tr>
                        <th>${SMS_I18n.__('admission_no')}</th>
                        <th>${SMS_I18n.__('roll_no')}</th>
                        <th>${SMS_I18n.__('student_name')}</th>
                        <th>${SMS_I18n.__('class')}</th>
                        <th>${SMS_I18n.__('section')}</th>
                        <th>${SMS_I18n.__('parent_guardian')}</th>
                        <th>${SMS_I18n.__('status')}</th>
                        <th>${SMS_I18n.__('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.students.map(s => `
                        <tr>
                            <td><strong>${escapeHTML(s.admission_no)}</strong></td>
                            <td>${escapeHTML(s.roll_no)}</td>
                            <td><strong>${escapeHTML(s.name)}</strong></td>
                            <td>${escapeHTML(s.class_name)}</td>
                            <td>${escapeHTML(s.section_name)}</td>
                            <td>${escapeHTML(s.parent_name || 'N/A')}</td>
                            <td><span class="sms-badge badge-${s.status}">${s.status.toUpperCase()}</span></td>
                            <td>
                                <button type="button" class="sms-btn-action btn-view" title="View Dossier" onclick="viewStudentDossier(${s.id})">
                                    <i class="dashicons dashicons-visibility"></i>
                                </button>
                                <button type="button" class="sms-btn-action btn-delete" title="Deactivate" onclick="deleteStudent(${s.id})">
                                    <i class="dashicons dashicons-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getTeachersHTML(db) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('teachers')}</h2>
                <p class="text-muted">Faculty profiles, qualifications, and class/subject assignments.</p>
            </div>
            <div class="header-actions">
                <button type="button" class="sms-btn sms-btn-primary" onclick="openModal('modalAddTeacher')">
                    <i class="dashicons dashicons-plus"></i> Add Faculty Member
                </button>
            </div>
        </div>

        <div class="sms-panel sms-table-responsive">
            <table class="sms-table">
                <thead>
                    <tr>
                        <th>${SMS_I18n.__('employee_code')}</th>
                        <th>${SMS_I18n.__('teacher_name')}</th>
                        <th>${SMS_I18n.__('designation')}</th>
                        <th>${SMS_I18n.__('qualification')}</th>
                        <th>${SMS_I18n.__('phone')}</th>
                        <th>${SMS_I18n.__('status')}</th>
                        <th>Assignments</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.teachers.map(t => {
                        const asgs = db.teacherAssignments.filter(a => a.teacher_id === t.user_id);
                        return `
                            <tr>
                                <td><strong>${escapeHTML(t.employee_code)}</strong></td>
                                <td><strong>${escapeHTML(t.name)}</strong></td>
                                <td>${escapeHTML(t.designation)}</td>
                                <td>${escapeHTML(t.qualification)}</td>
                                <td>${escapeHTML(t.phone)}</td>
                                <td><span class="sms-badge badge-${t.status}">${t.status.toUpperCase()}</span></td>
                                <td>
                                    ${asgs.length === 0 ? '<span class="text-muted text-sm">No assignments</span>' : asgs.map(a => `
                                        <div class="sms-tag-assignment">
                                            <span>${a.class_name} (${a.section_name}) - ${a.subject_name}</span>
                                        </div>
                                    `).join('')}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getClassesSectionsHTML(db) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('classes_sections')}</h2>
                <p class="text-muted">Define academic grades, class sections, room allocations, and student capacities.</p>
            </div>
        </div>

        <div class="sms-grid-2">
            <div class="sms-panel">
                <div class="sms-panel-header">
                    <h3>Classes (Grades)</h3>
                </div>
                <table class="sms-table">
                    <thead>
                        <tr>
                            <th>${SMS_I18n.__('numeric_grade')}</th>
                            <th>${SMS_I18n.__('class_name')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${db.classes.map(c => `
                            <tr>
                                <td><strong>${c.numeric_name}</strong></td>
                                <td>${escapeHTML(c.name)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="sms-panel">
                <div class="sms-panel-header">
                    <h3>Sections & Classrooms</h3>
                </div>
                <table class="sms-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Section Name</th>
                            <th>Capacity</th>
                            <th>Room No</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${db.sections.map(sec => `
                            <tr>
                                <td><strong>Grade ${sec.class_id}</strong></td>
                                <td>${escapeHTML(sec.name)}</td>
                                <td>${sec.capacity} students</td>
                                <td>${escapeHTML(sec.room_no)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getSubjectsHTML(db) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('subjects')}</h2>
                <p class="text-muted">Curriculum subject catalog, course codes, and passing score thresholds.</p>
            </div>
        </div>

        <div class="sms-panel sms-table-responsive">
            <table class="sms-table">
                <thead>
                    <tr>
                        <th>${SMS_I18n.__('subject_code')}</th>
                        <th>Subject Name</th>
                        <th>${SMS_I18n.__('subject_type')}</th>
                        <th>${SMS_I18n.__('total_marks')}</th>
                        <th>${SMS_I18n.__('pass_marks')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.subjects.map(s => `
                        <tr>
                            <td><strong>${escapeHTML(s.code)}</strong></td>
                            <td><strong>${escapeHTML(s.name)}</strong></td>
                            <td><span class="sms-badge badge-role">${s.type.toUpperCase()}</span></td>
                            <td>${s.total_marks}</td>
                            <td>${s.pass_marks}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getAttendanceHTML(db) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('attendance')}</h2>
                <p class="text-muted">Take daily roll call attendance, toggle statuses, and save to local records.</p>
            </div>
        </div>

        <div class="sms-panel sms-p-4">
            <form onsubmit="filterAttendance(event)">
                <div class="form-row" style="align-items:flex-end;">
                    <div class="form-group">
                        <label>${SMS_I18n.__('class')} *</label>
                        <select id="attClassSelect" class="sms-input">
                            ${db.classes.map(c => `<option value="${c.id}" ${c.id === 10 ? 'selected' : ''}>${escapeHTML(c.name)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>${SMS_I18n.__('section')} *</label>
                        <select id="attSectionSelect" class="sms-input">
                            <option value="1">Section A</option>
                            <option value="2">Section B</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>${SMS_I18n.__('attendance_date')} *</label>
                        <input type="date" id="attDateInput" value="2026-09-17" class="sms-input">
                    </div>
                    <div class="form-group">
                        <button type="submit" class="sms-btn sms-btn-primary">
                            <i class="dashicons dashicons-update"></i> ${SMS_I18n.__('load_sheet')}
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <div class="sms-panel" id="attSheetWrapper" style="margin-top:20px;">
            <div class="sms-panel-header">
                <h3>Attendance Roll Call</h3>
                <button type="button" class="sms-btn sms-btn-sm sms-btn-outline" onclick="markAllAttendance('present')">
                    <i class="dashicons dashicons-yes-alt"></i> ${SMS_I18n.__('mark_all_present')}
                </button>
            </div>
            <div id="attSheetContainer"></div>
            <div class="sms-p-4">
                <button type="button" class="sms-btn sms-btn-primary sms-btn-lg" onclick="saveAttendanceSheet()">
                    <i class="dashicons dashicons-saved"></i> ${SMS_I18n.__('save_attendance')}
                </button>
            </div>
        </div>
    `;
}

function initAttendanceSheet() {
    renderAttendanceRows();
}

function renderAttendanceRows() {
    const container = document.getElementById('attSheetContainer');
    if (!container) return;

    const db = SMSData.get();
    container.innerHTML = `
        <table class="sms-table sms-attendance-table">
            <thead>
                <tr>
                    <th>${SMS_I18n.__('roll_no')}</th>
                    <th>${SMS_I18n.__('student_name')}</th>
                    <th>${SMS_I18n.__('status')}</th>
                </tr>
            </thead>
            <tbody>
                ${db.students.map(s => `
                    <tr data-student-id="${s.id}">
                        <td><strong>${s.roll_no}</strong></td>
                        <td>${escapeHTML(s.name)}</td>
                        <td>
                            <div class="sms-att-toggle-group">
                                <label class="sms-att-btn active" onclick="setAttStatus(${s.id}, 'present', this)">
                                    <input type="radio" name="att_${s.id}" value="present" checked> ${SMS_I18n.__('present')}
                                </label>
                                <label class="sms-att-btn" onclick="setAttStatus(${s.id}, 'absent', this)">
                                    <input type="radio" name="att_${s.id}" value="absent"> ${SMS_I18n.__('absent')}
                                </label>
                                <label class="sms-att-btn" onclick="setAttStatus(${s.id}, 'late', this)">
                                    <input type="radio" name="att_${s.id}" value="late"> ${SMS_I18n.__('late')}
                                </label>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function setAttStatus(studentId, status, labelEl) {
    const group = labelEl.closest('.sms-att-toggle-group');
    group.querySelectorAll('.sms-att-btn').forEach(b => b.classList.remove('active'));
    labelEl.classList.add('active');
}

function markAllAttendance(status) {
    document.querySelectorAll('.sms-att-toggle-group').forEach(group => {
        group.querySelectorAll('.sms-att-btn').forEach(btn => {
            const input = btn.querySelector('input');
            if (input && input.value === status) {
                btn.click();
            }
        });
    });
}

function saveAttendanceSheet() {
    alert(SMS_I18n.__('attendance_saved'));
}

function getExaminationsHTML(db) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('examinations')}</h2>
                <p class="text-muted">Schedule examinations, input academic marks, calculate GPA, and generate report cards.</p>
            </div>
        </div>

        <div class="sms-panel sms-p-4">
            <h3>Enter / Update Subject Marks</h3>
            <div class="form-row" style="align-items:flex-end;">
                <div class="form-group">
                    <label>${SMS_I18n.__('select_exam')}</label>
                    <select id="marksExamSelect" class="sms-input">
                        ${db.exams.map(e => `<option value="${e.id}">${escapeHTML(e.name)}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>${SMS_I18n.__('subjects')}</label>
                    <select id="marksSubjectSelect" class="sms-input">
                        ${db.subjects.map(s => `<option value="${s.id}">${escapeHTML(s.name)} (${s.code})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <button type="button" class="sms-btn sms-btn-primary" onclick="initMarksSheet()">
                        <i class="dashicons dashicons-update"></i> ${SMS_I18n.__('load_sheet')}
                    </button>
                </div>
            </div>
        </div>

        <div class="sms-panel" style="margin-top:20px;">
            <div class="sms-panel-header">
                <h3>Marks Sheet & Automated Grading</h3>
            </div>
            <div id="marksSheetContainer"></div>
            <div class="sms-p-4">
                <button type="button" class="sms-btn sms-btn-primary sms-btn-lg" onclick="saveMarksSheet()">
                    <i class="dashicons dashicons-saved"></i> ${SMS_I18n.__('save_results')}
                </button>
            </div>
        </div>
    `;
}

function initMarksSheet() {
    const container = document.getElementById('marksSheetContainer');
    if (!container) return;

    const db = SMSData.get();
    container.innerHTML = `
        <table class="sms-table">
            <thead>
                <tr>
                    <th>${SMS_I18n.__('roll_no')}</th>
                    <th>${SMS_I18n.__('student_name')}</th>
                    <th>Max Marks</th>
                    <th>Marks Obtained</th>
                    <th>Grade</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${db.students.map(s => {
                    return `
                        <tr>
                            <td><strong>${s.roll_no}</strong></td>
                            <td>${escapeHTML(s.name)}</td>
                            <td><input type="number" value="100" class="sms-input-sm" style="width:70px;" readonly></td>
                            <td><input type="number" id="obt_${s.id}" value="${s.id === 1 ? '88' : '75'}" class="sms-input-sm" style="width:80px;" oninput="recalcGrade(${s.id})"></td>
                            <td><span class="sms-badge badge-grade" id="grade_${s.id}">${s.id === 1 ? 'A' : 'B'}</span></td>
                            <td>
                                <button type="button" class="sms-btn sms-btn-sm sms-btn-outline" onclick="printReportCard(${s.id})">
                                    <i class="dashicons dashicons-printer"></i> Report Card
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function recalcGrade(studentId) {
    const input = document.getElementById(`obt_${studentId}`);
    const badge = document.getElementById(`grade_${studentId}`);
    if (input && badge) {
        const val = parseFloat(input.value) || 0;
        badge.textContent = SMSData.calculateGrade(val);
    }
}

function saveMarksSheet() {
    alert(SMS_I18n.__('record_saved'));
}

function getTimetableHTML(db) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('timetable')}</h2>
                <p class="text-muted">Interactive weekly class schedules, teacher period assignments, and conflict checks.</p>
            </div>
        </div>

        <div class="sms-timetable-grid" id="ttGridContainer">
            ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                const slots = db.timetables.filter(t => t.day_of_week === day);
                return `
                    <div class="sms-timetable-day-card">
                        <div class="day-header">${day}</div>
                        <div class="day-slots">
                            ${slots.length === 0 ? '<div class="empty-slot">No classes scheduled</div>' : slots.map(sl => `
                                <div class="sms-slot-card">
                                    <div class="slot-time">${sl.start_time} - ${sl.end_time}</div>
                                    <div class="slot-subject"><strong>${escapeHTML(sl.subject_name)}</strong></div>
                                    <div class="slot-teacher">${escapeHTML(sl.teacher_name)} (${sl.room_no})</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function initTimetableGrid() {}

function getFeesHTML(db, currency) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('fees_finance')}</h2>
                <p class="text-muted">Student fee invoices, fee collection counter, payment records, and official receipts.</p>
            </div>
        </div>

        <div class="sms-panel sms-table-responsive">
            <table class="sms-table">
                <thead>
                    <tr>
                        <th>${SMS_I18n.__('invoice_no')}</th>
                        <th>${SMS_I18n.__('student_name')}</th>
                        <th>${SMS_I18n.__('fee_title')}</th>
                        <th>${SMS_I18n.__('total_amount')}</th>
                        <th>${SMS_I18n.__('paid_amount')}</th>
                        <th>${SMS_I18n.__('due_amount')}</th>
                        <th>${SMS_I18n.__('status')}</th>
                        <th>${SMS_I18n.__('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.invoices.map(inv => {
                        const due = inv.total_amount - inv.paid_amount;
                        return `
                            <tr>
                                <td><strong>${inv.invoice_no}</strong></td>
                                <td>${escapeHTML(inv.student_name)}</td>
                                <td>${escapeHTML(inv.title)}</td>
                                <td>${currency} ${formatNumber(inv.total_amount)}</td>
                                <td>${currency} ${formatNumber(inv.paid_amount)}</td>
                                <td><strong class="text-danger">${currency} ${formatNumber(due)}</strong></td>
                                <td><span class="sms-badge badge-${inv.status}">${inv.status.toUpperCase()}</span></td>
                                <td>
                                    ${due > 0 ? `
                                        <button type="button" class="sms-btn sms-btn-sm sms-btn-primary" onclick="openCollectFeeModal(${inv.id}, '${inv.invoice_no}', ${due})">
                                            <i class="dashicons dashicons-money"></i> ${SMS_I18n.__('collect_fee')}
                                        </button>
                                    ` : ''}
                                    <button type="button" class="sms-btn sms-btn-sm sms-btn-outline" onclick="printReceipt(${inv.id})">
                                        <i class="dashicons dashicons-printer"></i> Receipt
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getExpensesHTML(db, stats, currency) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('expenses')}</h2>
                <p class="text-muted">Record institutional expenses, utility bills, maintenance, and supplies.</p>
            </div>
        </div>

        <div class="sms-stat-cards-grid">
            <div class="sms-stat-card card-green">
                <div class="stat-icon"><i class="dashicons dashicons-arrow-down-alt"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('total_revenue')}</span>
                    <h3 class="stat-value">${currency} ${formatNumber(stats.totalIncome)}</h3>
                </div>
            </div>
            <div class="sms-stat-card card-red">
                <div class="stat-icon"><i class="dashicons dashicons-arrow-up-alt"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('total_expenses')}</span>
                    <h3 class="stat-value">${currency} ${formatNumber(stats.totalExpense)}</h3>
                </div>
            </div>
            <div class="sms-stat-card card-blue">
                <div class="stat-icon"><i class="dashicons dashicons-vault"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('net_balance')}</span>
                    <h3 class="stat-value">${currency} ${formatNumber(stats.netBalance)}</h3>
                </div>
            </div>
        </div>

        <div class="sms-panel sms-table-responsive" style="margin-top:20px;">
            <table class="sms-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Expense Title</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Receipt Ref</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.expenses.map(e => `
                        <tr>
                            <td>${e.expense_date}</td>
                            <td><strong>${escapeHTML(e.title)}</strong></td>
                            <td><span class="sms-badge badge-role">${e.category}</span></td>
                            <td><strong class="text-danger">${currency} ${formatNumber(e.amount)}</strong></td>
                            <td>${e.payment_method.toUpperCase()}</td>
                            <td>${e.receipt_ref}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getAnnouncementsHTML(db) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('announcements')}</h2>
                <p class="text-muted">Broadcast official circulars, event announcements, and emergency notices.</p>
            </div>
        </div>

        <div class="sms-panel sms-table-responsive">
            <table class="sms-table">
                <thead>
                    <tr>
                        <th>${SMS_I18n.__('published_on')}</th>
                        <th>${SMS_I18n.__('notice_title')}</th>
                        <th>Target</th>
                        <th>${SMS_I18n.__('priority')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.notices.map(n => `
                        <tr>
                            <td>${n.publish_date}</td>
                            <td><strong>${escapeHTML(n.title)}</strong></td>
                            <td><span class="sms-badge badge-role">${n.target_role.toUpperCase()}</span></td>
                            <td><span class="sms-badge badge-${n.priority}">${n.priority.toUpperCase()}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getUserApprovalsHTML(db) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('user_approvals')}</h2>
                <p class="text-muted">Review, verify, and approve incoming user registration requests.</p>
            </div>
        </div>

        <div class="sms-panel sms-table-responsive">
            <table class="sms-table">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Email Address</th>
                        <th>Role</th>
                        <th>Registered Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.pendingUsers.length === 0 ? '<tr><td colspan="5" class="text-center">No pending user registrations.</td></tr>' : db.pendingUsers.map(u => `
                        <tr>
                            <td><strong>${escapeHTML(u.name)}</strong> (${u.username})</td>
                            <td>${escapeHTML(u.email)}</td>
                            <td><span class="sms-badge badge-role">${u.requested_role.toUpperCase()}</span></td>
                            <td>${u.registered_at}</td>
                            <td>
                                <button type="button" class="sms-btn sms-btn-sm sms-btn-primary" onclick="approveUser(${u.id})">
                                    <i class="dashicons dashicons-yes"></i> ${SMS_I18n.__('approve')}
                                </button>
                                <button type="button" class="sms-btn sms-btn-sm sms-btn-outline text-danger" onclick="rejectUser(${u.id})">
                                    <i class="dashicons dashicons-no"></i> ${SMS_I18n.__('reject')}
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function getSettingsHTML(db) {
    const s = db.settings;
    return `
        <div class="sms-content-header">
            <div>
                <h2>${SMS_I18n.__('school_settings')}</h2>
                <p class="text-muted">Configure institutional profile, academic sessions, currency, and portal preferences.</p>
            </div>
        </div>

        <div class="sms-panel sms-p-4" style="max-width:800px;">
            <form onsubmit="saveSettingsForm(event)">
                <div class="form-group">
                    <label>School Name *</label>
                    <input type="text" id="setSchoolName" value="${escapeHTML(s.school_name)}" required class="sms-input">
                </div>
                <div class="form-group">
                    <label>School Tagline</label>
                    <input type="text" id="setSchoolTagline" value="${escapeHTML(s.school_tagline)}" class="sms-input">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Official Email</label>
                        <input type="email" id="setSchoolEmail" value="${escapeHTML(s.school_email)}" class="sms-input">
                    </div>
                    <div class="form-group">
                        <label>Contact Phone</label>
                        <input type="text" id="setSchoolPhone" value="${escapeHTML(s.school_phone)}" class="sms-input">
                    </div>
                </div>
                <div class="form-group">
                    <label>${SMS_I18n.__('address')}</label>
                    <textarea id="setSchoolAddress" class="sms-input" rows="2">${escapeHTML(s.school_address)}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Current Session</label>
                        <input type="text" id="setSession" value="${escapeHTML(s.current_session)}" class="sms-input">
                    </div>
                    <div class="form-group">
                        <label>Currency Symbol</label>
                        <input type="text" id="setCurrency" value="${escapeHTML(s.currency_symbol)}" class="sms-input">
                    </div>
                </div>
                <button type="submit" class="sms-btn sms-btn-primary sms-btn-lg" style="margin-top:15px;">
                    ${SMS_I18n.__('save_settings')}
                </button>
            </form>
        </div>
    `;
}

/* ==========================================================================
   ROLE-SPECIFIC DASHBOARD HTML BUILDERS
   ========================================================================== */
function getTeacherDashboardHTML(db) {
    const teacherAssignments = db.teacherAssignments.filter(a => a.teacher_id === currentUser.id);
    return `
        <div class="sms-content-header">
            <div>
                <h2>Faculty Dashboard</h2>
                <p class="text-muted">Welcome, <strong>${escapeHTML(currentUser.name)}</strong></p>
            </div>
            <div class="header-actions">
                <button type="button" class="sms-btn sms-btn-primary" onclick="switchTab('attendance')">
                    <i class="dashicons dashicons-yes-alt"></i> ${SMS_I18n.__('mark_attendance')}
                </button>
            </div>
        </div>

        <div class="sms-panel">
            <div class="sms-panel-header">
                <h3><i class="dashicons dashicons-welcome-learn-more"></i> Assigned Classes & Subjects</h3>
            </div>
            <div class="sms-panel-body">
                <div class="sms-grid-3">
                    ${teacherAssignments.map(a => `
                        <div class="sms-card-program">
                            <div class="program-badge">${a.class_name} - ${a.section_name}</div>
                            <h3>${a.subject_name}</h3>
                            <div class="program-actions" style="margin-top:15px; display:flex; gap:8px;">
                                <button type="button" class="sms-btn sms-btn-sm sms-btn-primary" onclick="switchTab('attendance')">
                                    <i class="dashicons dashicons-yes-alt"></i> Mark Attendance
                                </button>
                                <button type="button" class="sms-btn sms-btn-sm sms-btn-outline" onclick="switchTab('examinations')">
                                    <i class="dashicons dashicons-awards"></i> Enter Marks
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function getStudentDashboardHTML(db) {
    const std = db.students.find(s => s.user_id === currentUser.id) || db.students[0];
    const invoices = db.invoices.filter(i => i.student_id === std.id);
    const results = db.examResults.filter(r => r.student_id === std.id);

    return `
        <div class="sms-content-header">
            <div>
                <h2>Student Portal</h2>
                <p class="text-muted">Welcome back, <strong>${escapeHTML(std.name)}</strong></p>
            </div>
            <div class="header-actions">
                <button type="button" class="sms-btn sms-btn-primary" onclick="printReportCard(${std.id})">
                    <i class="dashicons dashicons-printer"></i> ${SMS_I18n.__('print_report_card')}
                </button>
            </div>
        </div>

        <div class="sms-grid-2">
            <div class="sms-id-card">
                <div class="id-card-top">
                    <span class="school-tag">🎓 ${escapeHTML(db.settings.school_name)}</span>
                    <span class="id-badge">STUDENT IDENTITY</span>
                </div>
                <div class="id-card-body">
                    <div class="id-avatar">
                        ${std.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div class="id-details">
                        <h3 class="student-name">${escapeHTML(std.name)}</h3>
                        <p class="student-class">${std.class_name} - ${std.section_name}</p>
                        <div class="id-meta-grid">
                            <div><span>Roll #:</span> <strong>${std.roll_no}</strong></div>
                            <div><span>Adm #:</span> <strong>${std.admission_no}</strong></div>
                            <div><span>Blood:</span> <strong>${std.blood_group}</strong></div>
                            <div><span>Session:</span> <strong>${std.session_year}</strong></div>
                        </div>
                    </div>
                </div>
                <div class="id-card-bottom">
                    <span>Authorized Student Credential</span>
                    <span>Valid: 2026-2027</span>
                </div>
            </div>

            <div class="sms-stat-cards-grid" style="grid-template-columns: 1fr 1fr;">
                <div class="sms-stat-card card-teal">
                    <div class="stat-icon"><i class="dashicons dashicons-calendar-alt"></i></div>
                    <div class="stat-body">
                        <span class="stat-title">${SMS_I18n.__('attendance_rate')}</span>
                        <h3 class="stat-value">94%</h3>
                    </div>
                </div>
                <div class="sms-stat-card card-green">
                    <div class="stat-icon"><i class="dashicons dashicons-yes-alt"></i></div>
                    <div class="stat-body">
                        <span class="stat-title">Present Days</span>
                        <h3 class="stat-value">16 / 17</h3>
                    </div>
                </div>
                <div class="sms-stat-card card-blue">
                    <div class="stat-icon"><i class="dashicons dashicons-awards"></i></div>
                    <div class="stat-body">
                        <span class="stat-title">Board Standing</span>
                        <h3 class="stat-value">Grade A+</h3>
                    </div>
                </div>
                <div class="sms-stat-card card-orange">
                    <div class="stat-icon"><i class="dashicons dashicons-money-alt"></i></div>
                    <div class="stat-body">
                        <span class="stat-title">Invoices</span>
                        <h3 class="stat-value">${invoices.length} Issued</h3>
                    </div>
                </div>
            </div>
        </div>

        <div class="sms-grid-2" style="margin-top:20px;">
            <div class="sms-panel">
                <div class="sms-panel-header">
                    <h3><i class="dashicons dashicons-awards"></i> Academic Performance</h3>
                    <button type="button" class="sms-btn-link" onclick="printReportCard(${std.id})">View Marksheet</button>
                </div>
                <div class="sms-panel-body">
                    <table class="sms-table sms-table-sm">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Max</th>
                                <th>Obtained</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.map(r => `
                                <tr>
                                    <td><strong>${r.subject_name}</strong></td>
                                    <td>${r.max_marks}</td>
                                    <td><strong>${r.marks_obtained}</strong></td>
                                    <td><span class="sms-badge badge-grade">${r.grade}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="sms-panel">
                <div class="sms-panel-header">
                    <h3><i class="dashicons dashicons-money-alt"></i> Fee History</h3>
                </div>
                <div class="sms-panel-body">
                    <table class="sms-table sms-table-sm">
                        <thead>
                            <tr>
                                <th>Invoice #</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoices.map(inv => `
                                <tr>
                                    <td><strong>${inv.invoice_no}</strong></td>
                                    <td>${db.settings.currency_symbol} ${formatNumber(inv.total_amount)}</td>
                                    <td><span class="sms-badge badge-${inv.status}">${inv.status.toUpperCase()}</span></td>
                                    <td>
                                        <button type="button" class="sms-btn sms-btn-sm sms-btn-outline" onclick="printReceipt(${inv.id})">Receipt</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function getParentDashboardHTML(db) {
    const child = db.students[0];
    const invoices = db.invoices.filter(i => i.student_id === child.id);
    const results = db.examResults.filter(r => r.student_id === child.id);

    return `
        <div class="sms-content-header">
            <div>
                <h2>Parent Guardian Portal</h2>
                <p class="text-muted">Viewing academic and financial records for your children.</p>
            </div>
        </div>

        <div class="sms-panel sms-p-4" style="display:flex; align-items:center; gap:16px;">
            <div class="user-avatar" style="width:56px; height:56px; font-size:20px;">${child.name.substring(0, 2).toUpperCase()}</div>
            <div>
                <h3>${escapeHTML(child.name)}</h3>
                <p class="text-muted">${child.class_name} - ${child.section_name} | Roll #: <strong>${child.roll_no}</strong> | Adm #: <strong>${child.admission_no}</strong></p>
            </div>
        </div>

        <div class="sms-grid-2" style="margin-top:20px;">
            <div class="sms-panel">
                <div class="sms-panel-header">
                    <h3>Child Results</h3>
                    <button type="button" class="sms-btn-link" onclick="printReportCard(${child.id})">Print Report Card</button>
                </div>
                <div class="sms-panel-body">
                    <table class="sms-table sms-table-sm">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Obtained</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.map(r => `
                                <tr>
                                    <td>${r.subject_name}</td>
                                    <td>${r.marks_obtained}</td>
                                    <td><span class="sms-badge badge-grade">${r.grade}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="sms-panel">
                <div class="sms-panel-header">
                    <h3>Child Fees</h3>
                </div>
                <div class="sms-panel-body">
                    <table class="sms-table sms-table-sm">
                        <thead>
                            <tr>
                                <th>Invoice #</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoices.map(inv => `
                                <tr>
                                    <td>${inv.invoice_no}</td>
                                    <td>${db.settings.currency_symbol} ${formatNumber(inv.total_amount)}</td>
                                    <td><span class="sms-badge badge-${inv.status}">${inv.status.toUpperCase()}</span></td>
                                    <td>
                                        <button type="button" class="sms-btn sms-btn-sm sms-btn-outline" onclick="printReceipt(${inv.id})">Receipt</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function getAccountantDashboardHTML(db, stats, currency) {
    return `
        <div class="sms-content-header">
            <div>
                <h2>Accounts & Finance Terminal</h2>
                <p class="text-muted">Welcome, <strong>${escapeHTML(currentUser.name)}</strong> (School Accountant)</p>
            </div>
        </div>

        <div class="sms-stat-cards-grid">
            <div class="sms-stat-card card-green">
                <div class="stat-icon"><i class="dashicons dashicons-money-alt"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('total_revenue')}</span>
                    <h3 class="stat-value">${currency} ${formatNumber(stats.totalIncome)}</h3>
                </div>
            </div>
            <div class="sms-stat-card card-red">
                <div class="stat-icon"><i class="dashicons dashicons-cart"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('total_expenses')}</span>
                    <h3 class="stat-value">${currency} ${formatNumber(stats.totalExpense)}</h3>
                </div>
            </div>
            <div class="sms-stat-card card-blue">
                <div class="stat-icon"><i class="dashicons dashicons-vault"></i></div>
                <div class="stat-body">
                    <span class="stat-title">${SMS_I18n.__('net_balance')}</span>
                    <h3 class="stat-value">${currency} ${formatNumber(stats.netBalance)}</h3>
                </div>
            </div>
        </div>

        <div class="sms-panel" style="margin-top:20px;">
            <div class="sms-panel-header">
                <h3><i class="dashicons dashicons-money"></i> Fee Collection Counter</h3>
            </div>
            <div class="sms-table-responsive">
                <table class="sms-table">
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Student</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${db.invoices.map(inv => {
                            const due = inv.total_amount - inv.paid_amount;
                            return `
                                <tr>
                                    <td><strong>${inv.invoice_no}</strong></td>
                                    <td>${escapeHTML(inv.student_name)}</td>
                                    <td>${currency} ${formatNumber(inv.total_amount)}</td>
                                    <td><span class="sms-badge badge-${inv.status}">${inv.status.toUpperCase()}</span></td>
                                    <td>
                                        ${due > 0 ? `
                                            <button type="button" class="sms-btn sms-btn-sm sms-btn-primary" onclick="openCollectFeeModal(${inv.id}, '${inv.invoice_no}', ${due})">
                                                Collect
                                            </button>
                                        ` : `
                                            <button type="button" class="sms-btn sms-btn-sm sms-btn-outline" onclick="printReceipt(${inv.id})">
                                                Receipt
                                            </button>
                                        `}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/* ==========================================================================
   MODALS & INTERACTIONS
   ========================================================================== */
function setupEventListeners() {
    // Auth Tab Switch
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');
    if (tabLoginBtn && tabRegisterBtn) {
        tabLoginBtn.addEventListener('click', () => {
            tabLoginBtn.classList.add('active');
            tabRegisterBtn.classList.remove('active');
            document.getElementById('panelLogin').style.display = 'block';
            document.getElementById('panelRegister').style.display = 'none';
        });
        tabRegisterBtn.addEventListener('click', () => {
            tabRegisterBtn.classList.add('active');
            tabLoginBtn.classList.remove('active');
            document.getElementById('panelRegister').style.display = 'block';
            document.getElementById('panelLogin').style.display = 'none';
        });
    }

    // Login Form Submit
    const loginForm = document.getElementById('smsLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const db = SMSData.get();
            const found = db.users.find(u => u.username === username);

            if (found) {
                currentUser = found;
                sessionStorage.setItem('sms_current_user', JSON.stringify(currentUser));
                renderPortalView();
            } else {
                alert(SMS_I18n.__('account_pending_error'));
            }
        });
    }

    // Register Form Submit
    const regForm = document.getElementById('smsRegisterForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value.trim();
            const role = document.getElementById('regRole').value;
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();

            const db = SMSData.get();
            db.pendingUsers.push({
                id: Date.now(),
                username,
                name,
                email,
                requested_role: role,
                registered_at: new Date().toISOString().split('T')[0]
            });
            SMSData.save(db);

            const alertBox = document.getElementById('smsRegisterAlert');
            alertBox.className = 'sms-form-alert success';
            alertBox.textContent = SMS_I18n.__('pending_approval_msg');
            alertBox.style.display = 'block';
            regForm.reset();
        });
    }

    // Sidebar toggle mobile
    const toggle = document.getElementById('smsSidebarToggle');
    const sidebar = document.getElementById('smsSidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

function fillLogin(username, pwd) {
    document.getElementById('loginUsername').value = username;
    document.getElementById('loginPassword').value = pwd;
}

function logout() {
    sessionStorage.removeItem('sms_current_user');
    currentUser = null;
    renderAuthView();
}

function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;
    document.getElementById('smsModalTitle').textContent = el.getAttribute('data-title') || 'Details';
    document.getElementById('smsModalBody').innerHTML = el.innerHTML;
    document.getElementById('smsUniversalModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('smsUniversalModal').style.display = 'none';
}

function openCollectFeeModal(invoiceId, invoiceNo, dueAmount) {
    const body = `
        <form onsubmit="submitCollectFee(event, ${invoiceId})">
            <div class="form-group">
                <label>Collecting for Invoice #</label>
                <input type="text" value="${invoiceNo}" readonly class="sms-input">
            </div>
            <div class="form-group">
                <label>Payment Amount *</label>
                <input type="number" id="payAmountInput" value="${dueAmount}" required class="sms-input">
            </div>
            <div class="form-group">
                <label>Payment Method</label>
                <select id="payMethodInput" class="sms-input">
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="online">Online</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="sms-btn sms-btn-primary">Record Payment</button>
                <button type="button" class="sms-btn sms-btn-outline" onclick="closeModal()">Cancel</button>
            </div>
        </form>
    `;
    document.getElementById('smsModalTitle').textContent = 'Collect Fee Payment';
    document.getElementById('smsModalBody').innerHTML = body;
    document.getElementById('smsUniversalModal').style.display = 'flex';
}

function submitCollectFee(e, invoiceId) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('payAmountInput').value) || 0;
    const method = document.getElementById('payMethodInput').value;

    const db = SMSData.get();
    const inv = db.invoices.find(i => i.id === invoiceId);
    if (inv) {
        inv.paid_amount += amount;
        if (inv.paid_amount >= inv.total_amount) {
            inv.status = 'paid';
        } else {
            inv.status = 'partial';
        }

        const payNo = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
        db.payments.push({
            id: Date.now(),
            invoice_id: invoiceId,
            payment_no: payNo,
            amount: amount,
            payment_date: new Date().toISOString().split('T')[0],
            payment_method: method,
            transaction_ref: 'RCP-' + Math.floor(100 + Math.random() * 900),
            notes: 'Paid at counter'
        });

        SMSData.save(db);
        closeModal();
        alert(`Payment recorded successfully! Receipt #${payNo} issued.`);
        renderActiveTab();
    }
}

function printReceipt(invoiceId) {
    const db = SMSData.get();
    const inv = db.invoices.find(i => i.id === invoiceId) || db.invoices[0];
    const payments = db.payments.filter(p => p.invoice_id === inv.id);
    const settings = db.settings;

    const body = `
        <div class="sms-receipt-modal" id="printableReceipt">
            <div class="sms-receipt-header">
                <h3>${escapeHTML(settings.school_name)}</h3>
                <p>${escapeHTML(settings.school_address)} | Tel: ${escapeHTML(settings.school_phone)}</p>
                <div class="sms-badge badge-receipt">${SMS_I18n.__('fee_receipt')}</div>
            </div>

            <div class="sms-receipt-meta">
                <div><strong>Invoice #:</strong> ${inv.invoice_no}</div>
                <div><strong>Date:</strong> 2026-09-17</div>
                <div><strong>Student:</strong> ${escapeHTML(inv.student_name)}</div>
                <div><strong>Class:</strong> ${inv.class_name}</div>
            </div>

            <table class="sms-table sms-receipt-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Due</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${escapeHTML(inv.title)}</td>
                        <td>${settings.currency_symbol} ${formatNumber(inv.total_amount)}</td>
                        <td>${settings.currency_symbol} ${formatNumber(inv.paid_amount)}</td>
                        <td><strong>${settings.currency_symbol} ${formatNumber(inv.total_amount - inv.paid_amount)}</strong></td>
                    </tr>
                </tbody>
            </table>

            <h4 style="margin-top:15px;">Transactions</h4>
            <table class="sms-table sms-table-sm">
                <thead>
                    <tr>
                        <th>Receipt #</th>
                        <th>Date</th>
                        <th>Method</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${payments.length === 0 ? '<tr><td colspan="4">No transactions.</td></tr>' : payments.map(p => `
                        <tr>
                            <td>${p.payment_no}</td>
                            <td>${p.payment_date}</td>
                            <td>${p.payment_method.toUpperCase()}</td>
                            <td><strong>${settings.currency_symbol} ${formatNumber(p.amount)}</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="sms-receipt-footer">
                <div class="sms-signature-box">
                    <span class="line"></span>
                    <span class="label">Accounts Office</span>
                </div>
                <div class="sms-signature-box">
                    <span class="line"></span>
                    <span class="label">Official Stamp</span>
                </div>
            </div>
        </div>
        <button type="button" class="sms-btn sms-btn-primary" onclick="window.print()">
            <i class="dashicons dashicons-printer"></i> Print Receipt
        </button>
    `;

    document.getElementById('smsModalTitle').textContent = 'Official Payment Receipt';
    document.getElementById('smsModalBody').innerHTML = body;
    document.getElementById('smsUniversalModal').style.display = 'flex';
}

function printReportCard(studentId) {
    const db = SMSData.get();
    const std = db.students.find(s => s.id === studentId) || db.students[0];
    const results = db.examResults.filter(r => r.student_id === std.id);
    const settings = db.settings;

    let totalMax = 0;
    let totalObt = 0;
    results.forEach(r => {
        totalMax += r.max_marks;
        totalObt += r.marks_obtained;
    });
    const pct = totalMax > 0 ? Math.round((totalObt / totalMax) * 100) : 0;
    const finalGrade = SMSData.calculateGrade(pct);

    const body = `
        <div class="sms-report-card-printable" id="printableReportCard">
            <div class="sms-report-header">
                <h2>🎓 ${escapeHTML(settings.school_name)}</h2>
                <p>${escapeHTML(settings.school_address)}</p>
                <div class="sms-report-title-badge">
                    <h3>Mid-Term Examination (2026-2027)</h3>
                    <h4>${SMS_I18n.__('report_card')}</h4>
                </div>
            </div>

            <div class="sms-report-student-info">
                <div><strong>Student:</strong> ${escapeHTML(std.name)}</div>
                <div><strong>Roll #:</strong> ${std.roll_no}</div>
                <div><strong>Class:</strong> ${std.class_name} (${std.section_name})</div>
                <div><strong>Admission #:</strong> ${std.admission_no}</div>
            </div>

            <table class="sms-table sms-report-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Total</th>
                        <th>Pass</th>
                        <th>Obtained</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(r => `
                        <tr>
                            <td><strong>${r.subject_name}</strong></td>
                            <td>${r.max_marks}</td>
                            <td>${r.pass_marks}</td>
                            <td><strong>${r.marks_obtained}</strong></td>
                            <td><span class="sms-badge badge-grade">${r.grade}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr class="sms-report-total-row">
                        <th>Total</th>
                        <th>${totalMax}</th>
                        <th>-</th>
                        <th>${totalObt}</th>
                        <th>${finalGrade} (${pct}%)</th>
                    </tr>
                </tfoot>
            </table>

            <div class="sms-report-footer">
                <div class="sms-signature-box">
                    <span class="line"></span>
                    <span class="label">Class Teacher</span>
                </div>
                <div class="sms-signature-box">
                    <span class="line"></span>
                    <span class="label">Controller of Exams</span>
                </div>
                <div class="sms-signature-box">
                    <span class="line"></span>
                    <span class="label">Principal</span>
                </div>
            </div>
        </div>
        <button type="button" class="sms-btn sms-btn-primary" onclick="window.print()">
            <i class="dashicons dashicons-printer"></i> Print Marksheet
        </button>
    `;

    document.getElementById('smsModalTitle').textContent = 'Official Student Report Card';
    document.getElementById('smsModalBody').innerHTML = body;
    document.getElementById('smsUniversalModal').style.display = 'flex';
}

function viewStudentDossier(studentId) {
    printReportCard(studentId);
}

function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to deactivate this student?')) return;
    const db = SMSData.get();
    db.students = db.students.filter(s => s.id !== studentId);
    SMSData.save(db);
    renderActiveTab();
}

function approveUser(userId) {
    const db = SMSData.get();
    const userIndex = db.pendingUsers.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        const u = db.pendingUsers[userIndex];
        db.users.push({
            id: Date.now(),
            username: u.username,
            name: u.name,
            email: u.email,
            role: u.requested_role,
            status: 'approved'
        });
        db.pendingUsers.splice(userIndex, 1);
        SMSData.save(db);
        alert(SMS_I18n.__('record_saved'));
        renderActiveTab();
    }
}

function rejectUser(userId) {
    const db = SMSData.get();
    db.pendingUsers = db.pendingUsers.filter(u => u.id !== userId);
    SMSData.save(db);
    renderActiveTab();
}

function saveSettingsForm(e) {
    e.preventDefault();
    const db = SMSData.get();
    db.settings.school_name = document.getElementById('setSchoolName').value;
    db.settings.school_tagline = document.getElementById('setSchoolTagline').value;
    db.settings.school_email = document.getElementById('setSchoolEmail').value;
    db.settings.school_phone = document.getElementById('setSchoolPhone').value;
    db.settings.school_address = document.getElementById('setSchoolAddress').value;
    db.settings.current_session = document.getElementById('setSession').value;
    db.settings.currency_symbol = document.getElementById('setCurrency').value;

    SMSData.save(db);
    alert(SMS_I18n.__('record_saved'));
    renderPortalView();
}

function formatNumber(num) {
    return new Intl.NumberFormat().format(num || 0);
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function submitAddStudent(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('[name="name"]').value.trim();
    const username = form.querySelector('[name="username"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const admission_no = form.querySelector('[name="admission_no"]').value.trim();
    const roll_no = form.querySelector('[name="roll_no"]').value.trim();
    const class_id = parseInt(form.querySelector('[name="class_id"]').value) || 1;
    const section_id = parseInt(form.querySelector('[name="section_id"]').value) || 1;
    const gender = form.querySelector('[name="gender"]').value;
    const address = form.querySelector('[name="address"]').value;

    const db = SMSData.get();
    const newId = db.students.length ? Math.max(...db.students.map(s => s.id)) + 1 : 1;
    const userId = db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 100;

    // Add user account
    db.users.push({
        id: userId,
        username,
        name,
        email,
        role: 'student',
        student_id: newId
    });

    // Add student
    db.students.push({
        id: newId,
        user_id: userId,
        admission_no,
        roll_no,
        class_id,
        section_id,
        parent_user_id: 0,
        dob: '2012-05-15',
        gender,
        address,
        admission_date: new Date().toISOString().split('T')[0],
        status: 'active'
    });

    SMSData.save(db);
    closeModal();
    alert(SMS_I18n.__('record_saved'));
    renderActiveTab();
}

function submitAddTeacher(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('[name="name"]').value.trim();
    const username = form.querySelector('[name="username"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const teacher_id_code = form.querySelector('[name="teacher_id"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const qualification = form.querySelector('[name="qualification"]').value.trim();
    const designation = form.querySelector('[name="designation"]').value.trim();

    const db = SMSData.get();
    const newId = db.teachers.length ? Math.max(...db.teachers.map(t => t.id)) + 1 : 1;
    const userId = db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 200;

    // Add user account
    db.users.push({
        id: userId,
        username,
        name,
        email,
        role: 'teacher',
        teacher_id: newId
    });

    // Add teacher record
    db.teachers.push({
        id: newId,
        user_id: userId,
        teacher_id: teacher_id_code,
        qualification,
        designation,
        joining_date: new Date().toISOString().split('T')[0],
        status: 'active'
    });

    SMSData.save(db);
    closeModal();
    alert(SMS_I18n.__('record_saved'));
    renderActiveTab();
}

function submitAddExpense(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.querySelector('[name="title"]').value.trim();
    const category = form.querySelector('[name="category"]').value;
    const amount = parseFloat(form.querySelector('[name="amount"]').value) || 0;
    const expense_date = form.querySelector('[name="expense_date"]').value;
    const description = form.querySelector('[name="description"]').value;

    const db = SMSData.get();
    const newId = db.expenses.length ? Math.max(...db.expenses.map(x => x.id)) + 1 : 1;

    db.expenses.push({
        id: newId,
        title,
        category,
        amount,
        expense_date,
        description
    });

    SMSData.save(db);
    closeModal();
    alert(SMS_I18n.__('record_saved'));
    renderActiveTab();
}

function submitAddNotice(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.querySelector('[name="title"]').value.trim();
    const audience = form.querySelector('[name="audience"]').value;
    const priority = form.querySelector('[name="priority"]').value;
    const content = form.querySelector('[name="content"]').value.trim();

    const db = SMSData.get();
    const newId = db.notices.length ? Math.max(...db.notices.map(n => n.id)) + 1 : 1;

    db.notices.unshift({
        id: newId,
        title,
        audience,
        priority,
        content,
        publish_date: new Date().toISOString().split('T')[0]
    });

    SMSData.save(db);
    closeModal();
    alert(SMS_I18n.__('record_saved'));
    renderActiveTab();
}
