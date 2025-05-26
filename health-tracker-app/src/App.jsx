import React, { useState } from 'react'
import { 
  BarChart3, Heart, Scale, Footprints, Droplets, Zap, 
  Target, Plus, Menu, X, ChevronRight, TrendingDown, Bell 
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

// Health data storage
const healthData = {
  metrics: {
    weight: { value: 172, unit: 'lbs', date: '2024-02-15' },
    heartRate: { value: 72, unit: 'bpm', date: '2024-02-15' },
    steps: 8429,
    water: 48 // oz
  },
  activities: [
    { id: 1, name: 'Morning Run', type: 'exercise', details: '3.2 miles • 28 minutes', time: '2h ago' },
    { id: 2, name: 'Weight Log', type: 'weight', details: '172 lbs recorded', time: '5h ago' },
    { id: 3, name: 'Yoga Session', type: 'exercise', details: '45 minutes • Hatha Yoga', time: '1d ago' },
    { id: 4, name: 'Water Intake', type: 'water', details: '8 glasses • Goal completed', time: '1d ago' }
  ],
  goals: [
    { id: 1, name: 'Lose 10 lbs', current: 7, target: 10, unit: 'lbs', type: 'weight_loss' },
    { id: 2, name: 'Walk 10,000 steps daily', current: 8429, target: 10000, unit: 'steps', type: 'daily_steps' },
    { id: 3, name: 'Exercise 5x per week', current: 3, target: 5, unit: 'sessions', type: 'weekly_exercise' }
  ],
  weightHistory: [
    { date: 'Jan 1', weight: 178 },
    { date: 'Jan 8', weight: 175 },
    { date: 'Jan 15', weight: 174 },
    { date: 'Jan 22', weight: 172 },
    { date: 'Jan 29', weight: 171 },
    { date: 'Feb 5', weight: 172 },
    { date: 'Feb 12', weight: 172 }
  ]
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('weight')
  const [chartPeriod, setChartPeriod] = useState('week')
  const [formData, setFormData] = useState({
    value: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    name: '',
    details: '',
    activityType: ''
  })

  const openModal = (type) => {
    setModalType(type)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setFormData({
      value: '',
      unit: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      name: '',
      details: '',
      activityType: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Save data logic would go here
    alert(`${modalType} logged successfully!`)
    closeModal()
  }

  const stats = [
    {
      label: 'Weight',
      value: `${healthData.metrics.weight.value} ${healthData.metrics.weight.unit}`,
      change: '-2.3 lbs this week',
      icon: Scale,
      color: 'primary',
      trending: 'down'
    },
    {
      label: 'Steps Today',
      value: healthData.metrics.steps.toLocaleString(),
      change: `${Math.round((healthData.metrics.steps / 10000) * 100)}% of goal`,
      icon: Footprints,
      color: 'secondary'
    },
    {
      label: 'Heart Rate',
      value: `${healthData.metrics.heartRate.value} ${healthData.metrics.heartRate.unit}`,
      change: 'Normal range',
      icon: Heart,
      color: 'destructive'
    },
    {
      label: 'Water Intake',
      value: `${(healthData.metrics.water / 8).toFixed(1)} L`,
      change: `${Math.round((healthData.metrics.water / 64) * 100)}% of daily goal`,
      icon: Droplets,
      color: 'accent'
    }
  ]

  const quickActions = [
    { name: 'Log Weight', icon: Scale, color: 'primary', type: 'weight' },
    { name: 'Log Activity', icon: Zap, color: 'secondary', type: 'activity' },
    { name: 'Log Vitals', icon: Heart, color: 'destructive', type: 'vitals' },
    { name: 'Log Water', icon: Droplets, color: 'accent', type: 'water' }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'exercise': return Zap
      case 'weight': return Scale
      case 'water': return Droplets
      default: return Target
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'exercise': return 'rgba(16, 185, 129, 0.1)'
      case 'weight': return 'rgba(59, 130, 246, 0.1)'
      case 'water': return 'rgba(6, 182, 212, 0.1)'
      default: return 'rgba(139, 92, 246, 0.1)'
    }
  }

  return (
    <div className="container">
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
      
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <Heart size={24} />
            </div>
            <h1>HealthTracker</h1>
          </div>
          <button className="menu-btn" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="nav-items">
          <a href="#" className="nav-item active">
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item">
            <BarChart3 size={20} />
            <span>Metrics</span>
          </a>
          <a href="#" className="nav-item">
            <Zap size={20} />
            <span>Activities</span>
          </a>
          <a href="#" className="nav-item">
            <Target size={20} />
            <span>Goals</span>
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h2>Dashboard</h2>
              <p className="date-text">
                Today, {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="header-right">
            <button className="menu-btn notification-btn">
              <Bell size={20} />
              <span className="notification-badge">2</span>
            </button>
            <div className="avatar">JD</div>
          </div>
        </header>

        <div className="content">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="card">
                <div className="stat-card">
                  <div className="stat-info">
                    <h3>{stat.label}</h3>
                    <div className="value">{stat.value}</div>
                    <div className={`change ${stat.color}`}>
                      {stat.trending === 'down' && <TrendingDown size={16} />}
                      {stat.change}
                    </div>
                  </div>
                  <div className={`stat-icon ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="main-grid">
            <div className="card">
              <div className="chart-header">
                <h3>Weight Progress</h3>
                <div className="chart-controls">
                  {['week', 'month', 'year'].map(period => (
                    <button
                      key={period}
                      className={`btn ${chartPeriod === period ? 'active' : ''}`}
                      onClick={() => setChartPeriod(period)}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData.weightHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" stroke="#475569" fontSize={12} />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#475569" fontSize={12} />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ fill: "#16a34a", strokeWidth: 2, stroke: "#ffffff", r: 6 }}
                      activeDot={{ r: 8, stroke: "#16a34a", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '24px' }}>Quick Log</h3>
              <div className="quick-actions">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="action-btn"
                    onClick={() => openModal(action.type)}
                  >
                    <div className="action-btn-left">
                      <div className={`action-icon ${action.color}`}>
                        <action.icon size={16} />
                      </div>
                      <span>{action.name}</span>
                    </div>
                    <ChevronRight size={20} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bottom-grid">
            <div className="card">
              <div className="goals-header">
                <h3>Current Goals</h3>
                <button className="btn btn-primary">
                  <Plus size={16} />
                  Set New Goal
                </button>
              </div>
              <div className="goals-list">
                {healthData.goals.map(goal => {
                  const percentage = Math.min((goal.current / goal.target) * 100, 100)
                  return (
                    <div key={goal.id} className="goal-item">
                      <div className="goal-header">
                        <span className="goal-name">{goal.name}</span>
                        <span className="goal-progress">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${percentage}%` }} />
                      </div>
                      <p className="goal-type">
                        {goal.type === 'daily_steps' ? 'Daily goal' : 
                         goal.type === 'weekly_exercise' ? 'Weekly goal' : 'Target goal'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card">
              <div className="activities-header">
                <h3>Recent Activities</h3>
                <button className="btn view-all-btn">View All</button>
              </div>
              <div className="activities-list">
                {healthData.activities.map(activity => {
                  const Icon = getActivityIcon(activity.type)
                  const bgColor = getActivityColor(activity.type)
                  return (
                    <div key={activity.id} className="activity-item">
                      <div className="action-icon" style={{ backgroundColor: bgColor }}>
                        <Icon size={20} />
                      </div>
                      <div className="activity-content">
                        <div className="activity-name">{activity.name}</div>
                        <div className="activity-details">{activity.details}</div>
                      </div>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Log {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h3>
              <button className="menu-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {modalType === 'activity' && (
                <div className="form-group">
                  <label className="form-label">Activity Type</label>
                  <select 
                    className="form-select"
                    value={formData.activityType}
                    onChange={e => setFormData(prev => ({ ...prev, activityType: e.target.value }))}
                    required
                  >
                    <option value="">Select activity type</option>
                    <option value="exercise">Exercise</option>
                    <option value="steps">Steps</option>
                    <option value="sleep">Sleep</option>
                  </select>
                </div>
              )}

              {(modalType === 'activity' || modalType === 'water') && (
                <div className="form-group">
                  <label className="form-label">Activity Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={modalType === 'water' ? 'Water intake' : 'Activity name'}
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">
                  {modalType === 'weight' ? 'Weight (lbs)' : 
                   modalType === 'vitals' ? 'Heart Rate (BPM)' :
                   modalType === 'water' ? 'Water (oz)' : 'Duration (minutes)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={formData.value}
                  onChange={e => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={`Enter ${modalType === 'weight' ? 'weight' : modalType === 'vitals' ? 'heart rate' : modalType === 'water' ? 'water intake' : 'duration'}`}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              {modalType === 'activity' && (
                <div className="form-group">
                  <label className="form-label">Details</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.details}
                    onChange={e => setFormData(prev => ({ ...prev, details: e.target.value }))}
                    placeholder="e.g., 3.2 miles, 300 calories burned"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes..."
                  rows="3"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App