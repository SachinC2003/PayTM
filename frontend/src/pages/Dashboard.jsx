import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"

export const Dashboard = () => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setBalance(response.data.balance);
        } catch (error) {
            console.error("Error fetching balance:", error);
            // Handle error (e.g., show an error message to the user)
        }
    };

    return (
        <div>
            <Appbar />
            <div className="m-8">
                {balance !== null ? (
                    <Balance value={balance} />
                ) : (
                    <div>Loading balance...</div>
                )}
                <Users />
            </div>
        </div>
    );
}