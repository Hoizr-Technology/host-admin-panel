import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { sdk } from "@/utils/graphqlClient";
import useGlobalStore from "@/store/global";
import { useRouter } from "next/router";
import { extractErrorMessage } from "@/utils/functions/common";
import CButton from "../common/buttons/button";
import { ButtonType } from "../common/buttons/interface";
import { useEventUpdateStore } from "@/store/eventUpdate.store";
import { Genres } from "@/generated/graphql";
import { allGenres } from "@/utils/genres/genres.enum";

const ITEMS_PER_PAGE = 12;
const MAX_GENRES = 10;

const GenresStep = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const { setToastData } = useGlobalStore();
  const [btnLoading, setBtnLoading] = useState(false);

  const { genres, setGenres } = useEventUpdateStore();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filter and paginate genres
  const filteredGenres = useMemo(() => {
    if (!search.trim()) return allGenres;
    return allGenres.filter((genre) =>
      genre.label.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredGenres.length / ITEMS_PER_PAGE);
  const currentPageGenres = filteredGenres.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const toggleGenre = (genre: Genres) => {
    // If already selected, allow removal as usual
    if (genres.includes(genre)) {
      setGenres(genres.filter((g) => g !== genre));
      return;
    }

    // If not yet selected and under max, allow add
    if (genres.length < MAX_GENRES) {
      setGenres([...genres, genre]);
      return;
    }

    // If at max, prevent add and show message
    setToastData({
      message: `You can select up to ${MAX_GENRES} genres.`,
      type: "warning",
    });
  };

  const handleSubmit = async () => {
    if (genres.length === 0) {
      setToastData({
        message: "Please select at least one genre",
        type: "error",
      });
      return;
    }

    try {
      setBtnLoading(true);
      await sdk.updateEvent({
        eventId: eventId as string,
        isFinalStep: false,
        input: { genresPreferred: genres },
      });
      router.push(`/event-update/additional-info?eventId=${eventId}`);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setToastData({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setBtnLoading(false);
    }
  };

  // On search change, reset to first page
  const handleSearch = (e: any) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <motion.div className="w-full max-w-5xl mx-auto mb-auto min-h-[calc(100vh-111px)] sm:px-6 flex flex-col justify-between bg-transparent items-center text-center relative py-6">
      <h1 className="text-2xl sm:text-3xl text-primary font-bold leading-tight mb-3">
        Select Preferred Music Genres
      </h1>
      <p className="max-w-xl mx-auto text-white/60 mb-5 text-sm">
        Choose all genres that best fit your event's vibe. This will help us
        deliver the best artist matches.
      </p>

      {/* Search and Pagination Row */}
      <div className="w-full flex items-center justify-between mb-4 gap-2">
        <input
          type="text"
          className="w-1/2 max-w-xs px-3 py-2 rounded-lg bg-background border border-white/20 text-white text-base placeholder:text-white/50 outline-none focus:ring-2 focus:ring-primary transition flex-grow-0"
          placeholder="Search genres..."
          value={search}
          onChange={handleSearch}
        />

        <div className="flex items-center space-x-2 text-white font-semibold text-base flex-grow-0 ml-auto">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-2 py-1 rounded bg-primary/10 text-white disabled:opacity-50"
          >
            &lt;
          </button>
          <span className="min-w-[50px] text-center">
            {page} / {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-2 py-1 rounded bg-primary/10 text-white disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* SCROLLABLE Genre Chips & Grid */}
      <div
        className="w-full flex-1 overflow-y-auto mb-4"
        style={{
          maxHeight: "calc(100vh - 370px)",
          minHeight: 0,
        }}
      >
        {/* Selected Genres */}
        <div className="w-full text-left mb-2">
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-semibold text-white text-base">
                Selected Genres ({genres.length}):
              </span>
              {genres.map((genreValue) => {
                const genre = allGenres.find((g) => g.value === genreValue);
                return (
                  <span
                    key={genreValue}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm"
                  >
                    {genre?.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Genre Grid */}
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
            {currentPageGenres.length ? (
              currentPageGenres.map((genre) => {
                const IconComponent = genre.icon;
                const isSelected = genres.includes(genre.value);
                const atLimit = genres.length >= MAX_GENRES && !isSelected;

                return (
                  <button
                    type="button"
                    key={genre.value}
                    disabled={atLimit}
                    className={`
                      group cursor-pointer relative transition-all duration-200 
                      rounded-2xl focus:outline-none shadow-md border-2
                      ${
                        isSelected
                          ? "border-primary shadow-2xl scale-105"
                          : "border-white/10 hover:border-primary"
                      }
                      ${atLimit ? "opacity-40 pointer-events-none" : ""}
                    `}
                    onClick={() => toggleGenre(genre.value)}
                  >
                    <div
                      className={`
                        absolute inset-0
                        ${isSelected ? "bg-primary/40" : "bg-primary/10"}
                        backdrop-blur-sm rounded-2xl z-0
                      `}
                    />
                    <div className="relative z-10 flex flex-col items-center justify-center px-3 py-5 sm:py-6 min-h-[90px]">
                      <span
                        className={`
                          p-3 rounded-full bg-primary/20 mb-3 shadow
                          group-hover:bg-primary/40 transition-all duration-200
                          flex items-center justify-center
                          ${isSelected ? "bg-primary/90 scale-110" : ""}
                        `}
                      >
                        <IconComponent
                          className={`w-6 h-6 text-white ${
                            isSelected ? "scale-110" : ""
                          }`}
                        />
                      </span>
                      <span className="block text-base font-semibold text-white">
                        {genre.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse z-20" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="col-span-full text-center text-white/40 pt-8 pb-12 text-base">
                No genres found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue/Back Buttons */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:space-x-6 space-y-2 sm:space-y-0 mt-10">
        <CButton
          variant={ButtonType.Secondary}
          onClick={() =>
            router.push(`/event-update/location?eventId=${eventId}`)
          }
          className="w-full sm:w-[200px]"
        >
          Back
        </CButton>
        <CButton
          loading={btnLoading}
          variant={ButtonType.Primary}
          onClick={handleSubmit}
          disabled={genres.length === 0}
          className="w-full sm:w-[200px]"
        >
          Continue
        </CButton>
      </div>
    </motion.div>
  );
};

export default GenresStep;
