// src/pages/Admin/index.js
import { html } from '../../shared/lib/html.js';
import { BoutiqueDB } from '../../entities/BoutiqueDB.js';
const React = window.React;

export const AdminPage = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = React.useState('analytics');
  const [dbState, setDbState] = React.useState(BoutiqueDB.getState());
  
  // Search & Filters
  const [orderSearch, setOrderSearch] = React.useState('');
  const [orderStatusFilter, setOrderStatusFilter] = React.useState('All');
  
  const [customerSearch, setCustomerSearch] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  
  // Custom measurement forms
  const [editedMeasurements, setEditedMeasurements] = React.useState(null);

  // New gallery item form
  const [newGalleryItem, setNewGalleryItem] = React.useState({ title: '', category: 'Aari Work', image: './assets/aari-detail.png' });

  // Canvas ref for chart
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    setDbState(BoutiqueDB.getState());
    const unsubscribe = BoutiqueDB.subscribe((state) => {
      setDbState(state);
    });
    return unsubscribe;
  }, []);

  // HTML5 Canvas dynamic gold/maroon revenue chart drawing
  React.useEffect(() => {
    if (activeTab === 'analytics' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const metrics = BoutiqueDB.getRevenueMetrics();
      const statusCounts = metrics.statusCounts;

      // Draw active status queue bar chart
      const statuses = ['Pending', 'Measuring', 'Cutting', 'Embroidery', 'Stitching', 'Trial', 'Completed'];
      const counts = statuses.map(s => statusCounts[s] || 0);

      const margin = { top: 30, right: 20, bottom: 40, left: 40 };
      const width = canvas.width - margin.left - margin.right;
      const height = canvas.height - margin.top - margin.bottom;

      // Draw axes
      ctx.strokeStyle = 'rgba(92, 6, 30, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top);
      ctx.lineTo(margin.left, margin.top + height);
      ctx.lineTo(margin.left + width, margin.top + height);
      ctx.stroke();

      // Find max value
      const maxCount = Math.max(...counts, 4);

      // Draw Bars
      const barWidth = width / statuses.length - 15;
      statuses.forEach((s, idx) => {
        const val = counts[idx];
        const barHeight = (val / maxCount) * height;
        const x = margin.left + idx * (width / statuses.length) + 7.5;
        const y = margin.top + height - barHeight;

        // Gradient for bars
        const grad = ctx.createLinearGradient(x, y, x, margin.top + height);
        grad.addColorStop(0, '#D4AF37'); // Gold Accent
        grad.addColorStop(1, '#5C061E'); // Maroon Primary
        ctx.fillStyle = grad;

        // Rounded rect for top of bar
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();

        // Draw Value Label on top of bar
        ctx.fillStyle = '#3D0210';
        ctx.font = 'bold 11px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText(val.toString(), x + barWidth / 2, y - 8);

        // Draw X-axis label
        ctx.fillStyle = 'rgba(61, 2, 16, 0.7)';
        ctx.font = '10px Poppins';
        ctx.fillText(s, x + barWidth / 2, margin.top + height + 20);
      });
    }
  }, [activeTab, dbState]);

  // Calculations
  const metrics = BoutiqueDB.getRevenueMetrics();

  const handleStatusChange = (orderId, status) => {
    BoutiqueDB.updateOrderStatus(orderId, status);
  };

  const handleStaffChange = (orderId, staffName) => {
    BoutiqueDB.updateOrderStaff(orderId, staffName);
  };

  const handleConfirmApt = (aptId) => {
    BoutiqueDB.updateAppointmentStatus(aptId, 'Confirmed');
  };

  const handleCompleteApt = (aptId) => {
    BoutiqueDB.updateAppointmentStatus(aptId, 'Completed');
  };

  const handleSelectCustomer = (cust) => {
    setSelectedCustomer(cust);
    setEditedMeasurements({ ...cust.measurements });
  };

  const handleSaveMeasurements = (e) => {
    e.preventDefault();
    if (!selectedCustomer || !editedMeasurements) return;
    BoutiqueDB.updateCustomerMeasurements(selectedCustomer.id, editedMeasurements);
    alert('Measurement card updated successfully in BoutiqueDB!');
    setSelectedCustomer(null);
  };

  const handleGalleryUpload = (e) => {
    e.preventDefault();
    if (!newGalleryItem.title) return;
    BoutiqueDB.addGalleryItem({
      title: newGalleryItem.title,
      category: newGalleryItem.category,
      image: newGalleryItem.image
    });
    alert('New design published to homepage gallery!');
    setNewGalleryItem({ title: '', category: 'Aari Work', image: './assets/aari-detail.png' });
  };

  // Filter Orders
  const filteredOrders = dbState.orders.filter(ord => {
    const matchesSearch = ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          ord.phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'All' || ord.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter Customers
  const filteredCustomers = dbState.customers.filter(c => {
    return c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch);
  });

  return html`
    <div className="min-h-screen bg-cream/30 pt-[70px] flex">
      
      <aside className="w-64 bg-maroon text-white border-r border-gold/15 hidden md:flex flex-col justify-between shrink-0">
        
        <div className="p-6 border-b border-gold/10 space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center font-playfair font-bold text-gold">M</div>
            <span className="font-playfair text-base font-bold tracking-wide">Owner Portal</span>
          </div>
          <span className="font-poppins text-[9px] uppercase tracking-widest text-gold block">
            Mahathi Tailor Shop
          </span>
        </div>

        <nav className="flex-grow py-6 px-4 space-y-1.5 font-poppins text-xs uppercase tracking-wider font-semibold">
          
          <button 
            onClick=${() => setActiveTab('analytics')}
            className=${`w-full text-left p-3.5 rounded-xl transition-all duration-300 flex items-center space-x-3 ${
              activeTab === 'analytics' ? 'bg-gold text-maroon shadow-luxury' : 'hover:bg-white/5 text-white/80'
            }`}
          >
            <span>📊</span>
            <span>Analytics Dashboard</span>
          </button>

          <button 
            onClick=${() => setActiveTab('orders')}
            className=${`w-full text-left p-3.5 rounded-xl transition-all duration-300 flex items-center space-x-3 ${
              activeTab === 'orders' ? 'bg-gold text-maroon shadow-luxury' : 'hover:bg-white/5 text-white/80'
            }`}
          >
            <span>✂</span>
            <span>Stitching Orders</span>
            ${dbState.orders.filter(o => o.status !== 'Completed').length > 0 && html`
              <span className="ml-auto bg-maroon-light text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-gold/20">
                ${dbState.orders.filter(o => o.status !== 'Completed').length}
              </span>
            `}
          </button>

          <button 
            onClick=${() => setActiveTab('appointments')}
            className=${`w-full text-left p-3.5 rounded-xl transition-all duration-300 flex items-center space-x-3 ${
              activeTab === 'appointments' ? 'bg-gold text-maroon shadow-luxury' : 'hover:bg-white/5 text-white/80'
            }`}
          >
            <span>📅</span>
            <span>Appointments</span>
            ${dbState.appointments.filter(a => a.status === 'Pending').length > 0 && html`
              <span className="ml-auto bg-maroon-light text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-gold/20">
                ${dbState.appointments.filter(a => a.status === 'Pending').length}
              </span>
            `}
          </button>

          <button 
            onClick=${() => setActiveTab('customers')}
            className=${`w-full text-left p-3.5 rounded-xl transition-all duration-300 flex items-center space-x-3 ${
              activeTab === 'customers' ? 'bg-gold text-maroon shadow-luxury' : 'hover:bg-white/5 text-white/80'
            }`}
          >
            <span>📏</span>
            <span>Measurement Cards</span>
          </button>

          <button 
            onClick=${() => setActiveTab('staff')}
            className=${`w-full text-left p-3.5 rounded-xl transition-all duration-300 flex items-center space-x-3 ${
              activeTab === 'staff' ? 'bg-gold text-maroon shadow-luxury' : 'hover:bg-white/5 text-white/80'
            }`}
          >
            <span>👑</span>
            <span>Boutique Artisans</span>
          </button>

          <button 
            onClick=${() => setActiveTab('gallery')}
            className=${`w-full text-left p-3.5 rounded-xl transition-all duration-300 flex items-center space-x-3 ${
              activeTab === 'gallery' ? 'bg-gold text-maroon shadow-luxury' : 'hover:bg-white/5 text-white/80'
            }`}
          >
            <span>📷</span>
            <span>Publish Designs</span>
          </button>

        </nav>

        <div className="p-6 border-t border-gold/10 space-y-3">
          <button 
            onClick=${() => setCurrentPage('home')}
            className="w-full text-center font-poppins text-[10px] font-bold uppercase tracking-widest text-gold hover:text-white transition-colors"
          >
            ← Exit Owner Mode
          </button>
        </div>

      </aside>

      <main className="flex-grow p-6 sm:p-10 max-w-[1200px] mx-auto overflow-x-hidden">
        
        <div className="flex md:hidden items-center justify-between bg-maroon text-gold p-4 rounded-xl mb-6 shadow-luxury">
          <span className="font-playfair text-sm font-bold">Owner Workspace</span>
          <select 
            value=${activeTab} 
            onChange=${(e) => setActiveTab(e.target.value)}
            className="bg-maroon-dark text-gold border border-gold/20 text-xs px-3 py-1 rounded focus:outline-none"
          >
            <option value="analytics">Analytics</option>
            <option value="orders">Orders</option>
            <option value="appointments">Appointments</option>
            <option value="customers">Measurements</option>
            <option value="staff">Artisans</option>
            <option value="gallery">Publish Design</option>
          </select>
        </div>


        ${activeTab === 'analytics' && html`
          <div className="space-y-10 animate-fade-in">
            
            <div>
              <h2 className="font-playfair text-3xl font-bold text-maroon">Analytics & Revenue</h2>
              <p className="font-poppins text-xs text-maroon/60">Live financial statistics and workshop load capacities.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury">
                <span className="font-poppins text-[10px] uppercase tracking-widest text-maroon/60">Total Estimated Sales</span>
                <h4 className="font-playfair text-3xl font-bold text-maroon mt-2">₹${metrics.totalSales.toLocaleString()}</h4>
                <p className="font-poppins text-[10px] text-gold mt-1">Estimates of stitching + embroidery</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury">
                <span className="font-poppins text-[10px] uppercase tracking-widest text-maroon/60">Total Cash Inflow</span>
                <h4 className="font-playfair text-3xl font-bold text-emerald-700 mt-2">₹${metrics.advancePaid.toLocaleString()}</h4>
                <p className="font-poppins text-[10px] text-emerald-600 mt-1">Advances collected on work orders</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury">
                <span className="font-poppins text-[10px] uppercase tracking-widest text-maroon/60">Pending Balances</span>
                <h4 className="font-playfair text-3xl font-bold text-amber-600 mt-2">₹${metrics.pendingCollections.toLocaleString()}</h4>
                <p className="font-poppins text-[10px] text-amber-500 mt-1">Due collections upon delivery</p>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury">
                <h3 className="font-playfair text-xl font-bold text-maroon mb-6">Active Stitching Queue Status</h3>
                <div className="w-full overflow-x-auto">
                  <canvas 
                    ref=${canvasRef} 
                    width="550" 
                    height="280"
                    className="mx-auto"
                  ></canvas>
                </div>
              </div>

              <div className="lg:col-span-4 bg-maroon text-white rounded-2xl p-6 border border-gold/20 shadow-luxury flex flex-col justify-between">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-gold mb-6 pb-2 border-b border-white/10">Workshop Workload</h3>
                  
                  <div className="space-y-4 font-poppins text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/70">Pending Orders (Unassigned):</span>
                      <strong className="text-gold">${dbState.orders.filter(o => o.status === 'Pending').length}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Embroidery Masters Load:</span>
                      <strong className="text-gold">${dbState.orders.filter(o => o.status === 'Embroidery').length} Active</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Tailoring Machine Load:</span>
                      <strong className="text-gold">${dbState.orders.filter(o => o.status === 'Stitching').length} Active</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Completed (Deliverable):</span>
                      <strong className="text-gold">${dbState.orders.filter(o => o.status === 'Completed').length} Done</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 text-center">
                  <span className="font-playfair text-sm text-gold block mb-2">Flagship Studio Slot Status</span>
                  <span className="bg-gold/15 text-gold border border-gold/20 font-poppins text-[10px] uppercase tracking-widest font-semibold px-4 py-1.5 rounded-full inline-block">
                    Studio Capacity: 84% Load
                  </span>
                </div>
              </div>

            </div>

          </div>
        `}

        ${activeTab === 'orders' && html`
          <div className="space-y-8 animate-fade-in">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-maroon">Stitching Orders</h2>
                <p className="font-poppins text-xs text-maroon/60">Configure order parameters, measurements, and track workshop queues.</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="Search Name or Order ID..." 
                  value=${orderSearch}
                  onChange=${(e) => setOrderSearch(e.target.value)}
                  className="bg-white border border-maroon/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-gold w-48 sm:w-64"
                />
                
                <select
                  value=${orderStatusFilter}
                  onChange=${(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-white border border-maroon/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-maroon font-semibold"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Measuring">Measuring</option>
                  <option value="Cutting">Cutting</option>
                  <option value="Embroidery">Embroidery</option>
                  <option value="Stitching">Stitching</option>
                  <option value="Trial">Trial</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-maroon/5 shadow-luxury overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-poppins text-xs">
                  
                  <thead className="bg-maroon text-gold uppercase tracking-wider text-[10px] border-b border-gold/15">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Stitching Item</th>
                      <th className="p-4">Target Delivery</th>
                      <th className="p-4">Assigned Artisans</th>
                      <th className="p-4">Work Status</th>
                      <th className="p-4 text-right">Cost</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-maroon/5 text-maroon">
                    ${filteredOrders.length === 0 ? html`
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-maroon/40 italic">
                          No matching workshop orders found in database.
                        </td>
                      </tr>
                    ` : filteredOrders.map(ord => html`
                      <tr key=${ord.id} className="hover:bg-maroon-soft/30 transition-colors">
                        <td className="p-4 font-bold text-gold-dark">${ord.id}</td>
                        <td className="p-4">
                          <span className="font-semibold block">${ord.customerName}</span>
                          <span className="text-[10px] text-maroon/50">${ord.phone}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold block">${ord.stitchingItem}</span>
                          <span className="text-[10px] text-maroon/50 block">Neck: ${ord.neckStyle}</span>
                          <span className="text-[10px] text-maroon/50 block">Sleeve: ${ord.sleeveStyle}</span>
                        </td>
                        <td className="p-4 font-semibold">${ord.dueDate}</td>
                        <td className="p-4">
                          <select
                            value=${ord.staffAssigned || 'Pending Assignment'}
                            onChange=${(e) => handleStaffChange(ord.id, e.target.value)}
                            className="bg-cream/40 border border-maroon/10 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
                          >
                            <option value="Pending Assignment">Pending Assignment</option>
                            ${dbState.staff.map(stf => html`
                              <option key=${stf.id} value=${`${stf.name} (${stf.role})`}>
                                ${stf.name} (${stf.role})
                              </option>
                            `)}
                          </select>
                        </td>
                        <td className="p-4">
                          <select
                            value=${ord.status}
                            onChange=${(e) => handleStatusChange(ord.id, e.target.value)}
                            className=${`text-xs font-bold px-3 py-1.5 rounded-full focus:outline-none border ${
                              ord.status === 'Completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                              ord.status === 'Embroidery' ? 'bg-maroon-soft border-gold/30 text-maroon font-bold' :
                              ord.status === 'Stitching' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                              'bg-amber-50 border-amber-200 text-amber-700'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Measuring">Measuring</option>
                            <option value="Cutting">Cutting</option>
                            <option value="Embroidery">Embroidery</option>
                            <option value="Stitching">Stitching</option>
                            <option value="Trial">Trial</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="p-4 text-right font-bold">₹${ord.cost.toLocaleString()}</td>
                      </tr>
                    `)}
                  </tbody>

                </table>
              </div>
            </div>

          </div>
        `}

        ${activeTab === 'appointments' && html`
          <div className="space-y-8 animate-fade-in">
            
            <div>
              <h2 className="font-playfair text-3xl font-bold text-maroon">Client Appointments</h2>
              <p className="font-poppins text-xs text-maroon/60">Approve upcoming home measurements, bridal coordinates, and trial schedulers.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              ${dbState.appointments.length === 0 ? html`
                <div className="bg-white p-8 rounded-2xl border border-maroon/5 text-center text-maroon/40 italic shadow-luxury">
                  No upcoming boutique appointments scheduled.
                </div>
              ` : dbState.appointments.map(apt => html`
                <div 
                  key=${apt.id}
                  className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-gold/30 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className=${`text-[10px] font-poppins font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border ${
                        apt.status === 'Confirmed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        apt.status === 'Completed' ? 'bg-gray-100 border-gray-200 text-gray-500' :
                        'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        ${apt.status}
                      </span>
                      <span className="font-poppins text-[10px] text-maroon/40 font-bold">${apt.id}</span>
                    </div>

                    <h4 className="font-playfair text-xl font-bold text-maroon">${apt.name}</h4>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-poppins text-xs text-maroon/70">
                      <span>📞 ${apt.phone}</span>
                      <span>📧 ${apt.email || 'N/A'}</span>
                      <span className="text-gold font-bold">📅 ${apt.date} at ${apt.time}</span>
                    </div>
                    
                    <p className="font-poppins text-xs text-maroon/60 italic pt-1">
                      *Category: <strong>${apt.type}</strong>. Notes: "${apt.notes || 'None'}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-maroon/5">
                    ${apt.status === 'Pending' && html`
                      <button 
                        onClick=${() => handleConfirmApt(apt.id)}
                        className="font-poppins text-[10px] uppercase tracking-widest font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full transition-colors w-full sm:w-auto"
                      >
                        Confirm Slot
                      </button>
                    `}
                    ${apt.status === 'Confirmed' && html`
                      <button 
                        onClick=${() => handleCompleteApt(apt.id)}
                        className="font-poppins text-[10px] uppercase tracking-widest font-bold bg-maroon hover:bg-gold text-gold hover:text-maroon px-5 py-2.5 rounded-full transition-colors border border-gold w-full sm:w-auto"
                      >
                        Mark Completed
                      </button>
                    `}
                    <button 
                      onClick=${() => BoutiqueDB.updateAppointmentStatus(apt.id, 'Cancelled')}
                      className="font-poppins text-[10px] uppercase tracking-widest font-semibold text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-full transition-colors w-full sm:w-auto text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              `)}
            </div>

          </div>
        `}

        ${activeTab === 'customers' && html`
          <div className="space-y-8 animate-fade-in">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-maroon">Client Sizing Files</h2>
                <p className="font-poppins text-xs text-maroon/60">Maintain archival measurement cards for bridal fits.</p>
              </div>

              <input 
                type="text" 
                placeholder="Search Client Name or Mobile..." 
                value=${customerSearch}
                onChange=${(e) => setCustomerSearch(e.target.value)}
                className="bg-white border border-maroon/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-gold w-full sm:w-72"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${filteredCustomers.map(cust => html`
                <div 
                  key=${cust.id}
                  className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury flex flex-col justify-between hover:border-gold/30 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-poppins text-[10px] text-maroon/40 font-bold">${cust.id}</span>
                      <span className="font-poppins text-[10px] text-gold font-bold">Joined: ${cust.joinedDate}</span>
                    </div>

                    <div>
                      <h4 className="font-playfair text-lg sm:text-xl font-bold text-maroon">${cust.name}</h4>
                      <p className="font-poppins text-xs text-maroon/70">Phone: ${cust.phone} | Email: ${cust.email}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-maroon-soft/40 p-3 rounded-xl border border-maroon/5 font-poppins text-[10px]">
                      <div>Chest: <strong className="text-maroon">${cust.measurements.chest || 0}"</strong></div>
                      <div>Waist: <strong className="text-maroon">${cust.measurements.waist || 0}"</strong></div>
                      <div>Blouse L: <strong className="text-maroon">${cust.measurements.blouseLength || 0}"</strong></div>
                      <div>Shoulder: <strong className="text-maroon">${cust.measurements.shoulder || 0}"</strong></div>
                      <div>Front Neck: <strong className="text-maroon">${cust.measurements.frontNeck || 0}"</strong></div>
                      <div>Back Neck: <strong className="text-maroon">${cust.measurements.backNeck || 0}"</strong></div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-maroon/5">
                    <button 
                      onClick=${() => handleSelectCustomer(cust)}
                      className="font-poppins text-[10px] uppercase tracking-widest font-bold bg-maroon hover:bg-gold text-gold hover:text-maroon px-5 py-2.5 rounded-full transition-all border border-gold w-full text-center block"
                    >
                      Edit Sizing Card
                    </button>
                  </div>
                </div>
              `)}
            </div>

            ${selectedCustomer && html`
              <div className="fixed inset-0 bg-maroon-dark/95 z-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto animate-fade-in">
                <div 
                  className="bg-white rounded-3xl p-6 sm:p-10 max-w-2xl w-full border border-gold/25 shadow-glow"
                  onClick=${(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-6 border-b border-maroon/10 mb-6">
                    <div>
                      <span className="font-poppins text-[10px] uppercase tracking-widest text-gold font-bold">Measurement Form</span>
                      <h3 className="font-playfair text-2xl font-bold text-maroon">Sizing Card: ${selectedCustomer.name}</h3>
                    </div>
                    <button 
                      onClick=${() => setSelectedCustomer(null)}
                      className="text-maroon hover:text-gold text-2xl font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit=${handleSaveMeasurements} className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 font-poppins text-xs">
                      
                      $
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-maroon/60 font-semibold mb-1">Chest Size (inches)</label>
                        <input 
                          type="number" step="0.25"
                          value=${editedMeasurements.chest}
                          onChange=${(e) => setEditedMeasurements({ ...editedMeasurements, chest: Number(e.target.value) })}
                          className="w-full bg-cream/40 border border-maroon/10 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      $
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-maroon/60 font-semibold mb-1">Waist Size (inches)</label>
                        <input 
                          type="number" step="0.25"
                          value=${editedMeasurements.waist}
                          onChange=${(e) => setEditedMeasurements({ ...editedMeasurements, waist: Number(e.target.value) })}
                          className="w-full bg-cream/40 border border-maroon/10 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      $
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-maroon/60 font-semibold mb-1">Blouse Length (in)</label>
                        <input 
                          type="number" step="0.25"
                          value=${editedMeasurements.blouseLength}
                          onChange=${(e) => setEditedMeasurements({ ...editedMeasurements, blouseLength: Number(e.target.value) })}
                          className="w-full bg-cream/40 border border-maroon/10 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      $
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-maroon/60 font-semibold mb-1">Shoulder Width (in)</label>
                        <input 
                          type="number" step="0.25"
                          value=${editedMeasurements.shoulder}
                          onChange=${(e) => setEditedMeasurements({ ...editedMeasurements, shoulder: Number(e.target.value) })}
                          className="w-full bg-cream/40 border border-maroon/10 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      $
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-maroon/60 font-semibold mb-1">Front Neck Depth (in)</label>
                        <input 
                          type="number" step="0.25"
                          value=${editedMeasurements.frontNeck}
                          onChange=${(e) => setEditedMeasurements({ ...editedMeasurements, frontNeck: Number(e.target.value) })}
                          className="w-full bg-cream/40 border border-maroon/10 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      $
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-maroon/60 font-semibold mb-1">Back Neck Depth (in)</label>
                        <input 
                          type="number" step="0.25"
                          value=${editedMeasurements.backNeck}
                          onChange=${(e) => setEditedMeasurements({ ...editedMeasurements, backNeck: Number(e.target.value) })}
                          className="w-full bg-cream/40 border border-maroon/10 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      $
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-maroon/60 font-semibold mb-1">Sleeve Length (in)</label>
                        <input 
                          type="number" step="0.25"
                          value=${editedMeasurements.sleeveLength}
                          onChange=${(e) => setEditedMeasurements({ ...editedMeasurements, sleeveLength: Number(e.target.value) })}
                          className="w-full bg-cream/40 border border-maroon/10 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      $
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-maroon/60 font-semibold mb-1">Sleeve Round (in)</label>
                        <input 
                          type="number" step="0.25"
                          value=${editedMeasurements.sleeveRound}
                          onChange=${(e) => setEditedMeasurements({ ...editedMeasurements, sleeveRound: Number(e.target.value) })}
                          className="w-full bg-cream/40 border border-maroon/10 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                      $
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-maroon/60 font-semibold mb-1">Arm Hole Size (in)</label>
                        <input 
                          type="number" step="0.25"
                          value=${editedMeasurements.armHole}
                          onChange=${(e) => setEditedMeasurements({ ...editedMeasurements, armHole: Number(e.target.value) })}
                          className="w-full bg-cream/40 border border-maroon/10 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>

                    </div>

                    <div className="pt-6 border-t border-maroon/10 flex items-center justify-end space-x-4">
                      <button 
                        type="button"
                        onClick=${() => setSelectedCustomer(null)}
                        className="font-poppins text-xs uppercase tracking-widest font-semibold text-maroon/60 px-6 py-3"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold text-maroon hover:bg-maroon hover:text-gold border border-gold px-8 py-3 rounded-full transition-all duration-300"
                      >
                        Save Sizing Card
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            `}

          </div>
        `}

        ${activeTab === 'staff' && html`
          <div className="space-y-8 animate-fade-in">
            
            <div>
              <h2 className="font-playfair text-3xl font-bold text-maroon">Artisans & Masters</h2>
              <p className="font-poppins text-xs text-maroon/60">Oversee active workloads for tailor cutters and embroidery masters.</p>
            </div>

            <div className="bg-white rounded-2xl border border-maroon/5 shadow-luxury overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-poppins text-xs">
                  
                  <thead className="bg-maroon text-gold uppercase tracking-wider text-[10px] border-b border-gold/15">
                    <tr>
                      <th className="p-4">Artisan ID</th>
                      <th className="p-4">Artisan Name</th>
                      <th className="p-4">Specialist Role</th>
                      <th className="p-4">Stitching Load</th>
                      <th className="p-4 text-right">Artisan Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-maroon/5 text-maroon">
                    ${dbState.staff.map(stf => html`
                      <tr key=${stf.id} className="hover:bg-maroon-soft/30 transition-colors">
                        <td className="p-4 font-bold text-gold-dark">${stf.id}</td>
                        <td className="p-4 font-semibold">${stf.name}</td>
                        <td className="p-4">${stf.role}</td>
                        <td className="p-4">
                          <span className="font-semibold block">${stf.ordersCount} Active Stitching</span>
                          <span className="text-[10px] text-maroon/40 block">Max capacity: 5 orders</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-3 py-1 rounded-full">
                            Available / Active
                          </span>
                        </td>
                      </tr>
                    `)}
                  </tbody>

                </table>
              </div>
            </div>

          </div>
        `}

        ${activeTab === 'gallery' && html`
          <div className="space-y-8 animate-fade-in">
            
            <div>
              <h2 className="font-playfair text-3xl font-bold text-maroon">Publish Design Portfolio</h2>
              <p className="font-poppins text-xs text-maroon/60">Upload mockups and catalog images directly to the client home screen.</p>
            </div>

            <form onSubmit=${handleGalleryUpload} className="bg-white rounded-2xl border border-maroon/5 p-6 sm:p-10 shadow-luxury max-w-xl space-y-6">
              
              <div>
                <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Outfit Title *</label>
                <input 
                  type="text"
                  placeholder="e.g. Royal Maroon Peacock Back neck"
                  value=${newGalleryItem.title}
                  onChange=${(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Category Filter *</label>
                <select
                  value=${newGalleryItem.category}
                  onChange=${(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                  className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
                  required
                >
                  <option value="Bridal Blouses">Bridal Blouses</option>
                  <option value="Aari Work">Aari Embroidery</option>
                  <option value="Wedding Collection">Wedding Collection</option>
                  <option value="Maggam Work">Maggam Work</option>
                  <option value="Kids Fashion">Kids Fashion</option>
                  <option value="Party Wear">Party Wear</option>
                </select>
              </div>

              <div>
                <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Choose Mockup Asset *</label>
                <select
                  value=${newGalleryItem.image}
                  onChange=${(e) => setNewGalleryItem({ ...newGalleryItem, image: e.target.value })}
                  className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold text-maroon font-semibold"
                  required
                >
                  <option value="./assets/designer-blouse.png">Royal Maroon Blouse back (designer-blouse.png)</option>
                  <option value="./assets/aari-detail.png">Gold Aari Detail (aari-detail.png)</option>
                  <option value="./assets/hero-bridal.png">Lehenga Bridal Portrait (hero-bridal.png)</option>
                </select>
              </div>

              <button 
                type="submit"
                className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold text-maroon hover:bg-maroon hover:text-gold border border-gold px-8 py-3.5 rounded-full transition-all duration-300 w-full text-center"
              >
                Publish Design Lookbook
              </button>

            </form>

          </div>
        `}

      </main>

    </div>
  `;
};
export default AdminPage;

