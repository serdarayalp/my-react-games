import React, { useState, useMemo } from "react";
import { Search, Heart, X, Star, Calendar, Globe, Gamepad2, Filter, ChevronDown } from "lucide-react";

// --- MOCK DATA (Inspiriert von RAWG.io / GameHub) ---
const GENRES = [
  { id: "action", name: "Action", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=100&q=80" },
  { id: "adventure", name: "Adventure", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=100&q=80" },
  { id: "arcade", name: "Arcade", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=100&q=80" },
  { id: "board-games", name: "Board Games", image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=100&q=80" },
  { id: "card", name: "Card", image: "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=100&q=80" },
  { id: "casual", name: "Casual", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&q=80" },
  { id: "educational", name: "Educational", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=100&q=80" },
  { id: "family", name: "Family", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=100&q=80" },
  { id: "fighting", name: "Fighting", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=100&q=80" },
  { id: "indie", name: "Indie", image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=100&q=80" },
  { id: "massively-multiplayer", name: "Massively Multiplayer", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=100&q=80" },
  { id: "platformer", name: "Platformer", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=100&q=80" },
  { id: "puzzle", name: "Puzzle", image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=100&q=80" },
  { id: "racing", name: "Racing", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=100&q=80" },
  { id: "rpg", name: "RPG", image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=100&q=80" },
  { id: "shooter", name: "Shooter", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=100&q=80" },
  { id: "strategy", name: "Strategy", image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=100&q=80" },
];

const PLATFORMS = [
  { id: "all", name: "Platforms" },
  { id: "pc", name: "PC (Windows)" },
  { id: "playstation", name: "PlayStation" },
  { id: "xbox", name: "Xbox" },
  { id: "nintendo", name: "Nintendo" },
  { id: "mac", name: "Apple Macintosh" },
  { id: "linux", name: "Linux" },
];

const SORT_OPTIONS = [
  { id: "relevance", name: "Order by: Relevance" },
  { id: "metacritic", name: "Order by: Metacritic Score" },
  { id: "name", name: "Order by: Name (A-Z)" },
  { id: "released", name: "Order by: Release Date" },
];

const INITIAL_GAMES = [
  {
    id: 1,
    title: "Grand Theft Auto V",
    metacritic: 92,
    emoji: "👍",
    released: "2013-09-17",
    genres: ["action", "adventure"],
    platforms: ["pc", "playstation", "xbox"],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    publisher: "Rockstar Games",
    description: "Erlebe die verwobenen Geschichten von Franklin, Michael und Trevor in der weitläufigen Metropole Los Santos und Blaine County.",
  },
  {
    id: 2,
    title: "The Witcher 3: Wild Hunt",
    metacritic: 92,
    emoji: "👍",
    released: "2015-05-18",
    genres: ["action", "adventure", "rpg"],
    platforms: ["pc", "playstation", "xbox", "nintendo"],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    publisher: "CD PROJEKT RED",
    description: "Schlüpfe in die Rolle von Geralt von Riva, einem professionellen Monsterjäger auf der Suche nach dem Kind der Prophezeiung.",
  },
  {
    id: 3,
    title: "Portal 2",
    metacritic: 95,
    emoji: "👍",
    released: "2011-04-18",
    genres: ["shooter", "puzzle", "platformer"],
    platforms: ["pc", "playstation", "xbox", "mac", "linux"],
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80",
    publisher: "Valve",
    description: "Nutze die Portal-Gun, um physikalische Rätsel in den verfallenen Testkammern von Aperture Science zu lösen.",
  },
  {
    id: 4,
    title: "Tomb Raider (2013)",
    metacritic: 86,
    emoji: "👍",
    released: "2013-03-05",
    genres: ["action", "adventure"],
    platforms: ["pc", "playstation", "xbox", "mac"],
    image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=800&q=80",
    publisher: "Square Enix",
    description: "Begleite die junge Lara Croft auf ihrer ersten Expedition, die zu einem erbitterten Kampf ums Überleben auf der Insel Yamatai wird.",
  },
  {
    id: 5,
    title: "Counter-Strike: Global Offensive",
    metacritic: 83,
    emoji: "🎯",
    released: "2012-08-21",
    genres: ["action", "shooter", "massively-multiplayer"],
    platforms: ["pc", "mac", "linux", "xbox", "playstation"],
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    publisher: "Valve",
    description: "Taktischer Team-Shooter mit ikonischen Karten, präziser Waffenmechanik und kompetitivem E-Sport-Fokus.",
  },
  {
    id: 6,
    title: "Portal",
    metacritic: 90,
    emoji: "👍",
    released: "2007-10-09",
    genres: ["adventure", "puzzle", "platformer"],
    platforms: ["pc", "mac", "linux", "xbox", "playstation"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    publisher: "Valve",
    description: "Ein bahnbrechendes First-Person-Puzzlespiel mit schwarzem Humor und der legendären KI GLaDOS.",
  },
  {
    id: 7,
    title: "Left 4 Dead 2",
    metacritic: 89,
    emoji: "👍",
    released: "2009-11-17",
    genres: ["action", "shooter"],
    platforms: ["pc", "mac", "linux", "xbox"],
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80",
    publisher: "Valve",
    description: "Kämpfe dich im Koop-Modus durch Horden von Infizierten auf dem Weg durch den amerikanischen Süden.",
  },
  {
    id: 8,
    title: "Cyberpunk 2077",
    metacritic: 86,
    emoji: "🎯",
    released: "2020-12-10",
    genres: ["action", "adventure", "rpg", "shooter"],
    platforms: ["pc", "playstation", "xbox"],
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    publisher: "CD PROJEKT RED",
    description: "Open-World-Action-Adventure in Night City, einer Megalopolis, die von Macht, Glamour und Körpermodifikationen besessen ist.",
  },
  {
    id: 9,
    title: "Forza Horizon 5",
    metacritic: 92,
    emoji: "👍",
    released: "2021-11-09",
    genres: ["racing", "arcade", "casual"],
    platforms: ["pc", "xbox"],
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    publisher: "Xbox Game Studios",
    description: "Erkunde die lebendigen und sich ständig verändernden Open-World-Landschaften Mexikos am Steuer hunderter Weltklasse-Autos.",
  },
];

// --- CUSTOM PLATFORM & LOGO ICONS ---
const HubLogo = () => (
  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md shrink-0">
    <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
      <circle cx="18" cy="18" r="5" stroke="#181920" strokeWidth="2.5" />
      <line x1="18" y1="6" x2="18" y2="13" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="23" x2="18" y2="30" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="6" y1="18" x2="13" y2="18" stroke="#9333EA" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="23" y1="18" x2="30" y2="18" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="5" r="2.2" fill="#E11D48" />
      <circle cx="18" cy="31" r="2.2" fill="#2563EB" />
      <circle cx="5" cy="18" r="2.2" fill="#9333EA" />
      <circle cx="31" cy="18" r="2.2" fill="#059669" />
    </svg>
  </div>
);

const PlatformIcons = ({ platforms, darkMode }) => {
  const iconColor = darkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`flex items-center gap-2 ${iconColor}`}>
      {platforms.includes("pc") && (
        <span title="PC / Windows">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
          </svg>
        </span>
      )}
      {platforms.includes("playstation") && (
        <span title="PlayStation" className="font-bold text-xs tracking-tighter">
          PS
        </span>
      )}
      {platforms.includes("xbox") && (
        <span title="Xbox">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.83 14.32c-.86 1.15-2.12 2.02-3.56 2.41.48-1.57-.32-3.68-1.27-4.88-.95 1.2-1.75 3.31-1.27 4.88-1.44-.39-2.7-1.26-3.56-2.41-.49-2.06.79-4.73 2.57-6.64C8.26 8.15 7.1 6.72 7.36 5.6c1.38-.82 3.01-1.29 4.64-1.29s3.26.47 4.64 1.29c.26 1.12-.9 2.55-2.38 4.08 1.78 1.91 3.06 4.58 2.57 6.64z" />
          </svg>
        </span>
      )}
      {platforms.includes("nintendo") && (
        <span title="Nintendo Switch" className="font-extrabold text-xs">
          N
        </span>
      )}
      {platforms.includes("mac") && (
        <span title="Apple Mac">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.96 6.32c.67-.81 1.12-1.94 1-3.07-.96.04-2.13.64-2.82 1.45-.61.7-.115 1.85-1.01 2.96 1.07.08 2.16-.53 2.83-1.34z" />
          </svg>
        </span>
      )}
      {platforms.includes("linux") && (
        <span title="Linux" className="text-xs font-semibold">
          🐧
        </span>
      )}
    </div>
  );
};

// --- MAIN APPLICATION ---
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [wishlist, setWishlist] = useState([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // Wishlist umschalten
  const toggleWishlist = (e, gameId) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  // Metacritic Badge Styling
  const getMetacriticColor = (score) => {
    if (score >= 90) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (score >= 75) return "text-amber-400 border-amber-500/40 bg-amber-500/10";
    return "text-rose-400 border-rose-500/40 bg-rose-500/10";
  };

  // Gefilterte & Sortierte Spiele
  const filteredGames = useMemo(() => {
    return INITIAL_GAMES.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = !selectedGenre || game.genres.includes(selectedGenre);
      const matchesPlatform =
        selectedPlatform === "all" || game.platforms.includes(selectedPlatform);
      const matchesWishlist = !showWishlistOnly || wishlist.includes(game.id);
      return matchesSearch && matchesGenre && matchesPlatform && matchesWishlist;
    }).sort((a, b) => {
      if (sortBy === "metacritic") return b.metacritic - a.metacritic;
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "released") return new Date(b.released) - new Date(a.released);
      return 0;
    });
  }, [searchQuery, selectedGenre, selectedPlatform, sortBy, showWishlistOnly, wishlist]);

  // Dynamischer Seitentitel wie auf RAWG
  const pageTitle = useMemo(() => {
    if (showWishlistOnly) return "My Wishlist";
    const genreObj = GENRES.find((g) => g.id === selectedGenre);
    const platformObj = PLATFORMS.find((p) => p.id === selectedPlatform && p.id !== "all");
    const parts = [];
    if (platformObj) parts.push(platformObj.name);
    if (genreObj) parts.push(genreObj.name);
    parts.push("Games");
    return parts.join(" ");
  }, [selectedGenre, selectedPlatform, showWishlistOnly]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? "bg-[#151515] text-white" : "bg-gray-100 text-gray-900"
        }`}
    >
      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-30 px-4 md:px-8 py-4 backdrop-blur-md bg-opacity-90">
        <div className="max-w-[1600px] mx-auto flex items-center gap-4 md:gap-6">
          {/* Logo */}
          <button
            onClick={() => {
              setSelectedGenre(null);
              setSelectedPlatform("all");
              setSearchQuery("");
              setShowWishlistOnly(false);
            }}
            className="flex items-center gap-3 focus:outline-none group"
            title="Reset filters"
          >
            <HubLogo />
          </button>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 858,625 games..."
              className={`w-full pl-11 pr-10 py-2.5 rounded-full text-sm transition-all outline-none ${darkMode
                  ? "bg-[#262626] hover:bg-[#303030] focus:bg-[#333333] text-white placeholder-gray-400"
                  : "bg-white hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-500 shadow-sm"
                }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => setShowWishlistOnly(!showWishlistOnly)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${showWishlistOnly
                ? "bg-rose-500 text-white"
                : darkMode
                  ? "bg-[#262626] hover:bg-[#303030] text-gray-200"
                  : "bg-white hover:bg-gray-50 text-gray-700 shadow-sm"
              }`}
          >
            <Heart className={`w-4 h-4 ${showWishlistOnly || wishlist.length > 0 ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-black/20">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle Switch (wie oben rechts im Bild) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setDarkMode(!darkMode)}
              role="switch"
              aria-checked={darkMode}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center ${darkMode ? "bg-[#4ADE80]" : "bg-gray-300"
                }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${darkMode ? "translate-x-5" : "translate-x-0"
                  }`}
              />
            </button>
            <span className="text-sm font-medium hidden md:inline whitespace-nowrap">
              {darkMode ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT (Sidebar + Content) --- */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-4 pb-16 flex flex-col lg:flex-row gap-8">
        {/* LEFT SIDEBAR: GENRES */}
        <aside className="w-full lg:w-56 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Genres</h2>
            {selectedGenre && (
              <button
                onClick={() => setSelectedGenre(null)}
                className="text-xs text-emerald-400 hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          <ul className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {GENRES.map((genre) => {
              const isSelected = selectedGenre === genre.id;
              return (
                <li key={genre.id} className="shrink-0">
                  <button
                    onClick={() => {
                      setShowWishlistOnly(false);
                      setSelectedGenre(isSelected ? null : genre.id);
                    }}
                    className={`w-full flex items-center gap-3 p-1.5 rounded-xl text-left transition-all group ${isSelected
                        ? darkMode
                          ? "bg-white/10 font-bold text-white"
                          : "bg-gray-200 font-bold text-gray-900"
                        : darkMode
                          ? "text-gray-300 hover:text-white hover:bg-white/5"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-200/60"
                      }`}
                  >
                    <img
                      src={genre.image}
                      alt={genre.name}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <span className="text-sm whitespace-nowrap">{genre.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="flex-1 min-w-0">
          {/* Dynamic Big Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            {pageTitle}
          </h1>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 mb-7">
            {/* Order By Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`appearance-none pl-4 pr-10 py-2.5 rounded-lg text-sm font-medium cursor-pointer outline-none transition-colors ${darkMode
                    ? "bg-[#262626] hover:bg-[#303030] text-white"
                    : "bg-white hover:bg-gray-50 text-gray-800 shadow-sm"
                  }`}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>

            {/* Platforms Dropdown */}
            <div className="relative">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className={`appearance-none pl-4 pr-10 py-2.5 rounded-lg text-sm font-medium cursor-pointer outline-none transition-colors ${darkMode
                    ? "bg-[#262626] hover:bg-[#303030] text-white"
                    : "bg-white hover:bg-gray-50 text-gray-800 shadow-sm"
                  }`}
              >
                {PLATFORMS.map((plat) => (
                  <option key={plat.id} value={plat.id}>
                    {plat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>

            {/* Active Filter Reset Pill */}
            {(selectedGenre || selectedPlatform !== "all" || searchQuery || showWishlistOnly) && (
              <button
                onClick={() => {
                  setSelectedGenre(null);
                  setSelectedPlatform("all");
                  setSearchQuery("");
                  setShowWishlistOnly(false);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Clear all filters
              </button>
            )}
          </div>

          {/* GAME GRID (3-Spalten Raster wie im Screenshot) */}
          {filteredGames.length === 0 ? (
            <div
              className={`rounded-2xl p-12 text-center ${darkMode ? "bg-[#202020]" : "bg-white shadow-sm"
                }`}
            >
              <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <h3 className="text-lg font-bold mb-1">Keine Spiele gefunden</h3>
              <p className="text-sm opacity-60">
                Versuche einen anderen Suchbegriff oder setze die aktiven Filter zurück.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGames.map((game) => {
                const isWishlisted = wishlist.includes(game.id);
                return (
                  <article
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col ${darkMode ? "bg-[#202020]" : "bg-white shadow-md"
                      }`}
                  >
                    {/* 16:9 Cover Image */}
                    <div className="aspect-video w-full overflow-hidden bg-black/40">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Platform Icons & Metacritic Badge */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <PlatformIcons platforms={game.platforms} darkMode={darkMode} />
                          <span
                            title="Metacritic Score"
                            className={`px-2 py-0.5 text-xs font-bold rounded border ${getMetacriticColor(
                              game.metacritic
                            )}`}
                          >
                            {game.metacritic}
                          </span>
                        </div>

                        {/* Game Title + Emoji */}
                        <h3 className="text-xl font-bold leading-snug mb-3 group-hover:text-emerald-400 transition-colors">
                          {game.title} <span className="inline-block ml-1">{game.emoji}</span>
                        </h3>
                      </div>

                      {/* Wishlist Heart Button */}
                      <div className="pt-2 flex items-center justify-between">
                        <button
                          onClick={(e) => toggleWishlist(e, game.id)}
                          aria-label="Add to wishlist"
                          className={`p-2 rounded-lg transition-colors ${isWishlisted
                              ? "text-rose-500 bg-rose-500/10"
                              : darkMode
                                ? "text-gray-400 hover:text-white hover:bg-white/10"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                        >
                          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                        </button>

                        <span className="text-xs opacity-0 group-hover:opacity-60 transition-opacity">
                          Details anzeigen →
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* --- GAME DETAIL MODAL --- */}
      {selectedGame && (
        <div
          onClick={() => setSelectedGame(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl ${darkMode ? "bg-[#202020] text-white" : "bg-white text-gray-900"
              }`}
          >
            <div className="relative h-64 sm:h-80">
              <img
                src={selectedGame.image}
                alt={selectedGame.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedGame(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <PlatformIcons platforms={selectedGame.platforms} darkMode={darkMode} />
                <div className="flex items-center gap-3">
                  <span className="text-xs opacity-70 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedGame.released}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-sm font-bold rounded border ${getMetacriticColor(
                      selectedGame.metacritic
                    )}`}
                  >
                    Metacritic: {selectedGame.metacritic}
                  </span>
                </div>
              </div>

              <h2 className="text-3xl font-extrabold mb-3">
                {selectedGame.title} {selectedGame.emoji}
              </h2>

              <p className={`text-sm leading-relaxed mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {selectedGame.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6 pt-4 border-t border-gray-500/20">
                <div>
                  <span className="block text-xs opacity-60 mb-1">Publisher</span>
                  <span className="font-semibold">{selectedGame.publisher}</span>
                </div>
                <div>
                  <span className="block text-xs opacity-60 mb-1">Genres</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGame.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2 py-0.5 text-xs rounded bg-emerald-500/15 text-emerald-400 capitalize"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={(e) => toggleWishlist(e, selectedGame.id)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors ${wishlist.includes(selectedGame.id)
                      ? "bg-rose-500 text-white"
                      : darkMode
                        ? "bg-white/10 hover:bg-white/20"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  <Heart
                    className={`w-4 h-4 ${wishlist.includes(selectedGame.id) ? "fill-current" : ""
                      }`}
                  />
                  {wishlist.includes(selectedGame.id)
                    ? "Auf der Wishlist"
                    : "Zur Wishlist hinzufügen"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}