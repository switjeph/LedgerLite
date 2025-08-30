import PropTypes from 'prop-types';
import { Sidebar } from "flowbite-react";
import { Link } from "react-router-dom";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className="w-64">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to="/dashboard">
              <Sidebar.Item>Dashboard</Sidebar.Item>
            </Link>
            <Link to="/transactions">
              <Sidebar.Item>Transactions</Sidebar.Item>
            </Link>
            <Link to="/accounts">
              <Sidebar.Item>Accounts</Sidebar.Item>
            </Link>
            <Link to="/reports">
              <Sidebar.Item>Reports</Sidebar.Item>
            </Link>
            <Link to="/settings">
              <Sidebar.Item>Settings</Sidebar.Item>
            </Link>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}


MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};
