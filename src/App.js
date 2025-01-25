import React, { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import "./App.css"; 

const SolanaWalletHealth = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSlot, setCurrentSlot] = useState(null);
  const [networkHealth, setNetworkHealth] = useState(null);

  useEffect(() => {
    const fetchCurrentSlot = async () => {
      try {
        const solana = new Connection(
          "https://long-capable-season.solana-mainnet.quiknode.pro/ec90b275b32c8703f7115813d7dbd380c6732b53/"
        );
        const slot = await solana.getSlot();
        setCurrentSlot(slot);
      } catch (err) {
        console.error("Failed to fetch current slot:", err);
      }
    };

    fetchCurrentSlot();
  }, []);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch(
          "https://long-capable-season.solana-mainnet.quiknode.pro/ec90b275b32c8703f7115813d7dbd380c6732b53/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: "1",
              method: "getHealth",
            }),
          }
        );

        const data = await response.json();
        setNetworkHealth(data.result);
      } catch (err) {
        console.error("Failed to fetch network health:", err);
      }
    };

    fetchHealthData();
  }, []);

  const isValidSolanaAddress = (address) => {
    try {
      new PublicKey(address);
      return true;
    } catch (err) {
      return false;
    }
  };

  const fetchWalletData = async () => {
    if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
      setError("Please enter a valid Solana wallet address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const connection = new Connection(
        "https://long-capable-season.solana-mainnet.quiknode.pro/ec90b275b32c8703f7115813d7dbd380c6732b53/"
      );
      const publicKey = new PublicKey(walletAddress);

      const balance = await connection.getBalance(publicKey);
      const transactionCount = await connection.getTransactionCount(publicKey);

      setWalletData({
        balance: balance / 1e9, 
        transactionCount,
      });
    } catch (err) {
      setError("Failed to fetch wallet data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Solana Wallet Health</h1>

      <div className="card">
        <input
          type="text"
          placeholder="Enter your wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="input"
        />
        <button
          onClick={fetchWalletData}
          disabled={loading}
          className={`button ${loading ? "button-disabled" : ""}`}
        >
          {loading ? <span className="loader"></span> : "Check Health"}
        </button>
      </div>

      {currentSlot !== null && (
        <div className="card">
          <p>Current Slot: <span className="highlight">{currentSlot}</span></p>
        </div>
      )}

      {networkHealth && (
        <div className="card">
          <p>Network Health: <span className="highlight">{networkHealth}</span></p>
        </div>
      )}

      {error && (
        <div className="error">{error}</div>
      )}

      {walletData && (
        <div className="card">
          <h2 className="subtitle">Wallet Health Details</h2>
          <p>Balance: <span className="highlight">{walletData.balance.toFixed(2)} SOL</span></p>
          <p>Transaction Count: <span className="highlight">{walletData.transactionCount}</span></p>
          <p>
            Health Score: <span className="highlight">{walletData.balance > 10 ? "Healthy" : "Low"}</span> ({walletData.balance.toFixed(2)} SOL)
          </p>
        </div>
      )}
    </div>
  );
};

export default SolanaWalletHealth;
