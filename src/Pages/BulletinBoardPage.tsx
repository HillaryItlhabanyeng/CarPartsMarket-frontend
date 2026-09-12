import { useState } from "react";
import Navbar from "../Components/Navbar";
import "./BulletinBoardPage.css";

type PostCategory = "Announcement" | "Lost & Found" | "Study Group" | "Event";

type Post = {
  id: string;
  author: string;
  avatar: string;
  category: PostCategory;
  title: string;
  body: string;
  timestamp: string;
  replies: number;
};

const posts: Post[] = [
  {
    id: "p1",
    author: "Campus Housing Office",
    avatar: "/Sipho.png",
    category: "Announcement",
    title: "Res applications for 2027 open next week",
    body: "Make sure your documents are ready — applications open Monday 25 August and close 15 September. Late submissions won't be considered.",
    timestamp: "2 hours ago",
    replies: 12,
  },
  {
    id: "p2",
    author: "Naledi M.",
    avatar: "/Sipho.png",
    category: "Lost & Found",
    title: "Found: black wired earphones near Bellville library",
    body: "Picked these up outside the library entrance yesterday afternoon. DM me with a description to claim them.",
    timestamp: "5 hours ago",
    replies: 3,
  },
  {
    id: "p3",
    author: "Thabo K.",
    avatar: "/Sipho.png",
    category: "Study Group",
    title: "Forming a Linear Algebra study group — Mowbray campus",
    body: "Meeting Tuesdays and Thursdays, library 2nd floor. All welcome, especially if you're also stuck on eigenvalues.",
    timestamp: "1 day ago",
    replies: 8,
  },
  {
    id: "p4",
    author: "UniTrade Events",
    avatar: "/Sipho.png",
    category: "Event",
    title: "Campus Market Day — this Friday, Distric 6",
    body: "Bring your unwanted textbooks and gadgets to trade in person. Free entry, snacks available.",
    timestamp: "1 day ago",
    replies: 21,
  },
  {
    id: "p5",
    author: "Amahle P.",
    avatar: "/Sipho.png",
    category: "Lost & Found",
    title: "Lost student card — name starts with 'S'",
    body: "Dropped somewhere between Wellington campus parking and the cafeteria. Please hand in at reception if found.",
    timestamp: "2 days ago",
    replies: 1,
  },
];

const categoryFilters: ("All" | PostCategory)[] = [
  "All",
  "Announcement",
  "Lost & Found",
  "Study Group",
  "Event",
];

export default function BulletinBoardPage() {
  const [activeFilter, setActiveFilter] = useState<"All" | PostCategory>("All");

  const visiblePosts =
    activeFilter === "All"
      ? posts
      : posts.filter((p) => p.category === activeFilter);

  return (
    <div className="bb-page">
      <Navbar />

      <div className="bb-page-header">
        <div>
          <h1>Bulletin Board</h1>
          <p>Announcements, lost & found, study groups and campus events</p>
        </div>
        <button className="bb-post-btn">Post Something</button>
      </div>

      <div className="bb-filter-bar">
        {categoryFilters.map((cat) => (
          <button
            key={cat}
            className={
              activeFilter === cat ? "bb-filter-chip bb-active" : "bb-filter-chip"
            }
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bb-list">
        {visiblePosts.map((post) => (
          <div className="bb-post-card" key={post.id}>
            <img src={post.avatar} alt={post.author} className="bb-post-avatar" />

            <div className="bb-post-content">
              <div className="bb-post-meta">
                <span className={`bb-tag bb-tag-${post.category.replace(/\s|&/g, "").toLowerCase()}`}>
                  {post.category}
                </span>
                <span className="bb-post-author">{post.author}</span>
                <span className="bb-post-dot">•</span>
                <span className="bb-post-time">{post.timestamp}</span>
              </div>

              <h4 className="bb-post-title">{post.title}</h4>
              <p className="bb-post-body">{post.body}</p>

              <button className="bb-post-replies">
                💬 {post.replies} {post.replies === 1 ? "reply" : "replies"}
              </button>
            </div>
          </div>
        ))}

        {visiblePosts.length === 0 && (
          <div className="bb-empty">
            <p>No posts in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}