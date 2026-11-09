import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "./useAuth";
import { createReview, getPartReviews, type ReviewDTO } from "../api/reviewService";

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span aria-label={`${value} out of 5 stars`} style={{ color: "#f5a623" }}>
      {[1, 2, 3, 4, 5].map((n) => (n <= Math.round(value) ? <FaStar key={n} size={size} /> : <FaRegStar key={n} size={size} />))}
    </span>
  );
}

export default function PartReviews({ carPartId }: { carPartId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    getPartReviews(carPartId)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [carPartId]);

  useEffect(load, [load]);

  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const alreadyReviewed = !!user && reviews.some((r) => r.reviewerEmail === user.email);
  const canReview = !!user && user.role !== "admin" && !alreadyReviewed;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (rating < 1 || !comment.trim()) {
      setError("Pick a star rating and write a comment.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createReview({
        carPartId,
        reviewerName: `${user.firstName} ${user.lastName?.charAt(0) ?? ""}.`.trim(),
        rating,
        title,
        comment,
      });
      setRating(0);
      setTitle("");
      setComment("");
      load();
    } catch (err) {
      setError(axios.isAxiosError(err) && typeof err.response?.data === "string" ? err.response.data : "Could not save your review. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="reviewsSection">
      <div className="reviewsHeader">
        <h3>
          Reviews {reviews.length > 0 && <>({reviews.length}) <Stars value={average} /> {average.toFixed(1)}</>}
        </h3>
      </div>

      {loading ? (
        <p className="reviewComment">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="reviewComment">No reviews yet for this part.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.reviewId} style={{ borderBottom: "1px solid #e3e8ee", padding: "14px 0" }}>
            <strong>{r.reviewerName}</strong>{" "}
            <span style={{ color: "#6b7a8a", fontSize: 13 }}>
              ({r.reviewerRole}) · {new Date(r.createdAt).toLocaleDateString()}
            </span>
            <div><Stars value={r.rating} /></div>
            {r.title && <div style={{ fontWeight: 600, marginTop: 4 }}>{r.title}</div>}
            <p className="reviewComment" style={{ margin: "4px 0 0" }}>{r.comment}</p>
          </div>
        ))
      )}

      <div style={{ marginTop: 20 }}>
        {!user && (
          <p className="reviewComment">
            <Link to="/login">Log in</Link> to write a review.
          </p>
        )}
        {alreadyReviewed && <p className="reviewComment">Thanks, you've already reviewed this part.</p>}
        {canReview && (
          <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
            <strong>Write a review</strong>
            <div role="radiogroup" aria-label="Your rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#f5a623", padding: 2 }}
                >
                  {n <= rating ? <FaStar size={24} /> : <FaRegStar size={24} />}
                </button>
              ))}
            </div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" maxLength={100}
              style={{ padding: 10, border: "1px solid #cbd5e0", borderRadius: 8 }} />
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell others about this part" rows={4} maxLength={2000}
              style={{ padding: 10, border: "1px solid #cbd5e0", borderRadius: 8 }} />
            {error && <span style={{ color: "#c0392b" }}>{error}</span>}
            <button type="submit" className="addToCartBtn" disabled={saving}>
              {saving ? "Posting..." : "Post review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
