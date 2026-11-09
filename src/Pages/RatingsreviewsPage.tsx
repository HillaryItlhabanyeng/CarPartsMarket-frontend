import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FC } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/Navbar";
import "./RatingsreviewsPage.css";
import { getAllReviews, type ReviewDTO } from "../api/reviewService";

import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaRegStar,
} from "react-icons/fa";

type ReviewerRole = "buyer" | "seller";

type TabKey = "all" | "buyers" | "sellers";

type SortKey = "recent" | "oldest" | "highest" | "lowest";

interface Review {
  id: string;
  name: string;
  role: ReviewerRole;
  image: string;
  initials: string;
  avatarColor: string;
  date: string;
  rating: number;
  title: string;
  body: string;
  item?: string;
}

/* =========================================================
   REVIEW DATA (loaded from the backend)
========================================================= */

const AVATAR_COLORS = ["#f0b64c", "#6c8ec9", "#c97fb0", "#5aa9a3", "#e08a6b", "#8b7fd9"];

const timeAgo = (iso: string): string => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString();
};

const toReview = (r: ReviewDTO, index: number): Review => ({
  id: r.reviewId,
  name: r.reviewerName,
  role: r.reviewerRole === "seller" ? "seller" : "buyer",
  image: "",
  initials: r.reviewerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
  avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
  date: timeAgo(r.createdAt),
  rating: r.rating,
  title: r.title,
  body: r.comment,
});

const REVIEWS_PER_PAGE = 3;

/* =========================================================
   STAR COMPONENT
========================================================= */

interface StarRowProps {
  rating: number;
  size?: number;
}

const StarRow: FC<StarRowProps> = ({
  rating,
  size = 16,
}) => {
  return (
    <span
      className="star-row"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const isFilled = index < Math.floor(rating);

        return isFilled ? (
          <FaStar
            key={index}
            size={size}
            className="star star-filled"
          />
        ) : (
          <FaRegStar
            key={index}
            size={size}
            className="star star-empty"
          />
        );
      })}
    </span>
  );
};

/* =========================================================
   AVATAR COMPONENT
========================================================= */

interface AvatarImgProps {
  src: string;
  alt: string;
  initials: string;
  color: string;
  className: string;
  fallbackClassName: string;
}

const AvatarImg: FC<AvatarImgProps> = ({
  src,
  alt,
  initials,
  color,
  className,
  fallbackClassName,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={fallbackClassName}
        style={{ background: color }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

/* =========================================================
   MAIN PAGE
========================================================= */

const RatingsReviewsPage: FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState<TabKey>("all");

  const [sortOrder, setSortOrder] =
    useState<SortKey>("recent");

  const [page, setPage] = useState(1);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    getAllReviews()
      .then((res) => setReviews(res.data.map(toReview)))
      .catch(() => setLoadError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const totalCount = reviews.length;
  const buyerCount = reviews.filter((r) => r.role === "buyer").length;
  const sellerCount = totalCount - buyerCount;
  const overallRating = totalCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
    : 0;
  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    percent: totalCount
      ? Math.round((reviews.filter((r) => r.rating === stars).length / totalCount) * 100)
      : 0,
  }));

  /* =======================================================
     FILTER + SORT REVIEWS

     NOTE:
     There is NO search here because the review search
     input was removed from the page.
  ======================================================= */

  const filteredReviews = useMemo<Review[]>(() => {
    let list = [...reviews];

    /* Filter by buyer/seller */
    if (activeTab === "buyers") {
      list = list.filter(
        (review) => review.role === "buyer"
      );
    }

    if (activeTab === "sellers") {
      list = list.filter(
        (review) => review.role === "seller"
      );
    }

    /* Sort reviews */
    switch (sortOrder) {
      case "highest":
        list.sort(
          (a, b) => b.rating - a.rating
        );
        break;

      case "lowest":
        list.sort(
          (a, b) => a.rating - b.rating
        );
        break;

      case "oldest":
        list.reverse();
        break;

      case "recent":
      default:
        /* Keep original order */
        break;
    }

    return list;
  }, [reviews, activeTab, sortOrder]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredReviews.length /
        REVIEWS_PER_PAGE
    )
  );

  const pageReviews = filteredReviews.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE
  );

  /* =======================================================
     TAB CHANGE
  ======================================================= */

  const changeTab = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
  };

  /* =======================================================
     PAGINATION CONTROLS
  ======================================================= */

  const previousPage = () => {
    setPage((currentPage) =>
      Math.max(1, currentPage - 1)
    );
  };

  const nextPage = () => {
    setPage((currentPage) =>
      Math.min(
        totalPages,
        currentPage + 1
      )
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="ratings-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar
        userName="Sipho"
        showLinks={true}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="ratings-main">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="ratings-page-heading">

          <div>
            <h1>
              Ratings &amp; Reviews
            </h1>

            <p>
              See what other students and
              sellers are saying about their
              experience on UniTrade.
            </p>
          </div>

          <button
            type="button"
            className="write-review-btn"
            onClick={() =>
              navigate("/shop")
            }
          >
            <FaStar size={13} />

            Find a part to review
          </button>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="ratings-content">

          {/* =================================================
              LEFT - RATING SUMMARY
          ================================================= */}

          <aside className="rating-summary-card">

            <h2>
              Overall Rating
            </h2>

            <div className="rating-summary-score">
              {overallRating.toFixed(1)}
            </div>

            <StarRow
              rating={overallRating}
              size={22}
            />

            <p className="rating-summary-count">
              Based on{" "}
              {totalCount} reviews
            </p>

            <div className="rating-breakdown">

              {ratingBreakdown.map(
                (row) => (
                  <div
                    className="rating-breakdown-row"
                    key={row.stars}
                  >

                    <span className="rating-breakdown-label">
                      {row.stars} Stars
                    </span>

                    <div className="rating-breakdown-track">

                      <div
                        className="rating-breakdown-fill"
                        style={
                          {
                            "--fill-percent": `${row.percent}%`,
                          } as CSSProperties
                        }
                      />

                    </div>

                    <span className="rating-breakdown-percent">
                      {row.percent}%
                    </span>

                  </div>
                )
              )}

            </div>

          </aside>

          {/* =================================================
              RIGHT - REVIEWS
          ================================================= */}

          <section className="reviews-panel">

            {/* =================================================
                REVIEWS HEADER
            ================================================= */}

            <div className="reviews-panel-header">

              <div className="reviews-tabs">

                <button
                  type="button"
                  className={
                    activeTab === "all"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    changeTab("all")
                  }
                >
                  All Reviews(
                  {totalCount})
                </button>

                <button
                  type="button"
                  className={
                    activeTab === "buyers"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    changeTab("buyers")
                  }
                >
                  From Buyers(
                  {buyerCount})
                </button>

                <button
                  type="button"
                  className={
                    activeTab === "sellers"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    changeTab("sellers")
                  }
                >
                  From Sellers(
                  {sellerCount})
                </button>

              </div>

              {/* SORT */}

              <div className="reviews-sort">

                <select
                  value={sortOrder}
                  onChange={(event) => {
                    setSortOrder(
                      event.target
                        .value as SortKey
                    );

                    setPage(1);
                  }}
                  aria-label="Sort reviews"
                >

                  <option value="recent">
                    Most Recent
                  </option>

                  <option value="oldest">
                    Oldest
                  </option>

                  <option value="highest">
                    Highest Rated
                  </option>

                  <option value="lowest">
                    Lowest Rated
                  </option>

                </select>

                <FaChevronDown
                  size={11}
                  className="reviews-sort-icon"
                />

              </div>

            </div>

            {/* =================================================
                LOADING STATE
            ================================================= */}

            {isLoading ? (

              <div className="review-list">

                {[1, 2, 3].map(
                  (number) => (
                    <div
                      className="review-card review-skeleton"
                      key={number}
                      aria-hidden="true"
                    >

                      <div className="skeleton-circle" />

                      <div className="skeleton-lines">

                        <div className="skeleton-line skeleton-line-short" />

                        <div className="skeleton-line skeleton-line-medium" />

                        <div className="skeleton-line skeleton-line-long" />

                        <div className="skeleton-line skeleton-line-long" />

                      </div>

                    </div>
                  )
                )}

              </div>

            ) : (

              /* =================================================
                 REVIEW LIST
              ================================================= */

              <div className="review-list">

                {pageReviews.length === 0 && (
                  <p className="review-empty">
                    {loadError
                      ? "Could not load reviews. Is the backend running?"
                      : "No reviews yet. Open a part and be the first to review it."}
                  </p>
                )}

                {pageReviews.map(
                  (review) => (

                    <article
                      className="review-card"
                      key={review.id}
                    >

                      {/* AVATAR */}

                      <AvatarImg
                        src={review.image}
                        alt={`${review.name} profile`}
                        initials={
                          review.initials
                        }
                        color={
                          review.avatarColor
                        }
                        className="review-avatar-img"
                        fallbackClassName="review-avatar-fallback"
                      />

                      {/* REVIEW CONTENT */}

                      <div className="review-content">

                        {/* NAME + ROLE */}

                        <div className="review-meta">

                          <span className="review-name">
                            {review.name}
                          </span>

                          <span
                            className={`review-role review-role-${review.role}`}
                          >
                            {review.role ===
                            "buyer"
                              ? "Buyer"
                              : "Seller"}
                          </span>

                        </div>

                        {/* STARS + DATE */}

                        <div className="review-rating-row">

                          <StarRow
                            rating={
                              review.rating
                            }
                          />

                          <span className="review-date">
                            • {review.date}
                          </span>

                        </div>

                        {/* TITLE */}

                        <h3 className="review-title">
                          {review.title}
                        </h3>

                        {/* BODY */}

                        <p className="review-body">
                          {review.body}
                        </p>

                        {/* ITEM */}

                        {review.item && (
                          <p className="review-item">
                            <strong>
                              Item:
                            </strong>{" "}
                            {review.item}
                          </p>
                        )}

                      </div>

                    </article>

                  )
                )}

              </div>
            )}

            {/* =================================================
                PAGINATION
            ================================================= */}

            {!isLoading &&
              totalPages > 1 && (

                <div className="pagination">

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    onClick={previousPage}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    <FaChevronLeft
                      size={12}
                    />
                  </button>

                  {/* PAGE NUMBERS */}

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((number) => (

                    <button
                      type="button"
                      key={number}
                      className={
                        number === page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setPage(number)
                      }
                    >
                      {number}
                    </button>

                  ))}

                  {/* NEXT */}

                  <button
                    type="button"
                    onClick={nextPage}
                    disabled={
                      page === totalPages
                    }
                    aria-label="Next page"
                  >
                    <FaChevronRight
                      size={12}
                    />
                  </button>

                </div>
              )}

          </section>

        </div>

      </main>

    </div>
  );
};

export default RatingsReviewsPage;