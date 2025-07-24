import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchStats } from '../utils/api';

const COLORS = ['#00aaff', '#ff9900'];

const StatsCharts = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 lg:p-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            {/* Bar Chart Skeleton */}
            <div className="w-full lg:w-1/2 max-w-lg">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 animate-pulse h-80">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>

            {/* Pie Chart Skeleton */}
            <div className="w-full lg:w-1/2 max-w-lg">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 animate-pulse h-80">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex justify-center items-center h-48">
                  <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-500 animate-pulse">Loading comprehensive analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  const barData = [
    { label: 'Today', value: stats.todayTotal },
    { label: 'This Month', value: stats.monthTotal },
    { label: 'This Year', value: stats.yearTotal },
  ];

  const pieData = [
    { name: 'Room', value: stats.roomCount },
    { name: 'Lawn', value: stats.lawnCount },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pb-6">
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-3 sm:p-6 lg:p-8 text-xs sm:text-base">
        <div className="text-center mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Payment & Booking Stats
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">Comprehensive analytics for your business performance</p>
        </div>

        <div className="animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 items-start justify-center">
            
            {/* Bar Chart Section */}
            <div className="w-full lg:w-1/2 max-w-lg">
              <div className="chart-container rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-all duration-500 border border-gray-100 group text-xs sm:text-base">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-xs sm:text-lg font-semibold text-gray-800">Revenue Trends</h3>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Revenue']} />
                      <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5e72e4" />
                          <stop offset="100%" stopColor="#3b4a98" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Pie Chart Section */}
            <div className="w-full lg:w-1/2 max-w-lg">
              <div className="chart-container rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-all duration-500 border border-gray-100 group text-xs sm:text-base">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-xs sm:text-lg font-semibold text-gray-800">Booking Distribution</h3>
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} bookings`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatsCharts;

// import React, { useEffect, useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from 'recharts';
// import { fetchStats } from '../utils/api';

// const COLORS = ['#00aaff', '#ff9900'];

// const StatsCharts = () => {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     fetchStats().then(setStats);
//   }, []);

//   if (!stats) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
//         <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 lg:p-8">
//           <div className="text-center mb-8">
//             <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
//           </div>

//           <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
//             {/* Bar Chart Skeleton */}
//             <div className="w-full lg:w-1/2 max-w-lg">
//               <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 animate-pulse h-80">
//                 <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
//                 <div className="space-y-3">
//                   <div className="h-8 bg-gray-200 rounded"></div>
//                   <div className="h-12 bg-gray-200 rounded"></div>
//                   <div className="h-6 bg-gray-200 rounded"></div>
//                 </div>
//                 <div className="mt-4 flex justify-center">
//                   <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//               </div>
//             </div>

//             {/* Pie Chart Skeleton */}
//             <div className="w-full lg:w-1/2 max-w-lg">
//               <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 animate-pulse h-80">
//                 <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
//                 <div className="flex justify-center items-center h-48">
//                   <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
//                 </div>
//                 <div className="mt-4 flex justify-center">
//                   <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="text-center mt-6">
//             <p className="text-gray-500 animate-pulse">Loading comprehensive analytics...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const barData = [
//     { label: 'Today', value: stats.todayTotal },
//     { label: 'This Month', value: stats.monthTotal },
//     { label: 'This Year', value: stats.yearTotal },
//   ];

//   const pieData = [
//     { name: 'Room', value: stats.roomCount },
//     { name: 'Lawn', value: stats.lawnCount },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
//       <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 lg:p-8">
//         <div className="text-center mb-8">
//           <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
//             Payment & Booking Stats
//           </h2>
//           <p className="text-gray-600 text-sm">Comprehensive analytics for your business performance</p>
//         </div>

//         <div className="animate-fade-in">
//           <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            
//             {/* Bar Chart Section */}
//             <div className="w-full lg:w-1/2 max-w-lg">
//               <div className="chart-container rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-500 border border-gray-100 group">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-800">Revenue Trends</h3>
//                   <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//                 </div>
                
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={barData}>
//                       <XAxis dataKey="label" />
//                       <YAxis />
//                       <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Revenue']} />
//                       <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
//                       <defs>
//                         <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="0%" stopColor="#5e72e4" />
//                           <stop offset="100%" stopColor="#3b4a98" />
//                         </linearGradient>
//                       </defs>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>

//             {/* Pie Chart Section */}
//             <div className="w-full lg:w-1/2 max-w-lg">
//               <div className="chart-container rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-500 border border-gray-100 group">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-800">Booking Distribution</h3>
//                   <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
//                 </div>
                
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={pieData}
//                         dataKey="value"
//                         nameKey="name"
//                         outerRadius={80}
//                         label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
//                       >
//                         {pieData.map((entry, index) => (
//                           <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip formatter={(value, name) => [`${value} bookings`, name]} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatsCharts;

