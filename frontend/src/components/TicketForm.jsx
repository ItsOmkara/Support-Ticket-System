import React, { useState, useEffect } from 'react';
import { ticketService } from '../services/api';
import { Sparkles, Loader2 } from 'lucide-react';

const TicketForm = ({ onTicketCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
    });
    const [loading, setLoading] = useState(false);
    const [classifying, setClassifying] = useState(false);

    // Auto-classify when description length is significant
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.description.length > 20) {
                handleAutoClassify();
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData.description]);

    const handleAutoClassify = async () => {
        setClassifying(true);
        try {
            const response = await ticketService.classifyTicket(formData.description);
            setFormData(prev => ({
                ...prev,
                category: response.data.suggested_category,
                priority: response.data.suggested_priority,
            }));
        } catch (error) {
            console.error("Classification failed", error);
        } finally {
            setClassifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ticketService.createTicket(formData);
            setFormData({ title: '', description: '', category: 'general', priority: 'medium' });
            onTicketCreated();
        } catch (error) {
            alert("Failed to create ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Ticket</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        required
                        placeholder="Summarize the issue"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Description
                        {classifying && <span style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                            <Loader2 className="loader" style={{ marginRight: '0.5rem', width: '12px', height: '12px' }} /> AI Classifying...
                        </span>}
                    </label>
                    <textarea
                        required
                        rows="4"
                        placeholder="Provide details about the problem..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2">
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="billing">Billing</option>
                            <option value="technical">Technical</option>
                            <option value="account">Account</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                    {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
            </form>
        </div>
    );
};

export default TicketForm;
