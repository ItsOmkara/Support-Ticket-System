import React, { useState } from 'react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import StatsDashboard from './components/StatsDashboard';
import { Ticket } from 'lucide-react';

function App() {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Ticket size={40} style={{ color: 'var(--primary)' }} />
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Support <span style={{ color: 'var(--primary)' }}>Ticket System</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Centralized support management with AI classification</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <aside>
                    <TicketForm onTicketCreated={triggerRefresh} />
                </aside>

                <main>
                    <StatsDashboard refreshKey={refreshKey} />
                    <TicketList refreshKey={refreshKey} onStatusUpdate={triggerRefresh} />
                </main>
            </div>

            <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', borderTop: '1px solid var(--border)' }}>
                &copy; 2026 Support Ticket System - AI Powered
            </footer>
        </div>
    );
}

export default App;
