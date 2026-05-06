import { useState, useEffect } from 'react';
import { getReservations, getMessages } from '../services/db';
import { Lock, LogOut, Calendar, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('reservations');

  useEffect(() => {
    // Check session storage on load
    if (sessionStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'cafeadmin2025') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setError('');
      fetchData();
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setPassword('');
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resData, msgData] = await Promise.all([
        getReservations(),
        getMessages()
      ]);
      setReservations(resData);
      setMessages(msgData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to be readable
  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    if (dateValue.toDate) {
      // Firebase timestamp
      return dateValue.toDate().toLocaleString();
    }
    // String date
    return new Date(dateValue).toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 bg-background min-h-screen flex items-center justify-center">
        <div className="bg-muted p-8 rounded-2xl border border-border shadow-md w-full max-w-md">
          <div className="flex justify-center mb-6 text-cafe-600">
            <Lock className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-center text-foreground mb-6">Admin Login</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-cafe-500 outline-none ${error ? 'border-red-500' : 'border-border'}`}
                placeholder="Enter admin password"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 bg-cafe-800 hover:bg-cafe-900 text-white dark:bg-cafe-200 dark:hover:bg-cafe-300 dark:text-cafe-900 rounded-lg font-bold transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-cafe-800 text-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-cafe-300 text-sm font-medium mb-1">Total Reservations</p>
                <h3 className="text-3xl font-bold">{reservations.length}</h3>
              </div>
              <Calendar className="w-8 h-8 text-cafe-400" />
            </div>
          </div>
          
          <div className="bg-cafe-200 dark:bg-cafe-900 text-cafe-900 dark:text-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-cafe-600 dark:text-cafe-300 text-sm font-medium mb-1">Messages</p>
                <h3 className="text-3xl font-bold">{messages.length}</h3>
              </div>
              <MessageSquare className="w-8 h-8 text-cafe-500" />
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-2xl border border-border overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button 
              onClick={() => setActiveTab('reservations')}
              className={`flex-1 py-4 font-medium flex items-center justify-center transition-colors ${activeTab === 'reservations' ? 'bg-background text-cafe-600 dark:text-cafe-400 border-b-2 border-cafe-600 dark:border-cafe-400' : 'text-muted-foreground hover:bg-background/50'}`}
            >
              <Calendar className="w-5 h-5 mr-2" /> Reservations
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-4 font-medium flex items-center justify-center transition-colors ${activeTab === 'messages' ? 'bg-background text-cafe-600 dark:text-cafe-400 border-b-2 border-cafe-600 dark:border-cafe-400' : 'text-muted-foreground hover:bg-background/50'}`}
            >
              <MessageSquare className="w-5 h-5 mr-2" /> Messages
            </button>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cafe-600"></div>
              </div>
            ) : (
              <>
                {/* Reservations List */}
                {activeTab === 'reservations' && (
                  <div className="overflow-x-auto">
                    {reservations.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">No reservations found.</p>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground text-sm">
                            <th className="pb-3 pr-4 font-medium">Name</th>
                            <th className="pb-3 pr-4 font-medium">Contact</th>
                            <th className="pb-3 pr-4 font-medium">Date & Time</th>
                            <th className="pb-3 pr-4 font-medium">Party Size</th>
                            <th className="pb-3 font-medium">Requests</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {reservations.map((res) => (
                            <tr key={res.id} className="border-b border-border/50 hover:bg-background/50">
                              <td className="py-4 pr-4 font-medium text-foreground">{res.name}</td>
                              <td className="py-4 pr-4">
                                <div className="text-foreground">{res.phone}</div>
                                <div className="text-muted-foreground text-xs">{res.email}</div>
                              </td>
                              <td className="py-4 pr-4">
                                <div className="flex items-center text-foreground">
                                  <Calendar className="w-3 h-3 mr-1 text-muted-foreground" /> {res.date}
                                </div>
                                <div className="flex items-center text-muted-foreground text-xs mt-1">
                                  <Clock className="w-3 h-3 mr-1" /> {res.time}
                                </div>
                              </td>
                              <td className="py-4 pr-4 text-foreground">{res.partySize}</td>
                              <td className="py-4 text-muted-foreground max-w-xs truncate">{res.requests || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Messages List */}
                {activeTab === 'messages' && (
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">No messages found.</p>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className="bg-background p-5 rounded-xl border border-border shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-foreground">{msg.name}</h4>
                              <p className="text-sm text-muted-foreground">{msg.email}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{formatDate(msg.createdAt)}</span>
                          </div>
                          <p className="text-foreground text-sm bg-muted/50 p-3 rounded-lg border border-border/50">{msg.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
