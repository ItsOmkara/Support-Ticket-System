import React, { useState, useEffect } from 'react';
import { ticketService } from '../services/api';
import { Search, Filter, Clock, ChevronRight } from 'lucide-react';

const TicketList = ({ refreshKey, onStatusUpdate }) => {
    const [tickets, setTickets] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        priority: '',
        status: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, [filters, refreshKey]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await ticketService.getTickets(filters);
            setTickets(response.data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            await ticketService.updateTicket(ticketId, { status: newStatus });
            fetchTickets();
            onStatusUpdate();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} size={18} />
                        <input
                            style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
                            placeholder="Search tickets..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-3" style={{ gap: '0.5rem' }}>
                        <select
                            style={{ marginBottom: 0 }}
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="">All Categories</option>
                            <option value="billing">Billing</option>
                            <option value="technical">Technical</option>
                            <option value="account">Account</option>
                            <option value="general">General</option>
                        </select>
                        <select
                            style={{ marginBottom: 0 }}
                            value={filters.priority}
                            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                        >
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                        <select
                            style={{ marginBottom: 0 }}
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading tickets...</div>
            ) : (
                <div className="grid">
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{ticket.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        {ticket.description.length > 100 ? ticket.description.substring(0, 100) + '...' : ticket.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <span className={`badge badge-${ticket.priority}`}>{ticket.priority}</span>
                                        <span className="badge" style={{ background: 'var(--border)', color: 'var(--text-main)' }}>{ticket.category}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                            <Clock size={12} style={{ marginRight: '0.25rem' }} />
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ minWidth: '120px', textAlign: 'right' }}>
                                    <select
                                        className={`badge badge-${ticket.status}`}
                                        value={ticket.status}
                                        style={{ width: 'auto', marginBottom: 0, padding: '0.25rem 0.5rem' }}
                                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tickets.length === 0 && (
                        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            No tickets found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TicketList;
