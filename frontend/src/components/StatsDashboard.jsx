import React, { useState, useEffect } from 'react';
import { ticketService } from '../services/api';
import { BarChart3, PieChart, Activity } from 'lucide-react';

const StatsDashboard = ({ refreshKey }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, [refreshKey]);

    const fetchStats = async () => {
        try {
            const response = await ticketService.getStats();
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    if (!stats) return null;

    return (
        <div className="grid grid-cols-3 animate-fade-in" style={{ marginBottom: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', borderColor: 'var(--info)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Tickets</p>
                <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.total_tickets}</h1>
                <Activity size={24} style={{ color: 'var(--info)', margin: '0 auto' }} />
            </div>

            <div className="card" style={{ borderColor: 'var(--warning)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>By Status</p>
                <div style={{ marginTop: '1rem' }}>
                    {stats.status_stats.map(s => (
                        <div key={s.status} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ textTransform: 'capitalize' }}>{s.status.replace('_', ' ')}</span>
                            <span style={{ fontWeight: 700 }}>{s.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card" style={{ borderColor: 'var(--primary)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>By Category</p>
                <div style={{ marginTop: '1rem' }}>
                    {stats.category_stats.map(c => (
                        <div key={c.category} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ textTransform: 'capitalize' }}>{c.category}</span>
                            <span style={{ fontWeight: 700 }}>{c.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
