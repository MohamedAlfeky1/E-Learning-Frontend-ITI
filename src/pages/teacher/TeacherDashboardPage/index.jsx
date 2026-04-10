import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const earningsData = [
  { day: "Mon", value: 1200, label: "$1.2k" },
  { day: "Tue", value: 2100, label: "$2.1k" },
  { day: "Wed", value: 3400, label: "$3.4k", active: true },
  { day: "Thu", value: 2800, label: "$2.8k" },
  { day: "Fri", value: 3100, label: "$3.1k" },
  { day: "Sat", value: 1800, label: "$1.8k" },
  { day: "Sun", value: 2400, label: "$2.4k" },
];

const upcomingEvents = [
  {
    day: "14",
    month: "MAR",
    title: "Live Q&A: Advanced Physics",
    subtitle: "Starts in 45 minutes",
  },
  {
    day: "16",
    month: "MAR",
    title: "Faculty Meeting",
    subtitle: "02:00 PM via Zoom",
  },
  {
    day: "20",
    month: "MAR",
    title: "Grade Submission",
    subtitle: "Midterm 01 Deadline",
  },
];

const activeCourses = [
  {
    id: 1,
    title: "Quantum Mechanics: Foundations",
    enrollments: 92,
    othersStudying: 89,
    image: null,
  },
  {
    id: 2,
    title: "Advanced Calculus: Series & Limits",
    enrollments: 154,
    othersStudying: 151,
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/cd6e175325732bfc239182b8323e83ef1ebed2f3?width=608",
  },
];

// SVG Icons
const RevenueIcon = () => (
  <svg width="38" height="32" viewBox="0 0 38 32" fill="none">
    <rect width="38" height="32" rx="12" fill="#EEF2FF" />
    <path
      d="M21 17C20.1667 17 19.4583 16.7083 18.875 16.125C18.2917 15.5417 18 14.8333 18 14C18 13.1667 18.2917 12.4583 18.875 11.875C19.4583 11.2917 20.1667 11 21 11C21.8333 11 22.5417 11.2917 23.125 11.875C23.7083 12.4583 24 13.1667 24 14C24 14.8333 23.7083 15.5417 23.125 16.125C22.5417 16.7083 21.8333 17 21 17ZM14 20C13.45 20 12.9792 19.8042 12.5875 19.4125C12.1958 19.0208 12 18.55 12 18V10C12 9.45 12.1958 8.97917 12.5875 8.5875C12.9792 8.19583 13.45 8 14 8H28C28.55 8 29.0208 8.19583 29.4125 8.5875C29.8042 8.97917 30 9.45 30 10V18C30 18.55 29.8042 19.0208 29.4125 19.4125C29.0208 19.8042 28.55 20 28 20H14ZM16 18H26C26 17.45 26.1958 16.9792 26.5875 16.5875C26.9792 16.1958 27.45 16 28 16V12C27.45 12 26.9792 11.8042 26.5875 11.4125C26.1958 11.0208 26 10.55 26 10H16C16 10.55 15.8042 11.0208 15.4125 11.4125C15.0208 11.8042 14.55 12 14 12V16C14.55 16 15.0208 16.1958 15.4125 16.5875C15.8042 16.9792 16 17.45 16 18ZM27 24H10C9.45 24 8.97917 23.8042 8.5875 23.4125C8.19583 23.0208 8 22.55 8 22V11H10V22H27V24ZM14 18V10V18Z"
      fill="#4F46E5"
    />
  </svg>
);

const EnrollmentIcon = () => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
    <rect width="36" height="28" rx="12" fill="#FAF5FF" />
    <path
      d="M9.4 20L8 18.6L15.4 11.15L19.4 15.15L24.6 10H22V8H28V14H26V11.4L19.4 18L15.4 14L9.4 20Z"
      fill="#9333EA"
    />
  </svg>
);

const RatingIcon = () => (
  <svg width="36" height="35" viewBox="0 0 36 35" fill="none">
    <rect width="36" height="35" rx="12" fill="#FFFBEB" />
    <path
      d="M11.825 27L13.45 19.975L8 15.25L15.2 14.625L18 8L20.8 14.625L28 15.25L22.55 19.975L24.175 27L18 23.275L11.825 27Z"
      fill="#F59E0B"
    />
  </svg>
);

const PendingIcon = () => (
  <svg width="35" height="37" viewBox="0 0 35 37" fill="none">
    <rect width="35" height="37" rx="12" fill="#FFDAD6" />
    <path
      d="M22 29C20.6167 29 19.4375 28.5125 18.4625 27.5375C17.4875 26.5625 17 25.3833 17 24C17 22.6167 17.4875 21.4375 18.4625 20.4625C19.4375 19.4875 20.6167 19 22 19C23.3833 19 24.5625 19.4875 25.5375 20.4625C26.5125 21.4375 27 22.6167 27 24C27 25.3833 26.5125 26.5625 25.5375 27.5375C24.5625 28.5125 23.3833 29 22 29ZM23.675 26.375L24.375 25.675L22.5 23.8V21H21.5V24.2L23.675 26.375ZM10 28C9.45 28 8.97917 27.8042 8.5875 27.4125C8.19583 27.0208 8 26.55 8 26V12C8 11.45 8.19583 10.9792 8.5875 10.5875C8.97917 10.1958 9.45 10 10 10H14.175C14.3583 9.41667 14.7167 8.9375 15.25 8.5625C15.7833 8.1875 16.3667 8 17 8C17.6667 8 18.2625 8.1875 18.7875 8.5625C19.3125 8.9375 19.6667 9.41667 19.85 10H24C24.55 10 25.0208 10.1958 25.4125 10.5875C25.8042 10.9792 26 11.45 26 12V18.25C25.7 18.0333 25.3833 17.85 25.05 17.7C24.7167 17.55 24.3667 17.4167 24 17.3V12H22V15H12V12H10V26H15.3C15.4167 26.3667 15.55 26.7167 15.7 27.05C15.85 27.3833 16.0333 27.7 16.25 28H10ZM17 12C17.2833 12 17.5208 11.9042 17.7125 11.7125C17.9042 11.5208 18 11.2833 18 11C18 10.7167 17.9042 10.4792 17.7125 10.2875C17.5208 10.0958 17.2833 10 17 10C16.7167 10 16.4792 10.0958 16.2875 10.2875C16.0958 10.4792 16 10.7167 16 11C16 11.2833 16.0958 11.5208 16.2875 11.7125C16.4792 11.9042 16.7167 12 17 12Z"
      fill="#BA1A1A"
    />
  </svg>
);

const EditIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path
      d="M1.16667 9.33333H1.99792L7.7 3.63125L6.86875 2.8L1.16667 8.50208V9.33333ZM0 10.5V8.02083L7.7 0.335417C7.81667 0.228472 7.94549 0.145833 8.08646 0.0875C8.22743 0.0291667 8.37569 0 8.53125 0C8.68681 0 8.8375 0.0291667 8.98333 0.0875C9.12917 0.145833 9.25556 0.233333 9.3625 0.35L10.1646 1.16667C10.2812 1.27361 10.3663 1.4 10.4198 1.54583C10.4733 1.69167 10.5 1.8375 10.5 1.98333C10.5 2.13889 10.4733 2.28715 10.4198 2.42812C10.3663 2.5691 10.2812 2.69792 10.1646 2.81458L2.47917 10.5H0ZM9.33333 1.98333L8.51667 1.16667L9.33333 1.98333ZM7.27708 3.22292L6.86875 2.8L7.7 3.63125L7.27708 3.22292Z"
      fill="#3525CD"
    />
  </svg>
);

const StatsIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path
      d="M7 9.33333V5.25H9.33333V9.33333H7ZM3.5 9.33333V0H5.83333V9.33333H3.5ZM0 9.33333V2.91667H2.33333V9.33333H0Z"
      fill="#464555"
    />
  </svg>
);

const DotsMenuIcon = () => (
  <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
    <path
      d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14C0 13.45 0.195833 12.9792 0.5875 12.5875C0.979167 12.1958 1.45 12 2 12C2.55 12 3.02083 12.1958 3.4125 12.5875C3.80417 12.9792 4 13.45 4 14C4 14.55 3.80417 15.0208 3.4125 15.4125C3.02083 15.8042 2.55 16 2 16ZM2 10C1.45 10 0.979167 9.80417 0.5875 9.4125C0.195833 9.02083 0 8.55 0 8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6C2.55 6 3.02083 6.19583 3.4125 6.5875C3.80417 6.97917 4 7.45 4 8C4 8.55 3.80417 9.02083 3.4125 9.4125C3.02083 9.80417 2.55 10 2 10ZM2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4Z"
      fill="#94A3B8"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M7.5 10H0V7.5H7.5V0H10V7.5H17.5V10H10V17.5H7.5V10Z"
      fill="#3525CD"
    />
  </svg>
);

// Custom tooltip for the earnings bar chart
const EarningsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="earnings-tooltip">
        <span>{payload[0].payload.label}</span>
      </div>
    );
  }
  return null;
};

// Custom bar label shown above active bar
const ActiveBarLabel = (props) => {
  const { x, y, width, value, index } = props;
  const entry = earningsData[index];
  if (!entry?.active) return null;
  return (
    <g>
      <rect x={x - 5} y={y - 34} width={52} height={23} rx={4} fill="#141B2B" />
      <text
        x={x + width / 2}
        y={y - 17}
        textAnchor="middle"
        fill="#fff"
        fontSize={10}
        fontFamily="Inter, sans-serif"
      >
        {entry.label}
      </text>
    </g>
  );
};

// Stat Card component
const StatCard = ({ icon, badge, badgeColor, label, children }) => (
  <div className="stat-card">
    <div className="stat-card__header">
      {icon}
      <span className="stat-card__badge" style={{ color: badgeColor }}>
        {badge}
      </span>
    </div>
    <p className="stat-card__label">{label}</p>
    <div className="stat-card__value">{children}</div>
  </div>
);

// Course Card component
const CourseCard = ({ course }) => (
  <div className="course-card">
    <div className="course-card__thumbnail">
      {course.image ? (
        <img
          src={course.image}
          alt={course.title}
          className="course-card__img"
        />
      ) : (
        <div className="course-card__img-placeholder" />
      )}
      <span className="course-card__enrollment-badge">
        {course.enrollments} Enrollments
      </span>
    </div>
    <div className="course-card__body">
      <div className="course-card__title-row">
        <h3 className="course-card__title">{course.title}</h3>
        <button className="course-card__menu-btn" aria-label="More options">
          <DotsMenuIcon />
        </button>
      </div>
      <div className="course-card__students">
        <div className="student-avatars">
          <div className="student-avatar student-avatar--1" />
          <div className="student-avatar student-avatar--2" />
          <div className="student-avatar student-avatar--3" />
        </div>
        <span className="course-card__student-count">
          +{course.othersStudying} others studying
        </span>
      </div>
      <div className="course-card__actions">
        <button className="course-card__edit-btn">
          <EditIcon />
          Edit Course
        </button>
        <button className="course-card__stats-btn">
          <StatsIcon />
          Stats
        </button>
      </div>
    </div>
  </div>
);

const TeacherDashboardPage = () => {
  return (
    <div className="dashboard-page p-8">
      {/* Hero Greeting */}
      <section className="dashboard-hero">
        <h1 className="dashboard-hero__title">
          Welcome back, Academic Prism Instructor
        </h1>
        <p className="dashboard-hero__subtitle">
          Your students have shown a 12% increase in engagement this week. Here
          is a summary of your digital campus performance.
        </p>
      </section>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <StatCard
          icon={<RevenueIcon />}
          badge="+14.2%"
          badgeColor="#007030"
          label="Total Revenue"
        >
          <span className="stat-value">$24,850.00</span>
        </StatCard>

        <StatCard
          icon={<EnrollmentIcon />}
          badge="+8%"
          badgeColor="#007030"
          label="Enrollments"
        >
          <span className="stat-value">1,284</span>
        </StatCard>

        <StatCard
          icon={<RatingIcon />}
          badge="Steady"
          badgeColor="#94A3B8"
          label="Avg Rating"
        >
          <span className="stat-value stat-value--rating">
            4.9
            <span className="stat-value__suffix">/5.0</span>
          </span>
        </StatCard>

        <StatCard
          icon={<PendingIcon />}
          badge="Due soon"
          badgeColor="#BA1A1A"
          label="Pending Review"
        >
          <span className="stat-value">42</span>
        </StatCard>
      </div>

      {/* Chart + Events Panel */}
      <div className="dashboard-middle-row">
        {/* Weekly Earnings Chart */}
        <div className="earnings-section">
          <div className="earnings-section__header">
            <div>
              <h2 className="earnings-section__title">Weekly Earnings</h2>
              <p className="earnings-section__subtitle">
                Revenue flow from 7 Mar - 14 Mar
              </p>
            </div>
            <div className="earnings-section__filter">
              <span className="earnings-section__filter-label">
                Last 7 Days
              </span>
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                <path
                  d="M6.2998 8.40039L10.4998 12.6004L14.6998 8.40039"
                  stroke="#6B7280"
                  strokeWidth="1.575"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="earnings-chart">
            <ResponsiveContainer width="100%" height={256}>
              <BarChart
                data={earningsData}
                margin={{ top: 40, right: 8, left: 8, bottom: 0 }}
                barCategoryGap="20%"
              >
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={(props) => {
                    const { x, y, payload, index } = props;
                    const isActive = earningsData[index]?.active;
                    return (
                      <text
                        x={x}
                        y={y + 8}
                        textAnchor="middle"
                        fill={isActive ? "#4F46E5" : "#94A3B8"}
                        fontSize={10}
                        fontWeight={700}
                        fontFamily="Inter, sans-serif"
                        textTransform="uppercase"
                      >
                        {payload.value}
                      </text>
                    );
                  }}
                />
                <Tooltip content={<EarningsTooltip />} cursor={false} />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  label={<ActiveBarLabel />}
                >
                  {earningsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.active ? "#4F46E5" : "#E8EDFF"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="events-panel">
          <h2 className="events-panel__title">Upcoming Events</h2>
          <div className="events-list">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="event-item">
                <div className="event-item__date-badge">
                  <span className="event-item__day">{event.day}</span>
                  <span className="event-item__month">{event.month}</span>
                </div>
                <div className="event-item__info">
                  <p className="event-item__title">{event.title}</p>
                  <p className="event-item__subtitle">{event.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="events-panel__cta">View Full Calendar</button>
        </div>
      </div>

      {/* Active Courses */}
      <section className="courses-section">
        <div className="courses-section__header">
          <h2 className="courses-section__title">Active Courses</h2>
          <a href="#" className="courses-section__see-all">
            See all courses
          </a>
        </div>

        <div className="courses-grid">
          {activeCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}

          {/* Add New Course CTA */}
          <div className="new-course-card">
            <div className="new-course-card__icon-wrapper">
              <PlusIcon />
            </div>
            <h3 className="new-course-card__title">Launch New Module</h3>
            <p className="new-course-card__desc">
              Draft your next course using the Curriculum Builder.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        /* ── Page layout ─────────────────────────────────────────── */
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 40px;
          background: #f8fafc;
          min-height: 100%;
          font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
        }

        /* ── Hero ────────────────────────────────────────────────── */
        .dashboard-hero__title {
          color: #141b2b;
          font-family: 'Plus Jakarta Sans', Inter, sans-serif;
          font-size: 30px;
          font-weight: 700;
          line-height: 36px;
          letter-spacing: -0.75px;
          margin: 0 0 8px;
        }
        .dashboard-hero__subtitle {
          color: #464555;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          max-width: 672px;
          margin: 0;
        }

        /* ── Stats grid ──────────────────────────────────────────── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }
        .stat-card {
          background: #fff;
          border: 1px solid #fff;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 20px 40px -12px rgba(20, 27, 43, 0.04);
        }
        .stat-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .stat-card__badge {
          font-size: 12px;
          font-weight: 700;
          line-height: 16px;
          padding: 4px 8px;
          border-radius: 9999px;
        }
        .stat-card__label {
          color: #464555;
          font-size: 12px;
          font-weight: 600;
          line-height: 16px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin: 0;
        }
        .stat-value {
          color: #141b2b;
          font-family: 'Plus Jakarta Sans', Inter, sans-serif;
          font-size: 24px;
          font-weight: 800;
          line-height: 32px;
          display: inline-block;
          margin-top: 4px;
        }
        .stat-value--rating {
          display: inline-flex;
          align-items: baseline;
          gap: 2px;
        }
        .stat-value__suffix {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
        }

        /* ── Middle row: chart + events ──────────────────────────── */
        .dashboard-middle-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px;
        }

        /* Earnings chart section */
        .earnings-section {
          grid-column: 1 / span 2;
          background: #fff;
          border: 1px solid #fff;
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          box-shadow: 0 20px 40px -12px rgba(20, 27, 43, 0.04);
        }
        .earnings-section__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .earnings-section__title {
          color: #141b2b;
          font-family: 'Plus Jakarta Sans', Inter, sans-serif;
          font-size: 18px;
          font-weight: 700;
          line-height: 28px;
          margin: 0;
        }
        .earnings-section__subtitle {
          color: #464555;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          margin: 0;
        }
        .earnings-section__filter {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 7.5px 8px 7.5px 12px;
          cursor: pointer;
          min-width: 140px;
          justify-content: space-between;
        }
        .earnings-section__filter-label {
          color: #141b2b;
          font-size: 14px;
          font-weight: 700;
          line-height: 20px;
        }
        .earnings-chart {
          flex: 1;
        }
        .earnings-tooltip {
          background: #141b2b;
          color: #fff;
          font-size: 10px;
          font-family: Inter, sans-serif;
          border-radius: 4px;
          padding: 4px 8px;
        }

        /* Upcoming events panel */
        .events-panel {
          grid-column: 3 / span 1;
          background: linear-gradient(135deg, #312e81 0%, #4338ca 40%, #6d28d9 100%);
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .events-panel__title {
          color: #fff;
          font-family: 'Plus Jakarta Sans', Inter, sans-serif;
          font-size: 18px;
          font-weight: 700;
          line-height: 28px;
          margin: 0;
        }
        .events-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
        }
        .event-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .event-item__date-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.10);
          backdrop-filter: blur(6px);
          flex-shrink: 0;
        }
        .event-item__day {
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          line-height: 16px;
        }
        .event-item__month {
          color: #fff;
          font-size: 8px;
          font-weight: 400;
          line-height: 12px;
          letter-spacing: -0.4px;
          text-transform: uppercase;
        }
        .event-item__title {
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          line-height: 20px;
          margin: 0 0 2px;
        }
        .event-item__subtitle {
          color: rgba(199, 210, 254, 0.70);
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          margin: 0;
        }
        .events-panel__cta {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid rgba(255, 255, 255, 0.60);
          background: transparent;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          font-family: Inter, sans-serif;
          cursor: pointer;
          transition: background 0.2s;
          text-align: center;
        }
        .events-panel__cta:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        /* ── Active Courses ───────────────────────────────────────── */
        .courses-section__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .courses-section__title {
          color: #141b2b;
          font-family: 'Plus Jakarta Sans', Inter, sans-serif;
          font-size: 20px;
          font-weight: 700;
          line-height: 28px;
          margin: 0;
        }
        .courses-section__see-all {
          color: #4f46e5;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }
        .courses-section__see-all:hover {
          text-decoration: underline;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        /* Course card */
        .course-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px -12px rgba(20, 27, 43, 0.04);
          display: flex;
          flex-direction: column;
        }
        .course-card__thumbnail {
          position: relative;
          height: 192px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .course-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .course-card__img-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        }
        .course-card__enrollment-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.70);
          border: 1px solid rgba(255, 255, 255, 0.20);
          backdrop-filter: blur(10px);
          border-radius: 9999px;
          padding: 4px 12px;
          color: #3525cd;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .course-card__body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .course-card__title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }
        .course-card__title {
          color: #141b2b;
          font-family: 'Plus Jakarta Sans', Inter, sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 20px;
          margin: 0;
          flex: 1;
        }
        .course-card__menu-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          flex-shrink: 0;
        }
        .course-card__students {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 8px;
        }
        .student-avatars {
          display: flex;
        }
        .student-avatar {
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          border: 2px solid #fff;
          margin-left: -6px;
        }
        .student-avatar:first-child {
          margin-left: 0;
        }
        .student-avatar--1 { background: #e2e8f0; }
        .student-avatar--2 { background: #cbd5e1; }
        .student-avatar--3 { background: #94a3b8; }
        .course-card__student-count {
          color: #464555;
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
        }
        .course-card__actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f8fafc;
          padding-top: 16px;
          margin-top: 8px;
        }
        .course-card__edit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #3525cd;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          font-family: Inter, sans-serif;
        }
        .course-card__stats-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #464555;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          font-family: Inter, sans-serif;
        }

        /* New course CTA card */
        .new-course-card {
          border: 2px dashed #cbd5e1;
          background: #f1f5f9;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 48px 32px;
          gap: 8px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .new-course-card:hover {
          border-color: #4f46e5;
        }
        .new-course-card__icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 9999px;
          background: #fff;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        .new-course-card__title {
          color: #141b2b;
          font-family: 'Plus Jakarta Sans', Inter, sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
          margin: 0;
        }
        .new-course-card__desc {
          color: #464555;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          margin: 0;
        }

        /* ── Responsive ──────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .dashboard-middle-row {
            grid-template-columns: 1fr;
          }
          .earnings-section {
            grid-column: 1;
          }
          .events-panel {
            grid-column: 1;
          }
          .courses-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .courses-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-footer {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          .dashboard-footer__links {
            flex-wrap: wrap;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboardPage;
