import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(1);
  const [feedbacks, setFeedbacks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/feedback");
      setFeedbacks(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // FRONTEND VALIDATION
  if (!name.trim() || !message.trim()) {
    setError("Name and Feedback cannot be empty");
    return;
  }

  try {
    setLoading(true);

    if (editId) {
      await axios.put(`http://localhost:5000/api/feedback/${editId}`, {
        name,
        message,
        rating,
      });
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/api/feedback", {
        name,
        message,
        rating,
      });
    }

    setName("");
    setMessage("");
    setRating(1);
    setError(null);
    fetchFeedbacks();
  } catch (err) {
    setError(err.response?.data?.message || "Operation failed");
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/feedback/${id}`);
      fetchFeedbacks();
    } catch (err) {
      setError("Failed to delete feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Feedback System</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Your Feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <button type="submit" className="submit">
          {editId ? "Update Feedback" : "Submit"}
        </button>
      </form>

      <h2>All Feedback</h2>

      {feedbacks.map((fb) => (
        <div key={fb._id} className="card">
          <strong>{fb.name}</strong>
          <p>{fb.message}</p>
          <p>Rating: ⭐ {fb.rating}</p>
          <button
            className="delete"
            onClick={() => handleDelete(fb._id)}
          >
            Delete
          </button>
          <button className="edit" onClick={ () =>{
            setEditId(fb._id);
            setName(fb.name);
            setMessage(fb.message);
            setRating(fb.rating);
          }

          }
          >Edit </button>         
        </div>
      ))}
    </div>
  );
}

export default App;