import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, FileSpreadsheet, FileJson, CheckCircle2, AlertTriangle, Play, HelpCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DataUpload() {
  const {
    uploadDataFile,
    loadDemoData,
    uploadStatus,
    uploadError,
    uploadPreview,
    uploadedData
  } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadDataFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadDataFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-white">Smart Meter Ingestion</h1>
        <p className="text-gray-400 text-sm mt-1">
          Upload aggregate smart meter readings to run batch NILM load disaggregations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Drag/Drop & Preview */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            {/* Background aura */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/5 rounded-full blur-[80px] pointer-events-none"></div>

            <h3 className="text-lg font-bold text-white mb-4">Ingest Logs</h3>
            
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                dragActive 
                  ? 'border-electric-blue bg-electric-blue/5 shadow-inner' 
                  : 'border-white/10 hover:border-white/20 bg-black/20'
              }`}
              onClick={onButtonClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv,.json"
                onChange={handleFileChange}
              />

              {uploadStatus === 'loading' ? (
                <div className="py-6 flex flex-col items-center">
                  <Loader2 className="h-12 w-12 text-electric-blue animate-spin mb-4" />
                  <span className="text-sm font-bold text-white">Ingesting telemetry...</span>
                  <p className="text-xs text-gray-500 mt-1">Extracting power factor transients</p>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-electric-blue mb-4 transition-transform hover:scale-115">
                    <Upload className="h-8 w-8 animate-pulse" />
                  </div>
                  <span className="text-sm font-bold text-white">Drag and Drop smart-meter logs</span>
                  <span className="text-xs text-gray-500 mt-1.5 block">or click to browse local files</span>
                  <span className="text-[10px] text-gray-600 mt-4 font-mono block">Supports CSV or JSON (max 5MB)</span>
                </div>
              )}
            </div>

            {/* Error or Success banners */}
            {uploadStatus === 'error' && (
              <div className="mt-6 bg-red-alert/10 border border-red-alert/20 rounded-2xl p-4 flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 text-red-alert shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-bold text-white">Ingestion Failure</span>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{uploadError}</p>
                </div>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="mt-6 bg-emerald-green/10 border border-emerald-green/20 rounded-2xl p-4 flex gap-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-emerald-green shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-bold text-white">File Ingested Successfully</span>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    Telemetry timeline successfully synced. Ingested {uploadedData ? uploadedData.length : 0} logs records.
                  </p>
                </div>
              </div>
            )}

            {/* Or Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">or sandbox tests</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Demo dataset loader */}
            <button
              onClick={loadDemoData}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Play className="h-4 w-4 text-emerald-green fill-emerald-green" />
              <span>Load 24hr Demo Telemetry Timeline</span>
            </button>

          </div>

          {/* Uploaded Data Preview Grid */}
          {uploadedData && (
            <div className="glass-panel p-6 rounded-3xl border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Parsed File Preview</h3>
                  <span className="text-xs text-gray-400">First 10 records matching schema columns</span>
                </div>
                <span className="bg-electric-blue/10 border border-electric-blue/20 text-electric-blue px-3 py-1 rounded-full text-xs font-bold font-mono">
                  {uploadedData.length} records
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/5">
                <table className="min-w-full divide-y divide-white/5 text-xs text-left">
                  <thead className="bg-black/35 font-bold uppercase text-gray-500 tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Index</th>
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4 text-right">Agg Power (W)</th>
                      <th className="py-2.5 px-4 text-right">Voltage (V)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
                    {uploadPreview.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-4 text-gray-500 font-semibold">{idx + 1}</td>
                        <td className="py-2.5 px-4 text-gray-400">
                          {row.timestamp.includes('T') ? new Date(row.timestamp).toLocaleTimeString() : row.timestamp}
                        </td>
                        <td className="py-2.5 px-4 text-right text-white font-bold">{row.power} W</td>
                        <td className="py-2.5 px-4 text-right">{row.voltage} V</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Schema Specifications */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-white/5">
            <h3 className="text-base font-bold text-white mb-4">Required Schemas</h3>
            
            <div className="space-y-5">
              
              <div className="bg-black/20 rounded-2xl p-4 border border-white/5 text-xs">
                <div className="flex items-center space-x-2 mb-3 text-electric-blue font-bold">
                  <FileSpreadsheet className="h-5 w-5 shrink-0" />
                  <span>CSV Column mapping</span>
                </div>
                <p className="text-gray-400 leading-relaxed mb-3">
                  CSV must contain a header row specifying <strong>timestamp</strong> and <strong>power</strong>.
                </p>
                <div className="bg-black/40 rounded-xl p-2 font-mono text-[10px] text-gray-400 leading-normal">
                  timestamp,power,voltage<br />
                  2026-07-23T18:00:00Z,350,230<br />
                  2026-07-23T18:00:05Z,1850,229<br />
                  2026-07-23T18:00:10Z,1845,230
                </div>
              </div>

              <div className="bg-black/20 rounded-2xl p-4 border border-white/5 text-xs">
                <div className="flex items-center space-x-2 mb-3 text-emerald-green font-bold">
                  <FileJson className="h-5 w-5 shrink-0" />
                  <span>JSON File Specifications</span>
                </div>
                <p className="text-gray-400 leading-relaxed mb-3">
                  JSON files must map an array of telemetry reading structures.
                </p>
                <div className="bg-black/40 rounded-xl p-2 font-mono text-[9px] text-gray-400 leading-normal">
                  [<br />
                  &nbsp;&nbsp;&#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"timestamp": "2026-07-23T18:00:00Z",<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"power": 350,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"voltage": 230<br />
                  &nbsp;&nbsp;&#125;,<br />
                  &nbsp;&nbsp;...<br />
                  ]
                </div>
              </div>

            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <HelpCircle className="h-16 w-16 text-electric-blue" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">AI Batch Processing</h3>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-4">Ingestion Workflow</span>

            <ul className="space-y-4 text-xs text-gray-400">
              <li className="flex gap-2">
                <span className="font-bold text-electric-blue shrink-0">1.</span>
                <span><strong>Transient isolation:</strong> Filters aggregate power variations to isolate appliance ON/OFF edge signatures.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-electric-blue shrink-0">2.</span>
                <span><strong>Clustering:</strong> Maps active profiles in the Real/Reactive power space.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
