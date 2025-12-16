import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from './components/Dashboard';
import CsvUploader from './components/CsvUploader';
import { LoginButton, LogoutButton } from './components/Login';
import { API_BASE } from './config';

function App() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    // Sync user to database on login
    useEffect(() => {
        if (isAuthenticated && user) {
            const syncUser = async () => {
                try {
                    await fetch(`${API_BASE}/users/sync`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            auth0_id: user.sub,
                            email: user.email,
                            name: user.name
                        })
                    });
                    console.log("User synced to database");
                } catch (error) {
                    console.error("Failed to sync user", error);
                }
            };
            syncUser();
        }
    }, [isAuthenticated, user]);

    const [sensorData, setSensorData] = useState({
        temperature: 65,
        vibration: 2.1,
        pressure: 105,
        rpm: 1450
    });

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>Loading...</div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        background: 'var(--accent-color)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 20px var(--accent-glow)'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l-2.83-2.83" />
                        </svg>
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>AI Maintenance Predictor</h1>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time Risk Monitoring System</p>
                    </div>
                </div>

                <div>
                    {isAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span>{user.name}</span>
                            <LogoutButton />
                        </div>
                    ) : (
                        <LoginButton />
                    )}
                </div>
            </header>

            <main>
                {isAuthenticated ? (
                    <>
                        <Dashboard data={sensorData} setData={setSensorData} />
                        <CsvUploader onDataLoaded={(newData) => setSensorData(prev => ({ ...prev, ...newData }))} />
                    </>
                ) : (
                    <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                        <h2>Welcome to AI Maintenance Predictor</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '1rem auto' }}>
                            Please log in to access the real-time monitoring dashboard and upload sensor data for analysis.
                        </p>
                        <div style={{ marginTop: '2rem' }}>
                            <LoginButton />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
