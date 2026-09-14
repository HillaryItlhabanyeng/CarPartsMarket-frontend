import { useMemo, useState } from "react";
import { FaBullhorn, FaSearch } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import "./AnnouncementsPage.css";

type AnnouncementCategory = "Campus" | "Marketplace" | "Community" | "Event";
type Priority = "Important" | "Update" | "Event";
type SortOrder = "newest" | "oldest";

type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
  category: AnnouncementCategory;
  priority: Priority;
};

const announcements: Announcement[] = [
  { id: "a1", title: "Campus Market Day returns this Friday", content: "Bring textbooks, gadgets and furniture you no longer need to the in-person campus exchange.", date: "2026-09-04", category: "Event", priority: "Event" },
  { id: "a2", title: "Keep every handover safe", content: "Meet in a busy public place on campus, check your item before paying and keep conversations on UniTrade.", date: "2026-09-01", category: "Marketplace", priority: "Important" },
  { id: "a3", title: "New community services are available", content: "Explore study resource exchange, listing support and other ways UniTrade helps students connect.", date: "2026-08-28", category: "Community", priority: "Update" },
  { id: "a4", title: "Bellville campus pickup point updated", content: "The recommended meeting point is now the library entrance during normal campus hours.", date: "2026-08-22", category: "Campus", priority: "Update" },
  { id: "a5", title: "Student seller spotlight applications open", content: "Share your best listing and help other students discover useful, affordable campus finds.", date: "2026-08-15", category: "Marketplace", priority: "Event" },
];

const categories: Array<"All" | AnnouncementCategory> = ["All", "Campus", "Marketplace", "Community", "Event"];

const formatDate = (date: string) => new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));

export default function AnnouncementsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | AnnouncementCategory>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const visibleAnnouncements = useMemo(() => announcements
    .filter((announcement) => {
      const matchesCategory = category === "All" || announcement.category === category;
      const searchText = `${announcement.title} ${announcement.content} ${announcement.category} ${announcement.priority}`.toLowerCase();
      return matchesCategory && searchText.includes(query.toLowerCase());
    })
    .sort((first, second) => sortOrder === "newest" ? second.date.localeCompare(first.date) : first.date.localeCompare(second.date)), [category, query, sortOrder]);

  return (
    <div className="announcements-page">
      <Navbar />
      <header className="announcements-header">
        <p className="services-eyebrow">Stay in the loop</p>
        <h1>Announcements</h1>
        <p>Important updates, community news and opportunities for UniTrade students.</p>
      </header>
      <section className="announcements-controls" aria-label="Announcement filters">
        <label className="announcements-search">
          <FaSearch aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search announcements" aria-label="Search announcements" />
        </label>
        <div className="announcements-filter-list" aria-label="Filter by category">
          {categories.map((item) => (
            <button type="button" key={item} className={`announcements-filter ${category === item ? "announcements-filter-active" : ""}`} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <select className="announcements-sort" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} aria-label="Sort announcements">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </section>
      <main className="announcements-content">
        <div className="announcements-results-heading"><h2>Latest from UniTrade</h2><span>{visibleAnnouncements.length} announcement{visibleAnnouncements.length === 1 ? "" : "s"}</span></div>
        {visibleAnnouncements.length > 0 ? (
          <div className="announcements-list">
            {visibleAnnouncements.map((announcement) => (
              <article className="announcement-card" key={announcement.id}>
                <div className="announcement-card-topline"><span className="announcement-category">{announcement.category}</span><span className={`announcement-priority announcement-priority-${announcement.priority.toLowerCase()}`}>{announcement.priority}</span></div>
                <h3>{announcement.title}</h3>
                <p>{announcement.content}</p>
                <div className="announcement-card-footer"><time dateTime={announcement.date}>{formatDate(announcement.date)}</time><button type="button" onClick={() => setSelectedAnnouncement(announcement)}>Read More</button></div>
              </article>
            ))}
          </div>
        ) : (
          <div className="announcements-empty"><FaBullhorn aria-hidden="true" /><h2>No announcements found</h2><p>Try a different search term or category.</p></div>
        )}
      </main>
      {selectedAnnouncement && (
        <div className="service-modal-backdrop" role="presentation" onClick={() => setSelectedAnnouncement(null)}>
          <section className="service-modal" role="dialog" aria-modal="true" aria-labelledby="announcement-modal-title" onClick={(event) => event.stopPropagation()}>
            <span className="announcement-category">{selectedAnnouncement.category} · {formatDate(selectedAnnouncement.date)}</span>
            <h2 id="announcement-modal-title">{selectedAnnouncement.title}</h2>
            <p>{selectedAnnouncement.content}</p>
            <button type="button" className="service-details-button" onClick={() => setSelectedAnnouncement(null)}>Close</button>
          </section>
        </div>
      )}
    </div>
  );
}