import React, { useEffect, useState, useMemo } from "react";
import MainLayout from "@/components/layouts/mainBodyLayout";
import { sdk } from "@/utils/graphqlClient";
import {
  Search,
  Star,
  MapPin,
  Users,
  Flame,
  Filter as FilterIcon,
} from "lucide-react";
import CButton from "@/components/common/buttons/button";
import { ButtonType } from "@/components/common/buttons/interface";
import { RowsPerPageEnum } from "@/generated/graphql";
import { getPageSizeNumber } from "@/utils/functions/common";

type Artist = {
  _id: string;
  profilePicture: string | null;
  firstName: string;
  lastName: string;
  stageName: string;
  genres: string[];
  city?: string;
  experience?: number;
  artistType?: string;
  hoizrBookingUrl?: string;
  rating?: number;
  socialLinks?: {
    instagram?: string;
    soundcloud?: string;
    spotify?: string;
  };
};

const ARTIST_TABS = [
  { label: "All Artists", value: "all", icon: <Users className="h-5 w-5" /> },
  { label: "Trending", value: "trending", icon: <Flame className="h-5 w-5" /> },
  { label: "Nearby", value: "nearby", icon: <MapPin className="h-5 w-5" /> },
];

// Utilities for mapping API response to our Artist type
function mapApiToArtist(a: any): Artist {
  return {
    _id: a._id,
    profilePicture: a.profilePicture || null,
    firstName: a.firstName || "",
    lastName: a.lastName || "",
    stageName: a.stageName || "",
    genres: a.genres || [],
    city: a.address?.city || "",
    experience: a.experience || undefined,
    artistType: a.artistType || undefined,
    hoizrBookingUrl: a.hoizrBookingUrl || undefined,
    // Take rating from testimonials array if available, else undefined
    rating:
      a.testimonials && Array.isArray(a.testimonials) && a.testimonials.length
        ? Number(
            (
              a.testimonials.reduce(
                (sum: number, t: any) => sum + (t.rating || 0),
                0
              ) / a.testimonials.length
            ).toFixed(1)
          )
        : undefined,
    socialLinks: {
      instagram: a.socialLinks?.instagram,
      soundcloud: a.socialLinks?.soundcloud,
      spotify: a.socialLinks?.spotify,
    },
  };
}

function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <div
      className="bg-card border border-card rounded-2xl p-5 group shadow transition hover:border-primary/60 hover:shadow-xl flex flex-col"
      tabIndex={0}
      onClick={() => window.open(`/artist/${artist._id}`, "_blank")}
      style={{ cursor: "pointer" }}
    >
      <div className="flex gap-4 items-center">
        <div className="w-16 h-16 rounded-full bg-secondaryBg border-2 border-primary flex items-center justify-center shadow-inner overflow-hidden">
          {artist.profilePicture ? (
            <img
              src={artist.profilePicture}
              className="object-cover w-full h-full"
              alt={artist.stageName || artist.firstName}
            />
          ) : (
            <span className="text-primary font-semibold text-xl">
              {artist.stageName
                ? artist.stageName[0]
                : artist.firstName
                ? artist.firstName[0]
                : "A"}
            </span>
          )}
        </div>
        <div>
          <div className="text-lg font-bold text-white leading-tight">
            {artist.stageName || `${artist.firstName} ${artist.lastName}`}
          </div>
          <div className="flex flex-wrap gap-1 mt-1 items-center">
            {artist.genres?.map((g) => (
              <span
                key={g}
                className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-semibold"
              >
                {g}
              </span>
            ))}
          </div>
          <div className="text-sm text-primary/80 mt-1 flex gap-2">
            {artist.city && <span>{artist.city}</span>}
            {artist.artistType && <span>· {artist.artistType}</span>}
            {artist.experience && <span>· {artist.experience}y exp</span>}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 items-center">
        <CButton
          variant={ButtonType.Primary}
          className="rounded-full px-4"
          onClick={() => {
            window.open(
              artist.hoizrBookingUrl || `/artist/${artist._id}`,
              "_blank"
            );
          }}
        >
          Book
        </CButton>
        <div className="flex gap-1 ml-auto">
          {artist.socialLinks?.instagram && (
            <a
              href={artist.socialLinks.instagram}
              className="text-pink-400 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fab fa-instagram" />
            </a>
          )}
          {artist.socialLinks?.soundcloud && (
            <a
              href={artist.socialLinks.soundcloud}
              className="text-orange-400 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
              title="SoundCloud"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fab fa-soundcloud" />
            </a>
          )}
          {artist.socialLinks?.spotify && (
            <a
              href={artist.socialLinks.spotify}
              className="text-green-500 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
              title="Spotify"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fab fa-spotify" />
            </a>
          )}
        </div>
        {artist.rating && (
          <span className="flex items-center text-xs bg-green-900/40 text-green-300 px-2 py-0.5 rounded-full ml-1 font-semibold">
            <Star className="h-3 w-3 mr-0.5" /> {artist.rating}
          </span>
        )}
      </div>
    </div>
  );
}

const ExploreArtists: React.FC & { getLayout?: any } = () => {
  const [tab, setTab] = useState<"all" | "trending" | "nearby">("all");
  const [search, setSearch] = useState("");
  const [isFilterOpen, setFilterOpen] = useState(false);

  // Pagination state (for all artists tab)
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = RowsPerPageEnum.Ten;

  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [total, setTotal] = useState(0);

  // Filter state
  const [filters, setFilters] = useState<any>({
    genres: [],
    city: "",
    experience: "",
  });

  useEffect(() => {
    let cancelRequest = false;
    async function fetchData() {
      setLoading(true);

      try {
        let apiArtists: any[] = [];
        let apiTotal = 0;

        if (tab === "trending") {
          const result = await sdk.getTrendingArtists();
          apiArtists = result.getTrendingArtists || [];
          apiTotal = apiArtists.length;
        } else if (tab === "nearby") {
          const result = await sdk.getNearbyArtists();
          apiArtists = result.getNearbyArtists || [];
          apiTotal = apiArtists.length;
        } else {
          // Compose filter input for API
          const apiFilters: any[] = [];
          if (filters.city) {
            apiFilters.push({
              field: "address.city",
              value: filters.city,
              operator: "equals",
            });
          }
          if (filters.genres.length) {
            apiFilters.push({
              field: "genres",
              value: filters.genres,
              operator: "in",
            });
          }
          if (filters.experience) {
            apiFilters.push({
              field: "experience",
              value: Number(filters.experience),
              operator: "gte",
            });
          }
          const pagination = {
            pageNumber: currentPage,
            rowsPerPage: pageSize,
          };
          const result = await sdk.getAllArtists({
            search: search,
            // sort: {
            //     key
            // },
            filter: apiFilters,
            page: pagination,
          });
          apiArtists = result.getAllArtists?.items || [];
          apiTotal = result.getAllArtists?.total || 0;
        }

        if (cancelRequest) return;

        setArtists(apiArtists.map(mapApiToArtist));
        setTotal(apiTotal);
      } catch (error) {
        // handle errors with toasts if you wish
        setArtists([]);
        setTotal(0);
      }
      setLoading(false);
    }
    fetchData();
    return () => {
      cancelRequest = true;
    };
    // Note: page only matters for 'all', so resetting currentPage on tab switch
    // Also, include filters only for 'all'
    // eslint-disable-next-line
  }, [tab, search, filters, currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter/tab/search change
  }, [tab, search, filters]);

  // Pagination
  const totalPages = Math.ceil(total / getPageSizeNumber(pageSize));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Explore Artists
          </h1>
          <p className="text-primary/80 mt-1 text-base">
            Discover DJs & artists from across genres, cities, and popular
            charts.
          </p>
        </div>
        <div className="flex border border-card bg-secondaryBg rounded-full overflow-hidden shadow divide-x divide-card">
          {ARTIST_TABS.map((t) => (
            <button
              key={t.value}
              className={`flex items-center gap-2 px-6 py-2 font-semibold transition
              ${
                tab === t.value
                  ? "bg-primary text-black"
                  : "text-primary hover:bg-primary/10"
              }`}
              onClick={() => setTab(t.value as any)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 flex items-center bg-secondaryBg border border-card rounded-lg px-3 py-2">
          <Search className="h-5 w-5 text-primary/70 mr-2" />
          <input
            type="text"
            placeholder="Search by name, stage name, or genre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent flex-1 text-white outline-none text-base placeholder:text-primary/40"
            disabled={tab !== "all"}
          />
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-semibold shadow hover:bg-primary/90 transition"
          onClick={() => setFilterOpen(true)}
          disabled={tab !== "all"}
        >
          <FilterIcon className="h-5 w-5" />
          Filters
        </button>
      </div>

      {/* Filter Drawer */}
      {isFilterOpen && tab === "all" && (
        <div
          className="fixed inset-0 z-30 bg-black/70 flex justify-end"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="w-full max-w-sm h-full bg-secondaryBg p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Filter Artists</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="text-primary text-lg"
              >
                x
              </button>
            </div>
            <div className="space-y-6">
              {/* Genre filter */}
              <div>
                <label className="block mb-2 text-primary font-medium">
                  Genre
                </label>
                <select
                  multiple
                  value={filters.genres}
                  onChange={(e) =>
                    setFilters((f: any) => ({
                      ...f,
                      genres: Array.from(e.target.selectedOptions).map(
                        (opt) => opt.value
                      ),
                    }))
                  }
                  className="w-full rounded-lg bg-card text-white border border-card px-2 py-1"
                >
                  {["House", "Techno", "Trap", "Pop", "Hip-Hop", "Indie"].map(
                    (g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    )
                  )}
                </select>
              </div>
              {/* City */}
              <div>
                <label className="block mb-2 text-primary font-medium">
                  City
                </label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters((f: any) => ({ ...f, city: e.target.value }))
                  }
                  className="w-full rounded-lg bg-card text-white border border-card px-2 py-1"
                  placeholder="e.g. Mumbai"
                />
              </div>
              {/* Experience */}
              <div>
                <label className="block mb-2 text-primary font-medium">
                  Experience (years)
                </label>
                <input
                  type="number"
                  min={0}
                  value={filters.experience}
                  onChange={(e) =>
                    setFilters((f: any) => ({
                      ...f,
                      experience: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg bg-card text-white border border-card px-2 py-1"
                  placeholder="e.g. 3"
                />
              </div>
              <CButton
                className="w-full rounded-lg font-semibold mt-4"
                variant={ButtonType.Primary}
                onClick={() => setFilterOpen(false)}
              >
                Apply Filters
              </CButton>
            </div>
          </div>
        </div>
      )}

      {/* Results Meta */}
      <div className="flex items-center justify-between mt-2 mb-2 text-primary/80 text-sm">
        <span>
          Showing {loading ? "…" : artists.length} of {loading ? "…" : total}{" "}
          artists
        </span>
        <span>
          Current view:{" "}
          <span className="font-semibold text-primary">
            {ARTIST_TABS.find((t) => t.value === tab)?.label}
          </span>
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-h-[40vh]">
        {loading
          ? Array(8)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-secondaryBg rounded-2xl h-48 border border-card"
                />
              ))
          : artists.map((artist) => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
      </div>

      {/* Pagination */}
      {tab === "all" && totalPages > 1 && (
        <div className="flex justify-center my-8 gap-2">
          <button
            className="px-4 py-2 rounded border border-card text-primary hover:bg-primary/10 disabled:opacity-40"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-white/70">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded border border-card text-primary hover:bg-primary/10 disabled:opacity-40"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

ExploreArtists.getLayout = (page: React.ReactNode) => (
  <MainLayout>{page}</MainLayout>
);
export default ExploreArtists;
