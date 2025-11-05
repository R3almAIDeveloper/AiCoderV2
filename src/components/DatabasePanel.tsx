import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Database, Plus, Search, Table, Key, Users, Settings, RefreshCw, Play, Download, Upload, CreditCard as Edit, Trash2, Filter, ArrowUpDown, MoreHorizontal, Eye, Copy, ExternalLink } from 'lucide-react';

export const DatabasePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tables');
  const [selectedTable, setSelectedTable] = useState<string | null>('users');
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showTableActions, setShowTableActions] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{row: number, column: string} | null>(null);
  const [editValue, setEditValue] = useState('');

  // Mock database data
  const tables = [
    { name: 'users', rows: 1250, columns: 8, size: '2.4 MB', type: 'table', status: 'active' },
    { name: 'posts', rows: 3420, columns: 12, size: '8.1 MB', type: 'table', status: 'active' },
    { name: 'comments', rows: 15680, columns: 6, size: '4.2 MB', type: 'table', status: 'active' },
    { name: 'categories', rows: 24, columns: 4, size: '12 KB', type: 'table', status: 'active' },
    { name: 'tags', rows: 156, columns: 3, size: '8 KB', type: 'table', status: 'active' },
    { name: 'user_sessions', rows: 892, columns: 5, size: '156 KB', type: 'table', status: 'active' },
    { name: 'audit_log', rows: 25680, columns: 7, size: '12.3 MB', type: 'table', status: 'active' }
  ];

  const [mockUserData, setMockUserData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', created: '2024-01-15', last_login: '2024-01-25', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', created: '2024-01-16', last_login: '2024-01-24', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', created: '2024-01-17', last_login: '2024-01-20', status: 'inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'moderator', created: '2024-01-18', last_login: '2024-01-25', status: 'active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'user', created: '2024-01-19', last_login: '2024-01-23', status: 'active' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'admin', created: '2024-01-20', last_login: '2024-01-25', status: 'active' },
    { id: 7, name: 'Edward Norton', email: 'edward@example.com', role: 'user', created: '2024-01-21', last_login: '2024-01-22', status: 'suspended' },
    { id: 8, name: 'Fiona Green', email: 'fiona@example.com', role: 'moderator', created: '2024-01-22', last_login: '2024-01-24', status: 'active' }
  ]);

  // Mock query results
  const queryResults = {
    'Active Users': [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', last_login: '2024-01-25', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', last_login: '2024-01-24', status: 'active' },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'moderator', last_login: '2024-01-25', status: 'active' },
      { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'user', last_login: '2024-01-23', status: 'active' },
      { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'admin', last_login: '2024-01-25', status: 'active' },
      { id: 8, name: 'Fiona Green', email: 'fiona@example.com', role: 'moderator', last_login: '2024-01-24', status: 'active' }
    ],
    'Popular Posts': [
      { id: 1, title: 'Getting Started with React', author: 'John Doe', views: 15420, likes: 892, created: '2024-01-20' },
      { id: 2, title: 'Advanced TypeScript Tips', author: 'Jane Smith', views: 12350, likes: 743, created: '2024-01-18' },
      { id: 3, title: 'Database Design Patterns', author: 'Alice Brown', views: 9876, likes: 567, created: '2024-01-22' },
      { id: 4, title: 'Modern CSS Techniques', author: 'Diana Prince', views: 8543, likes: 432, created: '2024-01-19' },
      { id: 5, title: 'API Security Best Practices', author: 'Fiona Green', views: 7234, likes: 398, created: '2024-01-21' }
    ],
    'User Analytics': [
      { role: 'admin', count: 2, percentage: '25%' },
      { role: 'moderator', count: 2, percentage: '25%' },
      { role: 'user', count: 4, percentage: '50%' }
    ]
  };

  const queryColumns = {
    'Active Users': [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'last_login', label: 'Last Login', type: 'date' },
      { key: 'status', label: 'Status', type: 'text' }
    ],
    'Popular Posts': [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'views', label: 'Views', type: 'number' },
      { key: 'likes', label: 'Likes', type: 'number' },
      { key: 'created', label: 'Created', type: 'date' }
    ],
    'User Analytics': [
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'count', label: 'Count', type: 'number' },
      { key: 'percentage', label: 'Percentage', type: 'text' }
    ]
  };

  const tableColumns = {
    users: [
      { key: 'id', label: 'ID', type: 'number', sortable: true },
      { key: 'name', label: 'Name', type: 'text', sortable: true },
      { key: 'email', label: 'Email', type: 'email', sortable: true },
      { key: 'role', label: 'Role', type: 'select', sortable: true, options: ['admin', 'moderator', 'user'] },
      { key: 'status', label: 'Status', type: 'select', sortable: true, options: ['active', 'inactive', 'suspended'] },
      { key: 'created', label: 'Created', type: 'date', sortable: true },
      { key: 'last_login', label: 'Last Login', type: 'date', sortable: true }
    ]
  };

  const sidebarTabs = [
    { id: 'tables', label: 'Tables', icon: Table },
    { id: 'queries', label: 'Queries', icon: Play },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current data based on whether we're showing query results or table data
  const getCurrentData = () => {
    if (selectedQuery && queryResults[selectedQuery as keyof typeof queryResults]) {
      return queryResults[selectedQuery as keyof typeof queryResults];
    }
    return mockUserData;
  };

  const getCurrentColumns = () => {
    if (selectedQuery && queryColumns[selectedQuery as keyof typeof queryColumns]) {
      return queryColumns[selectedQuery as keyof typeof queryColumns];
    }
    return tableColumns.users;
  };

  const currentData = getCurrentData();
  const currentColumns = getCurrentColumns();

  const filteredData = currentData.filter((item: any) => 
    Object.values(item).some(value => 
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = (a as any)[sortColumn];
    const bVal = (b as any)[sortColumn];
    const direction = sortDirection === 'asc' ? 1 : -1;
    return aVal < bVal ? -direction : aVal > bVal ? direction : 0;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === sortedData.length 
        ? [] 
        : sortedData.map((item: any) => item.id)
    );
  };

  const handleCellEdit = (row: number, column: string, currentValue: string) => {
    setEditingCell({ row, column });
    setEditValue(currentValue);
  };

  const handleCellSave = () => {
    if (editingCell) {
      setMockUserData(prev => prev.map((user: any) => 
        user.id === editingCell.row 
          ? { ...user, [editingCell.column]: editValue }
          : user
      ));
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleDeleteRows = () => {
    setMockUserData(prev => prev.filter((user: any) => !selectedRows.includes(user.id)));
    setSelectedRows([]);
  };

  const handleQueryClick = (queryName: string) => {
    setSelectedQuery(queryName);
    setSelectedTable(null);
    setSelectedRows([]);
    setSortColumn(null);
    setSortDirection('asc');
  };

  const handleTableClick = (tableName: string) => {
    setSelectedTable(tableName);
    setSelectedQuery(null);
    setSelectedRows([]);
    setSortColumn(null);
    setSortDirection('asc');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'inactive': return 'bg-yellow-600';
      case 'suspended': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="h-full bg-gray-900">
      <PanelGroup direction="horizontal">
        {/* Left Sidebar */}
        <Panel defaultSize={30} minSize={20} maxSize={50}>
          <div className="h-full bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Database</h2>
            </div>
            <div className="flex items-center space-x-1">
              <button className="text-gray-400 hover:text-white p-1 rounded-md" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-white p-1 rounded-md" title="Import">
                <Upload className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-white p-1 rounded-md" title="Export">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700">
          <nav className="flex">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-1 px-3 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'tables' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Tables ({tables.length})</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tables..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-700 border border-gray-600 text-white text-xs rounded-md pl-7 pr-3 py-1 w-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md" title="Create Table">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {filteredTables.map((table) => (
                  <div
                    key={table.name}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors relative group ${
                      selectedTable === table.name
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div 
                      onClick={() => handleTableClick(table.name)}
                      className="flex items-center justify-between mb-1"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{table.name}</span>
                        <div className={`w-2 h-2 rounded-full ${table.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Key className="w-3 h-3 opacity-60" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTableActions(showTableActions === table.name ? null : table.name);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-opacity"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs opacity-75">
                      {table.rows.toLocaleString()} rows • {table.columns} cols • {table.size}
                    </div>
                    
                    {/* Table Actions Dropdown */}
                    {showTableActions === table.name && (
                      <div className="absolute right-0 top-12 w-48 bg-gray-600 rounded-md shadow-lg border border-gray-500 z-50">
                        <div className="py-1">
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-200 hover:bg-gray-500">
                            <Eye className="w-3 h-3" />
                            <span>View Structure</span>
                          </button>
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-200 hover:bg-gray-500">
                            <Edit className="w-3 h-3" />
                            <span>Edit Table</span>
                          </button>
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-200 hover:bg-gray-500">
                            <Copy className="w-3 h-3" />
                            <span>Duplicate</span>
                          </button>
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-200 hover:bg-gray-500">
                            <Download className="w-3 h-3" />
                            <span>Export Data</span>
                          </button>
                          <hr className="border-gray-500 my-1" />
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-500">
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Table</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {filteredTables.length === 0 && (
                <div className="text-center py-8">
                  <Table className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">No tables found</p>
                  <p className="text-gray-500 text-sm">Try adjusting your search query</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'queries' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Saved Queries</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div 
                  onClick={() => handleQueryClick('Active Users')}
                  className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <div className="font-medium text-white mb-1">Active Users</div>
                  <div className="text-xs text-gray-400 font-mono">SELECT * FROM users WHERE last_login &gt; NOW() - INTERVAL 7 DAY</div>
                </div>
                <div 
                  onClick={() => handleQueryClick('Popular Posts')}
                  className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <div className="font-medium text-white mb-1">Popular Posts</div>
                  <div className="text-xs text-gray-400 font-mono">SELECT * FROM posts ORDER BY views DESC LIMIT 10</div>
                </div>
                <div 
                  onClick={() => handleQueryClick('User Analytics')}
                  className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <div className="font-medium text-white mb-1">User Analytics</div>
                  <div className="text-xs text-gray-400 font-mono">SELECT role, COUNT(*) FROM users GROUP BY role</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Database Users</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">admin</div>
                      <div className="text-xs text-gray-400">Full access</div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">app_user</div>
                      <div className="text-xs text-gray-400">Read/Write</div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">readonly</div>
                      <div className="text-xs text-gray-400">Read only</div>
                    </div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white mb-4">Database Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Connection String</label>
                  <input
                    type="text"
                    value="postgresql://localhost:5432/r3alm_dev"
                    className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Max Connections</label>
                  <input
                    type="number"
                    value="100"
                    className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white">Auto Backup</label>
                    <p className="text-xs text-gray-400">Daily automated backups</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600 transition-colors" />

        {/* Right Content Area */}
        <Panel defaultSize={70} minSize={50}>
          <div className="h-full bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-white">
                {selectedQuery ? `Query Results: ${selectedQuery}` : 
                 selectedTable ? `Table: ${selectedTable}` : 'Database Overview'}
              </h3>
              {(selectedTable || selectedQuery) && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  {selectedQuery ? 
                    `${currentData.length} results` : 
                    `${tables.find(t => t.name === selectedTable)?.rows.toLocaleString()} rows`
                  }
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm">
                Query
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {(selectedTable === 'users' || selectedQuery) ? (
            <div className="space-y-4">
              {/* Table Actions Bar */}
              {selectedRows.length > 0 && (
                <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-blue-100 text-sm">
                    {selectedRows.length} row{selectedRows.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                      Export
                    </button>
                    <button 
                      onClick={handleDeleteRows}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => setSelectedRows([])}
                      className="text-blue-300 hover:text-white px-3 py-1 rounded text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        {currentColumns.map((column) => (
                          <th 
                            key={column.key}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            {(column as any).sortable ? (
                              <button
                                onClick={() => handleSort(column.key)}
                                className="flex items-center space-x-1 hover:text-white"
                              >
                                <span>{column.label}</span>
                                <ArrowUpDown className="w-3 h-3" />
                              </button>
                            ) : (
                              column.label
                            )}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {sortedData.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-700">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(item.id)}
                              onChange={() => handleRowSelect(item.id)}
                              className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          {currentColumns.map((column) => (
                            <td key={column.key} className="px-4 py-3 text-sm">
                              {column.key === 'name' && !selectedQuery && editingCell?.row === item.id && editingCell?.column === 'name' ? (
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={handleCellSave}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCellSave();
                                    if (e.key === 'Escape') handleCellCancel();
                                  }}
                                  className="bg-gray-600 border border-gray-500 text-white text-sm rounded px-2 py-1 w-full"
                                  autoFocus
                                />
                              ) : column.key === 'email' && !selectedQuery && editingCell?.row === item.id && editingCell?.column === 'email' ? (
                                <input
                                  type="email"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={handleCellSave}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCellSave();
                                    if (e.key === 'Escape') handleCellCancel();
                                  }}
                                  className="bg-gray-600 border border-gray-500 text-white text-sm rounded px-2 py-1 w-full"
                                  autoFocus
                                />
                              ) : column.key === 'role' ? (
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  item[column.key] === 'admin' ? 'bg-red-600 text-white' :
                                  item[column.key] === 'moderator' ? 'bg-yellow-600 text-white' :
                                  'bg-green-600 text-white'
                                }`}>
                                  {item[column.key]}
                                </span>
                              ) : column.key === 'status' && item.status ? (
                                <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(item.status)}`}>
                                  {item.status}
                                </span>
                              ) : column.key === 'views' || column.key === 'likes' || column.key === 'count' ? (
                                <span className="text-white font-medium">{item[column.key]?.toLocaleString?.() || item[column.key]}</span>
                              ) : column.key === 'title' ? (
                                <span className="text-white font-medium">{item[column.key]}</span>
                              ) : (
                                <span 
                                  onClick={() => !selectedQuery && (column.key === 'name' || column.key === 'email') && handleCellEdit(item.id, column.key, item[column.key])}
                                  className={`${
                                    !selectedQuery && (column.key === 'name' || column.key === 'email') 
                                      ? 'cursor-pointer hover:bg-gray-600 px-1 py-1 rounded text-white' 
                                      : column.key === 'id' ? 'text-white' : 'text-gray-300'
                                  }`}
                                >
                                  {item[column.key]}
                                </span>
                              )}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-sm">
                            {!selectedQuery && (
                              <div className="flex items-center space-x-2">
                                <button 
                                  className="text-blue-400 hover:text-blue-300 p-1"
                                  title="Edit"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button 
                                  className="text-red-400 hover:text-red-300 p-1"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <button 
                                  className="text-gray-400 hover:text-gray-300 p-1"
                                  title="More"
                                >
                                  <MoreHorizontal className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="bg-gray-700 px-4 py-3 border-t border-gray-600 flex items-center justify-between">
                  <div className="text-sm text-gray-300">
                    Showing {sortedData.length} of {currentData.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded">
                      Previous
                    </button>
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded">1</span>
                    <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.map((table) => (
                <div
                  key={table.name}
                  onClick={() => handleTableClick(table.name)}
                  className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">{table.name}</h4>
                    <Table className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Rows:</span>
                      <span className="font-medium">{table.rows.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Columns:</span>
                      <span className="font-medium">{table.columns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="font-medium">{table.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};