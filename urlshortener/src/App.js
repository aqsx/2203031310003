import React, { useState } from "react";

// Mock function to generate short URLs
const mockShortenUrl = async (url, validityMins) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a random short code
  const code = Math.random().toString(36).substring(2, 8);
  const now = Date.now();
  const validity = validityMins || 30; // default 30 minutes
  const expiresAt = now + (validity * 60 * 1000);
  
  return {
    shortUrl: `https://short.url/${code}`,
    expiresAt,
    validityMins: validity
  };
};

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShortUrl("");
    setExpiresAt(null);
    setError("");

    try {
      const validityMins = validity ? parseInt(validity, 10) : undefined;
      const result = await mockShortenUrl(longUrl, validityMins);
      setShortUrl(result.shortUrl);
      setExpiresAt(result.expiresAt);
    } catch (err) {
      setError("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>URL Shortener</h2>
      <form onSubmit={handleShorten}>
        <input
          type="url"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
          style={{ 
            width: "100%", 
            padding: "12px", 
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}
        />
        <input
          type="number"
          min="1"
          placeholder="Validity (minutes, default 30)"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "12px", 
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "12px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>
      
      {error && (
        <div style={{ 
          marginTop: "20px", 
          color: "red", 
          padding: "10px", 
          backgroundColor: "#ffe6e6",
          borderRadius: "4px"
        }}>
          {error}
        </div>
      )}
      
      {shortUrl && (
        <div style={{ 
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
          border: "1px solid #ddd"
        }}>
          <strong>Short URL:</strong>
          <div style={{ marginTop: "10px", wordBreak: "break-all" }}>
            <a 
              href={shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              {shortUrl}
            </a>
          </div>
          {expiresAt && (
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
              <em>Expires at: {new Date(expiresAt).toLocaleString()}</em>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
