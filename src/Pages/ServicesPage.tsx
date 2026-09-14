import { useState } from "react";
import { FaBookOpen, FaComments, FaExchangeAlt, FaSearch, FaTools } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import "./ServicesPage.css";

type ServiceCategory = "Marketplace" | "Community" | "Support";

type Service = {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  availability: string;
  icon: typeof FaTools;
};

const services: Service[] = [
  {
    id: "safe-trading",
    name: "Safe trading on campus",
    description: "Find, compare and exchange pre-owned items with students across UniTrade campuses.",
    category: "Marketplace",
    availability: "Available now",
    icon: FaExchangeAlt,
  },
  {
    id: "study-resources",
    name: "Study resource exchange",
    description: "Give your textbooks, calculators and course supplies a useful second life.",
    category: "Marketplace",
    availability: "Available now",
    icon: FaBookOpen,
  },
  {
    id: "campus-community",
    name: "Campus community board",
    description: "Connect with fellow students through announcements, events, lost and found posts and study groups.",
    category: "Community",
    availability: "Available now",
    icon: FaComments,
  },
  {
    id: "listing-support",
    name: "Listing support",
    description: "Get help creating a clear listing, choosing a category and arranging a convenient campus handover.",
    category: "Support",
    availability: "Mon-Fri, 08:00-17:00",
    icon: FaTools,
  },
];

const categories: Array<"All" | ServiceCategory> = ["All", "Marketplace", "Community", "Support"];

export default function ServicesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | ServiceCategory>("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const visibleServices = services.filter((service) => {
    const matchesCategory = category === "All" || service.category === category;
    const searchText = `${service.name} ${service.description} ${service.category}`.toLowerCase();
    return matchesCategory && searchText.includes(query.toLowerCase());
  });

  return (
    <div className="services-page">
      <Navbar />
      <header className="services-header">
        <div>
          <p className="services-eyebrow">UniTrade community</p>
          <h1>Services</h1>
          <p>Helpful tools and support for buying, selling and connecting on campus.</p>
        </div>
      </header>

      <section className="services-controls" aria-label="Service filters">
        <label className="services-search">
          <FaSearch aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services"
            aria-label="Search services"
          />
        </label>
        <div className="services-filter-list" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={`services-filter ${category === item ? "services-filter-active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <main className="services-content">
        <div className="services-results-heading">
          <h2>What we can help with</h2>
          <span>{visibleServices.length} service{visibleServices.length === 1 ? "" : "s"}</span>
        </div>
        {visibleServices.length > 0 ? (
          <div className="services-grid">
            {visibleServices.map((service) => {
              const Icon = service.icon;
              return (
                <article className="service-card" key={service.id}>
                  <div className="service-icon"><Icon aria-hidden="true" /></div>
                  <div className="service-card-topline">
                    <span className="service-category">{service.category}</span>
                    <span className="service-availability">{service.availability}</span>
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <button type="button" className="service-details-button" onClick={() => setSelectedService(service)}>
                    View Details
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="services-empty">
            <FaSearch aria-hidden="true" />
            <h2>No services found</h2>
            <p>Try a different search term or category.</p>
          </div>
        )}
      </main>

      {selectedService && (
        <div className="service-modal-backdrop" role="presentation" onClick={() => setSelectedService(null)}>
          <section className="service-modal" role="dialog" aria-modal="true" aria-labelledby="service-modal-title" onClick={(event) => event.stopPropagation()}>
            <span className="service-category">{selectedService.category}</span>
            <h2 id="service-modal-title">{selectedService.name}</h2>
            <p>{selectedService.description}</p>
            <p className="service-modal-availability"><strong>Availability:</strong> {selectedService.availability}</p>
            <button type="button" className="service-details-button" onClick={() => setSelectedService(null)}>Close</button>
          </section>
        </div>
      )}
    </div>
  );
}