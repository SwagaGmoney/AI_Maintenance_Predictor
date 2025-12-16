import React, { useState } from 'react';
import { Activity, Thermometer, Gauge, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = ({ data, setData }) => {
    // Removed local state: const [data, setData] = useState(...)

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        setLoading(true);
        const payload = {
            temperature: parseFloat(data.temperature),
            vibration: parseFloat(data.vibration),
            pressure: parseFloat(data.pressure),
            rpm: parseFloat(data.rpm)
        };

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            setPrediction(result);
        } catch (error) {
            console.error("Prediction failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="grid-layout">
            {/* Input Panel */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={20} color="var(--accent-color)" />
                    Sensor Input
                </h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Temperature (°C)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Thermometer size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#64748b' }} />
                            <input
                                name="temperature"
                                type="number"
                                value={data.temperature}
                                onChange={handleChange}
                                style={{ paddingLeft: '35px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Vibration (mm/s)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Activity size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#64748b' }} />
                            <input
                                name="vibration"
                                type="number"
                                value={data.vibration}
                                onChange={handleChange}
                                style={{ paddingLeft: '35px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Pressure (psi)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Gauge size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#64748b' }} />
                            <input
                                name="pressure"
                                type="number"
                                value={data.pressure}
                                onChange={handleChange}
                                style={{ paddingLeft: '35px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            RPM
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Zap size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#64748b' }} />
                            <input
                                name="rpm"
                                type="number"
                                value={data.rpm}
                                onChange={handleChange}
                                style={{ paddingLeft: '35px' }}
                            />
                        </div>
                    </div>

                    <button className="btn" onClick={handlePredict} disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Analyzing...' : 'Analyze Risk'}
                    </button>
                </div>
            </div>

            {/* Results Panel */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {!prediction ? (
                    <div style={{ opacity: 0.5 }}>
                        <Activity size={48} />
                        <p>Run analysis to see prediction</p>
                    </div>
                ) : (
                    <div style={{ width: '100%' }}>
                        <h2 style={{ marginTop: 0 }}>System Health</h2>

                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            color: prediction.risk_level === 'Critical' ? 'var(--danger-color)' :
                                prediction.risk_level === 'Warning' ? 'var(--warning-color)' : 'var(--success-color)',
                            marginBottom: '1rem',
                            textShadow: '0 0 30px currentColor'
                        }}>
                            {prediction.risk_level}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Failure Probability</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{(prediction.failure_probability * 100).toFixed(1)}%</div>
                            </div>
                        </div>

                        {prediction.risk_level === 'Critical' && (
                            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--danger-color)' }}>
                                <AlertTriangle />
                                <span>Immediate maintenance required!</span>
                            </div>
                        )}

                        {prediction.risk_level === 'Low' && (
                            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--success-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--success-color)' }}>
                                <CheckCircle />
                                <span>System operating normally.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
