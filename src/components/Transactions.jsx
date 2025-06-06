import React, { useEffect, useState } from 'react';
import { getGOINContract } from '../utils/web3';

const Transactions = ({ account }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!account) return;
      
      setLoading(true);
      try {
        // In a real app, you would query blockchain or use The Graph
        // This is a mock implementation
        const mockTransactions = [
          {
            hash: '0x123...456',
            type: 'Deposit',
            amount: '100 GOIN',
            timestamp: '2023-05-15 14:30',
            status: 'Confirmed'
          },
          {
            hash: '0x789...012',
            type: 'Withdraw',
            amount: '50 GOIN',
            timestamp: '2023-05-14 09:15',
            status: 'Pending'
          }
        ];
        
        setTransactions(mockTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTransactions();
  }, [account]);

  return (
    <div className="transactions-container">
      <h2>Transaction History</h2>
      
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tx Hash</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td>{tx.hash}</td>
                <td>{tx.type}</td>
                <td>{tx.amount}</td>
                <td>{tx.timestamp}</td>
                <td className={`status-${tx.status.toLowerCase()}`}>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {transactions.length === 0 && !loading && (
        <p>No transactions found</p>
      )}
    </div>
  );
};

export default Transactions;
