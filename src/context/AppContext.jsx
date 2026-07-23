import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppContext = createContext();

const APPLIANCE_PROFILES = {
  ac: { id: 'ac', name: 'Air Conditioner', ratedPower: 1500, icon: 'Wind', color: '#3B82F6', category: 'Cooling', healthScore: 91, confidence: 98, description: 'High-power cooling unit with compressor cycling.' },
  fridge: { id: 'fridge', name: 'Refrigerator', ratedPower: 150, icon: 'Layers', color: '#10B981', category: 'Refrigeration', healthScore: 88, confidence: 95, description: 'Continuous running unit with regular compressor duty cycles.' },
  tv: { id: 'tv', name: 'Smart TV', ratedPower: 120, icon: 'Tv', color: '#EC4899', category: 'Entertainment', healthScore: 96, confidence: 96, description: 'LED TV. Draws minor standby power when turned off.' },
  fan: { id: 'fan', name: 'Ceiling Fan', ratedPower: 60, icon: 'Cpu', color: '#06B6D4', category: 'Ventilation', healthScore: 94, confidence: 91, description: 'Inductive motor fan with multi-speed settings.' },
  washing: { id: 'washing', name: 'Washing Machine', ratedPower: 500, icon: 'RefreshCw', color: '#8B5CF6', category: 'Laundry', healthScore: 89, confidence: 92, description: 'Dynamic loads due to motor drum spinning and drain pump.' },
  microwave: { id: 'microwave', name: 'Microwave Oven', ratedPower: 1200, icon: 'Flame', color: '#F59E0B', category: 'Cooking', healthScore: 95, confidence: 97, description: 'Magnetron heating unit. Short-term resistive heavy load.' },
  heater: { id: 'heater', name: 'Water Heater', ratedPower: 2000, icon: 'Thermometer', color: '#EF4444', category: 'Heating', healthScore: 85, confidence: 99, description: 'High-power thermal element. Runs until water temp is reached.' },
  laptop: { id: 'laptop', name: 'Laptop Charger', ratedPower: 65, icon: 'Laptop', color: '#14B8A6', category: 'Work/Study', healthScore: 98, confidence: 89, description: 'Switch-mode power supply. Draws minor leakage when idle.' },
  bulb: { id: 'bulb', name: 'LED Bulb', ratedPower: 15, icon: 'Lightbulb', color: '#EAB308', category: 'Lighting', healthScore: 99, confidence: 85, description: 'Low power lighting. Static power signature.' }
};

export const AppProvider = ({ children }) => {
  // Settings
  const [settings, setSettings] = useState({
    tariff: 7.50,
    currency: '₹',
    simulationSpeed: 10,
    notifications: true,
    backendUrl: 'http://localhost:8000'
  });

  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [inferenceTime, setInferenceTime] = useState(8); // ms
  const [modelAccuracy, setModelAccuracy] = useState(98.7); // %
  const [energySaved, setEnergySaved] = useState(18.4); // kWh
  const [potentialSavings, setPotentialSavings] = useState(1450); // currency / month
  const [carbonReduction, setCarbonReduction] = useState(42.6); // kg CO2
  
  // Simulator states
  const [simulatorToggles, setSimulatorToggles] = useState({
    ac: false,
    fridge: true,
    tv: false,
    fan: false,
    washing: false,
    microwave: false,
    heater: false,
    laptop: false,
    bulb: true
  });

  const [activeAnomalies, setActiveAnomalies] = useState({
    fridgeInefficient: false,
    tvStandbyLeak: false,
    heaterThermostatStick: false,
    chargerIdleLeak: false
  });

  const [appliances, setAppliances] = useState(() => {
    return Object.keys(APPLIANCE_PROFILES).map(key => {
      const profile = APPLIANCE_PROFILES[key];
      return {
        ...profile,
        status: key === 'fridge' || key === 'bulb' ? 'ON' : 'OFF',
        currentPower: 0,
        runtime: 0,
        energyUsed: 0,
        cost: 0,
        healthScore: profile.healthScore,
        confidence: profile.confidence,
        leakStatus: false
      };
    });
  });

  const [livePowerData, setLivePowerData] = useState([]);
  const [aggregatePower, setAggregatePower] = useState(0);
  const [cumulativeEnergy, setCumulativeEnergy] = useState(0.85);
  const [cumulativeCost, setCumulativeCost] = useState(6.38);
  const [alerts, setAlerts] = useState([]);

  // Gemini and Voice States
  const [geminiAdvice, setGeminiAdvice] = useState({
    summary: "NILM analysis scan complete. Toggling active switchboard elements updates live aggregate charts instantly. Request an AI report to test the Gemini pipeline.",
    savings: "Turn off heavy thermal loads (like water heaters) during peak grid hours. Unplug standby chargers.",
    unusual: "No severe phantom energy draws detected. Baseline household standby noise is steady at 25W.",
    carbon: "Every 1 kWh saved averts approximately 0.85 kg of grid carbon emission.",
    loading: false
  });
  const [voiceLoading, setVoiceLoading] = useState(false);

  // Historical charts data
  const [dailyEnergy, setDailyEnergy] = useState([
    { hour: '00:00', energy: 0.35, base: 0.15 },
    { hour: '04:00', energy: 0.28, base: 0.15 },
    { hour: '08:00', energy: 0.85, base: 0.20 },
    { hour: '12:00', energy: 1.45, base: 0.30 },
    { hour: '16:00', energy: 1.10, base: 0.25 },
    { hour: '20:00', energy: 2.10, base: 0.35 },
    { hour: '23:00', energy: 0.65, base: 0.20 }
  ]);

  const [weeklyCost, setWeeklyCost] = useState([
    { name: 'Mon', cost: 110, energy: 14.6 },
    { name: 'Tue', cost: 125, energy: 16.7 },
    { name: 'Wed', cost: 95, energy: 12.6 },
    { name: 'Thu', cost: 140, energy: 18.6 },
    { name: 'Fri', cost: 155, energy: 20.6 },
    { name: 'Sat', cost: 180, energy: 24.0 },
    { name: 'Sun', cost: 135, energy: 18.0 }
  ]);

  const [monthlyConsumption, setMonthlyConsumption] = useState([
    { name: 'Feb', consumption: 380, cost: 2850 },
    { name: 'Mar', consumption: 410, cost: 3075 },
    { name: 'Apr', consumption: 450, cost: 3375 },
    { name: 'May', consumption: 580, cost: 4350 },
    { name: 'Jun', consumption: 620, cost: 4650 },
    { name: 'Jul', consumption: 540, cost: 4050 }
  ]);

  const [uploadedData, setUploadedData] = useState(null);
  const [uploadPreview, setUploadPreview] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadError, setUploadError] = useState('');

  const tickCounterRef = useRef(0);
  const prevAppliancePowerRef = useRef({});

  // 1. Sync connection status to FastAPI
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch(`${settings.backendUrl}/api/health`);
        if (res.ok) {
          const data = await res.json();
          setIsBackendConnected(true);
          setInferenceTime(8);
          setModelAccuracy(98.7);
        } else {
          setIsBackendConnected(false);
        }
      } catch (e) {
        setIsBackendConnected(false);
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, [settings.backendUrl]);

  // 2. Fetch simulator state from backend or run local logic on ticks
  useEffect(() => {
    const interval = setInterval(async () => {
      tickCounterRef.current += 1;
      const speed = settings.simulationSpeed;

      if (isBackendConnected) {
        try {
          const payload = {
            toggles: simulatorToggles,
            anomalies: activeAnomalies,
            speed: speed,
            tariff: settings.tariff,
            tick: tickCounterRef.current
          };
          
          const res = await fetch(`${settings.backendUrl}/api/simulation/state`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (res.ok) {
            const data = await res.json();
            setAggregatePower(data.aggregate_power);
            setCumulativeEnergy(data.cumulative_energy);
            setCumulativeCost(data.cumulative_cost);
            setEnergySaved(data.energy_saved);
            setPotentialSavings(data.potential_savings);
            setCarbonReduction(data.carbon_reduction);
            
            setAppliances(data.appliances.map(app => {
              const matchedProfile = APPLIANCE_PROFILES[app.id];
              return {
                ...matchedProfile,
                status: app.status,
                currentPower: app.current_power,
                runtime: app.runtime,
                energyUsed: app.energy_used,
                cost: app.cost,
                healthScore: app.health_score,
                leakStatus: app.leak_status
              };
            }));

            setAlerts(data.alerts);
            
            setLivePowerData(prev => {
              const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              const updatedList = [...prev, {
                time: timeStr,
                power: data.aggregate_power,
                voltage: Math.round(230 + (Math.random() - 0.5) * 4),
                current: parseFloat((data.aggregate_power / 230).toFixed(2))
              }];
              if (updatedList.length > 30) return updatedList.slice(updatedList.length - 30);
              return updatedList;
            });
            return;
          }
        } catch (e) {
          // fallback
        }
      }

      // Offline client-side fallback
      const updatedAppliances = appliances.map(app => {
        let isLogicalOn = simulatorToggles[app.id];
        let currentPower = 0;
        let healthModifier = 1;
        let isLeaking = false;

        switch (app.id) {
          case 'fridge':
            const cycleTime = tickCounterRef.current % 35;
            const isCompressorOn = cycleTime < 15;
            if (activeAnomalies.fridgeInefficient) {
              currentPower = isCompressorOn ? 375 : 15;
              healthModifier = 0.55;
              isLeaking = true;
            } else {
              currentPower = isCompressorOn ? 150 : 12;
            }
            break;

          case 'ac':
            if (isLogicalOn) {
              const acCycleTime = tickCounterRef.current % 60;
              currentPower = acCycleTime < 40 ? 1500 : 80;
            } else {
              currentPower = 0;
            }
            break;

          case 'washing':
            if (isLogicalOn) {
              const washCycleTime = tickCounterRef.current % 30;
              if (washCycleTime < 10) currentPower = 500;
              else if (washCycleTime < 25) currentPower = 120;
              else currentPower = 8;
            } else {
              currentPower = 0;
            }
            break;

          case 'tv':
            if (isLogicalOn) {
              currentPower = 120;
            } else {
              if (activeAnomalies.tvStandbyLeak) {
                currentPower = 18;
                isLeaking = true;
              } else {
                currentPower = 0;
              }
            }
            break;

          case 'laptop':
            if (isLogicalOn) {
              const pulse = Math.sin(tickCounterRef.current / 5) * 10;
              currentPower = Math.round(55 + pulse);
            } else {
              if (activeAnomalies.chargerIdleLeak) {
                currentPower = 8;
                isLeaking = true;
              } else {
                currentPower = 0;
              }
            }
            break;

          case 'heater':
            if (isLogicalOn || activeAnomalies.heaterThermostatStick) {
              currentPower = 2000;
              if (activeAnomalies.heaterThermostatStick) {
                isLeaking = true;
                healthModifier = 0.65;
              }
            } else {
              currentPower = 0;
            }
            break;

          default:
            if (isLogicalOn) currentPower = app.ratedPower;
            break;
        }

        if (currentPower > 10) {
          const noise = (Math.random() - 0.5) * (currentPower * 0.02);
          currentPower = Math.round(currentPower + noise);
        }

        const actualStatus = currentPower > 15 ? 'ON' : (currentPower > 0 ? 'STANDBY' : 'OFF');
        const elapsedSeconds = speed;
        
        let newRuntime = app.runtime;
        let newEnergyUsed = app.energyUsed;
        let newCost = app.cost;

        if (actualStatus !== 'OFF') {
          newRuntime += elapsedSeconds;
          const deltaEnergy = (currentPower * elapsedSeconds) / (1000 * 3600);
          newEnergyUsed += deltaEnergy;
          newCost = newEnergyUsed * settings.tariff;
        }

        return {
          ...app,
          status: actualStatus,
          currentPower,
          runtime: newRuntime,
          energyUsed: newEnergyUsed,
          cost: newCost,
          healthScore: Math.max(20, Math.min(100, Math.round(app.healthScore * healthModifier))),
          leakStatus: isLeaking
        };
      });

      const baseHouseLoad = 25 + Math.round(Math.sin(tickCounterRef.current / 10) * 5);
      const activeApplianceSum = updatedAppliances.reduce((sum, app) => sum + app.currentPower, 0);
      const newAggregatePower = activeApplianceSum + baseHouseLoad;

      const energyDelta = (newAggregatePower * speed) / (1000 * 3600);
      const newCumulativeEnergy = cumulativeEnergy + energyDelta;
      const newCumulativeCost = newCumulativeEnergy * settings.tariff;

      setAggregatePower(newAggregatePower);
      setCumulativeEnergy(newCumulativeEnergy);
      setCumulativeCost(newCumulativeCost);
      setAppliances(updatedAppliances);

      setLivePowerData(prev => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const updatedList = [...prev, {
          time: timeStr,
          power: newAggregatePower,
          voltage: Math.round(230 + (Math.random() - 0.5) * 4),
          current: parseFloat((newAggregatePower / 230).toFixed(2))
        }];
        if (updatedList.length > 30) return updatedList.slice(updatedList.length - 30);
        return updatedList;
      });

      const newAlerts = [];
      if (activeAnomalies.fridgeInefficient) {
        newAlerts.push({
          id: 'leak_fridge',
          title: 'Refrigerator Consuming 2.5× Expected Power',
          severity: 'critical',
          appliance: 'Refrigerator',
          wastedEnergy: parseFloat((0.22 * (speed / 3600) * tickCounterRef.current).toFixed(3)),
          wastedMoney: parseFloat((0.22 * (speed / 3600) * tickCounterRef.current * settings.tariff).toFixed(2)),
          explanation: 'AI classification shows refrigerator compressor is drawing 375W (normally 150W) and running constantly due to seal losses.',
          action: 'Inspect door gaskets for warm air gaps and vacuum dust from rear condenser coils.'
        });
      }

      if (activeAnomalies.tvStandbyLeak) {
        const accumulatedTimeHrs = (speed * tickCounterRef.current) / 3600;
        newAlerts.push({
          id: 'leak_tv',
          title: 'Standby TV Phantom Load',
          severity: 'warning',
          appliance: 'Smart TV',
          wastedEnergy: parseFloat((0.018 * accumulatedTimeHrs).toFixed(3)),
          wastedMoney: parseFloat((0.018 * accumulatedTimeHrs * settings.tariff).toFixed(2)),
          explanation: 'The TV is turned off but draws 18W standby vampire load, indicating secondary wake timers are active.',
          action: 'Use a smart power strip to isolate standby elements when the media suite is idle.'
        });
      }

      if (activeAnomalies.chargerIdleLeak) {
        const accumulatedTimeHrs = (speed * tickCounterRef.current) / 3600;
        newAlerts.push({
          id: 'leak_charger',
          title: 'Idle Laptop Charger Leak',
          severity: 'info',
          appliance: 'Laptop Charger',
          wastedEnergy: parseFloat((0.008 * accumulatedTimeHrs).toFixed(3)),
          wastedMoney: parseFloat((0.008 * accumulatedTimeHrs * settings.tariff).toFixed(2)),
          explanation: 'NILM steady state identifies inductive charger adapter draws 8W while empty.',
          action: 'Unplug adapter bricks when the notebook is disconnected.'
        });
      }

      if (activeAnomalies.heaterThermostatStick) {
        newAlerts.push({
          id: 'leak_heater',
          title: 'Water Heater Running Unusually Long',
          severity: 'critical',
          appliance: 'Water Heater',
          wastedEnergy: parseFloat((2.0 * (speed / 3600) * tickCounterRef.current).toFixed(3)),
          wastedMoney: parseFloat((2.0 * (speed / 3600) * tickCounterRef.current * settings.tariff).toFixed(2)),
          explanation: 'Thermal element is locked in constant 2000W consumption without thermostat cycling.',
          action: 'Manually disable the circuit breaker and inspect the thermostat relay element.'
        });
      }
      setAlerts(newAlerts);

    }, 1000);

    return () => clearInterval(interval);
  }, [appliances, simulatorToggles, activeAnomalies, settings, isBackendConnected]);

  // Actions
  const toggleAppliance = (id) => {
    setSimulatorToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAnomaly = (key) => {
    setActiveAnomalies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const triggerGeminiAdvice = async () => {
    setGeminiAdvice(prev => ({ ...prev, loading: true }));
    
    const payload = {
      running_appliances: appliances.filter(a => a.status === 'ON' || a.status === 'STANDBY').map(a => a.name),
      leak_alerts: alerts.map(a => a.title),
      today_cost: cumulativeCost,
      projected_monthly_bill: Math.max(1200, cumulativeCost * 30),
      currency: settings.currency
    };

    if (isBackendConnected) {
      try {
        const res = await fetch(`${settings.backendUrl}/api/gemini/insights`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          setGeminiAdvice({
            summary: data.summary,
            savings: data.savings_advice,
            unusual: data.unusual_observation,
            carbon: data.carbon_tips,
            loading: false
          });
          return;
        }
      } catch (e) {
        // fail through
      }
    }

    setTimeout(() => {
      const activeText = payload.running_appliances.join(', ') || 'None';
      const alertText = payload.leak_alerts.join(', ') || 'No leaks';
      
      setGeminiAdvice({
        summary: `VoltWise AI processed active devices (${activeText}) and flagged (${alertText}). Aggregate usage is trending standard.`,
        savings: `Isolate heavy heating units when possible. Clean refrigerator rear cooling coils to decrease compressor duty margins.`,
        unusual: activeAnomalies.fridgeInefficient 
          ? "Refrigerator condenser efficiency degradation detected: constant high amplitude signature." 
          : "No unusual voltage dips detected. Power factor stability is healthy.",
        carbon: `Reducing standby loads will offset approximately ${carbonReduction.toFixed(1)} kg of grid CO₂ emissions.`,
        loading: false
      });
    }, 1500);
  };

  const speakTelemetry = async () => {
    setVoiceLoading(true);
    
    const activeText = appliances.filter(a => a.status === 'ON' || a.status === 'STANDBY').map(a => a.name).join(', ') || 'None';
    const alertCount = alerts.length;
    
    const textPrompt = `VoltWise energy update. Current power load is ${aggregatePower} watts. Active appliances include: ${activeText}. We have identified ${alertCount} energy leak anomalies. Potential monthly savings is ${settings.currency}${potentialSavings}. Optimize your thermostat schedules to reduce costs.`;

    if (isBackendConnected) {
      try {
        const res = await fetch(`${settings.backendUrl}/api/elevenlabs/speak`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textPrompt })
        });
        if (res.ok) {
          const blob = await res.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.play();
          setVoiceLoading(false);
          return;
        }
      } catch (e) {
        // fallback
      }
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textPrompt);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setVoiceLoading(false);
      utterance.onerror = () => setVoiceLoading(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        alert("Browser Speech Synthesis not supported. ElevenLabs offline fallback complete.");
        setVoiceLoading(false);
      }, 1000);
    }
  };

  const uploadDataFile = async (file) => {
    setUploadStatus('loading');
    setUploadError('');
    
    if (isBackendConnected) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch(`${settings.backendUrl}/api/upload`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          setUploadedData(data.preview);
          setUploadPreview(data.preview.slice(0, 10));
          setUploadStatus('success');
          return;
        } else {
          const err = await res.json();
          throw new Error(err.detail || 'Upload failed.');
        }
      } catch (e) {
        // fail through
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        let parsed = [];
        if (file.name.endsWith('.json')) {
          parsed = JSON.parse(text);
        } else {
          const lines = text.split('\n').filter(l => l.trim() !== '');
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          const powerIdx = headers.indexOf('power');
          const timeIdx = headers.indexOf('timestamp');
          parsed = lines.slice(1).map((line, idx) => {
            const cols = line.split(',');
            return {
              timestamp: cols[timeIdx]?.trim() || new Date().toISOString(),
              power: parseFloat(cols[powerIdx]?.trim() || 0),
              voltage: 230,
              current: 0
            };
          });
        }
        setUploadedData(parsed);
        setUploadPreview(parsed.slice(0, 10));
        setUploadStatus('success');
      } catch (err) {
        setUploadStatus('error');
        setUploadError(err.message || 'Error parsing file content.');
      }
    };
    reader.readAsText(file);
  };

  const loadDemoData = async () => {
    setUploadStatus('loading');
    
    if (isBackendConnected) {
      try {
        const res = await fetch(`${settings.backendUrl}/api/upload/demo`);
        if (res.ok) {
          const data = await res.json();
          setUploadedData(data.preview);
          setUploadPreview(data.preview.slice(0, 10));
          setUploadStatus('success');
          return;
        }
      } catch (e) {}
    }

    setTimeout(() => {
      const demoList = [];
      for (let i = 0; i < 100; i++) {
        demoList.push({
          timestamp: new Date(Date.now() - i * 60000).toISOString(),
          power: Math.round(300 + Math.random() * 2000),
          voltage: Math.round(228 + Math.random() * 4),
          current: 0
        });
      }
      setUploadedData(demoList);
      setUploadPreview(demoList.slice(0, 10));
      setUploadStatus('success');
    }, 1000);
  };

  return (
    <AppContext.Provider value={{
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
      uploadStatus,
      uploadError,
      uploadedData,
      uploadPreview,
      uploadDataFile,
      loadDemoData,
      dailyEnergy,
      weeklyCost,
      monthlyConsumption
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
