import { useEffect, useState, useMemo } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function SubDashboard(){
    const [payments, setPayments] = useState([]);
    const [filter, setFilter] = useState('7');

    const getDayWisePayment=async()=>{
        try {
            const res = await api.get('/analytics/daily-revenue');
            if (res.data.success) {
                const formattedData = res.data.data.map(item => ({
                    date: `${item._id.day}/${item._id.month}`,
                    amount: item.totalRevenue
                })).reverse();
                setPayments(formattedData);
            }
        } catch (error) {
            console.error("Error fetching day-wise payment:", error);
        }
    }

    useEffect(()=>{
        getDayWisePayment()
    },[])

    const filteredPayments = useMemo(() => {
        return payments.slice(-parseInt(filter));
    }, [payments, filter]);

    return(
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', paddingRight: '20px' }}>
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#334155', outline: 'none', cursor: 'pointer' }}
                >
                    <option value="7">Last 7 Days</option>
                    <option value="15">Last 15 Days</option>
                    <option value="30">Last 1 Month</option>
                </select>
            </div>
            <ResponsiveContainer style={{marginTop:'20px'}} width="100%" height={400}>
                <BarChart data={filteredPayments}>
                    <CartesianGrid strokeDasharray="2 1"></CartesianGrid>
                    <XAxis dataKey='date'/>
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#6366f1" />
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}
