import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Monitor,
  Armchair,
  Ticket,
  Info,
  ChevronRight,
  X,
  Loader,
} from "lucide-react";

import { formatShowTime, formatPrice } from "../data/shows";
import { getShowById, getMovieById, getBookedSeats } from "../services/api";
import { generateSeatMap, calculateTotalPrice, seatTypes } from "../data/seats";

const MAX_SEATS = 8;
const BOOKING_FEE_PER_SEAT = 150;

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getSeatById(seatMap, seatId) {
  for (const row of seatMap.rows) {
    const found = row.seats.find((s) => s.id === seatId);
    if (found) return found;
  }
  return null;
}

function SeatButton({ seat, isSelected, onClick, basePriceLkr }) {
  const isDisabled = seat.status === "sold" || seat.status === "held";

  // Type colors (subtle)
  const typeRing =
    seat.type === seatTypes.VIP
      ? "ring-yellow-400/50"
      : seat.type === seatTypes.PREMIUM
        ? "ring-purple-400/50"
        : "ring-gray-200";

  const selectedStyles =
    "bg-[var(--color-primary)] text-white ring-[var(--color-primary)] shadow-lg shadow-red-500/20 scale-[1.03]";
  const disabledStyles = "bg-gray-100 text-gray-300 cursor-not-allowed";
  const availableStyles =
    "bg-white text-[var(--color-light)] hover:bg-gray-50 hover:ring-gray-300";

  const price = basePriceLkr * seat.priceMultiplier;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        "relative w-9 h-9 md:w-10 md:h-10 rounded-xl border border-gray-200 ring-1 transition-all flex items-center justify-center group",
        typeRing,
        isSelected ? selectedStyles : isDisabled ? disabledStyles : availableStyles
      )}
      title={`${seat.row}${seat.number} • ${seat.type} • ${formatPrice(price)}`}
    >
      <Armchair className={cn("w-4 h-4 md:w-5 md:h-5", isSelected ? "fill-current" : "")} />
      {/* Hover tooltip */}
      {!isDisabled && (
        <div className="absolute -top-8 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-20">
          {seat.row}
          {seat.number} • {formatPrice(price)}
        </div>
      )}
    </button>
  );
}

export default function SeatSelectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [show, setShow] = useState(null);
  const [movie, setMovie] = useState(null);
  const [bookedSeatsList, setBookedSeatsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch show, movie, and booked seats data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const showData = await getShowById(id);
        setShow(showData);

        if (showData.movie_id) {
          const movieData = await getMovieById(showData.movie_id);
          setMovie(movieData);
        }

        // Fetch already booked seats for this show
        const bookedData = await getBookedSeats(id);
        setBookedSeatsList(bookedData.booked_seats || []);
      } catch (err) {
        console.error("Failed to fetch seat selection data:", err);
        setError("Failed to load show details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Generate seat map with booked seats marked as sold
  const seatMap = useMemo(() => {
    if (!show) return null;
    const map = generateSeatMap(show.screen_name, show.show_id);

    // Mark booked seats as sold
    if (map && bookedSeatsList.length > 0) {
      for (const row of map.rows) {
        for (const seat of row.seats) {
          const seatLabel = `${seat.row}${seat.number}`;
          if (bookedSeatsList.includes(seatLabel)) {
            seat.status = "sold";
          }
        }
      }
    }

    return map;
  }, [show, bookedSeatsList]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <Loader className="w-10 h-10 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (error || !show || !movie || !seatMap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-red-500 font-bold text-xl mb-4">{error || "Show not found"}</p>
        <Link to="/movies" className="btn btn-primary">Browse Movies</Link>
      </div>
    );
  }

  // Adapt show properties to snake_case from API
  const showPrice = show.ticket_price;
  const showScreenName = show.screen_name;
  const cinemaName = show.cinema?.name || 'Cinema';
  const showDate = new Date(show.start_time).toLocaleDateString();
  const showTime = show.start_time;

  const selectedSeatObjects = selectedSeats
    .map((seatId) => getSeatById(seatMap, seatId))
    .filter(Boolean);

  const totalSeatPrice = calculateTotalPrice(selectedSeats, showPrice, seatMap);
  const bookingFee = selectedSeats.length * BOOKING_FEE_PER_SEAT;
  const grandTotal = totalSeatPrice + bookingFee;

  const toggleSeat = (seatId) => {
    const seat = getSeatById(seatMap, seatId);
    if (!seat) return;

    if (seat.status === "sold" || seat.status === "held") return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
      return;
    }

    if (selectedSeats.length >= MAX_SEATS) {
      toast.error(`You can only select up to ${MAX_SEATS} seats`);
      return;
    }

    setSelectedSeats((prev) => [...prev, seatId]);
  };

  const clearSelection = () => setSelectedSeats([]);

  const proceed = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    // Convert seat IDs to seat labels (e.g., "A1", "B5")
    const seatLabels = selectedSeatObjects.map(s => `${s.row}${s.number}`);

    navigate("/checkout", {
      state: {
        showId: show.show_id,
        selectedSeats: seatLabels,
        totalPrice: grandTotal,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top header */}
        <div className="flex items-start gap-4 mb-6 pb-5 border-b border-gray-100">
          <Link
            to={`/movies/${movie.movie_id}`}
            className="p-2 rounded-full hover:bg-gray-100 text-[var(--color-light)] transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-light)]">
              {movie.title}
            </h1>
            <p className="text-sm md:text-base text-[var(--color-light-400)] mt-1">
              {cinemaName} •{" "}
              <span className="text-[var(--color-primary)] font-semibold">{showScreenName}</span>{" "}
              • {showDate} • {formatShowTime(showTime)}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-[var(--color-light-400)]">
            <Info className="w-4 h-4" />
            <span>Select up to {MAX_SEATS} seats</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Seat map */}
          <div className="lg:col-span-2">
            {/* Screen */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 md:p-6 mb-6">
              <div className="flex items-center justify-center gap-2 text-[var(--color-light-400)] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                <Monitor className="w-4 h-4" /> Screen
              </div>

              <div className="mx-auto w-[80%] h-3 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 shadow-inner" />

              <div className="mt-6 overflow-x-auto pb-2">
                <div className="min-w-[760px] flex flex-col gap-3 items-center">
                  {seatMap.rows.map((row) => (
                    <div key={row.rowLabel} className="flex items-center gap-4">
                      {/* Row label */}
                      <div className="w-8 text-right text-xs font-bold text-[var(--color-light-400)]">
                        {row.rowLabel}
                      </div>

                      {/* Seats */}
                      <div className="flex items-center gap-2">
                        {row.seats.map((seat) => {
                          const isSelected = selectedSeats.includes(seat.id);
                          const isDisabled = seat.status === "sold" || seat.status === "held";
                          return (
                            <SeatButton
                              key={seat.id}
                              seat={seat}
                              isSelected={isSelected}
                              basePriceLkr={showPrice}
                              onClick={() => !isDisabled && toggleSeat(seat.id)}
                            />
                          );
                        })}
                      </div>

                      {/* Row label */}
                      <div className="w-8 text-left text-xs font-bold text-[var(--color-light-400)]">
                        {row.rowLabel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm text-[var(--color-light-400)]">
                <LegendItem label="Available" boxClass="bg-white border border-gray-200" />
                <LegendItem label="Selected" boxClass="bg-[var(--color-primary)] border border-[var(--color-primary)]" active />
                <LegendItem label="Sold" boxClass="bg-gray-100 border border-gray-100" disabled />
                <LegendItem label="Premium" boxClass="bg-white border border-gray-200 ring-1 ring-purple-400/50" />
                <LegendItem label="VIP" boxClass="bg-white border border-gray-200 ring-1 ring-yellow-400/50" />
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-extrabold text-[var(--color-light)] flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    Booking Summary
                  </h2>

                  {selectedSeats.length > 0 && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="text-xs font-bold text-[var(--color-light-400)] hover:text-[var(--color-light)] flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Clear
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  <InfoRow label="Cinema" value={cinemaName} />
                  <InfoRow label="Screen" value={showScreenName} />
                  <InfoRow
                    label="Date & Time"
                    value={`${showDate} • ${formatShowTime(showTime)}`}
                  />
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="text-sm font-bold text-[var(--color-light)] mb-2">
                    Selected seats ({selectedSeats.length}/{MAX_SEATS})
                  </p>

                  {selectedSeats.length === 0 ? (
                    <div className="text-sm text-[var(--color-light-400)] bg-gray-50 border border-gray-100 rounded-xl p-4">
                      Click on seats to select them.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeatObjects.map((s) => (
                        <span
                          key={s.id}
                          className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-[var(--color-primary)] border border-red-100"
                        >
                          {s.row}
                          {s.number}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4 space-y-2">
                  <LineItem label="Seat total" value={formatPrice(totalSeatPrice)} />
                  <LineItem
                    label={`Booking fee (${BOOKING_FEE_PER_SEAT} x ${selectedSeats.length})`}
                    value={formatPrice(bookingFee)}
                  />
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-extrabold text-[var(--color-light)]">Grand total</span>
                    <span className="text-xl font-extrabold text-[var(--color-light)]">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={proceed}
                  disabled={selectedSeats.length === 0}
                  className="mt-5 w-full btn btn-primary py-3 rounded-xl font-extrabold shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>

                <p className="mt-3 text-xs text-[var(--color-light-400)]">
                  * UI only. Payment will be added in Phase 5.
                </p>
              </div>

              <div className="mt-4 text-xs text-[var(--color-light-400)] bg-gray-50 border border-gray-100 rounded-2xl p-4">
                Tip: Premium & VIP seats may cost more (based on seat type multiplier).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small UI helpers */
function LegendItem({ label, boxClass, active, disabled }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center",
          boxClass,
          active ? "text-white" : disabled ? "text-gray-300" : "text-gray-400"
        )}
      >
        <Armchair className="w-4 h-4 fill-current" />
      </div>
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs font-bold text-[var(--color-light-400)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--color-light)] text-right">{value}</span>
    </div>
  );
}

function LineItem({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--color-light-400)]">{label}</span>
      <span className="text-sm font-bold text-[var(--color-light)]">{value}</span>
    </div>
  );
}
