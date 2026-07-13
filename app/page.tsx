"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, supabaseConfigurationReady } from "../lib/supabase";

type Screen = "home" | "favorites" | "sell" | "bids" | "profile" | "detail" | "notifications" | "myListings";
type AuctionStatus = "active" | "ended";
type Condition = "Sıfır" | "Çok iyi" | "İyi" | "Orta";

type Auction = {
  id: string;
  title: string;
  category: string;
  image: string;
  currentBid: number;
  startingBid: number;
  bidCount: number;
  endsAt: string;
  city: string;
  seller: string;
  sellerId: string;
  verified: boolean;
  condition: Condition;
  description: string;
  minIncrement: number;
  reservePrice: number;
  favorite?: boolean;
  shipping: string;
  paymentHold: boolean;
  createdAt: string;
};

type Bid = {
  id: string;
  auctionId: string;
  userId: string;
  userName: string;
  amount: number;
  createdAt: string;
};

type Notice = {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  read: boolean;
  auctionId?: string;
};

type StoredState = {
  auctions: Auction[];
  bids: Bid[];
  notices: Notice[];
};

type AppUser = { id: string; name: string; initials: string; city: string; email?: string };

const DEMO_USER: AppUser = { id: "user-kemal", name: "Kemal Akar", initials: "KA", city: "İzmir", email: "demo@acikpazar.local" };
const money = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const seedAuctions: Auction[] = [
  {
    id: "1",
    title: "PlayStation 5 Slim + 2 Kol",
    category: "Oyun",
    image: "/products/ps5.svg",
    currentBid: 18500,
    startingBid: 14000,
    bidCount: 27,
    endsAt: new Date(Date.now() + 1000 * 60 * 48).toISOString(),
    city: "İzmir",
    seller: "Mert K.",
    sellerId: "seller-mert",
    verified: true,
    condition: "Çok iyi",
    description: "Kutu ve faturası mevcut. Cihaz sorunsuz, iki kol ile birlikte gönderilecektir. Kozmetik olarak temizdir.",
    minIncrement: 250,
    reservePrice: 18000,
    favorite: true,
    shipping: "Param Güvende Kargo",
    paymentHold: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: "2",
    title: "MacBook Air M2 256 GB",
    category: "Bilgisayar",
    image: "/products/macbook.svg",
    currentBid: 28750,
    startingBid: 24000,
    bidCount: 41,
    endsAt: new Date(Date.now() + 1000 * 60 * 130).toISOString(),
    city: "İstanbul",
    seller: "Selin A.",
    sellerId: "seller-selin",
    verified: true,
    condition: "İyi",
    description: "Pil sağlığı %91. Kozmetik olarak ufak kullanım izleri vardır. Şarj adaptörü ve kutusu dahildir.",
    minIncrement: 500,
    reservePrice: 30000,
    shipping: "Ücretsiz kargo",
    paymentHold: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
  },
  {
    id: "3",
    title: "iPhone 15 Pro 256 GB",
    category: "Telefon",
    image: "/products/iphone.svg",
    currentBid: 46250,
    startingBid: 40000,
    bidCount: 65,
    endsAt: new Date(Date.now() + 1000 * 60 * 310).toISOString(),
    city: "Ankara",
    seller: "Burak T.",
    sellerId: "seller-burak",
    verified: true,
    condition: "Çok iyi",
    description: "Türkiye cihazı, garantisi devam ediyor. Ekran ve kasa temiz. Pil sağlığı %96, kutu ve kablo mevcut.",
    minIncrement: 500,
    reservePrice: 45000,
    shipping: "Param Güvende Kargo",
    paymentHold: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "4",
    title: "Gaming Masaüstü RTX 4070",
    category: "Bilgisayar",
    image: "/products/pc.svg",
    currentBid: 39900,
    startingBid: 33000,
    bidCount: 19,
    endsAt: new Date(Date.now() + 1000 * 60 * 720).toISOString(),
    city: "Bursa",
    seller: "Efe D.",
    sellerId: "seller-efe",
    verified: false,
    condition: "İyi",
    description: "RTX 4070, Ryzen 7, 32 GB RAM ve 1 TB NVMe SSD. Sıcaklık ve performans testleri yapılmıştır.",
    minIncrement: 500,
    reservePrice: 42000,
    shipping: "Satıcı ödemeli kargo",
    paymentHold: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
  {
    id: "5",
    title: "Nintendo Switch OLED",
    category: "Oyun",
    image: "/products/switch.svg",
    currentBid: 9250,
    startingBid: 7000,
    bidCount: 16,
    endsAt: new Date(Date.now() + 1000 * 60 * 95).toISOString(),
    city: "Antalya",
    seller: "Duru S.",
    sellerId: "seller-duru",
    verified: true,
    condition: "Çok iyi",
    description: "Beyaz OLED model. Ekran koruyucu ilk günden beri takılı. Tüm aksesuarları ve kutusu mevcut.",
    minIncrement: 250,
    reservePrice: 10000,
    shipping: "Param Güvende Kargo",
    paymentHold: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "6",
    title: "Dyson V15 Detect Absolute",
    category: "Ev & Yaşam",
    image: "/products/dyson.svg",
    currentBid: 14750,
    startingBid: 11000,
    bidCount: 23,
    endsAt: new Date(Date.now() + 1000 * 60 * 580).toISOString(),
    city: "İzmir",
    seller: "Ayşe Y.",
    sellerId: "seller-ayse",
    verified: true,
    condition: "İyi",
    description: "Tüm başlıkları tamdır. Filtreleri temizlendi, batarya performansı iyi durumdadır.",
    minIncrement: 250,
    reservePrice: 15500,
    shipping: "Ücretsiz kargo",
    paymentHold: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
  },
];

const seedBids: Bid[] = [
  { id: "1", auctionId: "1", userId: "user-a", userName: "A*** K.", amount: 18000, createdAt: new Date(Date.now() - 1000 * 60 * 11).toISOString() },
  { id: "2", auctionId: "1", userId: DEMO_USER.id, userName: DEMO_USER.name, amount: 18250, createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString() },
  { id: "3", auctionId: "1", userId: "user-b", userName: "S*** D.", amount: 18500, createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: "4", auctionId: "3", userId: DEMO_USER.id, userName: DEMO_USER.name, amount: 45500, createdAt: new Date(Date.now() - 1000 * 60 * 31).toISOString() },
  { id: "5", auctionId: "3", userId: "user-c", userName: "T*** E.", amount: 46250, createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
];

const seedNotices: Notice[] = [
  { id: "1", title: "Teklifin geçildi", text: "PlayStation 5 Slim ilanında daha yüksek teklif verildi.", createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), read: false, auctionId: "1" },
  { id: "2", title: "Favorindeki ilan bitiyor", text: "PlayStation 5 Slim açık artırması bir saatten kısa sürede sona erecek.", createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), read: false, auctionId: "1" },
  { id: "3", title: "Hesabın doğrulandı", text: "Kimlik doğrulaman tamamlandı. Artık teklif verebilir ve ilan açabilirsin.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), read: true },
];

function remaining(iso: string, now: number) {
  const diff = Math.max(0, new Date(iso).getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1000);
  if (days > 0) return `${days}g ${hours}sa`;
  if (hours > 0) return `${hours}sa ${mins}dk`;
  return `${mins}dk ${secs.toString().padStart(2, "0")}sn`;
}

function isEnded(auction: Auction, now: number) {
  return new Date(auction.endsAt).getTime() <= now;
}

function safeRead(): StoredState {
  if (typeof window === "undefined") return { auctions: seedAuctions, bids: seedBids, notices: seedNotices };
  const raw = window.localStorage.getItem("acikpazar-v2");
  if (!raw) return { auctions: seedAuctions, bids: seedBids, notices: seedNotices };
  try {
    const parsed = JSON.parse(raw) as StoredState;
    if (!Array.isArray(parsed.auctions) || !Array.isArray(parsed.bids) || !Array.isArray(parsed.notices)) throw new Error("invalid");
    return parsed;
  } catch {
    window.localStorage.removeItem("acikpazar-v2");
    return { auctions: seedAuctions, bids: seedBids, notices: seedNotices };
  }
}

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase("tr"))
    .join("") || "AP";
}

function fallbackImage(category: string) {
  if (category === "Telefon") return "/products/iphone.svg";
  if (category === "Bilgisayar") return "/products/macbook.svg";
  if (category === "Oyun") return "/products/ps5.svg";
  return "/products/dyson.svg";
}

function dataUrlToBlob(dataUrl: string) {
  const [header, payload] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);base64/)?.[1] ?? "image/jpeg";
  const bytes = atob(payload);
  const buffer = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index += 1) buffer[index] = bytes.charCodeAt(index);
  return new Blob([buffer], { type: mime });
}

export default function Home() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const liveMode = Boolean(supabase);
  const [screen, setScreen] = useState<Screen>("home");
  const [auctions, setAuctions] = useState<Auction[]>(liveMode ? [] : seedAuctions);
  const [bids, setBids] = useState<Bid[]>(liveMode ? [] : seedBids);
  const [notices, setNotices] = useState<Notice[]>(liveMode ? [] : seedNotices);
  const [selectedId, setSelectedId] = useState(liveMode ? "" : "1");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [sort, setSort] = useState("Bitenler");
  const [now, setNow] = useState(Date.now());
  const [toast, setToast] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [authReady, setAuthReady] = useState(!liveMode);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser>(DEMO_USER);
  const [remoteLoading, setRemoteLoading] = useState(liveMode);

  const loadRemoteData = useCallback(async (user: User) => {
    if (!supabase) return;
    setRemoteLoading(true);

    const [profileResult, auctionsResult, bidsResult, favoritesResult, noticesResult] = await Promise.all([
      supabase.from("profiles").select("id,full_name,city").eq("id", user.id).maybeSingle(),
      supabase
        .from("auctions")
        .select("id,title,category,description,condition,starting_bid,current_bid,reserve_price,min_increment,ends_at,status,city,shipping_method,payment_hold,seller_id,bid_count,created_at,seller:profiles!auctions_seller_id_fkey(full_name,identity_verified),auction_images(storage_path,sort_order)")
        .order("created_at", { ascending: false }),
      supabase
        .from("bids")
        .select("id,auction_id,bidder_id,amount,created_at,bidder:profiles!bids_bidder_id_fkey(full_name)")
        .order("amount", { ascending: false }),
      supabase.from("favorites").select("auction_id").eq("user_id", user.id),
      supabase.from("notifications").select("id,auction_id,title,body,read_at,created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);

    const firstError = [profileResult.error, auctionsResult.error, bidsResult.error, favoritesResult.error, noticesResult.error].find(Boolean);
    if (firstError) {
      setToast(`Supabase hatası: ${firstError.message}`);
      setRemoteLoading(false);
      return;
    }

    const profile = profileResult.data;
    const fullName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Kullanıcı";
    setCurrentUser({
      id: user.id,
      name: fullName,
      initials: initialsFromName(fullName),
      city: profile?.city || "İzmir",
      email: user.email,
    });

    const favoriteIds = new Set((favoritesResult.data ?? []).map((item: { auction_id: string }) => item.auction_id));
    const mappedAuctions: Auction[] = (auctionsResult.data ?? []).map((row: any) => {
      const seller = Array.isArray(row.seller) ? row.seller[0] : row.seller;
      const images = [...(row.auction_images ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order);
      const storagePath = images[0]?.storage_path;
      const image = storagePath
        ? supabase.storage.from("auction-images").getPublicUrl(storagePath).data.publicUrl
        : fallbackImage(row.category);
      return {
        id: row.id,
        title: row.title,
        category: row.category,
        image,
        currentBid: Number(row.current_bid),
        startingBid: Number(row.starting_bid),
        bidCount: Number(row.bid_count),
        endsAt: row.ends_at,
        city: row.city,
        seller: seller?.full_name || "AçıkPazar kullanıcısı",
        sellerId: row.seller_id,
        verified: Boolean(seller?.identity_verified),
        condition: row.condition as Condition,
        description: row.description,
        minIncrement: Number(row.min_increment),
        reservePrice: Number(row.reserve_price),
        favorite: favoriteIds.has(row.id),
        shipping: row.shipping_method,
        paymentHold: Boolean(row.payment_hold),
        createdAt: row.created_at,
      };
    });

    const mappedBids: Bid[] = (bidsResult.data ?? []).map((row: any) => {
      const bidder = Array.isArray(row.bidder) ? row.bidder[0] : row.bidder;
      return {
        id: row.id,
        auctionId: row.auction_id,
        userId: row.bidder_id,
        userName: bidder?.full_name || "Kullanıcı",
        amount: Number(row.amount),
        createdAt: row.created_at,
      };
    });

    const mappedNotices: Notice[] = (noticesResult.data ?? []).map((row: any) => ({
      id: row.id,
      auctionId: row.auction_id || undefined,
      title: row.title,
      text: row.body,
      createdAt: row.created_at,
      read: Boolean(row.read_at),
    }));

    setAuctions(mappedAuctions);
    setBids(mappedBids);
    setNotices(mappedNotices);
    setSelectedId((previous) => previous || mappedAuctions[0]?.id || "");
    setRemoteLoading(false);
    setHydrated(true);
  }, [supabase]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    if (!supabase) {
      const stored = safeRead();
      setAuctions(stored.auctions);
      setBids(stored.bids);
      setNotices(stored.notices);
      setHydrated(true);
      return () => window.clearInterval(interval);
    }

    supabase.auth.getSession().then(({ data }) => {
      setAuthUser(data.session?.user ?? null);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => {
      window.clearInterval(interval);
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (supabase && authUser) loadRemoteData(authUser);
  }, [authUser, loadRemoteData, supabase]);

  useEffect(() => {
    if (!supabase || !authUser) return;
    const channel = supabase
      .channel(`acikpazar-${authUser.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "auctions" }, () => loadRemoteData(authUser))
      .on("postgres_changes", { event: "*", schema: "public", table: "bids" }, () => loadRemoteData(authUser))
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${authUser.id}` }, () => loadRemoteData(authUser))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [authUser, loadRemoteData, supabase]);

  useEffect(() => {
    if (!hydrated || supabase) return;
    window.localStorage.setItem("acikpazar-v2", JSON.stringify({ auctions, bids, notices }));
  }, [auctions, bids, notices, hydrated, supabase]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const categories = ["Tümü", "Telefon", "Bilgisayar", "Oyun", "Ev & Yaşam"];

  const filtered = useMemo(() => {
    const list = auctions.filter((auction) => {
      const normalized = `${auction.title} ${auction.category} ${auction.city}`.toLocaleLowerCase("tr");
      const matchesQuery = normalized.includes(query.toLocaleLowerCase("tr"));
      const matchesCategory = category === "Tümü" || auction.category === category;
      return matchesQuery && matchesCategory;
    });
    return [...list].sort((a, b) => {
      if (sort === "Yeni") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "Fiyat düşük") return a.currentBid - b.currentBid;
      if (sort === "Fiyat yüksek") return b.currentBid - a.currentBid;
      return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
    });
  }, [auctions, category, query, sort]);

  const selected = auctions.find((auction) => auction.id === selectedId) ?? auctions[0];
  const selectedBids = bids.filter((bid) => bid.auctionId === selected?.id).sort((a, b) => b.amount - a.amount);
  const unreadCount = notices.filter((notice) => !notice.read).length;

  function navigate(next: Screen) {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openAuction(id: string) {
    setSelectedId(id);
    navigate("detail");
  }

  async function toggleFavorite(id: string) {
    const auction = auctions.find((item) => item.id === id);
    if (!auction) return;
    setAuctions((items) => items.map((item) => item.id === id ? { ...item, favorite: !item.favorite } : item));
    if (!supabase || !authUser) return;

    const result = auction.favorite
      ? await supabase.from("favorites").delete().eq("user_id", authUser.id).eq("auction_id", id)
      : await supabase.from("favorites").insert({ user_id: authUser.id, auction_id: id });
    if (result.error) {
      setToast(`Favori kaydedilemedi: ${result.error.message}`);
      await loadRemoteData(authUser);
    }
  }

  function addNotice(title: string, text: string, auctionId?: string) {
    setNotices((items) => [{ id: String(Date.now()), title, text, createdAt: new Date().toISOString(), read: false, auctionId }, ...items]);
  }

  async function placeBid(id: string, amount: number) {
    const auction = auctions.find((item) => item.id === id);
    if (!auction) return;
    if (isEnded(auction, now)) return setToast("Bu açık artırma sona erdi.");
    if (auction.sellerId === currentUser.id) return setToast("Kendi ilanına teklif veremezsin.");
    const minimum = auction.currentBid + auction.minIncrement;
    if (!Number.isFinite(amount) || amount < minimum) return setToast(`En az ${money.format(minimum)} teklif vermelisin.`);

    if (supabase && authUser) {
      const { error } = await supabase.rpc("place_bid", { p_auction_id: id, p_amount: amount });
      if (error) return setToast(`Teklif alınamadı: ${error.message}`);
      setToast("Teklifin başarıyla alındı.");
      await loadRemoteData(authUser);
      return;
    }

    const remainingMs = new Date(auction.endsAt).getTime() - now;
    const extended = remainingMs <= 120_000;
    const updatedEnd = extended ? new Date(now + 120_000).toISOString() : auction.endsAt;
    const newBid: Bid = { id: String(Date.now()), auctionId: id, userId: currentUser.id, userName: currentUser.name, amount, createdAt: new Date().toISOString() };
    setBids((items) => [newBid, ...items]);
    setAuctions((items) => items.map((item) => item.id === id ? { ...item, currentBid: amount, bidCount: item.bidCount + 1, endsAt: updatedEnd } : item));
    addNotice("Teklifin alındı", `${auction.title} için ${money.format(amount)} teklif verdin.`, id);
    setToast(extended ? "Teklif alındı. Son dakika kuralıyla süre 2 dakika uzadı." : "Teklifin başarıyla alındı.");
  }

  async function createAuction(data: Omit<Auction, "id" | "bidCount" | "favorite" | "createdAt">) {
    if (supabase && authUser) {
      const { data: created, error } = await supabase
        .from("auctions")
        .insert({
          seller_id: authUser.id,
          title: data.title,
          category: data.category,
          description: data.description,
          condition: data.condition,
          starting_bid: data.startingBid,
          current_bid: data.startingBid,
          reserve_price: data.reservePrice,
          min_increment: data.minIncrement,
          ends_at: data.endsAt,
          status: "active",
          city: data.city,
          shipping_method: data.shipping,
          payment_hold: data.paymentHold,
        })
        .select("id")
        .single();
      if (error || !created) return setToast(`İlan oluşturulamadı: ${error?.message ?? "Bilinmeyen hata"}`);

      if (data.image.startsWith("data:")) {
        const blob = dataUrlToBlob(data.image);
        const extension = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
        const path = `${authUser.id}/${created.id}/${Date.now()}.${extension}`;
        const upload = await supabase.storage.from("auction-images").upload(path, blob, { contentType: blob.type, upsert: false });
        if (!upload.error) {
          await supabase.from("auction_images").insert({ auction_id: created.id, storage_path: path, sort_order: 0 });
        } else {
          setToast(`İlan oluştu fakat fotoğraf yüklenemedi: ${upload.error.message}`);
        }
      }

      await loadRemoteData(authUser);
      setSelectedId(created.id);
      navigate("detail");
      setToast("İlanın Supabase üzerinde yayınlandı.");
      return;
    }

    const id = String(Math.max(...auctions.map((item) => Number(item.id) || 0), 0) + 1);
    const newAuction: Auction = { ...data, id, bidCount: 0, favorite: false, createdAt: new Date().toISOString() };
    setAuctions((items) => [newAuction, ...items]);
    setSelectedId(id);
    addNotice("İlanın yayında", `${newAuction.title} açık artırması başladı.`, id);
    navigate("detail");
    setToast("İlanın başarıyla yayınlandı.");
  }

  async function openNotifications() {
    navigate("notifications");
    setNotices((items) => items.map((notice) => ({ ...notice, read: true })));
    if (supabase && authUser) {
      await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", authUser.id).is("read_at", null);
    }
  }

  function resetDemo() {
    if (supabase) return;
    setAuctions(seedAuctions);
    setBids(seedBids);
    setNotices(seedNotices);
    window.localStorage.removeItem("acikpazar-v2");
    navigate("home");
    setToast("Demo verileri sıfırlandı.");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuctions([]);
    setBids([]);
    setNotices([]);
    setCurrentUser(DEMO_USER);
    navigate("home");
  }

  if (!authReady) return <LoadingScreen text="Supabase oturumu kontrol ediliyor…" />;
  if (supabase && !authUser) return <AuthGate />;

  return (
    <main className="app-shell">
      {screen !== "detail" && (
        <header className="topbar">
          <button className="brand" onClick={() => navigate("home")} aria-label="Ana sayfa">
            <span className="brand-mark">A</span>
            <span><strong>AçıkPazar</strong><small>Teklif ver, değerini bul</small></span>
          </button>
          <div className="topbar-actions">
            <span className={liveMode ? "demo-pill live" : "demo-pill"}>● {liveMode ? "SUPABASE CANLI" : "DEMO"}</span>
            <button className="icon-button" onClick={openNotifications} aria-label="Bildirimler">🔔{unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}</button>
          </div>
        </header>
      )}

      {remoteLoading && liveMode && <div className="sync-banner">Supabase verileri eşitleniyor…</div>}

      {screen === "home" && (
        <section className="page">
          <div className="hero">
            <div>
              <span className="eyebrow">CANLI AÇIK ARTIRMALAR</span>
              <h1>İkinci el ürünün<br />gerçek değerini bul.</h1>
              <p>Doğrulanmış kullanıcılar, korumalı ödeme ve zamanlı teklifler.</p>
              <button className="hero-cta" onClick={() => navigate("sell")}>Ürününü açık artırmaya çıkar <span>→</span></button>
            </div>
            <div className="hero-metric"><strong>{liveMode ? auctions.length : "₺2,4M"}</strong><span>{liveMode ? "Veritabanındaki canlı ilan" : "Bu hafta verilen teklif"}</span><small>{liveMode ? "Supabase bağlı" : "↗ %18 büyüme"}</small></div>
          </div>

          <div className="toolbar">
            <label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Telefon, bilgisayar, konsol ara" /></label>
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sıralama">
              <option>Bitenler</option><option>Yeni</option><option>Fiyat düşük</option><option>Fiyat yüksek</option>
            </select>
          </div>

          <div className="chips" aria-label="Kategoriler">
            {categories.map((item) => <button key={item} className={category === item ? "chip active" : "chip"} onClick={() => setCategory(item)}>{item}</button>)}
          </div>

          <div className="safety-banner"><span>🛡️</span><div><strong>Alıcı koruması aktif</strong><small>Ödeme, ürün sana ulaşana kadar güvenli hesapta tutulur.</small></div><b>Detaylar ›</b></div>

          <div className="section-heading"><div><span className="live-dot" /> <strong>Canlı ilanlar</strong></div><span>{filtered.length} ilan</span></div>
          <AuctionGrid auctions={filtered} now={now} onOpen={openAuction} onFavorite={toggleFavorite} empty={liveMode ? <EmptyState icon="＋" title="Henüz canlı ilan yok" text="İlan Ver düğmesinden Supabase üzerindeki ilk açık artırmanı oluştur." /> : undefined} />
        </section>
      )}

      {screen === "favorites" && (
        <section className="page">
          <ScreenTitle title="Favorilerim" text="Takip ettiğin açık artırmalar" />
          <AuctionGrid auctions={auctions.filter((item) => item.favorite)} now={now} onOpen={openAuction} onFavorite={toggleFavorite} empty={<EmptyState icon="♡" title="Henüz favorin yok" text="Takip etmek istediğin ilanlardaki kalp simgesine dokun." />} />
        </section>
      )}

      {screen === "sell" && <SellForm currentUser={currentUser} onCreate={createAuction} onCancel={() => navigate("home")} />}
      {screen === "bids" && <BidsScreen currentUser={currentUser} bids={bids} auctions={auctions} now={now} onOpen={openAuction} />}
      {screen === "profile" && <Profile currentUser={currentUser} liveMode={liveMode} onListings={() => navigate("myListings")} onBids={() => navigate("bids")} onReset={resetDemo} onSignOut={signOut} />}
      {screen === "myListings" && <MyListings auctions={auctions.filter((auction) => auction.sellerId === currentUser.id)} now={now} onOpen={openAuction} />}
      {screen === "notifications" && <Notifications notices={notices} onOpen={(id) => id ? openAuction(id) : undefined} />}

      {screen === "detail" && selected && (
        <AuctionDetail currentUser={currentUser} auction={selected} bids={selectedBids} now={now} onBack={() => navigate("home")} onFavorite={() => toggleFavorite(selected.id)} onBid={(amount) => placeBid(selected.id, amount)} />
      )}

      {screen !== "detail" && screen !== "notifications" && screen !== "myListings" && (
        <nav className="bottom-nav">
          <NavButton icon="⌂" label="Ana Sayfa" active={screen === "home"} onClick={() => navigate("home")} />
          <NavButton icon="♡" label="Favoriler" active={screen === "favorites"} onClick={() => navigate("favorites")} />
          <button className="sell-button" onClick={() => navigate("sell")}><span>＋</span>İlan Ver</button>
          <NavButton icon="⇄" label="Teklifler" active={screen === "bids"} onClick={() => navigate("bids")} />
          <NavButton icon="○" label="Profil" active={screen === "profile"} onClick={() => navigate("profile")} />
        </nav>
      )}

      {(screen === "notifications" || screen === "myListings") && <button className="floating-back" onClick={() => navigate("profile")}>← Geri</button>}
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function LoadingScreen({ text }: { text: string }) {
  return <main className="auth-shell"><div className="auth-card"><span className="auth-logo">A</span><h1>AçıkPazar</h1><p>{text}</p><div className="auth-loader" /></div></main>;
}

function AuthGate() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [mode, setMode] = useState<"login" | "register">("register");
  const [fullName, setFullName] = useState("Kemal Akar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) setMessage(error.message);
      else if (!data.session) setMessage("Kayıt oluşturuldu. E-postana gelen doğrulama bağlantısına tıkla, sonra giriş yap.");
      else setMessage("Hesabın oluşturuldu ve giriş yapıldı.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    }
    setBusy(false);
  }

  return (
    <main className="auth-shell">
      <section className="auth-card auth-form-card">
        <span className="auth-logo">A</span>
        <div><span className="eyebrow">SUPABASE BAĞLANDI</span><h1>{mode === "register" ? "İlk hesabını oluştur" : "AçıkPazar’a giriş yap"}</h1><p>Bu hesap, ilanları ve teklifleri gerçek veritabanında saklayacak.</p></div>
        <div className="auth-tabs"><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Kayıt ol</button><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Giriş yap</button></div>
        <form onSubmit={submit}>
          {mode === "register" && <label>Ad soyad<input value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} required /></label>}
          <label>E-posta<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ornek@email.com" required /></label>
          <label>Şifre<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="En az 6 karakter" minLength={6} required /></label>
          <button className="primary-button" disabled={busy}>{busy ? "İşlem yapılıyor…" : mode === "register" ? "Hesabı oluştur" : "Giriş yap"}</button>
        </form>
        {message && <div className="auth-message">{message}</div>}
        <small className="auth-footnote">Bağlantı bilgileri yalnızca bilgisayarındaki <code>.env.local</code> dosyasından okunur.</small>
      </section>
    </main>
  );
}

function AuctionGrid({ auctions, now, onOpen, onFavorite, empty }: { auctions: Auction[]; now: number; onOpen: (id: string) => void; onFavorite: (id: string) => void; empty?: React.ReactNode }) {
  if (auctions.length === 0) return <>{empty ?? <EmptyState icon="⌕" title="İlan bulunamadı" text="Arama veya kategori filtresini değiştirmeyi dene." />}</>;
  return (
    <div className="auction-grid">
      {auctions.map((auction) => {
        const ended = isEnded(auction, now);
        const reserveMet = auction.currentBid >= auction.reservePrice;
        return (
          <article className="auction-card" key={auction.id} onClick={() => onOpen(auction.id)}>
            <div className="visual">
              <span className={ended ? "countdown ended" : "countdown"}>{ended ? "Sona erdi" : `⏱ ${remaining(auction.endsAt, now)}`}</span>
              <button className={auction.favorite ? "favorite active" : "favorite"} onClick={(event) => { event.stopPropagation(); onFavorite(auction.id); }} aria-label="Favoriye ekle">♥</button>
              <img src={auction.image} alt="" />
              <span className={reserveMet ? "reserve-badge met" : "reserve-badge"}>{reserveMet ? "Taban fiyat aşıldı" : "Taban fiyat bekleniyor"}</span>
            </div>
            <div className="card-body">
              <div className="card-meta"><span className="category-label">{auction.category}</span><span>{auction.city}</span></div>
              <h2>{auction.title}</h2>
              <div className="price-row"><div><small>Güncel teklif</small><strong>{money.format(auction.currentBid)}</strong></div><span>{auction.bidCount} teklif</span></div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function AuctionDetail({ currentUser, auction, bids, now, onBack, onFavorite, onBid }: { currentUser: AppUser; auction: Auction; bids: Bid[]; now: number; onBack: () => void; onFavorite: () => void; onBid: (amount: number) => void }) {
  const [amount, setAmount] = useState(auction.currentBid + auction.minIncrement);
  const [tab, setTab] = useState<"detail" | "bids">("detail");
  const ended = isEnded(auction, now);
  const reserveMet = auction.currentBid >= auction.reservePrice;
  useEffect(() => setAmount(auction.currentBid + auction.minIncrement), [auction.currentBid, auction.minIncrement]);

  return (
    <section className="detail-page">
      <div className="detail-actions"><button onClick={onBack}>←</button><button onClick={onFavorite}>{auction.favorite ? "♥" : "♡"}</button></div>
      <div className="detail-visual"><img src={auction.image} alt={auction.title} /><div className={ended ? "detail-timer ended" : "detail-timer"}><small>{ended ? "Durum" : "Kalan süre"}</small><strong>{ended ? "Sona erdi" : remaining(auction.endsAt, now)}</strong></div></div>
      <div className="detail-content">
        <div className="detail-topline"><span className="category-label">{auction.category}</span><span>İlan #{auction.id}</span></div>
        <h1>{auction.title}</h1>
        <div className="seller-row"><span className="avatar">{auction.seller.charAt(0)}</span><div><strong>{auction.seller} {auction.verified && <em>✓</em>}</strong><small>{auction.city} · {auction.verified ? "Kimliği doğrulanmış satıcı" : "Doğrulama bekliyor"}</small></div><span className="condition">{auction.condition}</span></div>

        <div className="bid-summary"><div><small>Güncel teklif</small><strong>{money.format(auction.currentBid)}</strong></div><div><small>Teklif sayısı</small><strong>{auction.bidCount}</strong></div></div>
        <div className={reserveMet ? "reserve-status met" : "reserve-status"}><span>{reserveMet ? "✓" : "○"}</span><div><strong>{reserveMet ? "Gizli taban fiyat aşıldı" : "Gizli taban fiyat henüz aşılmadı"}</strong><small>Satış yalnızca satıcının belirlediği minimum değer aşılırsa tamamlanır.</small></div></div>
        <div className="trust-strip"><span>🛡️ Korumalı ödeme</span><span>📦 {auction.shipping}</span><span>✓ Doğrulanmış ilan</span></div>

        <div className="detail-tabs"><button className={tab === "detail" ? "active" : ""} onClick={() => setTab("detail")}>Ürün detayı</button><button className={tab === "bids" ? "active" : ""} onClick={() => setTab("bids")}>Teklif geçmişi ({bids.length})</button></div>
        {tab === "detail" ? (
          <div className="detail-copy"><p>{auction.description}</p><dl><div><dt>Durum</dt><dd>{auction.condition}</dd></div><div><dt>Konum</dt><dd>{auction.city}</dd></div><div><dt>Başlangıç</dt><dd>{money.format(auction.startingBid)}</dd></div><div><dt>Minimum artış</dt><dd>{money.format(auction.minIncrement)}</dd></div></dl></div>
        ) : (
          <div className="bid-history">{bids.length ? bids.map((bid, index) => <div key={bid.id}><span className="rank">{index + 1}</span><div><strong>{bid.userId === currentUser.id ? "Sen" : bid.userName}</strong><small>{dateTime.format(new Date(bid.createdAt))}</small></div><b>{money.format(bid.amount)}</b></div>) : <p>Henüz teklif verilmedi.</p>}</div>
        )}

        <div className="bid-box">
          <label>Teklif tutarın</label>
          <div className="quick-bids"><button onClick={() => setAmount(auction.currentBid + auction.minIncrement)}>+{money.format(auction.minIncrement)}</button><button onClick={() => setAmount(auction.currentBid + auction.minIncrement * 2)}>+{money.format(auction.minIncrement * 2)}</button><button onClick={() => setAmount(auction.currentBid + auction.minIncrement * 4)}>+{money.format(auction.minIncrement * 4)}</button></div>
          <div className="bid-input"><span>₺</span><input type="number" value={amount} min={auction.currentBid + auction.minIncrement} onChange={(e) => setAmount(Number(e.target.value))} /></div>
          <small>Minimum teklif: {money.format(auction.currentBid + auction.minIncrement)} · Son 2 dakikadaki teklifler süreyi 2 dakika uzatır.</small>
          <button disabled={ended} onClick={() => onBid(amount)}>{ended ? "Açık artırma sona erdi" : "Teklif Ver"}</button>
        </div>
      </div>
    </section>
  );
}

function SellForm({ currentUser, onCreate, onCancel }: { currentUser: AppUser; onCreate: (data: Omit<Auction, "id" | "bidCount" | "favorite" | "createdAt">) => void | Promise<void>; onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Telefon");
  const [price, setPrice] = useState(1000);
  const [reservePrice, setReservePrice] = useState(1500);
  const [minIncrement, setMinIncrement] = useState(100);
  const [hours, setHours] = useState(24);
  const [condition, setCondition] = useState<Condition>("İyi");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState(currentUser.city);
  const [image, setImage] = useState("");

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2_500_000) return alert("Demo sürümünde fotoğraf en fazla 2,5 MB olabilir.");
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const fallback = category === "Telefon" ? "/products/iphone.svg" : category === "Bilgisayar" ? "/products/macbook.svg" : category === "Oyun" ? "/products/ps5.svg" : "/products/dyson.svg";
    onCreate({
      title: title.trim() || "Yeni açık artırma ilanı",
      category,
      image: image || fallback,
      currentBid: price,
      startingBid: price,
      endsAt: new Date(Date.now() + hours * 3_600_000).toISOString(),
      city,
      seller: currentUser.name,
      sellerId: currentUser.id,
      verified: true,
      condition,
      description: description.trim() || "Ürün açıklaması henüz eklenmedi.",
      minIncrement,
      reservePrice: Math.max(reservePrice, price),
      shipping: "Param Güvende Kargo",
      paymentHold: true,
    });
  }

  return (
    <section className="page form-page">
      <div className="sell-header"><div><button onClick={onCancel}>←</button><span>İlan oluştur</span></div><small>Adım {step}/3</small></div>
      <div className="stepper"><span className="active" /><span className={step >= 2 ? "active" : ""} /><span className={step >= 3 ? "active" : ""} /></div>
      <form className="sell-form" onSubmit={submit}>
        {step === 1 && <>
          <ScreenTitle title="Ürünü tanıtalım" text="Net bilgiler daha fazla ve daha güvenli teklif getirir." />
          <label className={image ? "photo-upload has-photo" : "photo-upload"}>{image ? <img src={image} alt="Yüklenen ürün" /> : <><span>＋</span><strong>Ürün fotoğrafı ekle</strong><small>JPG veya PNG · En fazla 2,5 MB</small></>}<input type="file" accept="image/*" onChange={handlePhoto} /></label>
          <label>İlan başlığı<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn. iPhone 15 Pro 256 GB" required /></label>
          <div className="form-grid"><label>Kategori<select value={category} onChange={(e) => setCategory(e.target.value)}><option>Telefon</option><option>Bilgisayar</option><option>Oyun</option><option>Ev & Yaşam</option></select></label><label>Ürün durumu<select value={condition} onChange={(e) => setCondition(e.target.value as Condition)}><option>Sıfır</option><option>Çok iyi</option><option>İyi</option><option>Orta</option></select></label></div>
          <label>Açıklama<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Kutu, garanti, kullanım süresi ve varsa kusurları yaz..." rows={5} required /></label>
        </>}
        {step === 2 && <>
          <ScreenTitle title="Açık artırma kuralları" text="Başlangıç, gizli taban fiyat ve teklif artışını belirle." />
          <div className="form-grid"><label>Başlangıç fiyatı<input type="number" min="1" value={price} onChange={(e) => setPrice(Number(e.target.value))} /></label><label>Gizli taban fiyat<input type="number" min={price} value={reservePrice} onChange={(e) => setReservePrice(Number(e.target.value))} /></label></div>
          <div className="form-grid"><label>Minimum teklif artışı<select value={minIncrement} onChange={(e) => setMinIncrement(Number(e.target.value))}><option value="50">₺50</option><option value="100">₺100</option><option value="250">₺250</option><option value="500">₺500</option><option value="1000">₺1.000</option></select></label><label>Süre<select value={hours} onChange={(e) => setHours(Number(e.target.value))}><option value="6">6 saat</option><option value="24">24 saat</option><option value="72">3 gün</option><option value="168">7 gün</option></select></label></div>
          <div className="rule-card"><span>⏱</span><div><strong>Son dakika koruması</strong><p>Son 2 dakikada teklif gelirse açık artırma otomatik olarak 2 dakika uzar.</p></div></div>
          <div className="rule-card"><span>🔒</span><div><strong>Gizli taban fiyat</strong><p>Alıcılar rakamı görmez; yalnızca taban fiyatın aşılıp aşılmadığını görür.</p></div></div>
        </>}
        {step === 3 && <>
          <ScreenTitle title="Teslimat ve ön izleme" text="İlanını son kez kontrol edip yayınla." />
          <label>Ürün konumu<input value={city} onChange={(e) => setCity(e.target.value)} /></label>
          <div className="preview-card"><img src={image || (category === "Telefon" ? "/products/iphone.svg" : category === "Bilgisayar" ? "/products/macbook.svg" : category === "Oyun" ? "/products/ps5.svg" : "/products/dyson.svg")} alt="" /><div><span className="category-label">{category}</span><h3>{title || "İlan başlığı"}</h3><small>Başlangıç</small><strong>{money.format(price)}</strong></div></div>
          <div className="summary-list"><div><span>Gizli taban fiyat</span><strong>{money.format(Math.max(reservePrice, price))}</strong></div><div><span>Minimum artış</span><strong>{money.format(minIncrement)}</strong></div><div><span>Açık artırma süresi</span><strong>{hours < 24 ? `${hours} saat` : `${hours / 24} gün`}</strong></div><div><span>Ödeme</span><strong>Korumalı hesap</strong></div></div>
          <div className="info-box">Bu demo sürümünde ilan tarayıcının yerel hafızasına kaydedilir. Supabase bağlandığında tüm kullanıcılar ilanı aynı anda görecek.</div>
        </>}
        <div className="form-actions">{step > 1 && <button type="button" className="secondary-button" onClick={() => setStep((value) => value - 1)}>Geri</button>}{step < 3 ? <button type="button" className="primary-button" onClick={() => setStep((value) => value + 1)}>Devam Et</button> : <button className="primary-button" type="submit">İlanı Yayınla</button>}</div>
      </form>
    </section>
  );
}

function BidsScreen({ currentUser, bids, auctions, now, onOpen }: { currentUser: AppUser; bids: Bid[]; auctions: Auction[]; now: number; onOpen: (id: string) => void }) {
  const userBids = bids.filter((bid) => bid.userId === currentUser.id);
  const auctionIds = [...new Set(userBids.map((bid) => bid.auctionId))];
  return (
    <section className="page"><ScreenTitle title="Tekliflerim" text="Katıldığın açık artırmaları tek yerden takip et" />
      <div className="tracking-list">{auctionIds.map((id) => {
        const auction = auctions.find((item) => item.id === id);
        if (!auction) return null;
        const myBid = Math.max(...userBids.filter((bid) => bid.auctionId === id).map((bid) => bid.amount));
        const winning = myBid >= auction.currentBid;
        const ended = isEnded(auction, now);
        return <button key={id} onClick={() => onOpen(id)}><img src={auction.image} alt="" /><div><h3>{auction.title}</h3><small>Senin teklifin: {money.format(myBid)}</small><span>{ended ? "Açık artırma sona erdi" : `${remaining(auction.endsAt, now)} kaldı`}</span></div><b className={winning ? "status winning" : "status outbid"}>{ended ? (winning ? "Kazandın" : "Sonuçlandı") : (winning ? "Öndesin" : "Teklifin geçildi")}</b></button>;
      })}{auctionIds.length === 0 && <EmptyState icon="⇄" title="Henüz teklifin yok" text="Bir açık artırmaya katıldığında burada görünecek." />}</div>
    </section>
  );
}

function Notifications({ notices, onOpen }: { notices: Notice[]; onOpen: (id?: string) => void }) {
  return <section className="page standalone-page"><ScreenTitle title="Bildirimler" text="Açık artırma hareketlerin ve hesap güncellemelerin" /><div className="notice-list">{notices.map((notice) => <button key={notice.id} onClick={() => onOpen(notice.auctionId)}><span>{notice.auctionId ? "🔔" : "✓"}</span><div><strong>{notice.title}</strong><p>{notice.text}</p><small>{dateTime.format(new Date(notice.createdAt))}</small></div><b>›</b></button>)}</div></section>;
}

function MyListings({ auctions, now, onOpen }: { auctions: Auction[]; now: number; onOpen: (id: string) => void }) {
  return <section className="page standalone-page"><ScreenTitle title="İlanlarım" text="Yayındaki ve tamamlanan açık artırmaların" /><div className="tracking-list">{auctions.map((auction) => <button key={auction.id} onClick={() => onOpen(auction.id)}><img src={auction.image} alt="" /><div><h3>{auction.title}</h3><small>{auction.bidCount} teklif · {money.format(auction.currentBid)}</small><span>{isEnded(auction, now) ? "Sona erdi" : `${remaining(auction.endsAt, now)} kaldı`}</span></div><b className="status winning">Yayında</b></button>)}{auctions.length === 0 && <EmptyState icon="◫" title="Henüz ilanın yok" text="İlan Ver düğmesinden ilk açık artırmanı oluştur." />}</div></section>;
}

function Profile({ currentUser, liveMode, onListings, onBids, onReset, onSignOut }: { currentUser: AppUser; liveMode: boolean; onListings: () => void; onBids: () => void; onReset: () => void; onSignOut: () => void | Promise<void> }) {
  return <section className="page"><div className="profile-card"><div className="large-avatar">{currentUser.initials}</div><div><h1>{currentUser.name}</h1><p>{liveMode ? currentUser.email : "Kimlik ve telefon doğrulandı ✓"}</p></div><span className="profile-level">{liveMode ? "Supabase Kullanıcısı" : "Güvenilir Satıcı"}</span></div><div className="stats"><div><strong>{liveMode ? "Canlı" : "4.9"}</strong><small>{liveMode ? "Veritabanı" : "Satıcı puanı"}</small></div><div><strong>{liveMode ? "RLS" : "12"}</strong><small>{liveMode ? "Güvenlik" : "Satış"}</small></div><div><strong>{liveMode ? "Aktif" : "27"}</strong><small>{liveMode ? "Oturum" : "Teklif"}</small></div></div><div className="wallet-card"><div><span>Kullanılabilir bakiye</span><strong>{money.format(liveMode ? 0 : 12450)}</strong></div><button disabled={liveMode}>Bakiyeyi çek</button></div><div className="menu-list"><button onClick={onListings}><span>◫</span>İlanlarım<b>›</b></button><button onClick={onBids}><span>⇄</span>Tekliflerim<b>›</b></button><button><span>₺</span>Ödemelerim<b>›</b></button><button><span>▣</span>Adreslerim<b>›</b></button><button><span>⚙</span>Ayarlar<b>›</b></button><button><span>?</span>Yardım ve destek<b>›</b></button>{liveMode ? <button className="danger-row" onClick={onSignOut}><span>↪</span>Çıkış yap<b>›</b></button> : <button className="danger-row" onClick={onReset}><span>↻</span>Demo verilerini sıfırla<b>›</b></button>}</div></section>;
}

function ScreenTitle({ title, text }: { title: string; text: string }) { return <div className="screen-title"><h1>{title}</h1><p>{text}</p></div>; }
function NavButton({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) { return <button className={active ? "nav-item active" : "nav-item"} onClick={onClick}><span>{icon}</span>{label}</button>; }
function EmptyState({ icon, title, text }: { icon: string; title: string; text: string }) { return <div className="empty-state"><span>{icon}</span><h2>{title}</h2><p>{text}</p></div>; }
