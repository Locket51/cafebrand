import { useApp } from '../context/AppContext';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Legend 
} from 'recharts';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getIcon = (name, className = "h-5 w-5", color = "currentColor") => {
  const IconComp = Icons[name];
  if (!IconComp) return <Icons.Zap className={className} style={{ color }} />;
  return <IconComp className={className} style={{ color }} />;
};

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function Dashboard() {
  const {
    settings,
    updateSetting,
    isBackendConnected,
    inferenceTime,
    modelAccuracy,
    energySaved,
    potentialSavings,
    carbonReduction,
    simulatorToggles,
    toggleAppliance,
    activeAnomalies,
    toggleAnomaly,
    appliances,
    livePowerData,
    aggregatePower,
    cumulativeEnergy,
    cumulativeCost,
    alerts,
    geminiAdvice,
    triggerGeminiAdvice,
    voiceLoading,
    speakTelemetry,
    dailyEnergy,
    weeklyCost,
    monthlyConsumption
  } = useApp();

  const activeCount = appliances.filter(a => a.status === 'ON' || a.status === 'STANDBY').length;

  // Pie chart data
  const pieData = appliances
    .filter(a => a.currentPower > 0)
    .map(a => ({
      name: a.name,
      value: a.currentPower,
      color: a.color
    }));
  
  const totalAppliancePower = appliances.reduce((sum, a) => sum + a.currentPower, 0);
  const standbyBase = Math.max(10, aggregatePower - totalAppliancePower);
  if (standbyBase > 0) {
    pieData.push({ name: 'Standby baseline', value: standbyBase, color: '#4B5563' });
  }

  // Carbon metrics
  const co2Today = cumulativeEnergy * 0.85;
  const co2Monthly = co2Today * 30;
  const treesOffset = co2Today / 0.06;

  // Render 10 KPI Cards
  const kpis = [
    { label: "Current Power", value: `${aggregatePower} W`, color: "text-electric-blue", icon: "Zap", desc: "Live aggregate flow" },
    { label: "Today's Energy", value: `${cumulativeEnergy.toFixed(3)} kWh`, color: "text-emerald-green", icon: "Activity", desc: "Total consumption" },
    { label: "Today's Cost", value: `${settings.currency}${cumulativeCost.toFixed(2)}`, color: "text-yellow-500", icon: "Coins", desc: `Tariff ${settings.currency}${settings.tariff}` },
    { label: "Running Devices", value: `${activeCount} / 9`, color: "text-purple-400", icon: "Cpu", desc: "Active classifications" },
    { label: "Monthly Bill Pred", value: `${settings.currency}${Math.round(Math.max(1200, cumulativeCost * 30))}`, color: "text-pink-500", icon: "TrendingUp", desc: "Linear projection" },
    { label: "Carbon Emitted", value: `${co2Today.toFixed(2)} kg`, color: "text-green-400", icon: "Leaf", desc: "Grid footprint" },
    { label: "Energy Saved", value: `${energySaved.toFixed(1)} kWh`, color: "text-cyan-400", icon: "CheckSquare", desc: "Averted wastage" },
    { label: "Potential Savings", value: `${settings.currency}${potentialSavings}/mo`, color: "text-amber-500", icon: "Wallet", desc: "Optimization margin" },
    { label: "AI Confidence", value: `${modelAccuracy}%`, color: "text-teal-400", icon: "Shield", desc: "Model certainty" },
    { label: "Inference Time", value: `${inferenceTime} ms`, color: "text-indigo-400", icon: "Clock", desc: "Edge latency rate" }
  ];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 text-left">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">VoltWise AI Control Panel</h1>
          <p className="text-gray-400 text-sm mt-1">
            Production-quality NILM analytics and load disaggregation dispatches.
          </p>
        </div>

        {/* ElevenLabs voice narrations */}
        <button
          onClick={speakTelemetry}
          disabled={voiceLoading}
          className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-electric-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-electric-blue/15 hover:shadow-electric-blue/30 transition-all duration-300 group disabled:opacity-50 shrink-0 cursor-pointer overflow-hidden border border-white/5"
        >
          {voiceLoading ? (
            <>
              <Icons.Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating Audio...</span>
            </>
          ) : (
            <>
              <Icons.Mic className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Explain My Electricity Usage</span>
            </>
          )}
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-emerald-green animate-ping mr-2 mt-2"></span>
        </button>
      </div>

      {/* 10 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="glass-panel p-4 rounded-2xl border border-white/5 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:scale-110 transition-transform duration-300">
              {getIcon(kpi.icon, "h-12 w-12")}
            </div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">{kpi.label}</span>
            <span className={`text-xl font-extrabold block mt-2 font-display ${kpi.color}`}>{kpi.value}</span>
            <span className="text-[9px] text-gray-400 block mt-1">{kpi.desc}</span>
          </div>
        ))}
      </div>

      {/* Main Grid split: Main charts and stats vs. simulator controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column (takes 2/3 cols) */}
        <div className="lg:col-span-2 space-y-8 text-left">
          
          {/* Live Meter power chart */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Live Aggregated Load Profile</h3>
                <span className="text-xs text-gray-400">Total wattage sampled from smart-meter logs</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-electric-blue bg-electric-blue/10 border border-electric-blue/20 rounded-full px-3 py-1 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-electric-blue animate-ping"></span>
                <span>AI Telemetry Active</span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={livePowerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="livePowerGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#4B5563" fontSize={9} tickLine={false} />
                  <YAxis stroke="#4B5563" fontSize={9} tickLine={false} domain={[0, 'dataMax + 100']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050816', borderColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}
                    labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
                    itemStyle={{ color: '#FFF' }}
                  />
                  <Area type="monotone" dataKey="power" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#livePowerGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detected Appliances Card Grid */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6">NILM Device State Registers</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {appliances.map(app => (
                <div key={app.id} className="bg-black/35 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0" style={{ color: app.currentPower > 15 ? app.color : '#4B5563' }}>
                      {getIcon(app.icon, "h-5 w-5")}
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      app.status === 'ON' 
                        ? 'bg-emerald-green/10 text-emerald-green border border-emerald-green/20' 
                        : (app.status === 'STANDBY' ? 'bg-orange-warning/10 text-orange-warning border border-orange-warning/20' : 'bg-white/5 text-gray-500 border border-white/10')
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-white block text-sm">{app.name}</span>
                    <span className="text-[10px] text-gray-500 block mb-3">{app.category}</span>
                    
                    <div className="space-y-1.5 text-[10px] text-gray-400 border-t border-white/5 pt-2.5">
                      <div className="flex justify-between">
                        <span>Load:</span>
                        <strong className="text-white">{app.currentPower} W</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Runtime:</span>
                        <strong className="text-white font-mono">{formatDuration(app.runtime)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Today's Energy:</span>
                        <strong className="text-white font-mono">{app.energyUsed.toFixed(3)} kWh</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <strong className="text-white">{app.confidence}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Health:</span>
                        <strong style={{ color: app.healthScore > 80 ? '#10B981' : '#F97316' }}>{app.healthScore}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI Recommendations Panel */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Icons.Sparkles className="h-24 w-24 text-electric-blue" />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <Icons.Sparkles className="h-5 w-5 text-electric-blue animate-pulse" />
                  Gemini AI Optimization report
                </h3>
                <span className="text-xs text-gray-400">Contextual savings guidelines powered by Google Gemini</span>
              </div>
              
              <button
                onClick={triggerGeminiAdvice}
                disabled={geminiAdvice.loading}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 disabled:opacity-50 shrink-0 cursor-pointer"
              >
                {geminiAdvice.loading ? "Synthesizing report..." : "Refresh AI Report"}
              </button>
            </div>

            {geminiAdvice.loading ? (
              <div className="h-40 flex flex-col items-center justify-center">
                <Icons.Loader2 className="h-8 w-8 text-electric-blue animate-spin mb-3" />
                <span className="text-xs text-gray-400">Requesting Gemini API...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-black/25 border border-white/5 rounded-2xl p-4">
                  <span className="text-[10px] text-electric-blue font-bold uppercase tracking-wider block mb-1">State Summary</span>
                  <p className="text-gray-300 leading-relaxed">{geminiAdvice.summary}</p>
                </div>
                <div className="bg-black/25 border border-white/5 rounded-2xl p-4">
                  <span className="text-[10px] text-emerald-green font-bold uppercase tracking-wider block mb-1">Savings Strategy</span>
                  <p className="text-gray-300 leading-relaxed">{geminiAdvice.savings}</p>
                </div>
                <div className="bg-black/25 border border-white/5 rounded-2xl p-4">
                  <span className="text-[10px] text-orange-warning font-bold uppercase tracking-wider block mb-1">Unusual Observations</span>
                  <p className="text-gray-300 leading-relaxed">{geminiAdvice.unusual}</p>
                </div>
                <div className="bg-black/25 border border-white/5 rounded-2xl p-4">
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider block mb-1">Carbon Reduction advice</span>
                  <p className="text-gray-300 leading-relaxed">{geminiAdvice.carbon}</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Controls, alerts, breakdown charts (takes 1/3 cols) */}
        <div className="space-y-8 text-left">
          
          {/* Simulator Switchboard Controls */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
            {/* Background glowing indicator */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/5 rounded-full blur-[40px] pointer-events-none"></div>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-1.5">
              <Icons.Cpu className="h-5 w-5 text-electric-blue" />
              Interactive Load Switchboard
            </h3>
            
            {/* Appliance Switches */}
            <div className="space-y-2.5 mb-6">
              {appliances.map(app => (
                <div 
                  key={app.id}
                  onClick={() => toggleAppliance(app.id)}
                  className={`px-4 py-3 rounded-xl border cursor-pointer transition-all duration-300 flex justify-between items-center ${
                    app.currentPower > 15
                      ? 'bg-electric-blue/5 border-electric-blue/35 hover:border-electric-blue/50'
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500" style={{ color: app.currentPower > 15 ? app.color : '' }}>
                      {getIcon(app.icon, "h-4 w-4")}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{app.name}</span>
                      <span className="text-[9px] text-gray-500 block">{app.ratedPower}W rated</span>
                    </div>
                  </div>
                  
                  {/* Slider */}
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${app.currentPower > 15 ? 'bg-electric-blue' : 'bg-white/10'}`}>
                    <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${app.currentPower > 15 ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Anomaly Injector Switches */}
            <h4 className="text-xs font-bold text-orange-warning mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Icons.AlertTriangle className="h-4 w-4" />
              Inject Telemetry Anomalies
            </h4>
            
            <div className="space-y-2">
              <div 
                onClick={() => toggleAnomaly('fridgeInefficient')}
                className={`p-3 rounded-xl border cursor-pointer text-xs transition-all duration-300 flex justify-between items-center ${
                  activeAnomalies.fridgeInefficient ? 'bg-orange-warning/5 border-orange-warning/35' : 'bg-black/20 border-white/5'
                }`}
              >
                <div>
                  <span className="font-bold text-white block">Bad Refrigerator Gaskets</span>
                  <span className="text-[8px] text-gray-500 block leading-tight">Increases load to 375W (2.5x draw)</span>
                </div>
                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors shrink-0 ${activeAnomalies.fridgeInefficient ? 'bg-orange-warning' : 'bg-white/10'}`}>
                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${activeAnomalies.fridgeInefficient ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div 
                onClick={() => toggleAnomaly('tvStandbyLeak')}
                className={`p-3 rounded-xl border cursor-pointer text-xs transition-all duration-300 flex justify-between items-center ${
                  activeAnomalies.tvStandbyLeak ? 'bg-orange-warning/5 border-orange-warning/35' : 'bg-black/20 border-white/5'
                }`}
              >
                <div>
                  <span className="font-bold text-white block">TV Vampire Standby Leak</span>
                  <span className="text-[8px] text-gray-500 block leading-tight">Draws 18W when turned OFF</span>
                </div>
                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors shrink-0 ${activeAnomalies.tvStandbyLeak ? 'bg-orange-warning' : 'bg-white/10'}`}>
                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${activeAnomalies.tvStandbyLeak ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div 
                onClick={() => toggleAnomaly('heaterThermostatStick')}
                className={`p-3 rounded-xl border cursor-pointer text-xs transition-all duration-300 flex justify-between items-center ${
                  activeAnomalies.heaterThermostatStick ? 'bg-red-alert/5 border-red-alert/35' : 'bg-black/20 border-white/5'
                }`}
              >
                <div>
                  <span className="font-bold text-white block">Stuck Heater Thermostat</span>
                  <span className="text-[8px] text-gray-500 block leading-tight">Heater runs at 2000W indefinitely</span>
                </div>
                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors shrink-0 ${activeAnomalies.heaterThermostatStick ? 'bg-red-alert' : 'bg-white/10'}`}>
                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${activeAnomalies.heaterThermostatStick ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>

            {/* Speed selection */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-semibold">Sim Speed:</span>
              <div className="flex gap-1 bg-black/35 p-0.5 rounded-lg border border-white/5">
                {[1, 10, 60].map(sp => (
                  <button
                    key={sp}
                    onClick={() => updateSetting('simulationSpeed', sp)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${settings.simulationSpeed === sp ? 'bg-electric-blue text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Energy Leaks Warnings list */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-1.5">
              <Icons.AlertTriangle className="h-5 w-5 text-orange-warning" />
              Energy Leak Warnings
            </h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-white/10 rounded-2xl">
                  <Icons.CheckCircle2 className="h-8 w-8 text-emerald-green mx-auto mb-2 opacity-75" />
                  <span className="text-xs font-bold text-white block">No leaks isolated</span>
                  <p className="text-[10px] text-gray-500 mt-1 max-w-[180px] mx-auto">System baseline draws conform to normal efficiency clusters.</p>
                </div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className={`p-4 rounded-xl border ${alert.severity === 'critical' ? 'bg-red-alert/5 border-red-alert/20' : 'bg-orange-warning/5 border-orange-warning/20'}`}>
                    <div className="flex justify-between items-start gap-1 mb-1.5">
                      <span className="text-xs font-bold text-white leading-tight">{alert.title}</span>
                      <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full shrink-0 ${alert.severity === 'critical' ? 'bg-red-alert/20 text-red-alert' : 'bg-orange-warning/20 text-orange-warning'}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mb-2 leading-relaxed">{alert.explanation}</p>
                    
                    {alert.wastedEnergy > 0 && (
                      <div className="bg-black/35 rounded-lg p-2 flex justify-between text-[9px] text-gray-500 mb-2 border border-white/5">
                        <span>Wasted: <strong className="text-white">{alert.wastedEnergy} kWh</strong></span>
                        <span>Loss: <strong className="text-white">{settings.currency}{alert.wastedMoney}</strong></span>
                      </div>
                    )}
                    <p className="text-[9px] text-gray-300 leading-normal border-t border-white/5 pt-1.5">
                      <strong className="text-electric-blue">Suggested Action:</strong> {alert.action}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cost Breakdown Pie Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5">
            <h3 className="text-base font-bold text-white mb-2">Cost disaggregation</h3>
            <span className="text-xs text-gray-400 block mb-4">Daily load value partition model</span>

            <div className="flex justify-center h-40 relative">
              {pieData.length === 0 ? (
                <span className="text-xs text-gray-600 self-center">No active load</span>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#050816', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <span className="text-[9px] text-gray-500 uppercase block font-bold">Total</span>
                    <span className="text-base font-extrabold text-white block leading-none">{aggregatePower}W</span>
                  </div>
                </>
              )}
            </div>

            {/* Custom Pie Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[9px]">
              {pieData.slice(0, 4).map(item => (
                <div key={item.name} className="flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-400 truncate">{item.name} ({Math.round((item.value / aggregatePower) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Carbon Footprint */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-1.5">
              <Icons.Leaf className="h-5 w-5 text-emerald-green" />
              Carbon Audit Logs
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
              <div className="bg-black/25 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-gray-500 font-bold block uppercase">Monthly CO₂</span>
                <span className="text-base font-bold text-white mt-1 block">{co2Monthly.toFixed(1)} kg</span>
              </div>
              <div className="bg-black/25 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-gray-500 font-bold block uppercase">Trees Offset</span>
                <span className="text-base font-bold text-emerald-green mt-1 block">{Math.ceil(treesOffset)} Trees</span>
              </div>
            </div>

            <div className="bg-emerald-green/10 border border-emerald-green/20 rounded-2xl p-4 flex gap-2.5 items-start">
              <Icons.TrendingDown className="h-4 w-4 text-emerald-green shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-400 leading-normal text-left">
                By addressing leakage, you avoided <strong className="text-emerald-green">{(carbonReduction + cumulativeEnergy * 0.1).toFixed(1)} kg</strong> of atmospheric CO₂ emissions.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
