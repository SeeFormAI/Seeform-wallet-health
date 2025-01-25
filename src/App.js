import React, { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

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
        balance: balance / 1e9, // Convert lamports to SOL
        transactionCount,
      });
    } catch (err) {
      setError("Failed to fetch wallet data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>Solana Wallet Health</h1>

      <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <input
          type="text"
          placeholder="Enter your wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button
          onClick={fetchWalletData}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Check Health"}
        </button>
      </div>

      {currentSlot !== null && (
        <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <p>Current Slot: {currentSlot}</p>
        </div>
      )}

      {networkHealth && (
        <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <p>Network Health: {networkHealth}</p>
        </div>
      )}

      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>
      )}

      {walletData && (
        <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Wallet Health Details</h2>
          <p>Balance: {walletData.balance.toFixed(2)} SOL</p>
          <p>Transaction Count: {walletData.transactionCount}</p>
          <p>
            Health Score: {walletData.balance > 10 ? "Healthy" : "Low"} ({walletData.balance.toFixed(2)} SOL)
          </p>
        </div>
      )}
    </div>
  );
};

export default SolanaWalletHealth;
