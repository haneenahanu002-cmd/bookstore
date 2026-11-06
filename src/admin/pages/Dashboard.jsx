
import React from "react";
import AdminHeader from "../components/Adminheader";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHouse,
  faBookOpen,
  faGear,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { generateMockData } from "@recharts/devtools";

const data = generateMockData(6, 823);
import { Pie, PieChart} from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

// #region Sample data
const data01 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const data02 = [
  { name: 'A1', value: 100 },
  { name: 'A2', value: 300 },
  { name: 'B1', value: 100 },
  { name: 'B2', value: 80 },
  { name: 'B3', value: 40 },
  { name: 'B4', value: 30 },
  { name: 'B5', value: 50 },
  { name: 'C1', value: 100 },
  { name: 'C2', value: 200 },
  { name: 'D1', value: 150 },
  { name: 'D2', value: 50 },
];




function Dashboard() {
  const navigate = useNavigate();

  // SIDEBAR MENU ITEMS
  const menuItems = [
    { name: "Home", icon: faHouse, path: "/admin-dashboard" },
    { name: "All Books", icon: faBookOpen, path: "/careers?tab=books" },
    { name: "Settings", icon: faGear, path: "/admin-settings" },
  ];

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="flex min-h-[calc(100vh-100px)]">

        {/* SIDEBAR */}
        <aside className="flex w-60 shrink-0 flex-col bg-black text-white">

          {/* SIDEBAR HEADER */}
          <div className="flex items-center gap-3 border-b border-gray-800 px-5 py-6">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black">
              <FontAwesomeIcon icon={faUser} size="xl" />
            </div>

            <div>
              <h2 className="text-lg font-bold">BOOK STORE</h2>
              <p className="text-sm text-gray-400">Admin</p>
            </div>

          </div>

          {/* SIDEBAR MENU */}
          <nav className="flex-1 space-y-2 p-4">

            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white no-underline transition-colors hover:bg-gray-800"
              >
                <FontAwesomeIcon icon={item.icon} className="w-5" />
                <span>{item.name}</span>
              </Link>
            ))}

          </nav>

          {/* LOGOUT */}
          <div className="border-t border-gray-800 p-4">

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white transition-colors hover:bg-gray-800"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </button>

          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1">

          {/* DASHBOARD CARDS */}
          <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">

            {/* TOTAL BOOKS */}
            <div className="flex items-center gap-4 rounded-lg bg-[#182878] p-6 text-white shadow-md">

              <span className="text-3xl" aria-hidden="true">
                📚
              </span>

              <div>
                <h2 className="text-sm">Total Number of Books</h2>
                <p className="text-2xl font-bold">100+</p>
              </div>

            </div>

            {/* TOTAL USERS */}
            <div className="flex items-center gap-4 rounded-lg bg-[#32833b] p-6 text-white shadow-md">

              <span className="text-3xl" aria-hidden="true">
                👥
              </span>

              <div>
                <h2 className="text-sm">Total Number of Users</h2>
                <p className="text-2xl font-bold">100+</p>
              </div>

            </div>

            {/* TOTAL EMPLOYEES */}
            <div className="flex items-center gap-4 rounded-lg bg-[#b8c20b] p-6 text-white shadow-md">

              <span className="text-3xl" aria-hidden="true">
                🧑‍💼
              </span>

              <div>
                <h2 className="text-sm">Total Number of Employees</h2>
                <p className="text-2xl font-bold">100+</p>
              </div>

            </div>

          </div>

          {/* CHART SECTION */}
          <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">

            {/* BOOK PURCHASE BAR CHART */}
            <div className="rounded-xl bg-white p-5 shadow-md">

              <h2 className="mb-5 text-lg font-bold text-gray-800">
                Book Purchase Ratio
              </h2>

              <ResponsiveContainer width="100%" height={300}>

                <BarChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="label" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="x"
                    name="Books Purchased"
                    fill="#182878"
                    radius={[10, 10, 0, 0]}
                  />

                  <Bar
                    dataKey="y"
                    name="Books Sold"
                    fill="#32833b"
                    radius={[10, 10, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            {/* YEARLY GROWTH CHART */}
            <div className="rounded-xl bg-white p-5 shadow-md">

              <h2 className="mb-5 text-lg font-bold text-gray-800">
                Growth Ratio (Yearly)
              </h2>

              
                {/* YEARLY GROWTH CHART */}
<div className="rounded-xl bg-white p-5 shadow-md">

  <h2 className="mb-5 text-lg font-bold text-gray-800">
    Growth Ratio (Yearly)
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <PieChart>

      <Pie
        data={data01}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#3830d8"
        stroke="white"
        isAnimationActive={true}
      />

      <Pie
        data={data02}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={90}
        outerRadius={120}
        fill="#048937"
        stroke="white"
        label
        isAnimationActive={true}
      />

      <Tooltip />

      <Legend />

    </PieChart>
  </ResponsiveContainer>

</div>


            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

export default Dashboard;
