import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { API_BASE } from '../config';

const CsvUploader = ({ onDataLoaded }) => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setStatus('idle');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('success');
                setFile(null);
                if (result.data && onDataLoaded) {
                    onDataLoaded(result.data);
                }
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
            <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={20} color="var(--accent-color)" />
                Upload Data (CSV)
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                <label
                    htmlFor="csv-upload"
                    style={{
                        cursor: 'pointer',
                        border: '2px dashed var(--text-secondary)',
                        padding: '2rem',
                        borderRadius: '8px',
                        width: '100%',
                        boxSizing: 'border-box',
                        textAlign: 'center',
                        color: 'var(--text-secondary)'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={32} />
                        <span>{file ? file.name : 'Click to select .csv file'}</span>
                    </div>
                    <input
                        id="csv-upload"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </label>

                {status === 'success' && (
                    <div style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Check size={16} /> Upload successful!
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={16} /> Upload failed.
                    </div>
                )}

                <button
                    className="btn"
                    onClick={handleUpload}
                    disabled={!file || status === 'uploading'}
                >
                    {status === 'uploading' ? 'Uploading...' : 'Upload Data'}
                </button>
            </div>
        </div>
    );
};

export default CsvUploader;
