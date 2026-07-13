"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  getSupabaseBrowserClient,
  supabaseConfigurationReady,
} from "../lib/supabase";

import type {
  Screen,
  Condition,
  PaymentStatus,
  ShipmentStatus,
  ModerationStatus,
  DisputeStatus,
  Dispute,
  AutoBid,
  Auction,
  Bid,
  Notice,
  Order,
  Review,
  ChatMessage,
  WalletTransaction,
  VerificationState,
  ReminderKind,
  AuctionReminder,
  Coupon,
  SavedSearch,
  Promotion,
  StoreProfile,
  MembershipTier,
  MembershipState,
  BusinessVerificationStatus,
  BusinessAccount,
  InvoiceRecord,
  AddressRecord,
  ShipmentLabel,
  AuditSeverity,
  AuditLog,
  UserCaseStatus,
  UserCase,
  SystemSettings,
  SystemToggleKey,
  AuctionQuestion,
  AuctionDraft,
  StoredState,
  AppUser
} from "../types/domain";

const DEMO_USER: AppUser = {
  id: "user-kemal",
  name: "Kemal Akar",
  initials: "KA",
  city: "İzmir",
  email: "demo@kapiskapis.local",
};

const seedMembership: MembershipState = {
  tier: "free",
  autoRenew: false,
};

const seedBusinessAccount: BusinessAccount = {
  accountType: "individual",
  companyTitle: "",
  taxNumber: "",
  taxOffice: "",
  mersisNumber: "",
  invoiceEmail: "",
  address: "",
  verificationStatus: "not_started",
};

const seedInvoiceRecords: InvoiceRecord[] = [
  {
    id: "invoice-2026-06",
    period: "Haziran 2026",
    grossSales: 37450,
    commission: 2996,
    vat: 599,
    netPayout: 33855,
    invoiceNo: "AP-2026-000184",
    status: "issued",
    createdAt: "2026-06-30T18:00:00.000Z",
  },
  {
    id: "invoice-2026-05",
    period: "Mayıs 2026",
    grossSales: 28900,
    commission: 2312,
    vat: 462,
    netPayout: 26126,
    invoiceNo: "AP-2026-000127",
    status: "issued",
    createdAt: "2026-05-31T18:00:00.000Z",
  },
  {
    id: "invoice-2026-04",
    period: "Nisan 2026",
    grossSales: 18650,
    commission: 1492,
    vat: 298,
    netPayout: 16860,
    invoiceNo: "AP-2026-000089",
    status: "issued",
    createdAt: "2026-04-30T18:00:00.000Z",
  },
];

const seedAddresses: AddressRecord[] = [
  {
    id: "address-home",
    label: "Ev",
    fullName: "Kemal Akar",
    phone: "+90 532 000 00 38",
    city: "İzmir",
    district: "Karşıyaka",
    neighborhood: "Bostanlı Mah.",
    addressLine: "1810 Sok. No:12 D:4",
    postalCode: "35590",
    isDefault: true,
    isBilling: true,
  },
  {
    id: "address-work",
    label: "İş",
    fullName: "Kemal Akar",
    phone: "+90 532 000 00 38",
    city: "İzmir",
    district: "Bayraklı",
    neighborhood: "Mansuroğlu Mah.",
    addressLine: "Ankara Cad. No:81 Kat:3",
    postalCode: "35535",
    isDefault: false,
    isBilling: false,
  },
];

const seedShipmentLabels: ShipmentLabel[] = [
  {
    id: "label-order-2",
    orderId: "order-2",
    carrier: "MNG Kargo",
    trackingNumber: "AP260713890",
    packageType: "medium",
    desi: 3,
    price: 119,
    estimatedDelivery: "1-2 iş günü",
    status: "created",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

const seedAuditLogs: AuditLog[] = [
  {
    id: "audit-1",
    actor: "Otomatik Risk Motoru",
    action: "Yüksek riskli teklif işaretlendi",
    target: "PlayStation 5 Slim + 2 Kol",
    details: "Yeni hesap kısa sürede 6 ardışık teklif verdi.",
    severity: "critical",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "audit-2",
    actor: "Kemal Akar",
    action: "İlan onaylandı",
    target: "MacBook Air M2 256 GB",
    details: "Fotoğraf ve açıklama kontrolleri tamamlandı.",
    severity: "info",
    createdAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
  },
  {
    id: "audit-3",
    actor: "Ödeme Sistemi",
    action: "Ödeme incelemeye alındı",
    target: "Sipariş AP-24018",
    details: "Kart sahibi ve hesap sahibi adı eşleşmiyor.",
    severity: "warning",
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
  },
];

const seedUserCases: UserCase[] = [
  {
    id: "case-1",
    userId: "seller-mert",
    userName: "Mert K.",
    reason: "Ürün açıklamasıyla görseller uyuşmuyor",
    source: "Alıcı şikâyeti",
    riskScore: 74,
    status: "open",
    blocked: false,
    notes: "Satıcıdan ek seri numarası fotoğrafı istenecek.",
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "case-2",
    userId: "seller-zeynep",
    userName: "Zeynep A.",
    reason: "Platform dışı ödeme talebi",
    source: "Mesaj güvenlik filtresi",
    riskScore: 92,
    status: "reviewing",
    blocked: true,
    notes: "Hesap geçici olarak işlem yapamaz durumda.",
    createdAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
  },
  {
    id: "case-3",
    userId: "buyer-deniz",
    userName: "Deniz T.",
    reason: "Teklif verip ödeme yapmama",
    source: "Sipariş otomasyonu",
    riskScore: 48,
    status: "resolved",
    blocked: false,
    notes: "Kullanıcı uyarıldı ve teklif limiti düşürüldü.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];

const seedSystemSettings: SystemSettings = {
  maintenanceMode: false,
  newListingsEnabled: true,
  paymentsEnabled: true,
  autoModeration: true,
  lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
};

const membershipMeta: Record<MembershipTier, {
  name: string;
  price: number;
  commission: number;
  color: string;
  benefits: string[];
}> = {
  free: {
    name: "Başlangıç",
    price: 0,
    commission: 8,
    color: "Gri",
    benefits: [
      "Ayda 5 aktif ilan",
      "Standart mağaza vitrini",
      "Temel satıcı analizi",
      "%8 satış hizmet bedeli",
    ],
  },
  plus: {
    name: "KapışKapış Plus",
    price: 249,
    commission: 5,
    color: "Turuncu",
    benefits: [
      "Ayda 25 aktif ilan",
      "3 ücretsiz öne çıkarma",
      "Gelişmiş satıcı analizi",
      "Takipçilere özel kampanya",
      "%5 satış hizmet bedeli",
    ],
  },
  pro: {
    name: "KapışKapış Pro",
    price: 599,
    commission: 3,
    color: "Mor",
    benefits: [
      "Sınırsız aktif ilan",
      "Ayda 10 ücretsiz öne çıkarma",
      "Premium mağaza tasarımı",
      "Öncelikli destek ve itiraz",
      "Detaylı performans raporları",
      "%3 satış hizmet bedeli",
    ],
  },
};
const money = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});
const dateTime = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

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
    description:
      "Kutu ve faturası mevcut. Cihaz sorunsuz, iki kol ile birlikte gönderilecektir. Kozmetik olarak temizdir.",
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
    description:
      "Pil sağlığı %91. Kozmetik olarak ufak kullanım izleri vardır. Şarj adaptörü ve kutusu dahildir.",
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
    description:
      "Türkiye cihazı, garantisi devam ediyor. Ekran ve kasa temiz. Pil sağlığı %96, kutu ve kablo mevcut.",
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
    description:
      "RTX 4070, Ryzen 7, 32 GB RAM ve 1 TB NVMe SSD. Sıcaklık ve performans testleri yapılmıştır.",
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
    description:
      "Beyaz OLED model. Ekran koruyucu ilk günden beri takılı. Tüm aksesuarları ve kutusu mevcut.",
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
    description:
      "Tüm başlıkları tamdır. Filtreleri temizlendi, batarya performansı iyi durumdadır.",
    minIncrement: 250,
    reservePrice: 15500,
    shipping: "Ücretsiz kargo",
    paymentHold: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
  },
  {
    id: "7",
    title: "PlayStation Portal Remote Player",
    category: "Oyun",
    image: "/products/ps5.svg",
    currentBid: 12800,
    startingBid: 9000,
    bidCount: 34,
    endsAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    city: "İstanbul",
    seller: "Cem A.",
    sellerId: "seller-cem",
    verified: true,
    condition: "Çok iyi",
    description:
      "Faturalı, kutulu ve çok temiz. Açık artırmayı kazanan alıcı için korumalı ödeme başlatıldı.",
    minIncrement: 250,
    reservePrice: 12000,
    shipping: "Param Güvende Kargo",
    paymentHold: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 75).toISOString(),
  },
  {
    id: "8",
    title: "Nintendo Switch Lite Turkuaz",
    category: "Oyun",
    image: "/products/switch.svg",
    currentBid: 8900,
    startingBid: 6000,
    bidCount: 22,
    endsAt: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
    city: "İzmir",
    seller: DEMO_USER.name,
    sellerId: DEMO_USER.id,
    verified: true,
    condition: "İyi",
    description:
      "Satışı tamamlanan örnek ilan. Kargo ve ödeme adımları Satış Merkezi ekranından izlenebilir.",
    minIncrement: 250,
    reservePrice: 8000,
    shipping: "Param Güvende Kargo",
    paymentHold: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 140).toISOString(),
  },
  {
    id: "9",
    title: "Apple Watch Ultra 2 · Titanyum",
    category: "Telefon",
    image: "/products/iphone.svg",
    currentBid: 19800,
    startingBid: 15000,
    bidCount: 18,
    endsAt: new Date(Date.now() + 1000 * 60 * 360).toISOString(),
    city: "İzmir",
    seller: DEMO_USER.name,
    sellerId: DEMO_USER.id,
    verified: true,
    condition: "Çok iyi",
    description:
      "Titanyum kasa, kutu ve şarj kablosu tamdır. Pil sağlığı %98, ekran ve kasa koruyucuyla kullanılmıştır.",
    minIncrement: 250,
    reservePrice: 21500,
    shipping: "Param Güvende Kargo",
    paymentHold: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

const seedBids: Bid[] = [
  {
    id: "1",
    auctionId: "1",
    userId: "user-a",
    userName: "A*** K.",
    amount: 18000,
    createdAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
  },
  {
    id: "2",
    auctionId: "1",
    userId: DEMO_USER.id,
    userName: DEMO_USER.name,
    amount: 18250,
    createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
  },
  {
    id: "3",
    auctionId: "1",
    userId: "user-b",
    userName: "S*** D.",
    amount: 18500,
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: "4",
    auctionId: "3",
    userId: DEMO_USER.id,
    userName: DEMO_USER.name,
    amount: 45500,
    createdAt: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
  },
  {
    id: "5",
    auctionId: "3",
    userId: "user-c",
    userName: "T*** E.",
    amount: 46250,
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "6",
    auctionId: "7",
    userId: DEMO_USER.id,
    userName: DEMO_USER.name,
    amount: 12800,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 31).toISOString(),
  },
  {
    id: "7",
    auctionId: "8",
    userId: "user-z",
    userName: "E*** K.",
    amount: 8900,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 91).toISOString(),
  },
];

const seedNotices: Notice[] = [
  {
    id: "1",
    title: "Teklifin geçildi",
    text: "PlayStation 5 Slim ilanında daha yüksek teklif verildi.",
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    read: false,
    auctionId: "1",
  },
  {
    id: "2",
    title: "Favorindeki ilan bitiyor",
    text: "PlayStation 5 Slim açık artırması bir saatten kısa sürede sona erecek.",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    read: false,
    auctionId: "1",
  },
  {
    id: "3",
    title: "Hesabın doğrulandı",
    text: "Kimlik doğrulaman tamamlandı. Artık teklif verebilir ve ilan açabilirsin.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    read: true,
  },
  {
    id: "4",
    title: "Açık artırmayı kazandın",
    text: "PlayStation Portal için ödeme ve teslimat süreci başladı.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: false,
    auctionId: "7",
  },
];

const seedReviews: Review[] = [
  {
    id: "r1",
    sellerId: "seller-mert",
    reviewer: "Ayşe K.",
    rating: 5,
    text: "Ürün anlatıldığı gibiydi, aynı gün kargoya verdi.",
    product: "PlayStation 5",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: "r2",
    sellerId: "seller-mert",
    reviewer: "Ozan T.",
    rating: 5,
    text: "Paketleme çok iyiydi. Satıcı iletişimi hızlı.",
    product: "DualSense Kol",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31).toISOString(),
  },
  {
    id: "r3",
    sellerId: "seller-selin",
    reviewer: "Ceren D.",
    rating: 4,
    text: "MacBook temizdi, pil bilgisi doğru paylaşıldı.",
    product: "MacBook Air",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
  },
  {
    id: "r4",
    sellerId: "seller-burak",
    reviewer: "Emre B.",
    rating: 5,
    text: "Telefon kusursuz geldi, faturası eksiksizdi.",
    product: "iPhone 15 Pro",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: "r5",
    sellerId: "seller-efe",
    reviewer: "Can S.",
    rating: 4,
    text: "Bilgisayar performansı ilandaki testlerle uyumlu.",
    product: "Gaming PC",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(),
  },
  {
    id: "r6",
    sellerId: DEMO_USER.id,
    reviewer: "E*** K.",
    rating: 5,
    text: "Hızlı kargo ve güvenli paketleme. Tekrar alışveriş yaparım.",
    product: "Nintendo Switch Lite",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "r7",
    sellerId: DEMO_USER.id,
    reviewer: "B*** A.",
    rating: 5,
    text: "Ürün açıklaması çok detaylıydı, sürpriz yaşamadım.",
    product: "Oyun Konsolu",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 44).toISOString(),
  },
];

const seedAutoBids: AutoBid[] = [];

const seedOrders: Order[] = [
  {
    id: "order-1",
    auctionId: "7",
    buyerId: DEMO_USER.id,
    sellerId: "seller-cem",
    amount: 12800,
    paymentStatus: "pending",
    shipmentStatus: "waiting",
    carrier: "Yurtiçi Kargo",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "order-2",
    auctionId: "8",
    buyerId: "user-z",
    sellerId: DEMO_USER.id,
    amount: 8900,
    paymentStatus: "held",
    shipmentStatus: "prepared",
    carrier: "MNG Kargo",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];

const seedWalletBalance = 12450;

const seedWalletTransactions: WalletTransaction[] = [
  {
    id: "wt-1",
    type: "deposit",
    title: "Banka kartından para yükleme",
    amount: 10000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    status: "completed",
  },
  {
    id: "wt-2",
    type: "sale",
    title: "Nintendo Switch Lite satış geliri",
    amount: 8900,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    status: "completed",
    orderId: "order-2",
  },
  {
    id: "wt-3",
    type: "purchase",
    title: "PlayStation Portal güvenli ödeme",
    amount: -12800,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "completed",
    orderId: "order-1",
  },
  {
    id: "wt-4",
    type: "refund",
    title: "İptal edilen teklif teminatı iadesi",
    amount: 6350,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    status: "completed",
  },
];

const seedVerification: VerificationState = {
  phone: true,
  identity: true,
  bank: true,
  twoFactor: false,
};

const seedFollowedSellers = ["seller-mert"];

const seedReminders: AuctionReminder[] = [
  {
    auctionId: "1",
    kind: "ending",
    active: true,
    triggered: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    auctionId: "2",
    kind: "price",
    targetPrice: 30000,
    active: true,
    triggered: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
];

const seedCoupons: Coupon[] = [
  {
    code: "AP250",
    title: "Alıcı korumada ₺250 indirim",
    type: "fixed",
    value: 250,
    minSpend: 5000,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    used: false,
  },
  {
    code: "ILKTEKLIF",
    title: "%5 ödeme indirimi",
    type: "percent",
    value: 5,
    minSpend: 10000,
    maxDiscount: 750,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    used: false,
  },
];

const seedDisputes: Dispute[] = [
  {
    id: "dispute-1",
    orderId: "order-2",
    openedBy: "user-z",
    reason: "Kargo süresi aşıldı",
    details:
      "Satıcı kargo hazırlama süresini geçti. Alıcı, güncel gönderim tarihi için inceleme talep etti.",
    status: "reviewing",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

const seedFinalizedAuctionIds = ["7", "8"];

const seedSavedSearches: SavedSearch[] = [
  {
    id: "search-iphone-izmir",
    name: "İzmir · Telefon · 30.000 TL altı",
    query: "iPhone",
    category: "Telefon",
    condition: "Tümü",
    city: "İzmir",
    maxPrice: 30000,
    endingFilter: "24",
    notify: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
];

const seedPromotions: Promotion[] = [
  {
    auctionId: "9",
    plan: "24h",
    price: 149,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
    impressions: 1840,
    clicks: 126,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];

const seedDrafts: AuctionDraft[] = [
  {
    id: "draft-headphones",
    title: "AirPods Max · Uzay Gri",
    category: "Telefon",
    image: "/products/iphone.svg",
    startingBid: 9000,
    reservePrice: 12500,
    minIncrement: 250,
    durationHours: 48,
    city: "İzmir",
    condition: "İyi",
    description:
      "Kutu, taşıma kılıfı ve şarj kablosu mevcut. Kozmetik kullanım izleri fotoğraflarda gösterilecektir.",
    shipping: "Param Güvende Kargo",
    savedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
];

const seedAutoRelistIds = ["9"];

const seedStorefronts: StoreProfile[] = [
  {
    sellerId: DEMO_USER.id,
    name: "Kemal Teknoloji",
    tagline: "Seçilmiş teknoloji ürünleri, şeffaf açık artırmalar",
    about:
      "İzmir merkezli mağazamızda kontrol edilmiş oyun ve teknoloji ürünlerini güvenli ödeme ile açık artırmaya çıkarıyoruz.",
    featuredAuctionIds: ["9", "8"],
    followerDiscount: 10,
    campaignActive: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    sellerId: "seller-mert",
    name: "Mert Oyun Dünyası",
    tagline: "Konsol, aksesuar ve oyuncu ekipmanlarında güvenilir satıcı",
    about:
      "Tüm ürünler test edilerek listelenir. Kutu içeriği ve kozmetik durum ilanlarda ayrıntılı paylaşılır.",
    featuredAuctionIds: ["1"],
    followerDiscount: 5,
    campaignActive: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
];

const seedQuestions: AuctionQuestion[] = [
  {
    id: "q1",
    auctionId: "1",
    userId: "user-ayse",
    userName: "Ayşe T.",
    question: "Pil sağlığı ve garanti durumu nedir?",
    answer: "Pil sağlığı %92. Fatura ve garanti belgesi mevcut.",
    answeredAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
  },
  {
    id: "q2",
    auctionId: "1",
    userId: "user-emre",
    userName: "Emre K.",
    question: "Kutu içeriği tam mı?",
    answer: "Kutu, kablo ve orijinal evraklar tamdır.",
    answeredAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
  },
  {
    id: "q3",
    auctionId: "2",
    userId: "user-selin",
    userName: "Selin A.",
    question: "Ekranda çizik veya ışık sızması var mı?",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
];


const seedMessages: ChatMessage[] = [
  {
    id: "m1",
    conversationId: "7:seller-cem",
    auctionId: "7",
    senderId: "seller-cem",
    senderName: "Cem A.",
    body: "Merhaba Kemal, ödemen güvende. Ürünü bugün kargoya teslim ettim.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    read: true,
  },
  {
    id: "m2",
    conversationId: "7:seller-cem",
    auctionId: "7",
    senderId: DEMO_USER.id,
    senderName: DEMO_USER.name,
    body: "Teşekkürler, takip kodunu gördüm. Teslim alınca onaylayacağım.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6.5).toISOString(),
    read: true,
  },
  {
    id: "m3",
    conversationId: "1:seller-mert",
    auctionId: "1",
    senderId: DEMO_USER.id,
    senderName: DEMO_USER.name,
    body: "Merhaba, cihazın garanti belgesi ve seri numarası fotoğraflarda mevcut mu?",
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    read: true,
  },
  {
    id: "m4",
    conversationId: "1:seller-mert",
    auctionId: "1",
    senderId: "seller-mert",
    senderName: "Mert K.",
    body: "Merhaba, garanti belgesi mevcut. Seri numarasının son dört hanesini de ilana ekledim.",
    createdAt: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
    read: false,
  },
  {
    id: "m5",
    conversationId: "8:user-z",
    auctionId: "8",
    senderId: "user-z",
    senderName: "E*** K.",
    body: "Ürünü kazandım, kargoya ne zaman verebilirsiniz?",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    read: false,
  },
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
  const defaults: StoredState = {
    auctions: seedAuctions,
    bids: seedBids,
    notices: seedNotices,
    orders: seedOrders,
    autoBids: seedAutoBids,
    messages: seedMessages,
    walletBalance: seedWalletBalance,
    walletTransactions: seedWalletTransactions,
    verification: seedVerification,
    followedSellers: seedFollowedSellers,
    reminders: seedReminders,
    coupons: seedCoupons,
    reviews: seedReviews,
    disputes: seedDisputes,
    finalizedAuctionIds: seedFinalizedAuctionIds,
    savedSearches: seedSavedSearches,
    questions: seedQuestions,
    promotions: seedPromotions,
    drafts: seedDrafts,
    autoRelistIds: seedAutoRelistIds,
    storefronts: seedStorefronts,
    membership: seedMembership,
    businessAccount: seedBusinessAccount,
    invoiceRecords: seedInvoiceRecords,
    addresses: seedAddresses,
    shipmentLabels: seedShipmentLabels,
    auditLogs: seedAuditLogs,
    userCases: seedUserCases,
    systemSettings: seedSystemSettings,
  };
  if (typeof window === "undefined") return defaults;
  const raw =
    window.localStorage.getItem("kapiskapis-v20") ||
    window.localStorage.getItem("kapiskapis-v18") ||
    window.localStorage.getItem("kapiskapis-v17") ||
    window.localStorage.getItem("kapiskapis-v16") ||
    window.localStorage.getItem("kapiskapis-v15") ||
    window.localStorage.getItem("kapiskapis-v14") ||
    window.localStorage.getItem("kapiskapis-v13") ||
    window.localStorage.getItem("kapiskapis-v12") ||
    window.localStorage.getItem("kapiskapis-v11") ||
    window.localStorage.getItem("kapiskapis-v10") ||
    window.localStorage.getItem("kapiskapis-v9") ||
    window.localStorage.getItem("kapiskapis-v8") ||
    window.localStorage.getItem("kapiskapis-v7") ||
    window.localStorage.getItem("kapiskapis-v6") ||
    window.localStorage.getItem("kapiskapis-v5") ||
    window.localStorage.getItem("kapiskapis-v4") ||
    window.localStorage.getItem("kapiskapis-v3");
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    if (
      !Array.isArray(parsed.auctions) ||
      !Array.isArray(parsed.bids) ||
      !Array.isArray(parsed.notices)
    )
      throw new Error("invalid");
    return {
      auctions: parsed.auctions,
      bids: parsed.bids,
      notices: parsed.notices,
      orders: Array.isArray(parsed.orders) ? parsed.orders : seedOrders,
      autoBids: Array.isArray(parsed.autoBids) ? parsed.autoBids : seedAutoBids,
      messages: Array.isArray(parsed.messages) ? parsed.messages : seedMessages,
      walletBalance:
        typeof parsed.walletBalance === "number"
          ? parsed.walletBalance
          : seedWalletBalance,
      walletTransactions: Array.isArray(parsed.walletTransactions)
        ? parsed.walletTransactions
        : seedWalletTransactions,
      verification:
        parsed.verification && typeof parsed.verification === "object"
          ? { ...seedVerification, ...parsed.verification }
          : seedVerification,
      followedSellers: Array.isArray(parsed.followedSellers)
        ? parsed.followedSellers
        : seedFollowedSellers,
      reminders: Array.isArray(parsed.reminders)
        ? parsed.reminders
        : seedReminders,
      coupons: Array.isArray(parsed.coupons) ? parsed.coupons : seedCoupons,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : seedReviews,
      disputes: Array.isArray(parsed.disputes)
        ? parsed.disputes
        : seedDisputes,
      finalizedAuctionIds: Array.isArray(parsed.finalizedAuctionIds)
        ? parsed.finalizedAuctionIds
        : seedFinalizedAuctionIds,
      savedSearches: Array.isArray(parsed.savedSearches)
        ? parsed.savedSearches
        : seedSavedSearches,
      questions: Array.isArray(parsed.questions)
        ? parsed.questions
        : seedQuestions,
      promotions: Array.isArray(parsed.promotions)
        ? parsed.promotions
        : seedPromotions,
      drafts: Array.isArray(parsed.drafts) ? parsed.drafts : seedDrafts,
      autoRelistIds: Array.isArray(parsed.autoRelistIds)
        ? parsed.autoRelistIds
        : seedAutoRelistIds,
      storefronts: Array.isArray(parsed.storefronts)
        ? parsed.storefronts
        : seedStorefronts,
      membership:
        parsed.membership && typeof parsed.membership === "object"
          ? { ...seedMembership, ...parsed.membership }
          : seedMembership,
      businessAccount:
        parsed.businessAccount && typeof parsed.businessAccount === "object"
          ? { ...seedBusinessAccount, ...parsed.businessAccount }
          : seedBusinessAccount,
      invoiceRecords: Array.isArray(parsed.invoiceRecords)
        ? parsed.invoiceRecords
        : seedInvoiceRecords,
      addresses: Array.isArray(parsed.addresses)
        ? parsed.addresses
        : seedAddresses,
      shipmentLabels: Array.isArray(parsed.shipmentLabels)
        ? parsed.shipmentLabels
        : seedShipmentLabels,
      auditLogs: Array.isArray(parsed.auditLogs)
        ? parsed.auditLogs
        : seedAuditLogs,
      userCases: Array.isArray(parsed.userCases)
        ? parsed.userCases
        : seedUserCases,
      systemSettings:
        parsed.systemSettings && typeof parsed.systemSettings === "object"
          ? { ...seedSystemSettings, ...parsed.systemSettings }
          : seedSystemSettings,
    };
  } catch {
    [
      "kapiskapis-v20",
      "kapiskapis-v18",
      "kapiskapis-v17",
      "kapiskapis-v16",
      "kapiskapis-v15",
      "kapiskapis-v14",
      "kapiskapis-v13",
      "kapiskapis-v12",
      "kapiskapis-v11",
      "kapiskapis-v10",
      "kapiskapis-v9",
      "kapiskapis-v7",
      "kapiskapis-v6",
      "kapiskapis-v5",
      "kapiskapis-v4",
      "kapiskapis-v3",
      "kapiskapis-moderation-v4",
    ].forEach((key) => window.localStorage.removeItem(key));
    return defaults;
  }
}

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toLocaleUpperCase("tr"))
      .join("") || "AP"
  );
}

function sellerScore(sellerId: string, reviews: Review[] = seedReviews) {
  const sellerReviews = reviews.filter(
    (review) => review.sellerId === sellerId,
  );
  if (!sellerReviews.length) return { rating: 4.7, count: 9, sales: 14 };
  const rating =
    sellerReviews.reduce((sum, review) => sum + review.rating, 0) /
    sellerReviews.length;
  return {
    rating,
    count: sellerReviews.length,
    sales: 12 + sellerReviews.length * 3,
  };
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
  for (let index = 0; index < bytes.length; index += 1)
    buffer[index] = bytes.charCodeAt(index);
  return new Blob([buffer], { type: mime });
}

export default function Home() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const liveMode = Boolean(supabase);
  const [screen, setScreen] = useState<Screen>("home");
  const [auctions, setAuctions] = useState<Auction[]>(
    liveMode ? [] : seedAuctions,
  );
  const [bids, setBids] = useState<Bid[]>(liveMode ? [] : seedBids);
  const [notices, setNotices] = useState<Notice[]>(liveMode ? [] : seedNotices);
  const [orders, setOrders] = useState<Order[]>(liveMode ? [] : seedOrders);
  const [autoBids, setAutoBids] = useState<AutoBid[]>(seedAutoBids);
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [walletBalance, setWalletBalance] = useState(
    liveMode ? 0 : seedWalletBalance,
  );
  const [walletTransactions, setWalletTransactions] = useState<
    WalletTransaction[]
  >(seedWalletTransactions);
  const [verification, setVerification] =
    useState<VerificationState>(seedVerification);
  const [followedSellers, setFollowedSellers] =
    useState<string[]>(seedFollowedSellers);
  const [reminders, setReminders] = useState<AuctionReminder[]>(seedReminders);
  const [coupons, setCoupons] = useState<Coupon[]>(seedCoupons);
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [disputes, setDisputes] = useState<Dispute[]>(seedDisputes);
  const [finalizedAuctionIds, setFinalizedAuctionIds] = useState<string[]>(
    seedFinalizedAuctionIds,
  );
  const [savedSearches, setSavedSearches] =
    useState<SavedSearch[]>(seedSavedSearches);
  const [promotions, setPromotions] = useState<Promotion[]>(seedPromotions);
  const [drafts, setDrafts] = useState<AuctionDraft[]>(seedDrafts);
  const [autoRelistIds, setAutoRelistIds] = useState<string[]>(seedAutoRelistIds);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<AuctionQuestion[]>(seedQuestions);
  const [storefronts, setStorefronts] = useState<StoreProfile[]>(seedStorefronts);
  const [membership, setMembership] = useState<MembershipState>(seedMembership);
  const [businessAccount, setBusinessAccount] = useState<BusinessAccount>(seedBusinessAccount);
  const [invoiceRecords, setInvoiceRecords] = useState<InvoiceRecord[]>(seedInvoiceRecords);
  const [addresses, setAddresses] = useState<AddressRecord[]>(seedAddresses);
  const [shipmentLabels, setShipmentLabels] = useState<ShipmentLabel[]>(seedShipmentLabels);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(seedAuditLogs);
  const [userCases, setUserCases] = useState<UserCase[]>(seedUserCases);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(seedSystemSettings);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState("");
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [conditionFilter, setConditionFilter] = useState("Tümü");
  const [cityFilter, setCityFilter] = useState("Tümü");
  const [maxPrice, setMaxPrice] = useState(0);
  const [endingFilter, setEndingFilter] = useState("Tümü");
  const [selectedSellerId, setSelectedSellerId] = useState("");
  const [moderation, setModeration] = useState<
    Record<string, ModerationStatus>
  >({ "2": "pending", "4": "pending", "6": "pending" });

  const loadRemoteData = useCallback(
    async (user: User) => {
      if (!supabase) return;
      setRemoteLoading(true);

      // Süresi dolan açık artırmaları güvenli SQL fonksiyonu ile sonuçlandır.
      // Fonksiyon henüz kurulmadıysa veri yüklemeyi engellemeden devam eder.
      await supabase.rpc("finalize_expired_auctions");

      const [
        profileResult,
        auctionsResult,
        bidsResult,
        favoritesResult,
        noticesResult,
        paymentsResult,
        shipmentsResult,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("id,full_name,city")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("auctions")
          .select(
            "id,title,category,description,condition,starting_bid,current_bid,reserve_price,min_increment,ends_at,status,city,shipping_method,payment_hold,seller_id,bid_count,created_at,seller:profiles!auctions_seller_id_fkey(full_name,identity_verified),auction_images(storage_path,sort_order)",
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("bids")
          .select(
            "id,auction_id,bidder_id,amount,created_at,bidder:profiles!bids_bidder_id_fkey(full_name)",
          )
          .order("amount", { ascending: false }),
        supabase.from("favorites").select("auction_id").eq("user_id", user.id),
        supabase
          .from("notifications")
          .select("id,auction_id,title,body,read_at,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("payments")
          .select("id,auction_id,buyer_id,seller_id,amount,status,updated_at")
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order("updated_at", { ascending: false }),
        supabase
          .from("shipments")
          .select("auction_id,carrier,tracking_number,status,updated_at")
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`),
      ]);

      const firstError = [
        profileResult.error,
        auctionsResult.error,
        bidsResult.error,
        favoritesResult.error,
        noticesResult.error,
        paymentsResult.error,
        shipmentsResult.error,
      ].find(Boolean);
      if (firstError) {
        setToast(`Supabase hatası: ${firstError.message}`);
        setRemoteLoading(false);
        return;
      }

      const profile = profileResult.data;
      const fullName =
        profile?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Kullanıcı";
      setCurrentUser({
        id: user.id,
        name: fullName,
        initials: initialsFromName(fullName),
        city: profile?.city || "İzmir",
        email: user.email,
      });

      const favoriteIds = new Set(
        (favoritesResult.data ?? []).map(
          (item: { auction_id: string }) => item.auction_id,
        ),
      );
      const mappedAuctions: Auction[] = (auctionsResult.data ?? []).map(
        (row: any) => {
          const seller = Array.isArray(row.seller) ? row.seller[0] : row.seller;
          const images = [...(row.auction_images ?? [])].sort(
            (a: any, b: any) => a.sort_order - b.sort_order,
          );
          const storagePath = images[0]?.storage_path;
          const image = storagePath
            ? supabase.storage.from("auction-images").getPublicUrl(storagePath)
                .data.publicUrl
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
            seller: seller?.full_name || "KapışKapış kullanıcısı",
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
        },
      );

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

      const mappedNotices: Notice[] = (noticesResult.data ?? []).map(
        (row: any) => ({
          id: row.id,
          auctionId: row.auction_id || undefined,
          title: row.title,
          text: row.body,
          createdAt: row.created_at,
          read: Boolean(row.read_at),
        }),
      );

      const shipmentByAuction = new Map(
        (shipmentsResult.data ?? []).map((row: any) => [row.auction_id, row]),
      );
      const mappedOrders: Order[] = (paymentsResult.data ?? []).map((row: any) => {
        const shipment: any = shipmentByAuction.get(row.auction_id);
        const paymentStatus: PaymentStatus =
          row.status === "held"
            ? "held"
            : row.status === "released"
              ? "released"
              : row.status === "refunded"
                ? "refunded"
                : "pending";
        return {
          id: row.id,
          auctionId: row.auction_id,
          buyerId: row.buyer_id,
          sellerId: row.seller_id,
          amount: Number(row.amount),
          paymentStatus,
          shipmentStatus: (shipment?.status ?? "waiting") as ShipmentStatus,
          carrier: shipment?.carrier || undefined,
          trackingNumber: shipment?.tracking_number || undefined,
          updatedAt: shipment?.updated_at || row.updated_at,
        };
      });

      setAuctions(mappedAuctions);
      setBids(mappedBids);
      setNotices(mappedNotices);
      setOrders(mappedOrders);
      setSelectedId((previous) => previous || mappedAuctions[0]?.id || "");
      setRemoteLoading(false);
      setHydrated(true);
    },
    [supabase],
  );

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    if (!supabase) {
      const stored = safeRead();
      setAuctions(stored.auctions);
      setBids(stored.bids);
      setNotices(stored.notices);
      setOrders(stored.orders);
      setAutoBids(stored.autoBids);
      setMessages(stored.messages);
      setWalletBalance(stored.walletBalance);
      setWalletTransactions(stored.walletTransactions);
      setVerification(stored.verification);
      setFollowedSellers(stored.followedSellers);
      setReminders(stored.reminders);
      setCoupons(stored.coupons);
      setReviews(stored.reviews);
      setDisputes(stored.disputes);
      setFinalizedAuctionIds(stored.finalizedAuctionIds);
      setSavedSearches(stored.savedSearches);
      setPromotions(stored.promotions);
      setDrafts(stored.drafts);
      setAutoRelistIds(stored.autoRelistIds);
      setQuestions(stored.questions);
      setStorefronts(stored.storefronts);
      setMembership(stored.membership);
      setBusinessAccount(stored.businessAccount);
      setInvoiceRecords(stored.invoiceRecords);
      setAddresses(stored.addresses);
      setShipmentLabels(stored.shipmentLabels);
      setAuditLogs(stored.auditLogs);
      setUserCases(stored.userCases);
      setSystemSettings(stored.systemSettings);
      setHydrated(true);
      return () => window.clearInterval(interval);
    }

    supabase.auth.getSession().then(({ data }) => {
      setAuthUser(data.session?.user ?? null);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthUser(session?.user ?? null);
        setAuthReady(true);
      },
    );

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
      .channel(`kapiskapis-${authUser.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auctions" },
        () => loadRemoteData(authUser),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bids" },
        () => loadRemoteData(authUser),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${authUser.id}`,
        },
        () => loadRemoteData(authUser),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "favorites", filter: `user_id=eq.${authUser.id}` },
        () => loadRemoteData(authUser),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        () => loadRemoteData(authUser),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shipments" },
        () => loadRemoteData(authUser),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [authUser, loadRemoteData, supabase]);

  useEffect(() => {
    if (!hydrated || supabase) return;
    window.localStorage.setItem(
      "kapiskapis-v20",
      JSON.stringify({
        auctions,
        bids,
        notices,
        orders,
        autoBids,
        messages,
        walletBalance,
        walletTransactions,
        verification,
        followedSellers,
        reminders,
        coupons,
        reviews,
        disputes,
        finalizedAuctionIds,
        savedSearches,
        promotions,
        drafts,
        autoRelistIds,
        questions,
        storefronts,
        membership,
        businessAccount,
        invoiceRecords,
        addresses,
        shipmentLabels,
        auditLogs,
        userCases,
        systemSettings,
      }),
    );
  }, [
    auctions,
    bids,
    notices,
    orders,
    autoBids,
    messages,
    walletBalance,
    walletTransactions,
    verification,
    followedSellers,
    reminders,
    coupons,
    reviews,
    disputes,
    finalizedAuctionIds,
    savedSearches,
    promotions,
    drafts,
    autoRelistIds,
    questions,
    storefronts,
    membership,
    businessAccount,
    invoiceRecords,
    addresses,
    shipmentLabels,
    auditLogs,
    userCases,
    systemSettings,
    hydrated,
    supabase,
  ]);

  useEffect(() => {
    if (supabase || typeof window === "undefined") return;
    const saved = window.localStorage.getItem("kapiskapis-moderation-v4");
    if (saved) {
      try {
        setModeration(JSON.parse(saved));
      } catch {
        /* demo state */
      }
    }
  }, [supabase]);

  useEffect(() => {
    if (supabase || typeof window === "undefined") return;
    window.localStorage.setItem(
      "kapiskapis-moderation-v4",
      JSON.stringify(moderation),
    );
  }, [moderation, supabase]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!hydrated) return;
    const due = reminders.filter((reminder) => {
      if (!reminder.active || reminder.triggered) return false;
      const auction = auctions.find((item) => item.id === reminder.auctionId);
      if (!auction || isEnded(auction, now)) return false;
      if (reminder.kind === "ending")
        return new Date(auction.endsAt).getTime() - now <= 30 * 60_000;
      return (
        typeof reminder.targetPrice === "number" &&
        auction.currentBid <= reminder.targetPrice
      );
    });
    if (!due.length) return;
    setReminders((items) =>
      items.map((item) =>
        due.some(
          (entry) =>
            entry.auctionId === item.auctionId && entry.kind === item.kind,
        )
          ? { ...item, triggered: true }
          : item,
      ),
    );
    due.forEach((reminder) => {
      const auction = auctions.find((item) => item.id === reminder.auctionId);
      if (!auction) return;
      addNotice(
        reminder.kind === "ending"
          ? "İzlediğin ilan bitiyor"
          : "Fiyat hedefin yakalandı",
        reminder.kind === "ending"
          ? `${auction.title} 30 dakikadan kısa sürede sona erecek.`
          : `${auction.title} ${money.format(auction.currentBid)} seviyesinde.`,
        auction.id,
      );
    });
  }, [auctions, hydrated, now, reminders]);

  useEffect(() => {
    if (!hydrated || supabase) return;
    const newlyEnded = auctions.filter(
      (auction) =>
        isEnded(auction, now) && !finalizedAuctionIds.includes(auction.id),
    );
    if (!newlyEnded.length) return;

    const createdOrders: Order[] = [];
    const createdNotices: Notice[] = [];
    const relistedIds: string[] = [];
    newlyEnded.forEach((auction) => {
      const topBid = bids
        .filter((bid) => bid.auctionId === auction.id)
        .sort((a, b) => b.amount - a.amount)[0];
      const reserveMet = Boolean(
        topBid && topBid.amount >= auction.reservePrice,
      );

      if (reserveMet && topBid) {
        if (!orders.some((order) => order.auctionId === auction.id)) {
          createdOrders.push({
            id: `order-${auction.id}-${Date.now()}`,
            auctionId: auction.id,
            buyerId: topBid.userId,
            sellerId: auction.sellerId,
            amount: topBid.amount,
            paymentStatus: "pending",
            shipmentStatus: "waiting",
            carrier: "KapışKapış Anlaşmalı Kargo",
            updatedAt: new Date().toISOString(),
          });
        }
        if (topBid.userId === currentUser.id) {
          createdNotices.push({
            id: `winner-${auction.id}-${Date.now()}`,
            title: "Açık artırmayı kazandın",
            text: `${auction.title} için ödeme süreci başladı.`,
            createdAt: new Date().toISOString(),
            read: false,
            auctionId: auction.id,
          });
        } else if (auction.sellerId === currentUser.id) {
          createdNotices.push({
            id: `sold-${auction.id}-${Date.now()}`,
            title: "İlanın satıldı",
            text: `${auction.title} ${money.format(topBid.amount)} ile tamamlandı.`,
            createdAt: new Date().toISOString(),
            read: false,
            auctionId: auction.id,
          });
        }
      } else if (auction.sellerId === currentUser.id) {
        if (autoRelistIds.includes(auction.id)) {
          relistedIds.push(auction.id);
          createdNotices.push({
            id: `relist-${auction.id}-${Date.now()}`,
            title: "İlan otomatik yeniden yayınlandı",
            text: `${auction.title} yeni 72 saatlik açık artırmayla tekrar yayında.`,
            createdAt: new Date().toISOString(),
            read: false,
            auctionId: auction.id,
          });
        } else {
          createdNotices.push({
            id: `reserve-${auction.id}-${Date.now()}`,
            title: "Taban fiyat karşılanmadı",
            text: `${auction.title} satılmadan sona erdi.`,
            createdAt: new Date().toISOString(),
            read: false,
            auctionId: auction.id,
          });
        }
      }
    });

    if (relistedIds.length) {
      setAuctions((items) =>
        items.map((auction) =>
          relistedIds.includes(auction.id)
            ? {
                ...auction,
                currentBid: auction.startingBid,
                bidCount: 0,
                endsAt: new Date(Date.now() + 72 * 3_600_000).toISOString(),
                extensionCount: 0,
                createdAt: new Date().toISOString(),
              }
            : auction,
        ),
      );
      setBids((items) =>
        items.filter((bid) => !relistedIds.includes(bid.auctionId)),
      );
      setAutoRelistIds((items) =>
        items.filter((id) => !relistedIds.includes(id)),
      );
    }
    if (createdOrders.length)
      setOrders((items) => [...createdOrders, ...items]);
    if (createdNotices.length)
      setNotices((items) => [...createdNotices, ...items]);
    setAutoBids((items) =>
      items.map((item) =>
        newlyEnded.some((auction) => auction.id === item.auctionId)
          ? { ...item, active: false }
          : item,
      ),
    );
    setFinalizedAuctionIds((items) => [
      ...new Set([
        ...items,
        ...newlyEnded
          .filter((auction) => !relistedIds.includes(auction.id))
          .map((auction) => auction.id),
      ]),
    ]);
  }, [
    auctions,
    autoRelistIds,
    bids,
    currentUser.id,
    finalizedAuctionIds,
    hydrated,
    now,
    orders,
    supabase,
  ]);

  const categories = ["Tümü", "Telefon", "Bilgisayar", "Oyun", "Ev & Yaşam"];
  const cities = useMemo(
    () => [
      "Tümü",
      ...Array.from(new Set(auctions.map((auction) => auction.city))).sort(),
    ],
    [auctions],
  );
  const activeFilterCount = [
    conditionFilter !== "Tümü",
    cityFilter !== "Tümü",
    maxPrice > 0,
    endingFilter !== "Tümü",
  ].filter(Boolean).length;

  const searchSuggestions = useMemo(() => {
    const clean = query.trim().toLocaleLowerCase("tr");
    if (clean.length < 2) return [];
    return Array.from(
      new Set(
        auctions.flatMap((auction) => [
          auction.title,
          auction.category,
          `${auction.category} · ${auction.city}`,
        ]),
      ),
    )
      .filter((item) => item.toLocaleLowerCase("tr").includes(clean))
      .slice(0, 6);
  }, [auctions, query]);

  const filtered = useMemo(() => {
    const list = auctions.filter((auction) => {
      if (isEnded(auction, now)) return false;
      const normalized =
        `${auction.title} ${auction.category} ${auction.city}`.toLocaleLowerCase(
          "tr",
        );
      const matchesQuery = normalized.includes(query.toLocaleLowerCase("tr"));
      const matchesCategory =
        category === "Tümü" || auction.category === category;
      const matchesCondition =
        conditionFilter === "Tümü" || auction.condition === conditionFilter;
      const matchesCity = cityFilter === "Tümü" || auction.city === cityFilter;
      const matchesPrice = maxPrice <= 0 || auction.currentBid <= maxPrice;
      const hoursLeft = (new Date(auction.endsAt).getTime() - now) / 3_600_000;
      const matchesEnding =
        endingFilter === "Tümü" || hoursLeft <= Number(endingFilter);
      return (
        matchesQuery &&
        matchesCategory &&
        matchesCondition &&
        matchesCity &&
        matchesPrice &&
        matchesEnding
      );
    });
    return [...list].sort((a, b) => {
      if (sort === "Yeni")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sort === "Fiyat düşük") return a.currentBid - b.currentBid;
      if (sort === "Fiyat yüksek") return b.currentBid - a.currentBid;
      return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
    });
  }, [
    auctions,
    category,
    query,
    sort,
    now,
    conditionFilter,
    cityFilter,
    maxPrice,
    endingFilter,
  ]);

  const selected =
    auctions.find((auction) => auction.id === selectedId) ?? auctions[0];
  const selectedBids = bids
    .filter((bid) => bid.auctionId === selected?.id)
    .sort((a, b) => b.amount - a.amount);
  const unreadCount = notices.filter((notice) => !notice.read).length;
  const canAccessAdmin =
    !liveMode ||
    authUser?.app_metadata?.role === "founder" ||
    authUser?.user_metadata?.role === "founder";
  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? orders[0];
  const unreadMessages = messages.filter(
    (message) => !message.read && message.senderId !== currentUser.id,
  ).length;
  const activeDisputeCount = disputes.filter(
    (item) => item.status === "open" || item.status === "reviewing",
  ).length;
  const reviewableCount = orders.filter(
    (order) =>
      order.buyerId === currentUser.id &&
      (order.paymentStatus === "released" ||
        order.shipmentStatus === "approved") &&
      !reviews.some((review) => review.orderId === order.id),
  ).length;

  function navigate(next: Screen) {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleCompare(id: string) {
    if (compareIds.includes(id)) {
      setCompareIds((items) => items.filter((item) => item !== id));
      return;
    }
    if (compareIds.length >= 3) {
      setToast("Aynı anda en fazla 3 ilan karşılaştırabilirsin.");
      return;
    }
    setCompareIds((items) => [...items, id]);
    setToast("İlan karşılaştırma listesine eklendi.");
  }

  function saveDraft(draft: AuctionDraft) {
    setDrafts((items) => [draft, ...items.filter((item) => item.id !== draft.id)]);
    setToast("İlan taslağı kaydedildi.");
    navigate("listingManager");
  }

  async function publishDraft(id: string) {
    const draft = drafts.find((item) => item.id === id);
    if (!draft) return;
    await createAuction({
      title: draft.title,
      category: draft.category,
      image: draft.image || fallbackImage(draft.category),
      currentBid: draft.startingBid,
      startingBid: draft.startingBid,
      endsAt: new Date(Date.now() + draft.durationHours * 3_600_000).toISOString(),
      city: draft.city,
      seller: currentUser.name,
      sellerId: currentUser.id,
      verified: true,
      condition: draft.condition,
      description: draft.description,
      minIncrement: draft.minIncrement,
      reservePrice: Math.max(draft.reservePrice, draft.startingBid),
      shipping: draft.shipping,
      paymentHold: true,
    });
    setDrafts((items) => items.filter((item) => item.id !== id));
  }

  function deleteDraft(id: string) {
    setDrafts((items) => items.filter((item) => item.id !== id));
    setToast("Taslak silindi.");
  }

  function toggleAutoRelist(id: string) {
    const enabled = autoRelistIds.includes(id);
    setAutoRelistIds((items) =>
      enabled ? items.filter((item) => item !== id) : [...items, id],
    );
    setToast(
      enabled
        ? "Otomatik yeniden yayınlama kapatıldı."
        : "Satılmazsa otomatik yeniden yayınlama açıldı.",
    );
  }

  function extendListings(ids: string[], hours: number) {
    if (!ids.length) return setToast("Önce en az bir ilan seç.");
    setAuctions((items) =>
      items.map((auction) =>
        ids.includes(auction.id) && !isEnded(auction, now)
          ? {
              ...auction,
              endsAt: new Date(
                new Date(auction.endsAt).getTime() + hours * 3_600_000,
              ).toISOString(),
            }
          : auction,
      ),
    );
    setToast(`${ids.length} ilanın süresi ${hours} saat uzatıldı.`);
  }

  function relistListings(ids: string[]) {
    const eligible = auctions.filter(
      (auction) => ids.includes(auction.id) && isEnded(auction, now),
    );
    if (!eligible.length)
      return setToast("Seçilen ilanlar arasında sona ermiş ilan yok.");
    setAuctions((items) =>
      items.map((auction) =>
        eligible.some((item) => item.id === auction.id)
          ? {
              ...auction,
              currentBid: auction.startingBid,
              bidCount: 0,
              endsAt: new Date(Date.now() + 72 * 3_600_000).toISOString(),
              extensionCount: 0,
              createdAt: new Date().toISOString(),
            }
          : auction,
      ),
    );
    setBids((items) =>
      items.filter(
        (bid) => !eligible.some((auction) => auction.id === bid.auctionId),
      ),
    );
    setFinalizedAuctionIds((items) =>
      items.filter((id) => !eligible.some((auction) => auction.id === id)),
    );
    setToast(`${eligible.length} ilan yeniden 72 saatliğine yayınlandı.`);
  }

  function openAuction(id: string) {
    setSelectedId(id);
    navigate("detail");
  }

  function openSeller(sellerId: string) {
    setSelectedSellerId(sellerId);
    navigate("sellerProfile");
  }

  function openStorefront(sellerId: string) {
    setSelectedSellerId(sellerId);
    navigate("storefront");
  }

  function saveStorefront(profile: StoreProfile) {
    setStorefronts((items) => [
      profile,
      ...items.filter((item) => item.sellerId !== profile.sellerId),
    ]);
    setToast("Mağaza vitrini güncellendi.");
  }

  function openMessages(auctionId?: string, participantId?: string) {
    if (auctionId) {
      const auction = auctions.find((item) => item.id === auctionId);
      const otherId =
        participantId ||
        (auction?.sellerId === currentUser.id
          ? messages.find(
              (message) =>
                message.auctionId === auctionId &&
                message.senderId !== currentUser.id,
            )?.senderId
          : auction?.sellerId);
      if (otherId) setSelectedConversationId(`${auctionId}:${otherId}`);
    } else if (!selectedConversationId) {
      setSelectedConversationId(messages[0]?.conversationId || "");
    }
    setMessages((items) =>
      items.map((message) =>
        message.conversationId === selectedConversationId
          ? { ...message, read: true }
          : message,
      ),
    );
    navigate("messages");
  }

  function sendMessage(conversationId: string, body: string) {
    const auctionId = conversationId.split(":")[0];
    const clean = body.trim();
    if (!clean) return;
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      auctionId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      body: clean,
      createdAt: new Date().toISOString(),
      read: true,
    };
    setMessages((items) => [...items, message]);
    setToast("Mesajın güvenli sohbet üzerinden gönderildi.");
  }

  function openOrderFlow(orderId: string, target: "checkout" | "shipment") {
    setSelectedOrderId(orderId);
    navigate(target);
  }

  function completePayment(
    orderId: string,
    method: "card" | "wallet",
    total: number,
    deliveryAddressId?: string,
  ) {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    if (method === "wallet" && walletBalance < total) {
      setToast(
        `Cüzdan bakiyen yetersiz. ${money.format(total - walletBalance)} daha yüklemelisin.`,
      );
      return;
    }
    if (method === "wallet") {
      setWalletBalance((value) => value - total);
      setWalletTransactions((items) => [
        {
          id: `wt-${Date.now()}`,
          type: "hold",
          title: `${auctions.find((item) => item.id === order.auctionId)?.title || "Açık artırma"} güvenli ödemesi`,
          amount: -total,
          createdAt: new Date().toISOString(),
          status: "pending",
          orderId,
        },
        ...items,
      ]);
    }
    setOrders((items) =>
      items.map((item) =>
        item.id === orderId
          ? {
              ...item,
              paymentStatus: "held",
              shipmentStatus: "waiting",
              deliveryAddressId: deliveryAddressId || item.deliveryAddressId,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
    addNotice(
      "Ödeme güvenli hesaba alındı",
      `${money.format(total)} tutarındaki ödeme ürün onayına kadar bloke edildi.`,
      order.auctionId,
    );
    setToast(
      method === "wallet"
        ? "Cüzdan bakiyenden ödeme güvenli hesaba alındı."
        : "Kart ödemen güvenli hesaba alındı.",
    );
    navigate("orders");
  }

  function addWalletFunds(amount: number) {
    if (!Number.isFinite(amount) || amount < 100)
      return setToast("En az ₺100 yükleyebilirsin.");
    setWalletBalance((value) => value + amount);
    setWalletTransactions((items) => [
      {
        id: `wt-${Date.now()}`,
        type: "deposit",
        title: "Banka kartından para yükleme",
        amount,
        createdAt: new Date().toISOString(),
        status: "completed",
      },
      ...items,
    ]);
    addNotice(
      "Bakiye yüklendi",
      `${money.format(amount)} KapışKapış cüzdanına eklendi.`,
    );
    setToast(`${money.format(amount)} bakiyene eklendi.`);
  }

  function withdrawWallet(amount: number) {
    if (!Number.isFinite(amount) || amount < 100)
      return setToast("En az ₺100 çekebilirsin.");
    if (amount > walletBalance)
      return setToast(
        "Çekmek istediğin tutar kullanılabilir bakiyenden fazla.",
      );
    if (!verification.bank)
      return setToast("Para çekmek için banka hesabını doğrulamalısın.");
    setWalletBalance((value) => value - amount);
    setWalletTransactions((items) => [
      {
        id: `wt-${Date.now()}`,
        type: "withdrawal",
        title: "Banka hesabına para çekme",
        amount: -amount,
        createdAt: new Date().toISOString(),
        status: "pending",
      },
      ...items,
    ]);
    addNotice(
      "Para çekme talebi alındı",
      `${money.format(amount)} banka hesabına aktarılmak üzere sıraya alındı.`,
    );
    setToast("Para çekme talebin alındı.");
  }

  function completeVerification(key: keyof VerificationState) {
    if (verification[key]) return setToast("Bu doğrulama zaten tamamlanmış.");
    setVerification((state) => ({ ...state, [key]: true }));
    const labels: Record<keyof VerificationState, string> = {
      phone: "Telefon",
      identity: "Kimlik",
      bank: "Banka hesabı",
      twoFactor: "İki aşamalı giriş",
    };
    addNotice(
      `${labels[key]} doğrulaması tamamlandı`,
      "Hesap güvenlik puanın güncellendi.",
    );
    setToast(`${labels[key]} doğrulaması tamamlandı.`);
  }

  function toggleFollowSeller(sellerId: string, sellerName: string) {
    const following = followedSellers.includes(sellerId);
    setFollowedSellers((items) =>
      following ? items.filter((id) => id !== sellerId) : [...items, sellerId],
    );
    if (!following)
      addNotice(
        "Satıcı takibe alındı",
        `${sellerName} yeni ilan yayınladığında bildirim alacaksın.`,
      );
    setToast(
      following
        ? "Satıcı takibi bırakıldı."
        : "Satıcıyı takip etmeye başladın.",
    );
  }

  function toggleEndingReminder(auctionId: string) {
    const auction = auctions.find((item) => item.id === auctionId);
    if (!auction) return;
    const existing = reminders.find(
      (item) => item.auctionId === auctionId && item.kind === "ending",
    );
    if (existing?.active) {
      setReminders((items) =>
        items.map((item) =>
          item === existing ? { ...item, active: false } : item,
        ),
      );
      setToast("Bitiş hatırlatıcısı kapatıldı.");
      return;
    }
    const next: AuctionReminder = {
      auctionId,
      kind: "ending",
      active: true,
      triggered: false,
      createdAt: new Date().toISOString(),
    };
    setReminders((items) => [
      next,
      ...items.filter(
        (item) => !(item.auctionId === auctionId && item.kind === "ending"),
      ),
    ]);
    setToast("Açık artırma bitmeden 30 dakika önce bildirim alacaksın.");
  }

  function setPriceReminder(auctionId: string, targetPrice: number) {
    const auction = auctions.find((item) => item.id === auctionId);
    if (!auction || !Number.isFinite(targetPrice) || targetPrice <= 0)
      return setToast("Geçerli bir fiyat hedefi gir.");
    const next: AuctionReminder = {
      auctionId,
      kind: "price",
      targetPrice,
      active: true,
      triggered: false,
      createdAt: new Date().toISOString(),
    };
    setReminders((items) => [
      next,
      ...items.filter(
        (item) => !(item.auctionId === auctionId && item.kind === "price"),
      ),
    ]);
    setToast(`${money.format(targetPrice)} fiyat uyarısı kaydedildi.`);
  }

  function removeReminder(auctionId: string, kind: ReminderKind) {
    setReminders((items) =>
      items.filter(
        (item) => !(item.auctionId === auctionId && item.kind === kind),
      ),
    );
    setToast("Uyarı kaldırıldı.");
  }

  function useCoupon(code: string) {
    setCoupons((items) =>
      items.map((coupon) =>
        coupon.code === code ? { ...coupon, used: true } : coupon,
      ),
    );
  }

  function markAllNoticesRead() {
    setNotices((items) => items.map((notice) => ({ ...notice, read: true })));
    setToast("Tüm bildirimler okundu olarak işaretlendi.");
  }

  function clearFilters() {
    setConditionFilter("Tümü");
    setCityFilter("Tümü");
    setMaxPrice(0);
    setEndingFilter("Tümü");
  }

  function saveCurrentSearch() {
    const hasCriteria =
      query.trim() ||
      category !== "Tümü" ||
      conditionFilter !== "Tümü" ||
      cityFilter !== "Tümü" ||
      maxPrice > 0 ||
      endingFilter !== "Tümü";
    if (!hasCriteria) {
      setToast("Kaydetmek için önce arama veya filtre seç.");
      return;
    }
    const parts = [
      query.trim(),
      category !== "Tümü" ? category : "",
      cityFilter !== "Tümü" ? cityFilter : "",
      maxPrice > 0 ? `${money.format(maxPrice)} altı` : "",
    ].filter(Boolean);
    const item: SavedSearch = {
      id: `saved-search-${Date.now()}`,
      name: parts.join(" · ") || "Kaydedilmiş arama",
      query: query.trim(),
      category,
      condition: conditionFilter,
      city: cityFilter,
      maxPrice,
      endingFilter,
      notify: true,
      createdAt: new Date().toISOString(),
    };
    setSavedSearches((items) => [item, ...items]);
    setToast("Arama kaydedildi; yeni ilanlar için bildirim açıldı.");
  }

  function applySavedSearch(item: SavedSearch) {
    setQuery(item.query);
    setCategory(item.category);
    setConditionFilter(item.condition);
    setCityFilter(item.city);
    setMaxPrice(item.maxPrice);
    setEndingFilter(item.endingFilter);
    setFilterOpen(true);
    navigate("home");
    setToast("Kaydedilmiş arama uygulandı.");
  }

  function toggleSavedSearchNotification(id: string) {
    setSavedSearches((items) =>
      items.map((item) =>
        item.id === id ? { ...item, notify: !item.notify } : item,
      ),
    );
  }

  function deleteSavedSearch(id: string) {
    setSavedSearches((items) => items.filter((item) => item.id !== id));
    setToast("Kaydedilmiş arama silindi.");
  }

  function moderateAuction(id: string, status: ModerationStatus) {
    setModeration((items) => ({ ...items, [id]: status }));
    setToast(
      status === "approved"
        ? "İlan onaylandı ve yayına hazırlandı."
        : "İlan inceleme sonucunda reddedildi.",
    );
  }

  async function toggleFavorite(id: string) {
    const auction = auctions.find((item) => item.id === id);
    if (!auction) return;
    setAuctions((items) =>
      items.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item,
      ),
    );
    if (!supabase || !authUser) return;

    const result = auction.favorite
      ? await supabase
          .from("favorites")
          .delete()
          .eq("user_id", authUser.id)
          .eq("auction_id", id)
      : await supabase
          .from("favorites")
          .insert({ user_id: authUser.id, auction_id: id });
    if (result.error) {
      setToast(`Favori kaydedilemedi: ${result.error.message}`);
      await loadRemoteData(authUser);
    }
  }

  function addNotice(title: string, text: string, auctionId?: string) {
    setNotices((items) => [
      {
        id: String(Date.now()),
        title,
        text,
        createdAt: new Date().toISOString(),
        read: false,
        auctionId,
      },
      ...items,
    ]);
  }

  async function placeBid(id: string, amount: number) {
    const auction = auctions.find((item) => item.id === id);
    if (!auction) return;
    if (isEnded(auction, now)) return setToast("Bu açık artırma sona erdi.");
    if (auction.sellerId === currentUser.id)
      return setToast("Kendi ilanına teklif veremezsin.");
    const minimum = auction.currentBid + auction.minIncrement;
    if (!Number.isFinite(amount) || amount < minimum)
      return setToast(`En az ${money.format(minimum)} teklif vermelisin.`);

    if (supabase && authUser) {
      const { error } = await supabase.rpc("place_bid", {
        p_auction_id: id,
        p_amount: amount,
      });
      if (error) return setToast(`Teklif alınamadı: ${error.message}`);
      setToast("Teklifin başarıyla alındı.");
      await loadRemoteData(authUser);
      return;
    }

    const remainingMs = new Date(auction.endsAt).getTime() - now;
    const extended = remainingMs <= 120_000;
    const updatedEnd = extended
      ? new Date(now + 120_000).toISOString()
      : auction.endsAt;
    const newBid: Bid = {
      id: String(Date.now()),
      auctionId: id,
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      createdAt: new Date().toISOString(),
    };
    setBids((items) => [newBid, ...items]);
    setAuctions((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              currentBid: amount,
              bidCount: item.bidCount + 1,
              endsAt: updatedEnd,
              extensionCount: (item.extensionCount ?? 0) + (extended ? 1 : 0),
            }
          : item,
      ),
    );
    addNotice(
      "Teklifin alındı",
      `${auction.title} için ${money.format(amount)} teklif verdin.`,
      id,
    );
    setToast(
      extended
        ? "Teklif alındı. Son dakika kuralıyla süre 2 dakika uzadı."
        : "Teklifin başarıyla alındı.",
    );
  }

  async function setAutomaticBid(auctionId: string, maxAmount: number) {
    const auction = auctions.find((item) => item.id === auctionId);
    if (!auction) return;
    const minimum = auction.currentBid + auction.minIncrement;
    if (!Number.isFinite(maxAmount) || maxAmount < minimum) {
      setToast(`Otomatik teklif limiti en az ${money.format(minimum)} olmalı.`);
      return;
    }

    const autoBid: AutoBid = {
      auctionId,
      userId: currentUser.id,
      maxAmount,
      active: true,
      createdAt: new Date().toISOString(),
    };
    setAutoBids((items) => [
      autoBid,
      ...items.filter(
        (item) =>
          !(item.auctionId === auctionId && item.userId === currentUser.id),
      ),
    ]);

    const topBid = bids
      .filter((bid) => bid.auctionId === auctionId)
      .sort((a, b) => b.amount - a.amount)[0];
    if (topBid?.userId !== currentUser.id && !isEnded(auction, now)) {
      await placeBid(auctionId, minimum);
    }
    addNotice(
      "Otomatik teklif açıldı",
      `${auction.title} için gizli limitin ${money.format(maxAmount)} olarak kaydedildi.`,
      auctionId,
    );
    setToast(
      "Otomatik teklif açıldı. Limitin diğer kullanıcılara gösterilmez.",
    );
  }

  function disableAutomaticBid(auctionId: string) {
    setAutoBids((items) =>
      items.map((item) =>
        item.auctionId === auctionId && item.userId === currentUser.id
          ? { ...item, active: false }
          : item,
      ),
    );
    setToast("Otomatik teklif kapatıldı.");
  }

  function simulateCompetingBid(auctionId: string) {
    if (liveMode)
      return setToast(
        "Rakip teklif simülasyonu yalnızca demo modunda kullanılabilir.",
      );
    const auction = auctions.find((item) => item.id === auctionId);
    if (!auction || isEnded(auction, now))
      return setToast("Bu açık artırma sona erdi.");
    const autoBid = autoBids.find(
      (item) =>
        item.auctionId === auctionId &&
        item.userId === currentUser.id &&
        item.active,
    );
    const competitorAmount = auction.currentBid + auction.minIncrement;
    const competitorBid: Bid = {
      id: `competitor-${Date.now()}`,
      auctionId,
      userId: "demo-rival",
      userName: "Rakip kullanıcı",
      amount: competitorAmount,
      createdAt: new Date().toISOString(),
    };
    const remainingMs = new Date(auction.endsAt).getTime() - now;
    const extended = remainingMs <= 120_000;
    const updatedEnd = extended
      ? new Date(now + 120_000).toISOString()
      : auction.endsAt;

    if (
      autoBid &&
      autoBid.maxAmount >= competitorAmount + auction.minIncrement
    ) {
      const responseAmount = Math.min(
        autoBid.maxAmount,
        competitorAmount + auction.minIncrement,
      );
      const responseBid: Bid = {
        id: `auto-${Date.now()}`,
        auctionId,
        userId: currentUser.id,
        userName: currentUser.name,
        amount: responseAmount,
        createdAt: new Date(Date.now() + 1).toISOString(),
      };
      setBids((items) => [responseBid, competitorBid, ...items]);
      setAuctions((items) =>
        items.map((item) =>
          item.id === auctionId
            ? {
                ...item,
                currentBid: responseAmount,
                bidCount: item.bidCount + 2,
                endsAt: updatedEnd,
                extensionCount: (item.extensionCount ?? 0) + (extended ? 1 : 0),
              }
            : item,
        ),
      );
      addNotice(
        "Otomatik teklif devreye girdi",
        `${auction.title} için sistem senin adına ${money.format(responseAmount)} teklif verdi.`,
        auctionId,
      );
      setToast(
        "Rakip teklif geldi; otomatik teklifin minimum artışla seni yeniden öne taşıdı.",
      );
      return;
    }

    setBids((items) => [competitorBid, ...items]);
    setAuctions((items) =>
      items.map((item) =>
        item.id === auctionId
          ? {
              ...item,
              currentBid: competitorAmount,
              bidCount: item.bidCount + 1,
              endsAt: updatedEnd,
              extensionCount: (item.extensionCount ?? 0) + (extended ? 1 : 0),
            }
          : item,
      ),
    );
    if (autoBid)
      setAutoBids((items) =>
        items.map((item) =>
          item.auctionId === auctionId && item.userId === currentUser.id
            ? { ...item, active: false }
            : item,
        ),
      );
    addNotice(
      "Teklifin geçildi",
      `${auction.title} için otomatik teklif limitin aşıldı.`,
      auctionId,
    );
    setToast(
      autoBid
        ? "Rakip teklif otomatik limitini aştı."
        : "Rakip kullanıcı daha yüksek teklif verdi.",
    );
  }

  async function createAuction(
    data: Omit<Auction, "id" | "bidCount" | "favorite" | "createdAt">,
  ) {
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
      if (error || !created)
        return setToast(
          `İlan oluşturulamadı: ${error?.message ?? "Bilinmeyen hata"}`,
        );

      if (data.image.startsWith("data:")) {
        const blob = dataUrlToBlob(data.image);
        const extension =
          blob.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
        const path = `${authUser.id}/${created.id}/${Date.now()}.${extension}`;
        const upload = await supabase.storage
          .from("auction-images")
          .upload(path, blob, { contentType: blob.type, upsert: false });
        if (!upload.error) {
          await supabase
            .from("auction_images")
            .insert({
              auction_id: created.id,
              storage_path: path,
              sort_order: 0,
            });
        } else {
          setToast(
            `İlan oluştu fakat fotoğraf yüklenemedi: ${upload.error.message}`,
          );
        }
      }

      await loadRemoteData(authUser);
      setSelectedId(created.id);
      navigate("detail");
      setToast("İlanın Supabase üzerinde yayınlandı.");
      return;
    }

    const id = String(
      Math.max(...auctions.map((item) => Number(item.id) || 0), 0) + 1,
    );
    const newAuction: Auction = {
      ...data,
      id,
      bidCount: 0,
      favorite: false,
      createdAt: new Date().toISOString(),
    };
    setAuctions((items) => [newAuction, ...items]);
    setSelectedId(id);
    addNotice(
      "İlanın yayında",
      `${newAuction.title} açık artırması başladı.`,
      id,
    );
    navigate("detail");
    setToast("İlanın başarıyla yayınlandı.");
  }

  async function openNotifications() {
    navigate("notifications");
  }

  async function openNotice(notice: Notice) {
    setNotices((items) =>
      items.map((item) =>
        item.id === notice.id ? { ...item, read: true } : item,
      ),
    );
    if (supabase && authUser)
      await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", notice.id);
    if (notice.auctionId) openAuction(notice.auctionId);
  }

  function openDispute(orderId: string, reason: string, details: string) {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    if (disputes.some((item) => item.orderId === orderId && (item.status === "open" || item.status === "reviewing"))) {
      setToast("Bu sipariş için zaten açık bir itiraz bulunuyor.");
      return;
    }
    if (!reason || details.trim().length < 10) {
      setToast("İtiraz nedeni ve en az 10 karakter açıklama gir.");
      return;
    }
    const dispute: Dispute = {
      id: `dispute-${Date.now()}`,
      orderId,
      openedBy: currentUser.id,
      reason,
      details: details.trim(),
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDisputes((items) => [dispute, ...items]);
    setOrders((items) =>
      items.map((item) =>
        item.id === orderId
          ? { ...item, shipmentStatus: "disputed", updatedAt: new Date().toISOString() }
          : item,
      ),
    );
    addNotice(
      "İtiraz kaydı oluşturuldu",
      `${reason} başlığıyla güvenli işlem incelemesi başladı.`,
      order.auctionId,
    );
    setToast("İtirazın incelemeye alındı.");
  }

  function resolveDispute(id: string, result: "buyer" | "seller" | "reviewing") {
    const dispute = disputes.find((item) => item.id === id);
    if (!dispute) return;
    const order = orders.find((item) => item.id === dispute.orderId);
    if (!order) return;
    const status: DisputeStatus =
      result === "reviewing"
        ? "reviewing"
        : result === "buyer"
          ? "resolved_buyer"
          : "resolved_seller";
    setDisputes((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
    if (result === "buyer") {
      setOrders((items) =>
        items.map((item) =>
          item.id === order.id
            ? { ...item, paymentStatus: "refunded", updatedAt: new Date().toISOString() }
            : item,
        ),
      );
      if (order.buyerId === currentUser.id) {
        setWalletBalance((value) => value + order.amount);
        setWalletTransactions((items) => [
          {
            id: `refund-${Date.now()}`,
            type: "refund",
            title: "İtiraz sonucu ödeme iadesi",
            amount: order.amount,
            createdAt: new Date().toISOString(),
            status: "completed",
            orderId: order.id,
          },
          ...items,
        ]);
      }
    } else if (result === "seller") {
      setOrders((items) =>
        items.map((item) =>
          item.id === order.id
            ? {
                ...item,
                paymentStatus: "released",
                shipmentStatus: "approved",
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
      if (order.sellerId === currentUser.id) {
        const net = Math.round(order.amount * 0.925);
        setWalletBalance((value) => value + net);
        setWalletTransactions((items) => [
          {
            id: `sale-${Date.now()}`,
            type: "sale",
            title: "İtiraz sonrası satış geliri",
            amount: net,
            createdAt: new Date().toISOString(),
            status: "completed",
            orderId: order.id,
          },
          ...items,
        ]);
      }
    }
    setToast(
      result === "reviewing"
        ? "İtiraz uzman incelemesine alındı."
        : "İtiraz sonuçlandırıldı.",
    );
  }

  function submitReview(orderId: string, rating: number, text: string) {
    const order = orders.find((item) => item.id === orderId);
    const auction = auctions.find((item) => item.id === order?.auctionId);
    if (!order || !auction) return;
    if (order.buyerId !== currentUser.id)
      return setToast("Bu işlemi yalnızca alıcı değerlendirebilir.");
    if (order.paymentStatus !== "released" && order.shipmentStatus !== "approved")
      return setToast("Değerlendirme için siparişin tamamlanması gerekiyor.");
    if (reviews.some((review) => review.orderId === orderId))
      return setToast("Bu işlem daha önce değerlendirildi.");
    if (rating < 1 || rating > 5 || text.trim().length < 5)
      return setToast("Puan seç ve en az 5 karakter yorum yaz.");
    setReviews((items) => [
      {
        id: `review-${Date.now()}`,
        orderId,
        sellerId: order.sellerId,
        reviewer: currentUser.name,
        rating,
        text: text.trim(),
        product: auction.title,
        createdAt: new Date().toISOString(),
      },
      ...items,
    ]);
    addNotice(
      "Değerlendirmen yayınlandı",
      `${auction.title} işlemi için ${rating} yıldız verdin.`,
      auction.id,
    );
    setToast("Değerlendirmen satıcı profiline eklendi.");
  }

  function activateMembership(tier: MembershipTier) {
    if (tier === membership.tier) {
      setToast("Bu plan zaten aktif.");
      return;
    }
    const plan = membershipMeta[tier];
    if (plan.price > walletBalance) {
      setToast(`${money.format(plan.price - walletBalance)} bakiye eksik.`);
      return;
    }
    if (plan.price > 0) {
      setWalletBalance((value) => value - plan.price);
      setWalletTransactions((items) => [
        {
          id: `membership-${Date.now()}`,
          type: "purchase",
          title: `${plan.name} aylık üyelik`,
          amount: -plan.price,
          createdAt: new Date().toISOString(),
          status: "completed",
        },
        ...items,
      ]);
    }
    const startedAt = new Date();
    const renewAt = new Date(startedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    setMembership({
      tier,
      autoRenew: tier === "free" ? false : true,
      startedAt: startedAt.toISOString(),
      renewAt: tier === "free" ? undefined : renewAt.toISOString(),
    });
    addNotice(
      "Üyelik planın güncellendi",
      `${plan.name} aktif. Satış hizmet bedelin artık %${plan.commission}.`,
    );
    setToast(`${plan.name} başarıyla aktif edildi.`);
  }

  function saveBusinessAccount(next: BusinessAccount) {
    setBusinessAccount({ ...next, updatedAt: new Date().toISOString() });
    setToast("Kurumsal hesap ve fatura bilgileri kaydedildi.");
  }

  function updateBusinessVerification(status: BusinessVerificationStatus) {
    setBusinessAccount((current) => ({
      ...current,
      verificationStatus: status,
      updatedAt: new Date().toISOString(),
    }));
    if (status === "pending") {
      addNotice(
        "Şirket doğrulama başvurusu alındı",
        "Vergi ve şirket bilgilerin inceleme sırasına alındı.",
      );
      setToast("Şirket doğrulama başvurusu incelemeye gönderildi.");
    } else if (status === "verified") {
      addNotice(
        "Kurumsal hesabın doğrulandı",
        "Fatura ve şirket rozetin kullanıma açıldı.",
      );
      setToast("Kurumsal satıcı doğrulaması tamamlandı.");
    }
  }

  function saveAddress(next: AddressRecord) {
    setAddresses((items) => {
      const normalized = next.isDefault
        ? items.map((item) => ({ ...item, isDefault: false }))
        : items;
      const exists = normalized.some((item) => item.id === next.id);
      return exists
        ? normalized.map((item) => (item.id === next.id ? next : item))
        : [next, ...normalized];
    });
    setToast("Adres bilgileri kaydedildi.");
  }

  function deleteAddress(id: string) {
    setAddresses((items) => {
      if (items.length <= 1) {
        setToast("En az bir teslimat adresi bulunmalı.");
        return items;
      }
      const remaining = items.filter((item) => item.id !== id);
      if (!remaining.some((item) => item.isDefault))
        remaining[0] = { ...remaining[0], isDefault: true };
      return remaining;
    });
  }

  function makeDefaultAddress(id: string) {
    setAddresses((items) =>
      items.map((item) => ({ ...item, isDefault: item.id === id })),
    );
    setToast("Varsayılan teslimat adresi güncellendi.");
  }

  function createShipmentLabel(input: Omit<ShipmentLabel, "id" | "trackingNumber" | "status" | "createdAt">) {
    const trackingNumber = `AP${Date.now().toString().slice(-10)}`;
    const label: ShipmentLabel = {
      ...input,
      id: `label-${Date.now()}`,
      trackingNumber,
      status: "created",
      createdAt: new Date().toISOString(),
    };
    setShipmentLabels((items) => [
      label,
      ...items.filter((item) => item.orderId !== input.orderId),
    ]);
    setOrders((items) =>
      items.map((order) =>
        order.id === input.orderId
          ? {
              ...order,
              carrier: input.carrier,
              trackingNumber,
              shipmentStatus: "prepared",
              updatedAt: new Date().toISOString(),
            }
          : order,
      ),
    );
    addNotice(
      "Kargo etiketi oluşturuldu",
      `${input.carrier} gönderisi için ${trackingNumber} takip kodu hazır.`,
    );
    setToast("Kargo etiketi ve takip kodu oluşturuldu.");
  }

  function markShipmentPrinted(labelId: string) {
    setShipmentLabels((items) =>
      items.map((item) =>
        item.id === labelId ? { ...item, status: "printed" } : item,
      ),
    );
    setToast("Etiket yazdırmaya hazırlandı.");
  }

  function handOverShipment(labelId: string) {
    const label = shipmentLabels.find((item) => item.id === labelId);
    if (!label) return;
    setShipmentLabels((items) =>
      items.map((item) =>
        item.id === labelId ? { ...item, status: "handed_over" } : item,
      ),
    );
    setOrders((items) =>
      items.map((order) =>
        order.id === label.orderId
          ? { ...order, shipmentStatus: "shipped", updatedAt: new Date().toISOString() }
          : order,
      ),
    );
    addNotice(
      "Sipariş kargoya verildi",
      `${label.carrier} gönderisi ${label.trackingNumber} koduyla yola çıktı.`,
    );
    setToast("Sipariş kargoya teslim edildi olarak işaretlendi.");
  }

  function pushAuditLog(
    action: string,
    target: string,
    details: string,
    severity: AuditSeverity = "info",
  ) {
    setAuditLogs((items) => [
      {
        id: `audit-${Date.now()}`,
        actor: currentUser.name,
        action,
        target,
        details,
        severity,
        createdAt: new Date().toISOString(),
      },
      ...items,
    ]);
  }

  function updateUserCaseStatus(id: string, status: UserCaseStatus) {
    const item = userCases.find((entry) => entry.id === id);
    if (!item) return;
    setUserCases((items) =>
      items.map((entry) =>
        entry.id === id
          ? { ...entry, status, updatedAt: new Date().toISOString() }
          : entry,
      ),
    );
    const action =
      status === "reviewing"
        ? "Şikâyet incelemeye alındı"
        : status === "resolved"
          ? "Şikâyet sonuçlandırıldı"
          : "Şikâyet yeniden açıldı";
    pushAuditLog(action, item.userName, item.reason, status === "resolved" ? "info" : "warning");
    setToast(action);
  }

  function toggleUserBlock(id: string) {
    const item = userCases.find((entry) => entry.id === id);
    if (!item) return;
    const blocked = !item.blocked;
    setUserCases((items) =>
      items.map((entry) =>
        entry.id === id
          ? { ...entry, blocked, updatedAt: new Date().toISOString() }
          : entry,
      ),
    );
    pushAuditLog(
      blocked ? "Kullanıcı geçici olarak engellendi" : "Kullanıcı engeli kaldırıldı",
      item.userName,
      item.reason,
      blocked ? "critical" : "info",
    );
    setToast(blocked ? "Kullanıcının işlemleri durduruldu." : "Kullanıcı engeli kaldırıldı.");
  }

  function toggleSystemSetting(key: SystemToggleKey) {
    const labels: Record<SystemToggleKey, string> = {
      maintenanceMode: "Bakım modu",
      newListingsEnabled: "Yeni ilan kabulü",
      paymentsEnabled: "Ödeme işlemleri",
      autoModeration: "Otomatik moderasyon",
    };
    const nextValue = !systemSettings[key];
    setSystemSettings((current) => ({ ...current, [key]: nextValue }));
    pushAuditLog(
      `${labels[key]} ${nextValue ? "açıldı" : "kapatıldı"}`,
      "Platform ayarları",
      "Ayar yönetici operasyon merkezinden değiştirildi.",
      key === "paymentsEnabled" && !nextValue ? "critical" : "warning",
    );
  }

  function createSystemBackup() {
    const createdAt = new Date().toISOString();
    setSystemSettings((current) => ({ ...current, lastBackup: createdAt }));
    pushAuditLog(
      "Manuel sistem yedeği oluşturuldu",
      "Veri güvenliği",
      "Demo platform verileri başarıyla yedeklendi.",
      "info",
    );
    setToast("Sistem yedeği oluşturuldu.");
  }

  function resetDemo() {
    if (supabase) return;
    setAuctions(seedAuctions);
    setBids(seedBids);
    setNotices(seedNotices);
    setOrders(seedOrders);
    setAutoBids(seedAutoBids);
    setMessages(seedMessages);
    setWalletBalance(seedWalletBalance);
    setWalletTransactions(seedWalletTransactions);
    setVerification(seedVerification);
    setFollowedSellers(seedFollowedSellers);
    setReminders(seedReminders);
    setCoupons(seedCoupons);
    setReviews(seedReviews);
    setDisputes(seedDisputes);
    setFinalizedAuctionIds(seedFinalizedAuctionIds);
    setSavedSearches(seedSavedSearches);
    setPromotions(seedPromotions);
    setDrafts(seedDrafts);
    setAutoRelistIds(seedAutoRelistIds);
    setMembership(seedMembership);
    setBusinessAccount(seedBusinessAccount);
    setInvoiceRecords(seedInvoiceRecords);
    setAddresses(seedAddresses);
    setShipmentLabels(seedShipmentLabels);
    setAuditLogs(seedAuditLogs);
    setUserCases(seedUserCases);
    setSystemSettings(seedSystemSettings);
    setCompareIds([]);
    window.localStorage.removeItem("kapiskapis-v20");
    window.localStorage.removeItem("kapiskapis-v18");
    window.localStorage.removeItem("kapiskapis-v17");
    window.localStorage.removeItem("kapiskapis-v16");
    window.localStorage.removeItem("kapiskapis-v15");
    window.localStorage.removeItem("kapiskapis-v14");
    window.localStorage.removeItem("kapiskapis-v13");
    window.localStorage.removeItem("kapiskapis-v12");
    window.localStorage.removeItem("kapiskapis-v11");
    window.localStorage.removeItem("kapiskapis-v10");
    window.localStorage.removeItem("kapiskapis-v9");
    window.localStorage.removeItem("kapiskapis-v8");
    window.localStorage.removeItem("kapiskapis-v7");
    window.localStorage.removeItem("kapiskapis-v6");
    window.localStorage.removeItem("kapiskapis-v5");
    window.localStorage.removeItem("kapiskapis-v4");
    window.localStorage.removeItem("kapiskapis-v3");
    window.localStorage.removeItem("kapiskapis-moderation-v4");
    setModeration({ "2": "pending", "4": "pending", "6": "pending" });
    navigate("home");
    setToast("Demo verileri sıfırlandı.");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuctions([]);
    setBids([]);
    setNotices([]);
    setOrders([]);
    setAutoBids([]);
    setMessages([]);
    setWalletBalance(0);
    setWalletTransactions([]);
    setVerification({
      phone: false,
      identity: false,
      bank: false,
      twoFactor: false,
    });
    setFollowedSellers([]);
    setReminders([]);
    setCoupons([]);
    setReviews([]);
    setDisputes([]);
    setFinalizedAuctionIds([]);
    setSavedSearches([]);
    setPromotions([]);
    setDrafts([]);
    setAutoRelistIds([]);
    setMembership(seedMembership);
    setCompareIds([]);
    setCurrentUser(DEMO_USER);
    navigate("home");
  }

  function activatePromotion(auctionId: string, plan: Promotion["plan"], price: number) {
    if (liveMode) {
      setToast("Canlı öne çıkarma ödeme sağlayıcısı bağlandığında açılacak.");
      return;
    }
    if (walletBalance < price) {
      setToast("Cüzdan bakiyesi bu öne çıkarma paketi için yetersiz.");
      return;
    }
    const durationHours = plan === "24h" ? 24 : plan === "3d" ? 72 : 168;
    setWalletBalance((value) => value - price);
    setWalletTransactions((items) => [
      {
        id: `promotion-${Date.now()}`,
        type: "purchase",
        title: "İlan öne çıkarma paketi",
        amount: -price,
        status: "completed",
        createdAt: new Date().toISOString(),
      },
      ...items,
    ]);
    setPromotions((items) => [
      {
        auctionId,
        plan,
        price,
        expiresAt: new Date(Date.now() + durationHours * 3_600_000).toISOString(),
        impressions: 0,
        clicks: 0,
        createdAt: new Date().toISOString(),
      },
      ...items.filter((item) => item.auctionId !== auctionId),
    ]);
    setToast("İlan öne çıkarıldı ve ana sayfa vitrini aktif edildi.");
  }

  function advanceOrder(orderId: string) {
    if (liveMode) {
      setToast(
        "Canlı ödeme ve kargo işlemleri ödeme sağlayıcısı bağlandığında açılacak.",
      );
      return;
    }
    setOrders((items) =>
      items.map((order) => {
        if (order.id !== orderId) return order;
        if (order.paymentStatus === "pending")
          return {
            ...order,
            paymentStatus: "held",
            updatedAt: new Date().toISOString(),
          };
        if (order.shipmentStatus === "waiting")
          return {
            ...order,
            shipmentStatus: "prepared",
            updatedAt: new Date().toISOString(),
          };
        if (order.shipmentStatus === "prepared")
          return {
            ...order,
            shipmentStatus: "shipped",
            trackingNumber:
              order.trackingNumber || `AP${Date.now().toString().slice(-9)}`,
            updatedAt: new Date().toISOString(),
          };
        if (order.shipmentStatus === "shipped")
          return {
            ...order,
            shipmentStatus: "delivered",
            updatedAt: new Date().toISOString(),
          };
        if (order.shipmentStatus === "delivered")
          return {
            ...order,
            shipmentStatus: "approved",
            paymentStatus: "released",
            updatedAt: new Date().toISOString(),
          };
        return order;
      }),
    );
    setToast("Sipariş adımı güncellendi.");
  }

  function openLiveRoom(id: string) {
    setSelectedId(id);
    setScreen("liveRoom");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function askAuctionQuestion(auctionId: string, text: string) {
    const clean = text.trim();
    if (!clean) return;
    setQuestions((items) => [
      {
        id: `question-${Date.now()}`,
        auctionId,
        userId: currentUser.id,
        userName: currentUser.name,
        question: clean,
        createdAt: new Date().toISOString(),
      },
      ...items,
    ]);
    setToast("Sorun satıcıya iletildi.");
  }

  function answerAuctionQuestion(questionId: string, answer: string) {
    const clean = answer.trim();
    if (!clean) return;
    setQuestions((items) =>
      items.map((item) =>
        item.id === questionId
          ? { ...item, answer: clean, answeredAt: new Date().toISOString() }
          : item,
      ),
    );
    setToast("Yanıt yayınlandı.");
  }

  async function shareAuction(auction: Auction) {
    const url = `${window.location.origin}/?auction=${encodeURIComponent(auction.id)}`;
    const text = `${auction.title} açık artırmasına göz at: ${money.format(auction.currentBid)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: auction.title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        setToast("İlan bağlantısı kopyalandı.");
      }
    } catch {
      setToast("Paylaşım iptal edildi.");
    }
  }

  if (!authReady)
    return <LoadingScreen text="Supabase oturumu kontrol ediliyor…" />;
  if (supabase && !authUser) return <AuthGate />;

  return (
    <main className="app-shell">
      {screen !== "detail" && (
        <header className="topbar">
          <button
            className="brand"
            onClick={() => navigate("home")}
            aria-label="Ana sayfa"
          >
            <img className="brand-logo" src="/kapiskapis-logo.svg" alt="KapışKapış" />
            <span>
              <strong>KapışKapış</strong>
              <small>Beğendiysen bekleme, KapışKapış kap!</small>
            </span>
          </button>
          <div className="topbar-actions">
            <button
              className="topbar-live-button"
              onClick={() => navigate("liveLobby")}
              aria-label="Canlı açık artırma odaları"
            >
              <i /> CANLI
            </button>
            <span className={liveMode ? "demo-pill live" : "demo-pill"}>
              ● {liveMode ? "KAPIŞKAPIŞ CANLI · BETA" : "KAPIŞKAPIŞ ÖNİZLEME · V21"}
            </span>
            <button
              className="icon-button"
              onClick={openNotifications}
              aria-label="Bildirimler"
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-count">{unreadCount}</span>
              )}
            </button>
          </div>
        </header>
      )}

      {remoteLoading && liveMode && (
        <div className="sync-banner">Supabase verileri eşitleniyor…</div>
      )}

      {screen === "home" && (
        <section className="page">
          <div className="hero">
            <div>
              <span className="eyebrow">CANLI AÇIK ARTIRMALAR</span>
              <h1>
                İkinci el ürünün
                <br />
                gerçek değerini bul.
              </h1>
              <p>
                Doğrulanmış kullanıcılar, korumalı ödeme ve zamanlı teklifler.
              </p>
              <div className="hero-actions">
                <button className="hero-cta" onClick={() => navigate("sell")}>
                  Ürününü açık artırmaya çıkar <span>→</span>
                </button>
                <button className="hero-live-cta" onClick={() => navigate("liveLobby")}>
                  <i /> Canlı odaları izle
                </button>
              </div>
            </div>
            <div className="hero-metric">
              <strong>{liveMode ? auctions.length : "₺2,4M"}</strong>
              <span>
                {liveMode
                  ? "Veritabanındaki canlı ilan"
                  : "Bu hafta verilen teklif"}
              </span>
              <small>{liveMode ? "Supabase bağlı" : "↗ %18 büyüme"}</small>
            </div>
          </div>

          <div className="toolbar">
            <div className="search-composer">
              <label className="search-box">
                <span>⌕</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Telefon, bilgisayar, konsol ara"
                />
              </label>
              {searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  <small>AKILLI ÖNERİLER</small>
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion.split(" · ")[0])}
                    >
                      <span>⌕</span>{suggestion}<b>→</b>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className={
                filterOpen || activeFilterCount
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setFilterOpen((value) => !value)}
            >
              ☷ Filtre{activeFilterCount > 0 && <b>{activeFilterCount}</b>}
            </button>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sıralama"
            >
              <option>Bitenler</option>
              <option>Yeni</option>
              <option>Fiyat düşük</option>
              <option>Fiyat yüksek</option>
            </select>
          </div>

          {filterOpen && (
            <div className="filter-panel">
              <div className="filter-head">
                <div>
                  <strong>Gelişmiş filtreler</strong>
                  <small>İlanları bütçe, konum ve süreye göre daralt</small>
                </div>
                <div className="filter-head-actions">
                  <button onClick={saveCurrentSearch}>Aramayı kaydet</button>
                  <button onClick={clearFilters}>Temizle</button>
                </div>
              </div>
              <div className="filter-grid">
                <label>
                  Ürün durumu
                  <select
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                  >
                    <option>Tümü</option>
                    <option>Sıfır</option>
                    <option>Çok iyi</option>
                    <option>İyi</option>
                    <option>Orta</option>
                  </select>
                </label>
                <label>
                  Şehir
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  >
                    {cities.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                </label>
                <label>
                  En yüksek teklif
                  <input
                    type="number"
                    min="0"
                    value={maxPrice || ""}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    placeholder="Örn. 30000"
                  />
                </label>
                <label>
                  Bitiş süresi
                  <select
                    value={endingFilter}
                    onChange={(e) => setEndingFilter(e.target.value)}
                  >
                    <option value="Tümü">Tümü</option>
                    <option value="1">1 saat içinde</option>
                    <option value="6">6 saat içinde</option>
                    <option value="24">24 saat içinde</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          <div className="chips" aria-label="Kategoriler">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "chip active" : "chip"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <StoreShowcase
            storefronts={storefronts}
            auctions={auctions}
            followedSellers={followedSellers}
            onOpen={openStorefront}
          />

          <LiveRoomShowcase
            auctions={auctions}
            now={now}
            onOpen={openLiveRoom}
            onAll={() => navigate("liveLobby")}
          />

          <FeaturedAuctions
            auctions={auctions.filter((auction) =>
              promotions.some(
                (promotion) =>
                  promotion.auctionId === auction.id &&
                  new Date(promotion.expiresAt).getTime() > now,
              ),
            )}
            now={now}
            onOpen={openAuction}
          />

          <div className="safety-banner">
            <span>🛡️</span>
            <div>
              <strong>Alıcı koruması aktif</strong>
              <small>
                Ödeme, ürün sana ulaşana kadar güvenli hesapta tutulur.
              </small>
            </div>
            <b>Detaylar ›</b>
          </div>

          <div className="section-heading">
            <div>
              <span className="live-dot" /> <strong>Canlı ilanlar</strong>
            </div>
            <span>{filtered.length} ilan</span>
          </div>
          <AuctionGrid
            auctions={filtered}
            now={now}
            onOpen={openAuction}
            onFavorite={toggleFavorite}
            compareIds={compareIds}
            onCompare={toggleCompare}
            empty={
              liveMode ? (
                <EmptyState
                  icon="＋"
                  title="Henüz canlı ilan yok"
                  text="İlan Ver düğmesinden Supabase üzerindeki ilk açık artırmanı oluştur."
                />
              ) : undefined
            }
          />
        </section>
      )}

      {screen === "favorites" && (
        <section className="page">
          <ScreenTitle
            title="Favorilerim"
            text="Takip ettiğin açık artırmalar"
          />
          <AuctionGrid
            auctions={auctions.filter((item) => item.favorite)}
            now={now}
            onOpen={openAuction}
            onFavorite={toggleFavorite}
            empty={
              <EmptyState
                icon="♡"
                title="Henüz favorin yok"
                text="Takip etmek istediğin ilanlardaki kalp simgesine dokun."
              />
            }
          />
        </section>
      )}

      {screen === "sell" && (
        <SellForm
          currentUser={currentUser}
          liveMode={liveMode}
          onCreate={createAuction}
          onSaveDraft={saveDraft}
          onCancel={() => navigate("home")}
        />
      )}
      {screen === "bids" && (
        <BidsScreen
          currentUser={currentUser}
          bids={bids}
          auctions={auctions}
          autoBids={autoBids}
          now={now}
          onOpen={openAuction}
        />
      )}
      {screen === "profile" && (
        <Profile
          currentUser={currentUser}
          liveMode={liveMode}
          unreadMessages={unreadMessages}
          walletBalance={walletBalance}
          membership={membership}
          businessAccount={businessAccount}
          verification={verification}
          followedCount={followedSellers.length}
          reminderCount={reminders.filter((item) => item.active).length}
          couponCount={
            coupons.filter(
              (item) => !item.used && new Date(item.expiresAt).getTime() > now,
            ).length
          }
          disputeCount={activeDisputeCount}
          reviewableCount={reviewableCount}
          savedSearchCount={savedSearches.length}
          promotionCount={promotions.filter((item) => new Date(item.expiresAt).getTime() > now).length}
          draftCount={drafts.length}
          onWallet={() => navigate("wallet")}
          onVerification={() => navigate("verification")}
          onTrustCenter={() => navigate("trustCenter")}
          onMessages={() => openMessages()}
          onListings={() => navigate("myListings")}
          onBids={() => navigate("bids")}
          onOrders={() => navigate("orders")}
          onSellerCenter={() => navigate("sellerCenter")}
          onSellerAnalytics={() => navigate("sellerAnalytics")}
          onSavedSearches={() => navigate("savedSearches")}
          onPromotions={() => navigate("promotions")}
          onListingManager={() => navigate("listingManager")}
          onStoreManager={() => navigate("storeManager")}
          onMembership={() => navigate("membership")}
          onBusinessAccount={() => navigate("businessAccount")}
          onFinanceReports={() => navigate("financeReports")}
          onAddresses={() => navigate("addresses")}
          onShippingOperations={() => navigate("shippingOperations")}
          onOperationsCenter={() => navigate("operationsCenter")}
          onLiveSystem={() => navigate("liveSystem")}
          onFollowing={() => navigate("following")}
          onReminders={() => navigate("reminders")}
          onCoupons={() => navigate("coupons")}
          onAuctionResults={() => navigate("auctionResults")}
          onDisputes={() => navigate("disputes")}
          onReviews={() => navigate("reviews")}
          onSecurity={() => navigate("security")}
          onSupport={() => navigate("support")}
          showAdmin={canAccessAdmin}
          onAdmin={() => navigate("admin")}
          onReset={resetDemo}
          onSignOut={signOut}
        />
      )}
      {screen === "myListings" && (
        <MyListings
          auctions={auctions.filter(
            (auction) => auction.sellerId === currentUser.id,
          )}
          now={now}
          onOpen={openAuction}
        />
      )}
      {screen === "orders" && (
        <OrdersScreen
          currentUser={currentUser}
          orders={orders}
          auctions={auctions}
          liveMode={liveMode}
          onOpen={openAuction}
          onAdvance={advanceOrder}
          onCheckout={(id) => openOrderFlow(id, "checkout")}
          onTrack={(id) => openOrderFlow(id, "shipment")}
          onMessage={(auctionId, participantId) =>
            openMessages(auctionId, participantId)
          }
        />
      )}
      {screen === "sellerCenter" && (
        <SellerCenter
          currentUser={currentUser}
          auctions={auctions}
          orders={orders}
          now={now}
          onOpen={openAuction}
          onSell={() => navigate("sell")}
          onAnalytics={() => navigate("sellerAnalytics")}
        />
      )}
      {screen === "savedSearches" && (
        <SavedSearchesScreen
          items={savedSearches}
          auctions={auctions}
          now={now}
          onApply={applySavedSearch}
          onToggleNotify={toggleSavedSearchNotification}
          onDelete={deleteSavedSearch}
        />
      )}
      {screen === "sellerAnalytics" && (
        <SellerAnalyticsScreen
          currentUser={currentUser}
          auctions={auctions}
          bids={bids}
          orders={orders}
          now={now}
          onOpen={openAuction}
        />
      )}
      {screen === "promotions" && (
        <PromotionsCenter
          currentUser={currentUser}
          auctions={auctions}
          promotions={promotions}
          walletBalance={walletBalance}
          now={now}
          onOpen={openAuction}
          onActivate={activatePromotion}
        />
      )}
      {screen === "listingManager" && (
        <ListingManager
          auctions={auctions.filter((auction) => auction.sellerId === currentUser.id)}
          drafts={drafts}
          autoRelistIds={autoRelistIds}
          now={now}
          onOpen={openAuction}
          onPublishDraft={publishDraft}
          onDeleteDraft={deleteDraft}
          onToggleAutoRelist={toggleAutoRelist}
          onExtend={extendListings}
          onRelist={relistListings}
          onSell={() => navigate("sell")}
        />
      )}
      {screen === "compare" && (
        <CompareScreen
          auctions={auctions.filter((auction) => compareIds.includes(auction.id))}
          bids={bids}
          now={now}
          onOpen={openAuction}
          onRemove={toggleCompare}
          onClear={() => setCompareIds([])}
        />
      )}
      {screen === "security" && <SecurityCenter liveMode={liveMode} />}
      {screen === "support" && <SupportCenter />}
      {screen === "sellerProfile" && (
        <SellerProfile
          sellerId={selectedSellerId || selected?.sellerId || ""}
          auctions={auctions}
          now={now}
          followed={followedSellers.includes(
            selectedSellerId || selected?.sellerId || "",
          )}
          reviews={reviews}
          onFollow={toggleFollowSeller}
          onOpen={openAuction}
          onStore={() =>
            openStorefront(selectedSellerId || selected?.sellerId || "")
          }
        />
      )}
      {screen === "storefront" && (
        <StorefrontScreen
          sellerId={selectedSellerId || currentUser.id}
          profile={
            storefronts.find(
              (item) => item.sellerId === (selectedSellerId || currentUser.id),
            )
          }
          auctions={auctions}
          reviews={reviews}
          now={now}
          followed={followedSellers.includes(selectedSellerId || currentUser.id)}
          isOwner={(selectedSellerId || currentUser.id) === currentUser.id}
          onFollow={toggleFollowSeller}
          onOpen={openAuction}
          onManage={() => navigate("storeManager")}
        />
      )}
      {screen === "storeManager" && (
        <StoreManagerScreen
          currentUser={currentUser}
          profile={storefronts.find((item) => item.sellerId === currentUser.id)}
          auctions={auctions.filter((item) => item.sellerId === currentUser.id)}
          onSave={saveStorefront}
          onPreview={() => openStorefront(currentUser.id)}
        />
      )}
      {screen === "membership" && (
        <MembershipScreen
          membership={membership}
          walletBalance={walletBalance}
          auctions={auctions.filter((item) => item.sellerId === currentUser.id)}
          onSelect={activateMembership}
          onToggleRenew={() =>
            setMembership((current) => ({
              ...current,
              autoRenew: !current.autoRenew,
            }))
          }
          onCancel={() => {
            setMembership(seedMembership);
            setToast("Üyelik yenilemesi durduruldu. Başlangıç planına geçtin.");
          }}
        />
      )}
      {screen === "businessAccount" && (
        <BusinessAccountScreen
          account={businessAccount}
          currentUser={currentUser}
          onSave={saveBusinessAccount}
          onVerification={updateBusinessVerification}
        />
      )}
      {screen === "financeReports" && (
        <FinanceReportsScreen
          account={businessAccount}
          membership={membership}
          orders={orders}
          auctions={auctions}
          currentUser={currentUser}
          invoiceRecords={invoiceRecords}
        />
      )}
      {screen === "addresses" && (
        <AddressBookScreen
          addresses={addresses}
          onSave={saveAddress}
          onDelete={deleteAddress}
          onDefault={makeDefaultAddress}
        />
      )}
      {screen === "shippingOperations" && (
        <ShippingOperationsScreen
          currentUser={currentUser}
          orders={orders}
          auctions={auctions}
          labels={shipmentLabels}
          onCreate={createShipmentLabel}
          onPrinted={markShipmentPrinted}
          onHandOver={handOverShipment}
          onOpenOrder={(id) => openOrderFlow(id, "shipment")}
        />
      )}
      {screen === "liveSystem" && (
        <LiveSystemCenter
          currentUser={currentUser}
          auctions={auctions}
          bids={bids}
          notices={notices}
          orders={orders}
          liveMode={liveMode}
        />
      )}
      {screen === "operationsCenter" && canAccessAdmin && (
        <OperationsCenter
          logs={auditLogs}
          cases={userCases}
          settings={systemSettings}
          onCaseStatus={updateUserCaseStatus}
          onToggleBlock={toggleUserBlock}
          onToggleSetting={toggleSystemSetting}
          onBackup={createSystemBackup}
        />
      )}
      {screen === "admin" && canAccessAdmin && (
        <AdminPanel
          auctions={auctions}
          bids={bids}
          orders={orders}
          moderation={moderation}
          onModerate={moderateAuction}
          onOpen={openAuction}
        />
      )}
      {screen === "messages" && (
        <MessagesScreen
          currentUser={currentUser}
          auctions={auctions}
          messages={messages}
          selectedConversationId={selectedConversationId}
          onSelect={(id) => {
            setSelectedConversationId(id);
            setMessages((items) =>
              items.map((message) =>
                message.conversationId === id
                  ? { ...message, read: true }
                  : message,
              ),
            );
          }}
          onSend={sendMessage}
          onOpenAuction={openAuction}
        />
      )}
      {screen === "checkout" && selectedOrder && (
        <CheckoutScreen
          order={selectedOrder}
          auction={auctions.find(
            (auction) => auction.id === selectedOrder.auctionId,
          )}
          walletBalance={walletBalance}
          coupons={coupons}
          addresses={addresses}
          onManageAddresses={() => navigate("addresses")}
          onUseCoupon={useCoupon}
          onPay={(method, total, addressId) =>
            completePayment(selectedOrder.id, method, total, addressId)
          }
        />
      )}
      {screen === "shipment" && selectedOrder && (
        <ShipmentScreen
          order={selectedOrder}
          auction={auctions.find(
            (auction) => auction.id === selectedOrder.auctionId,
          )}
          currentUser={currentUser}
          deliveryAddress={
            addresses.find((item) => item.id === selectedOrder.deliveryAddressId) ||
            addresses.find((item) => item.isDefault) ||
            addresses[0]
          }
          onAdvance={() => advanceOrder(selectedOrder.id)}
          onMessage={(auctionId, participantId) =>
            openMessages(auctionId, participantId)
          }
          onDispute={() => navigate("disputes")}
        />
      )}
      {screen === "notifications" && (
        <Notifications
          notices={notices}
          onOpen={openNotice}
          onReadAll={markAllNoticesRead}
        />
      )}
      {screen === "wallet" && (
        <WalletCenter
          balance={walletBalance}
          transactions={walletTransactions}
          liveMode={liveMode}
          onDeposit={addWalletFunds}
          onWithdraw={withdrawWallet}
        />
      )}
      {screen === "verification" && (
        <VerificationCenter
          state={verification}
          onComplete={completeVerification}
        />
      )}
      {screen === "trustCenter" && <TrustCenter auctions={auctions} />}
      {screen === "following" && (
        <FollowingScreen
          sellerIds={followedSellers}
          auctions={auctions}
          now={now}
          onOpen={openAuction}
          onSeller={openSeller}
        />
      )}
      {screen === "reminders" && (
        <RemindersScreen
          reminders={reminders}
          auctions={auctions}
          now={now}
          onOpen={openAuction}
          onRemove={removeReminder}
        />
      )}
      {screen === "coupons" && <CouponsScreen coupons={coupons} now={now} />}
      {screen === "auctionResults" && (
        <AuctionResultsScreen
          auctions={auctions}
          bids={bids}
          orders={orders}
          currentUser={currentUser}
          now={now}
          onOpen={openAuction}
          onOrder={(id) => {
            setSelectedOrderId(id);
            navigate("shipment");
          }}
        />
      )}
      {screen === "disputes" && (
        <DisputesCenter
          disputes={disputes}
          orders={orders}
          auctions={auctions}
          currentUser={currentUser}
          selectedOrderId={selectedOrderId}
          liveMode={liveMode}
          onCreate={openDispute}
          onResolve={resolveDispute}
        />
      )}
      {screen === "reviews" && (
        <ReviewsCenter
          reviews={reviews}
          orders={orders}
          auctions={auctions}
          currentUser={currentUser}
          onSubmit={submitReview}
        />
      )}

      {screen === "liveLobby" && (
        <LiveRoomsLobby
          auctions={auctions}
          now={now}
          onOpen={openLiveRoom}
          onDetail={openAuction}
        />
      )}

      {screen === "detail" && selected && (
        <AuctionDetail
          currentUser={currentUser}
          auction={selected}
          bids={selectedBids}
          autoBid={autoBids.find(
            (item) =>
              item.auctionId === selected.id && item.userId === currentUser.id,
          )}
          liveMode={liveMode}
          now={now}
          endingReminderActive={Boolean(
            reminders.find(
              (item) =>
                item.auctionId === selected.id &&
                item.kind === "ending" &&
                item.active,
            ),
          )}
          priceReminder={reminders.find(
            (item) =>
              item.auctionId === selected.id &&
              item.kind === "price" &&
              item.active,
          )}
          onBack={() => navigate("home")}
          onFavorite={() => toggleFavorite(selected.id)}
          onBid={(amount) => placeBid(selected.id, amount)}
          onSetAutoBid={(limit) => setAutomaticBid(selected.id, limit)}
          onDisableAutoBid={() => disableAutomaticBid(selected.id)}
          onSimulate={() => simulateCompetingBid(selected.id)}
          onToggleEndingReminder={() => toggleEndingReminder(selected.id)}
          onSetPriceReminder={(target) => setPriceReminder(selected.id, target)}
          onSeller={() => openSeller(selected.sellerId)}
          onMessage={() => openMessages(selected.id, selected.sellerId)}
          promoted={promotions.some((item) => item.auctionId === selected.id && new Date(item.expiresAt).getTime() > now)}
          questions={questions.filter((item) => item.auctionId === selected.id)}
          onAskQuestion={(text) => askAuctionQuestion(selected.id, text)}
          onAnswerQuestion={answerAuctionQuestion}
          onLiveRoom={() => openLiveRoom(selected.id)}
          onShare={() => shareAuction(selected)}
        />
      )}


      {screen === "liveRoom" && selected && (
        <LiveAuctionRoom
          auction={selected}
          bids={selectedBids}
          questions={questions.filter((item) => item.auctionId === selected.id)}
          currentUser={currentUser}
          now={now}
          onBack={() => navigate("detail")}
          onBid={(amount) => placeBid(selected.id, amount)}
          onAsk={(text) => askAuctionQuestion(selected.id, text)}
          onAnswer={answerAuctionQuestion}
          onShare={() => shareAuction(selected)}
        />
      )}

      {compareIds.length > 0 && screen !== "compare" && screen !== "liveLobby" && screen !== "liveRoom" && (
        <div className="compare-tray">
          <div>
            <strong>{compareIds.length}/3 ürün seçildi</strong>
            <small>Fiyat ve teklifleri yan yana incele</small>
          </div>
          <button onClick={() => navigate("compare")}>Karşılaştır</button>
          <button className="tray-clear" onClick={() => setCompareIds([])}>×</button>
        </div>
      )}

      {screen !== "detail" &&
        screen !== "notifications" &&
        screen !== "myListings" &&
        screen !== "orders" &&
        screen !== "sellerCenter" &&
        screen !== "security" &&
        screen !== "support" &&
        screen !== "sellerProfile" &&
        screen !== "admin" &&
        screen !== "messages" &&
        screen !== "checkout" &&
        screen !== "shipment" &&
        screen !== "wallet" &&
        screen !== "verification" &&
        screen !== "trustCenter" &&
        screen !== "following" &&
        screen !== "reminders" &&
        screen !== "coupons" &&
        screen !== "auctionResults" &&
        screen !== "disputes" &&
        screen !== "reviews" &&
        screen !== "savedSearches" &&
        screen !== "sellerAnalytics" &&
        screen !== "promotions" &&
        screen !== "listingManager" &&
        screen !== "compare" &&
        screen !== "liveLobby" &&
        screen !== "liveRoom" &&
        screen !== "storefront" &&
        screen !== "storeManager" &&
        screen !== "businessAccount" &&
        screen !== "financeReports" && (
          <nav className="bottom-nav">
            <NavButton
              icon="⌂"
              label="Ana Sayfa"
              active={screen === "home"}
              onClick={() => navigate("home")}
            />
            <NavButton
              icon="♡"
              label="Favoriler"
              active={screen === "favorites"}
              onClick={() => navigate("favorites")}
            />
            <button className="sell-button" onClick={() => navigate("sell")}>
              <span>＋</span>İlan Ver
            </button>
            <NavButton
              icon="⇄"
              label="Teklifler"
              active={screen === "bids"}
              onClick={() => navigate("bids")}
            />
            <NavButton
              icon="○"
              label="Profil"
              active={screen === "profile"}
              onClick={() => navigate("profile")}
            />
          </nav>
        )}

      {(screen === "notifications" ||
        screen === "myListings" ||
        screen === "orders" ||
        screen === "sellerCenter" ||
        screen === "security" ||
        screen === "support" ||
        screen === "sellerProfile" ||
        screen === "admin" ||
        screen === "messages" ||
        screen === "checkout" ||
        screen === "shipment" ||
        screen === "wallet" ||
        screen === "verification" ||
        screen === "trustCenter" ||
        screen === "following" ||
        screen === "reminders" ||
        screen === "coupons" ||
        screen === "auctionResults" ||
        screen === "disputes" ||
        screen === "reviews" ||
        screen === "savedSearches" ||
        screen === "sellerAnalytics" ||
        screen === "promotions" ||
        screen === "listingManager" ||
        screen === "compare" ||
        screen === "liveLobby" ||
        screen === "liveRoom" ||
        screen === "storefront" ||
        screen === "storeManager" ||
        screen === "membership" ||
        screen === "businessAccount" ||
        screen === "financeReports" ||
        screen === "liveSystem" ||
        screen === "operationsCenter") && (
        <button
          className="floating-back"
          onClick={() =>
            screen === "sellerProfile"
              ? navigate("detail")
              : screen === "checkout" || screen === "shipment"
                ? navigate("orders")
                : screen === "compare"
                  ? navigate("home")
                  : screen === "liveLobby"
                  ? navigate("home")
                  : screen === "liveRoom"
                    ? navigate("liveLobby")
                    : screen === "storefront"
                      ? navigate("sellerProfile")
                      : screen === "storeManager"
                        ? navigate("profile")
                        : navigate("profile")
          }
        >
          ← Geri
        </button>
      )}
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}


type LiveCheck = {
  id: string;
  label: string;
  status: "checking" | "ok" | "warning" | "error";
  detail: string;
};

function LiveSystemCenter({
  currentUser,
  auctions,
  bids,
  notices,
  orders,
  liveMode,
}: {
  currentUser: AppUser;
  auctions: Auction[];
  bids: Bid[];
  notices: Notice[];
  orders: Order[];
  liveMode: boolean;
}) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [checks, setChecks] = useState<LiveCheck[]>([]);
  const [running, setRunning] = useState(false);
  const [lastChecked, setLastChecked] = useState("");

  const runChecks = useCallback(async () => {
    setRunning(true);
    const initial: LiveCheck[] = [
      {
        id: "environment",
        label: "Vercel bağlantı değişkenleri",
        status: liveMode ? "ok" : "error",
        detail: liveMode
          ? "Project URL ve publishable key uygulamaya ulaşıyor."
          : "Vercel Environment Variables içinde iki Supabase değişkeni eksik.",
      },
    ];

    if (!supabase) {
      setChecks(initial);
      setLastChecked(new Date().toLocaleTimeString("tr-TR"));
      setRunning(false);
      return;
    }

    const sessionResult = await supabase.auth.getSession();
    const user = sessionResult.data.session?.user;
    initial.push({
      id: "auth",
      label: "Kullanıcı oturumu",
      status: user ? "ok" : "error",
      detail: user
        ? `${user.email ?? currentUser.name} oturumu aktif.`
        : sessionResult.error?.message ?? "Aktif kullanıcı oturumu bulunamadı.",
    });

    const tableNames = [
      "profiles",
      "auctions",
      "bids",
      "favorites",
      "notifications",
      "payments",
      "shipments",
    ] as const;
    const tableResults = await Promise.all(
      tableNames.map(async (table) => {
        const result = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });
        return { table, error: result.error, count: result.count ?? 0 };
      }),
    );

    tableResults.forEach(({ table, error, count }) => {
      initial.push({
        id: `table-${table}`,
        label: `Tablo: ${table}`,
        status: error ? "error" : "ok",
        detail: error ? error.message : `Erişim başarılı · ${count} kayıt`,
      });
    });

    const storageResult = user
      ? await supabase.storage
          .from("auction-images")
          .list(user.id, { limit: 1 })
      : { data: null, error: new Error("Oturum gerekli") };
    initial.push({
      id: "storage",
      label: "Ürün fotoğrafı deposu",
      status: storageResult.error ? "error" : "ok",
      detail: storageResult.error
        ? storageResult.error.message
        : "auction-images deposu erişilebilir.",
    });

    const failed = initial.filter((item) => item.status === "error").length;
    initial.unshift({
      id: "summary",
      label: "Canlı sistem özeti",
      status: failed === 0 ? "ok" : "warning",
      detail:
        failed === 0
          ? "Kimlik, veritabanı ve görsel deposu hazır."
          : `${failed} bağlantı kontrolü tamamlanamadı. SQL şemasını yeniden çalıştır.`,
    });

    setChecks(initial);
    setLastChecked(new Date().toLocaleTimeString("tr-TR"));
    setRunning(false);
  }, [currentUser.name, liveMode, supabase]);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const successCount = checks.filter((item) => item.status === "ok").length;
  const errorCount = checks.filter((item) => item.status === "error").length;

  return (
    <section className="page live-system-page">
      <div className="page-heading live-system-heading">
        <div>
          <span className="eyebrow">AÇIKPAZAR V20</span>
          <h1>Canlı sistem bağlantısı</h1>
          <p>
            Vercel, Supabase Auth, veritabanı, canlı teklifler ve ürün görsellerini
            tek ekrandan kontrol et.
          </p>
        </div>
        <span className={`connection-orb ${liveMode ? "online" : "offline"}`}>
          {liveMode ? "CANLI" : "DEMO"}
        </span>
      </div>

      <div className="live-summary-grid">
        <article>
          <span>Canlı ilan</span>
          <strong>{auctions.length}</strong>
          <small>Supabase auctions</small>
        </article>
        <article>
          <span>Teklif</span>
          <strong>{bids.length}</strong>
          <small>Realtime bids</small>
        </article>
        <article>
          <span>Bildirim</span>
          <strong>{notices.length}</strong>
          <small>Kullanıcıya özel</small>
        </article>
        <article>
          <span>Sipariş</span>
          <strong>{orders.length}</strong>
          <small>Ödeme + kargo</small>
        </article>
      </div>

      <div className="system-check-card">
        <div className="system-check-head">
          <div>
            <h2>Bağlantı testi</h2>
            <p>
              {lastChecked
                ? `Son kontrol: ${lastChecked}`
                : "Kontrol başlatılıyor…"}
            </p>
          </div>
          <button className="secondary-button" onClick={runChecks} disabled={running}>
            {running ? "Kontrol ediliyor…" : "Tekrar kontrol et"}
          </button>
        </div>

        <div className="check-result-list">
          {checks.map((check) => (
            <div className={`check-result ${check.status}`} key={check.id}>
              <span className="check-icon">
                {check.status === "ok"
                  ? "✓"
                  : check.status === "error"
                    ? "!"
                    : check.status === "warning"
                      ? "•"
                      : "…"}
              </span>
              <div>
                <strong>{check.label}</strong>
                <small>{check.detail}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="live-system-note">
        <strong>{errorCount === 0 ? "Canlı sistem hazır" : "Eksik kurulum bulundu"}</strong>
        <p>
          {errorCount === 0
            ? `${successCount} kontrol başarıyla geçti. İlan, teklif, favori, bildirim ve sipariş verileri artık Supabase üzerinden okunuyor.`
            : "Supabase SQL Editor içinde V20 schema.sql dosyasını çalıştır ve Vercel değişkenlerini kontrol et. Secret veya service_role anahtarını tarayıcıya ekleme."}
        </p>
      </div>
    </section>
  );
}

function LoadingScreen({ text }: { text: string }) {
  return (
    <main className="auth-shell">
      <div className="auth-card">
        <img className="auth-brand-logo" src="/kapiskapis-logo.svg" alt="KapışKapış" />
        <h1>KapışKapış</h1>
        <p>{text}</p>
        <div className="auth-loader" />
      </div>
    </main>
  );
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
      else if (!data.session)
        setMessage(
          "Kayıt oluşturuldu. E-postana gelen doğrulama bağlantısına tıkla, sonra giriş yap.",
        );
      else setMessage("Hesabın oluşturuldu ve giriş yapıldı.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMessage(error.message);
    }
    setBusy(false);
  }

  return (
    <main className="auth-shell">
      <section className="auth-card auth-form-card">
        <img className="auth-brand-logo" src="/kapiskapis-logo.svg" alt="KapışKapış" />
        <div>
          <span className="eyebrow">SUPABASE BAĞLANDI</span>
          <h1>
            {mode === "register"
              ? "İlk hesabını oluştur"
              : "KapışKapış’a giriş yap"}
          </h1>
          <p>
            Bu hesap, ilanları ve teklifleri gerçek veritabanında saklayacak.
          </p>
        </div>
        <div className="auth-tabs">
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Kayıt ol
          </button>
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Giriş yap
          </button>
        </div>
        <form onSubmit={submit}>
          {mode === "register" && (
            <label>
              Ad soyad
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                minLength={2}
                required
              />
            </label>
          )}
          <label>
            E-posta
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ornek@email.com"
              required
            />
          </label>
          <label>
            Şifre
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="En az 6 karakter"
              minLength={6}
              required
            />
          </label>
          <button className="primary-button" disabled={busy}>
            {busy
              ? "İşlem yapılıyor…"
              : mode === "register"
                ? "Hesabı oluştur"
                : "Giriş yap"}
          </button>
        </form>
        {message && <div className="auth-message">{message}</div>}
        <small className="auth-footnote">
          Bağlantı bilgileri Vercel&apos;deki <code>Environment Variables</code>
          alanından güvenli biçimde okunur. Secret veya service_role anahtarı kullanma.
        </small>
      </section>
    </main>
  );
}

function AuctionGrid({
  auctions,
  now,
  onOpen,
  onFavorite,
  compareIds = [],
  onCompare,
  empty,
}: {
  auctions: Auction[];
  now: number;
  onOpen: (id: string) => void;
  onFavorite: (id: string) => void;
  compareIds?: string[];
  onCompare?: (id: string) => void;
  empty?: React.ReactNode;
}) {
  if (auctions.length === 0)
    return (
      <>
        {empty ?? (
          <EmptyState
            icon="⌕"
            title="İlan bulunamadı"
            text="Arama veya kategori filtresini değiştirmeyi dene."
          />
        )}
      </>
    );
  return (
    <div className="auction-grid">
      {auctions.map((auction) => {
        const ended = isEnded(auction, now);
        const reserveMet = auction.currentBid >= auction.reservePrice;
        return (
          <article
            className="auction-card"
            key={auction.id}
            onClick={() => onOpen(auction.id)}
          >
            <div className="visual">
              <span className={ended ? "countdown ended" : "countdown"}>
                {ended ? "Sona erdi" : `⏱ ${remaining(auction.endsAt, now)}`}
              </span>
              <button
                className={auction.favorite ? "favorite active" : "favorite"}
                onClick={(event) => {
                  event.stopPropagation();
                  onFavorite(auction.id);
                }}
                aria-label="Favoriye ekle"
              >
                ♥
              </button>
              {onCompare && (
                <button
                  className={compareIds.includes(auction.id) ? "compare-toggle active" : "compare-toggle"}
                  onClick={(event) => {
                    event.stopPropagation();
                    onCompare(auction.id);
                  }}
                  aria-label="Karşılaştır"
                >
                  ⇄
                </button>
              )}
              <img src={auction.image} alt="" />
              <span
                className={reserveMet ? "reserve-badge met" : "reserve-badge"}
              >
                {reserveMet ? "Taban fiyat aşıldı" : "Taban fiyat bekleniyor"}
              </span>
            </div>
            <div className="card-body">
              <div className="card-meta">
                <span className="category-label">{auction.category}</span>
                <span>{auction.city}</span>
              </div>
              <h2>{auction.title}</h2>
              <div className="price-row">
                <div>
                  <small>Güncel teklif</small>
                  <strong>{money.format(auction.currentBid)}</strong>
                </div>
                <span>{auction.bidCount} teklif</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function liveViewerCount(auction: Auction) {
  return 14 + auction.bidCount * 3 + (auction.id.charCodeAt(auction.id.length - 1) % 19);
}

function LiveRoomShowcase({
  auctions,
  now,
  onOpen,
  onAll,
}: {
  auctions: Auction[];
  now: number;
  onOpen: (id: string) => void;
  onAll: () => void;
}) {
  const rooms = auctions
    .filter((auction) => !isEnded(auction, now))
    .sort((a, b) => {
      const activity = b.bidCount - a.bidCount;
      return activity || new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
    })
    .slice(0, 3);

  if (!rooms.length) return null;
  const lead = rooms[0];

  return (
    <section className="live-showcase">
      <div className="live-showcase-head">
        <div>
          <span><i /> CANLI AÇIK ARTIRMA ODALARI</span>
          <strong>Teklifleri anlık izle, odadan ayrılmadan katıl</strong>
        </div>
        <button onClick={onAll}>Tüm canlı odalar →</button>
      </div>
      <div className="live-showcase-grid">
        <button className="live-lead-card" onClick={() => onOpen(lead.id)}>
          <div className="live-lead-image">
            <img src={lead.image} alt={lead.title} />
            <span className="live-now-badge"><i /> CANLI</span>
            <span className="live-viewer-badge">◉ {liveViewerCount(lead)} izleyici</span>
          </div>
          <div className="live-lead-content">
            <small>{lead.category} · {lead.city}</small>
            <strong>{lead.title}</strong>
            <div>
              <span><small>Güncel teklif</small><b>{money.format(lead.currentBid)}</b></span>
              <span><small>Kalan süre</small><b>{remaining(lead.endsAt, now)}</b></span>
            </div>
            <em>Canlı odaya katıl <b>→</b></em>
          </div>
        </button>
        <div className="live-mini-list">
          {rooms.slice(1).map((auction) => (
            <button key={auction.id} onClick={() => onOpen(auction.id)}>
              <img src={auction.image} alt={auction.title} />
              <div>
                <span><i /> CANLI · {liveViewerCount(auction)} kişi</span>
                <strong>{auction.title}</strong>
                <small>{remaining(auction.endsAt, now)} · {auction.bidCount} teklif</small>
                <b>{money.format(auction.currentBid)}</b>
              </div>
              <em>›</em>
            </button>
          ))}
          {rooms.length < 3 && (
            <button className="live-discover-card" onClick={onAll}>
              <span>●</span>
              <div><strong>Canlı merkezini aç</strong><small>Tüm odaları ve yaklaşan finalleri gör</small></div>
              <em>›</em>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function LiveRoomsLobby({
  auctions,
  now,
  onOpen,
  onDetail,
}: {
  auctions: Auction[];
  now: number;
  onOpen: (id: string) => void;
  onDetail: (id: string) => void;
}) {
  const [tab, setTab] = useState<"active" | "finals">("active");
  const active = auctions.filter((auction) => !isEnded(auction, now));
  const activeRooms = [...active].sort((a, b) => b.bidCount - a.bidCount);
  const finals = [...active].sort(
    (a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime(),
  );
  const list = tab === "active" ? activeRooms : finals;
  const totalViewers = active.reduce((sum, auction) => sum + liveViewerCount(auction), 0);
  const totalBids = active.reduce((sum, auction) => sum + auction.bidCount, 0);

  return (
    <section className="page live-lobby-page">
      <div className="live-lobby-hero">
        <div>
          <span><i /> AÇIKPAZAR CANLI</span>
          <h1>Açık artırmanın heyecanını anlık yaşa.</h1>
          <p>Teklif akışını izle, satıcıya soru sor ve tek dokunuşla teklif ver.</p>
        </div>
        <div className="live-lobby-stats">
          <div><strong>{active.length}</strong><small>Açık oda</small></div>
          <div><strong>{totalViewers}</strong><small>İzleyici</small></div>
          <div><strong>{totalBids}</strong><small>Toplam teklif</small></div>
        </div>
      </div>

      <div className="live-lobby-tabs">
        <button className={tab === "active" ? "active" : ""} onClick={() => setTab("active")}>
          <i /> Şimdi canlı
        </button>
        <button className={tab === "finals" ? "active" : ""} onClick={() => setTab("finals")}>
          ⏱ Yaklaşan finaller
        </button>
      </div>

      {list.length ? (
        <div className="live-room-cards">
          {list.map((auction, index) => {
            const timeLeft = new Date(auction.endsAt).getTime() - now;
            const urgent = timeLeft <= 60 * 60 * 1000;
            return (
              <article className={urgent ? "live-room-card urgent" : "live-room-card"} key={auction.id}>
                <button className="live-room-card-image" onClick={() => onOpen(auction.id)}>
                  <img src={auction.image} alt={auction.title} />
                  <span className="live-now-badge"><i /> {urgent ? "FİNAL SAATİ" : "CANLI"}</span>
                  <span className="live-viewer-badge">◉ {liveViewerCount(auction)} izleyici</span>
                </button>
                <div className="live-room-card-body">
                  <div className="live-room-rank"><span>#{index + 1}</span><small>{auction.category} · {auction.city}</small></div>
                  <h2>{auction.title}</h2>
                  <div className="live-room-metrics">
                    <div><small>Güncel teklif</small><strong>{money.format(auction.currentBid)}</strong></div>
                    <div><small>Teklif</small><strong>{auction.bidCount}</strong></div>
                    <div><small>Kalan</small><strong>{remaining(auction.endsAt, now)}</strong></div>
                  </div>
                  <div className="live-room-card-actions">
                    <button onClick={() => onOpen(auction.id)}><i /> Canlı odaya katıl</button>
                    <button onClick={() => onDetail(auction.id)}>İlanı incele</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState icon="●" title="Şu anda canlı oda yok" text="Yeni açık artırmalar başladığında burada görünecek." />
      )}

      <div className="live-lobby-info">
        <span>⚡</span>
        <div><strong>Son dakika tekliflerinde süre uzar</strong><small>Son 2 dakikada teklif gelirse açık artırma 2 dakika daha devam eder.</small></div>
      </div>
    </section>
  );
}

function FeaturedAuctions({
  auctions,
  now,
  onOpen,
}: {
  auctions: Auction[];
  now: number;
  onOpen: (id: string) => void;
}) {
  if (!auctions.length) return null;
  return (
    <section className="featured-strip">
      <div className="featured-strip-head">
        <div>
          <span>🚀 VİTRİN</span>
          <strong>Öne çıkan açık artırmalar</strong>
        </div>
        <small>Satıcılar tarafından desteklenen ilanlar</small>
      </div>
      <div className="featured-list">
        {auctions.slice(0, 3).map((auction) => (
          <button key={auction.id} onClick={() => onOpen(auction.id)}>
            <img src={auction.image} alt="" />
            <div>
              <span>{remaining(auction.endsAt, now)} kaldı</span>
              <strong>{auction.title}</strong>
              <b>{money.format(auction.currentBid)}</b>
            </div>
            <em>ÖNE ÇIKAN</em>
          </button>
        ))}
      </div>
    </section>
  );
}

function SellerBadgeRow({ sellerId, verified }: { sellerId: string; verified: boolean }) {
  const score = sellerScore(sellerId);
  const badges = [
    verified ? "Kimlik doğrulandı" : "Yeni satıcı",
    score.rating >= 4.8 ? "Yüksek puan" : "Hızlı yanıt",
    score.sales >= 15 ? "Deneyimli satıcı" : "Güvenli gönderim",
  ];
  return (
    <div className="seller-badges">
      {badges.map((badge, index) => (
        <span key={badge} className={index === 0 && verified ? "verified" : ""}>
          {index === 0 && verified ? "✓" : index === 1 ? "★" : "◆"} {badge}
        </span>
      ))}
    </div>
  );
}

function PriceAnalysis({ auction, bids }: { auction: Auction; bids: Bid[] }) {
  const history = [
    { label: "Başlangıç", amount: auction.startingBid },
    ...[...bids]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(-5)
      .map((bid, index) => ({ label: `${index + 1}. teklif`, amount: bid.amount })),
    { label: "Güncel", amount: auction.currentBid },
  ];
  const marketEstimate = Math.round(Math.max(auction.reservePrice, auction.currentBid * 1.08) / 250) * 250;
  const max = Math.max(...history.map((item) => item.amount), marketEstimate);
  const growth = Math.round(((auction.currentBid - auction.startingBid) / auction.startingBid) * 100);
  return (
    <div className="price-analysis">
      <div className="analysis-metrics">
        <div><span>Fiyat artışı</span><strong>%{growth}</strong><small>Başlangıçtan bugüne</small></div>
        <div><span>Piyasa tahmini</span><strong>{money.format(marketEstimate)}</strong><small>Benzer ilan aralığı</small></div>
        <div><span>Taban farka</span><strong>{money.format(auction.currentBid - auction.reservePrice)}</strong><small>{auction.currentBid >= auction.reservePrice ? "Satış eşiği aşıldı" : "Eşik altında"}</small></div>
      </div>
      <div className="price-chart">
        {history.map((item, index) => (
          <div key={`${item.label}-${index}`}>
            <b style={{ height: `${Math.max(10, (item.amount / max) * 100)}%` }} />
            <span>{money.format(item.amount)}</span>
            <small>{item.label}</small>
          </div>
        ))}
      </div>
      <div className="comparison-table">
        <div><span>Başlangıç fiyatı</span><b>{money.format(auction.startingBid)}</b></div>
        <div><span>Güncel teklif</span><b>{money.format(auction.currentBid)}</b></div>
        <div><span>Gizli taban fiyat</span><b>{auction.currentBid >= auction.reservePrice ? "Karşılandı" : "Henüz karşılanmadı"}</b></div>
        <div><span>Teklif rekabeti</span><b>{auction.bidCount >= 30 ? "Çok yüksek" : auction.bidCount >= 15 ? "Yüksek" : "Orta"}</b></div>
      </div>
    </div>
  );
}

function AuctionDetail({
  currentUser,
  auction,
  bids,
  autoBid,
  liveMode,
  now,
  endingReminderActive,
  priceReminder,
  onBack,
  onFavorite,
  onBid,
  onSetAutoBid,
  onDisableAutoBid,
  onSimulate,
  onToggleEndingReminder,
  onSetPriceReminder,
  onSeller,
  onMessage,
  promoted,
  questions,
  onAskQuestion,
  onAnswerQuestion,
  onLiveRoom,
  onShare,
}: {
  currentUser: AppUser;
  auction: Auction;
  bids: Bid[];
  autoBid?: AutoBid;
  liveMode: boolean;
  now: number;
  endingReminderActive: boolean;
  priceReminder?: AuctionReminder;
  onBack: () => void;
  onFavorite: () => void;
  onBid: (amount: number) => void;
  onSetAutoBid: (limit: number) => void;
  onDisableAutoBid: () => void;
  onSimulate: () => void;
  onToggleEndingReminder: () => void;
  onSetPriceReminder: (target: number) => void;
  onSeller: () => void;
  onMessage: () => void;
  promoted: boolean;
  questions: AuctionQuestion[];
  onAskQuestion: (text: string) => void;
  onAnswerQuestion: (questionId: string, answer: string) => void;
  onLiveRoom: () => void;
  onShare: () => void;
}) {
  const [amount, setAmount] = useState(
    auction.currentBid + auction.minIncrement,
  );
  const [autoLimit, setAutoLimit] = useState(
    autoBid?.maxAmount ?? auction.currentBid + auction.minIncrement * 5,
  );
  const [priceTarget, setPriceTarget] = useState(
    priceReminder?.targetPrice ?? auction.currentBid,
  );
  const [tab, setTab] = useState<"detail" | "bids" | "analysis" | "questions">("detail");
  const ended = isEnded(auction, now);
  const reserveMet = auction.currentBid >= auction.reservePrice;
  const extensionZone =
    !ended && new Date(auction.endsAt).getTime() - now <= 120_000;
  useEffect(
    () => setAmount(auction.currentBid + auction.minIncrement),
    [auction.currentBid, auction.minIncrement],
  );
  useEffect(
    () =>
      setAutoLimit(
        autoBid?.maxAmount ?? auction.currentBid + auction.minIncrement * 5,
      ),
    [autoBid?.maxAmount, auction.currentBid, auction.minIncrement],
  );
  useEffect(
    () => setPriceTarget(priceReminder?.targetPrice ?? auction.currentBid),
    [priceReminder?.targetPrice, auction.currentBid],
  );

  return (
    <section className="detail-page">
      <div className="detail-actions">
        <button onClick={onBack}>←</button>
        <div>
          <button onClick={onShare}>↗</button>
          <button onClick={onFavorite}>{auction.favorite ? "♥" : "♡"}</button>
        </div>
      </div>
      <div className="detail-visual">
        <img src={auction.image} alt={auction.title} />
        <div
          className={
            ended
              ? "detail-timer ended"
              : extensionZone
                ? "detail-timer extension"
                : "detail-timer"
          }
        >
          <small>
            {ended ? "Durum" : extensionZone ? "Uzatma bölgesi" : "Kalan süre"}
          </small>
          <strong>
            {ended ? "Sona erdi" : remaining(auction.endsAt, now)}
          </strong>
        </div>
      </div>
      <div className="detail-content">
        <div className="detail-topline">
          <span className="category-label">{auction.category}</span>
          <span>{promoted ? "🚀 Öne çıkan ilan" : `İlan #${auction.id}`}</span>
        </div>
        <h1>{auction.title}</h1>
        <button className="seller-row seller-link" onClick={onSeller}>
          <span className="avatar">{auction.seller.charAt(0)}</span>
          <div>
            <strong>
              {auction.seller} {auction.verified && <em>✓</em>}
            </strong>
            <small>
              {auction.city} · ★{" "}
              {sellerScore(auction.sellerId).rating.toFixed(1)} ·{" "}
              {sellerScore(auction.sellerId).count} değerlendirme
            </small>
          </div>
          <span className="condition">{auction.condition} ›</span>
        </button>
        <SellerBadgeRow sellerId={auction.sellerId} verified={auction.verified} />
        {auction.sellerId !== currentUser.id && (
          <button className="contact-seller" onClick={onMessage}>
            <span>💬</span>
            <div>
              <strong>Satıcıya güvenli mesaj gönder</strong>
              <small>
                Telefon veya ödeme bilgisi paylaşmadan ilan hakkında soru sor.
              </small>
            </div>
            <b>›</b>
          </button>
        )}


        <button className="live-room-cta" onClick={onLiveRoom}>
          <span className="live-dot" />
          <div>
            <strong>Canlı açık artırma odasına katıl</strong>
            <small>Teklifleri, soruları ve son dakika hareketlerini anlık izle.</small>
          </div>
          <b>CANLI ›</b>
        </button>

        <div className="bid-summary">
          <div>
            <small>Güncel teklif</small>
            <strong>{money.format(auction.currentBid)}</strong>
          </div>
          <div>
            <small>Teklif sayısı</small>
            <strong>{auction.bidCount}</strong>
          </div>
        </div>
        {extensionZone && (
          <div className="extension-alert">
            <span>⏱</span>
            <div>
              <strong>Son dakika koruması aktif</strong>
              <small>
                Şimdi gelen her geçerli teklif süreyi yeniden 2 dakikaya
                çıkarır.
              </small>
            </div>
            <b>{auction.extensionCount ?? 0} uzatma</b>
          </div>
        )}
        <div className={reserveMet ? "reserve-status met" : "reserve-status"}>
          <span>{reserveMet ? "✓" : "○"}</span>
          <div>
            <strong>
              {reserveMet
                ? "Gizli taban fiyat aşıldı"
                : "Gizli taban fiyat henüz aşılmadı"}
            </strong>
            <small>
              Satış yalnızca satıcının belirlediği minimum değer aşılırsa
              tamamlanır.
            </small>
          </div>
        </div>
        <div className="trust-strip">
          <span>🛡️ Korumalı ödeme</span>
          <span>📦 {auction.shipping}</span>
          <span>✓ Doğrulanmış ilan</span>
        </div>
        <div className="watch-tools">
          <button
            className={endingReminderActive ? "active" : ""}
            onClick={onToggleEndingReminder}
          >
            <span>⏰</span>
            <div>
              <strong>
                {endingReminderActive
                  ? "Bitiş uyarısı açık"
                  : "Bitiş uyarısı kur"}
              </strong>
              <small>Bitime 30 dakika kala bildir.</small>
            </div>
            <b>{endingReminderActive ? "✓" : "+"}</b>
          </button>
          <div className="price-alert-tool">
            <div>
              <span>🎯</span>
              <div>
                <strong>Fiyat uyarısı</strong>
                <small>Teklif bu tutardayken bildir.</small>
              </div>
            </div>
            <div>
              <input
                type="number"
                value={priceTarget}
                min={1}
                onChange={(event) => setPriceTarget(Number(event.target.value))}
              />
              <button onClick={() => onSetPriceReminder(priceTarget)}>
                {priceReminder ? "Güncelle" : "Kur"}
              </button>
            </div>
          </div>
        </div>

        <div className="detail-tabs">
          <button
            className={tab === "detail" ? "active" : ""}
            onClick={() => setTab("detail")}
          >
            Ürün detayı
          </button>
          <button
            className={tab === "bids" ? "active" : ""}
            onClick={() => setTab("bids")}
          >
            Teklif geçmişi ({bids.length})
          </button>
          <button
            className={tab === "analysis" ? "active" : ""}
            onClick={() => setTab("analysis")}
          >
            Fiyat analizi
          </button>
          <button
            className={tab === "questions" ? "active" : ""}
            onClick={() => setTab("questions")}
          >
            Soru & cevap ({questions.length})
          </button>
        </div>
        {tab === "detail" ? (
          <div className="detail-copy">
            <p>{auction.description}</p>
            <dl>
              <div>
                <dt>Durum</dt>
                <dd>{auction.condition}</dd>
              </div>
              <div>
                <dt>Konum</dt>
                <dd>{auction.city}</dd>
              </div>
              <div>
                <dt>Başlangıç</dt>
                <dd>{money.format(auction.startingBid)}</dd>
              </div>
              <div>
                <dt>Minimum artış</dt>
                <dd>{money.format(auction.minIncrement)}</dd>
              </div>
            </dl>
          </div>
        ) : tab === "bids" ? (
          <div className="bid-history">
            {bids.length ? (
              bids.map((bid, index) => (
                <div key={bid.id}>
                  <span className="rank">{index + 1}</span>
                  <div>
                    <strong>
                      {bid.userId === currentUser.id ? "Sen" : bid.userName}
                    </strong>
                    <small>{dateTime.format(new Date(bid.createdAt))}</small>
                  </div>
                  <b>{money.format(bid.amount)}</b>
                </div>
              ))
            ) : (
              <p>Henüz teklif verilmedi.</p>
            )}
          </div>
        ) : tab === "analysis" ? (
          <PriceAnalysis auction={auction} bids={bids} />
        ) : (
          <QuestionBoard
            auction={auction}
            questions={questions}
            currentUser={currentUser}
            onAsk={onAskQuestion}
            onAnswer={onAnswerQuestion}
          />
        )}

        <div
          className={autoBid?.active ? "auto-bid-card active" : "auto-bid-card"}
        >
          <div className="auto-bid-head">
            <span>⚡</span>
            <div>
              <strong>Otomatik teklif</strong>
              <small>
                Sistem, gizli limitine kadar yalnızca gereken minimum artışı
                verir.
              </small>
            </div>
            {autoBid?.active && <b>AKTİF</b>}
          </div>
          {autoBid?.active ? (
            <div className="auto-bid-active">
              <div>
                <small>Gizli limitin</small>
                <strong>{money.format(autoBid.maxAmount)}</strong>
              </div>
              <button onClick={onDisableAutoBid}>Kapat</button>
            </div>
          ) : (
            <div className="auto-bid-form">
              <div className="bid-input">
                <span>₺</span>
                <input
                  type="number"
                  value={autoLimit}
                  min={auction.currentBid + auction.minIncrement}
                  onChange={(e) => setAutoLimit(Number(e.target.value))}
                />
              </div>
              <button disabled={ended} onClick={() => onSetAutoBid(autoLimit)}>
                Otomatik teklifi aç
              </button>
            </div>
          )}
          {!liveMode && autoBid?.active && (
            <button className="simulation-button" onClick={onSimulate}>
              Rakip teklifini test et
            </button>
          )}
          <small>Limitin satıcıya ve diğer teklif verenlere gösterilmez.</small>
        </div>

        <div className="bid-box">
          <label>Teklif tutarın</label>
          <div className="quick-bids">
            <button
              onClick={() =>
                setAmount((current) => current + auction.minIncrement)
              }
            >
              +{money.format(auction.minIncrement)}
            </button>
            <button
              onClick={() =>
                setAmount((current) => current + auction.minIncrement * 2)
              }
            >
              +{money.format(auction.minIncrement * 2)}
            </button>
            <button
              onClick={() =>
                setAmount((current) => current + auction.minIncrement * 4)
              }
            >
              +{money.format(auction.minIncrement * 4)}
            </button>
          </div>
          <div className="bid-input">
            <span>₺</span>
            <input
              type="number"
              value={amount}
              min={auction.currentBid + auction.minIncrement}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <small>
            Minimum teklif:{" "}
            {money.format(auction.currentBid + auction.minIncrement)} · Son 2
            dakikadaki teklifler süreyi 2 dakika uzatır.
          </small>
          <button disabled={ended} onClick={() => onBid(amount)}>
            {ended ? "Açık artırma sona erdi" : "Teklif Ver"}
          </button>
        </div>
      </div>
    </section>
  );
}


function QuestionBoard({
  auction,
  questions,
  currentUser,
  onAsk,
  onAnswer,
}: {
  auction: Auction;
  questions: AuctionQuestion[];
  currentUser: AppUser;
  onAsk: (text: string) => void;
  onAnswer: (questionId: string, answer: string) => void;
}) {
  const [text, setText] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const isSeller = auction.sellerId === currentUser.id;
  return (
    <div className="question-board">
      {!isSeller && (
        <form
          className="question-form"
          onSubmit={(event) => {
            event.preventDefault();
            onAsk(text);
            setText("");
          }}
        >
          <div>
            <strong>Satıcıya açık soru sor</strong>
            <small>Yanıt tüm teklif verenler tarafından görülebilir.</small>
          </div>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Ürünün durumu, kutu içeriği veya kargo hakkında sor…"
            maxLength={280}
          />
          <button disabled={!text.trim()}>Soruyu yayınla</button>
        </form>
      )}
      <div className="question-list">
        {questions.length ? questions.map((item) => (
          <article key={item.id}>
            <div className="question-meta">
              <span>{item.userName.charAt(0)}</span>
              <div>
                <strong>{item.userId === currentUser.id ? "Sen" : item.userName}</strong>
                <small>{dateTime.format(new Date(item.createdAt))}</small>
              </div>
            </div>
            <p>{item.question}</p>
            {item.answer ? (
              <div className="seller-answer">
                <b>Satıcının yanıtı</b>
                <p>{item.answer}</p>
                <small>{item.answeredAt ? dateTime.format(new Date(item.answeredAt)) : ""}</small>
              </div>
            ) : isSeller ? (
              <form
                className="answer-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  onAnswer(item.id, answers[item.id] || "");
                  setAnswers((value) => ({ ...value, [item.id]: "" }));
                }}
              >
                <input
                  value={answers[item.id] || ""}
                  onChange={(event) => setAnswers((value) => ({ ...value, [item.id]: event.target.value }))}
                  placeholder="Satıcı yanıtını yaz…"
                />
                <button>Yanıtla</button>
              </form>
            ) : (
              <small className="waiting-answer">Satıcının yanıtı bekleniyor</small>
            )}
          </article>
        )) : <p className="empty-copy">Bu ilan için henüz soru sorulmadı.</p>}
      </div>
    </div>
  );
}

function LiveAuctionRoom({
  auction,
  bids,
  questions,
  currentUser,
  now,
  onBack,
  onBid,
  onAsk,
  onAnswer,
  onShare,
}: {
  auction: Auction;
  bids: Bid[];
  questions: AuctionQuestion[];
  currentUser: AppUser;
  now: number;
  onBack: () => void;
  onBid: (amount: number) => void;
  onAsk: (text: string) => void;
  onAnswer: (questionId: string, answer: string) => void;
  onShare: () => void;
}) {
  const [amount, setAmount] = useState(auction.currentBid + auction.minIncrement);
  useEffect(() => setAmount(auction.currentBid + auction.minIncrement), [auction.currentBid, auction.minIncrement]);
  const viewers = 18 + auction.bidCount * 2 + (auction.id.charCodeAt(0) % 11);
  const activity = [
    ...bids.map((bid) => ({
      id: `bid-${bid.id}`,
      at: bid.createdAt,
      icon: "⚡",
      title: `${bid.userId === currentUser.id ? "Sen" : bid.userName} teklif verdi`,
      text: money.format(bid.amount),
    })),
    ...questions.map((item) => ({
      id: `question-${item.id}`,
      at: item.createdAt,
      icon: "💬",
      title: `${item.userId === currentUser.id ? "Sen" : item.userName} soru sordu`,
      text: item.question,
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 10);
  return (
    <section className="live-room-page">
      <header className="live-room-header">
        <button onClick={onBack}>←</button>
        <div>
          <span><i /> CANLI ODA</span>
          <strong>{auction.title}</strong>
        </div>
        <button onClick={onShare}>↗</button>
      </header>
      <div className="live-room-stage">
        <img src={auction.image} alt={auction.title} />
        <div className="room-viewers">◉ {viewers} izleyici</div>
        <div className="room-clock">
          <small>Kalan süre</small>
          <strong>{isEnded(auction, now) ? "Sona erdi" : remaining(auction.endsAt, now)}</strong>
        </div>
      </div>
      <div className="live-room-grid">
        <div className="live-room-main">
          <div className="live-price-card">
            <div><small>Güncel teklif</small><strong>{money.format(auction.currentBid)}</strong></div>
            <div><small>Teklif</small><strong>{auction.bidCount}</strong></div>
            <div><small>Minimum artış</small><strong>{money.format(auction.minIncrement)}</strong></div>
          </div>
          <div className="room-bid-box">
            <div className="quick-bids">
              {[1,2,4].map((multiplier) => (
                <button key={multiplier} onClick={() => setAmount((value) => value + auction.minIncrement * multiplier)}>
                  +{money.format(auction.minIncrement * multiplier)}
                </button>
              ))}
            </div>
            <div className="bid-input"><span>₺</span><input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /></div>
            <button disabled={isEnded(auction, now)} onClick={() => onBid(amount)}>
              {isEnded(auction, now) ? "Açık artırma bitti" : "Canlı teklif ver"}
            </button>
          </div>
          <QuestionBoard auction={auction} questions={questions} currentUser={currentUser} onAsk={onAsk} onAnswer={onAnswer} />
        </div>
        <aside className="live-activity">
          <div className="activity-head"><strong>Canlı hareketler</strong><span>ANLIK</span></div>
          {activity.length ? activity.map((item) => (
            <div className="activity-item" key={item.id}>
              <span>{item.icon}</span>
              <div><strong>{item.title}</strong><p>{item.text}</p><small>{dateTime.format(new Date(item.at))}</small></div>
            </div>
          )) : <p>Henüz hareket yok.</p>}
        </aside>
      </div>
    </section>
  );
}

function SellForm({
  currentUser,
  liveMode,
  onCreate,
  onSaveDraft,
  onCancel,
}: {
  currentUser: AppUser;
  liveMode: boolean;
  onCreate: (
    data: Omit<Auction, "id" | "bidCount" | "favorite" | "createdAt">,
  ) => void | Promise<void>;
  onSaveDraft: (draft: AuctionDraft) => void;
  onCancel: () => void;
}) {
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
  const [shipping, setShipping] = useState("Param Güvende Kargo");
  const [image, setImage] = useState("");
  const [templateKey, setTemplateKey] = useState("none");

  const templates: Record<
    string,
    {
      title: string;
      category: string;
      condition: Condition;
      description: string;
      price: number;
      reserve: number;
      increment: number;
    }
  > = {
    phone: {
      title: "iPhone 15 Pro 256 GB · Kutulu",
      category: "Telefon",
      condition: "Çok iyi",
      description:
        "Cihazın pil sağlığı, garanti durumu, kutu ve aksesuar bilgileri eksiksizdir. Kozmetik kusurlar fotoğraflarda gösterilmiştir. IMEI ve fatura bilgileri doğrulama sonrası paylaşılır.",
      price: 22000,
      reserve: 28500,
      increment: 250,
    },
    laptop: {
      title: "MacBook Air M2 · Faturalı",
      category: "Bilgisayar",
      condition: "Çok iyi",
      description:
        "İşlemci, RAM, depolama, pil döngüsü ve garanti bilgileri ilanda belirtilmiştir. Ekran, klavye ve kasa durumu fotoğraflarda ayrıntılı gösterilir.",
      price: 18000,
      reserve: 24000,
      increment: 250,
    },
    console: {
      title: "PlayStation 5 Slim · 2 Kol",
      category: "Oyun",
      condition: "İyi",
      description:
        "Konsol, iki kontrolcü, güç ve HDMI kablosuyla teslim edilir. Fan sesi, portlar ve kontrolcü analogları test edilmiştir.",
      price: 12500,
      reserve: 16500,
      increment: 200,
    },
    home: {
      title: "Dyson V15 · Tüm Aparatlarıyla",
      category: "Ev & Yaşam",
      condition: "İyi",
      description:
        "Motor, batarya, filtre ve başlıklar test edilmiştir. Kullanım izleri ve aparat listesi fotoğraflarda gösterilir.",
      price: 7000,
      reserve: 9500,
      increment: 100,
    },
  };

  function applyTemplate(key: string) {
    setTemplateKey(key);
    if (key === "none") return;
    const template = templates[key];
    if (!template) return;
    setTitle(template.title);
    setCategory(template.category);
    setCondition(template.condition);
    setDescription(template.description);
    setPrice(template.price);
    setReservePrice(template.reserve);
    setMinIncrement(template.increment);
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2_500_000)
      return alert("Demo sürümünde fotoğraf en fazla 2,5 MB olabilir.");
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  function saveAsDraft() {
    const fallback = fallbackImage(category);
    onSaveDraft({
      id: `draft-${Date.now()}`,
      title: title.trim() || "İsimsiz ilan taslağı",
      category,
      image: image || fallback,
      startingBid: price,
      reservePrice: Math.max(reservePrice, price),
      minIncrement,
      durationHours: hours,
      city,
      condition,
      description: description.trim() || "Açıklama daha sonra eklenecek.",
      shipping,
      savedAt: new Date().toISOString(),
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const fallback =
      category === "Telefon"
        ? "/products/iphone.svg"
        : category === "Bilgisayar"
          ? "/products/macbook.svg"
          : category === "Oyun"
            ? "/products/ps5.svg"
            : "/products/dyson.svg";
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
      shipping,
      paymentHold: true,
    });
  }

  return (
    <section className="page form-page">
      <div className="sell-header">
        <div>
          <button onClick={onCancel}>←</button>
          <span>İlan oluştur</span>
        </div>
        <small>Adım {step}/3</small>
      </div>
      <div className="stepper">
        <span className="active" />
        <span className={step >= 2 ? "active" : ""} />
        <span className={step >= 3 ? "active" : ""} />
      </div>
      <form className="sell-form" onSubmit={submit}>
        {step === 1 && (
          <>
            <ScreenTitle
              title="Ürünü tanıtalım"
              text="Net bilgiler daha fazla ve daha güvenli teklif getirir."
            />
            <div className="template-picker">
              <div>
                <span>✨</span>
                <div>
                  <strong>Akıllı ilan şablonu</strong>
                  <small>Kategoriye uygun başlık, açıklama ve fiyat önerisi doldurur.</small>
                </div>
              </div>
              <select value={templateKey} onChange={(event) => applyTemplate(event.target.value)}>
                <option value="none">Şablon seç</option>
                <option value="phone">Telefon · iPhone</option>
                <option value="laptop">Bilgisayar · MacBook</option>
                <option value="console">Oyun · PlayStation</option>
                <option value="home">Ev & Yaşam · Dyson</option>
              </select>
            </div>
            <label
              className={image ? "photo-upload has-photo" : "photo-upload"}
            >
              {image ? (
                <img src={image} alt="Yüklenen ürün" />
              ) : (
                <>
                  <span>＋</span>
                  <strong>Ürün fotoğrafı ekle</strong>
                  <small>JPG veya PNG · En fazla 2,5 MB</small>
                </>
              )}
              <input type="file" accept="image/*" onChange={handlePhoto} />
            </label>
            <label>
              İlan başlığı
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn. iPhone 15 Pro 256 GB"
                required
              />
            </label>
            <div className="form-grid">
              <label>
                Kategori
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Telefon</option>
                  <option>Bilgisayar</option>
                  <option>Oyun</option>
                  <option>Ev & Yaşam</option>
                </select>
              </label>
              <label>
                Ürün durumu
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as Condition)}
                >
                  <option>Sıfır</option>
                  <option>Çok iyi</option>
                  <option>İyi</option>
                  <option>Orta</option>
                </select>
              </label>
            </div>
            <label>
              Açıklama
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kutu, garanti, kullanım süresi ve varsa kusurları yaz..."
                rows={5}
                required
              />
            </label>
          </>
        )}
        {step === 2 && (
          <>
            <ScreenTitle
              title="Açık artırma kuralları"
              text="Başlangıç, gizli taban fiyat ve teklif artışını belirle."
            />
            <div className="form-grid">
              <label>
                Başlangıç fiyatı
                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </label>
              <label>
                Gizli taban fiyat
                <input
                  type="number"
                  min={price}
                  value={reservePrice}
                  onChange={(e) => setReservePrice(Number(e.target.value))}
                />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Minimum teklif artışı
                <select
                  value={minIncrement}
                  onChange={(e) => setMinIncrement(Number(e.target.value))}
                >
                  <option value="50">₺50</option>
                  <option value="100">₺100</option>
                  <option value="250">₺250</option>
                  <option value="500">₺500</option>
                  <option value="1000">₺1.000</option>
                </select>
              </label>
              <label>
                Süre
                <select
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                >
                  <option value="6">6 saat</option>
                  <option value="24">24 saat</option>
                  <option value="72">3 gün</option>
                  <option value="168">7 gün</option>
                </select>
              </label>
            </div>
            <div className="rule-card">
              <span>⏱</span>
              <div>
                <strong>Son dakika koruması</strong>
                <p>
                  Son 2 dakikada teklif gelirse açık artırma otomatik olarak 2
                  dakika uzar.
                </p>
              </div>
            </div>
            <div className="rule-card">
              <span>🔒</span>
              <div>
                <strong>Gizli taban fiyat</strong>
                <p>
                  Alıcılar rakamı görmez; yalnızca taban fiyatın aşılıp
                  aşılmadığını görür.
                </p>
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <ScreenTitle
              title="Teslimat ve ön izleme"
              text="İlanını son kez kontrol edip yayınla."
            />
            <div className="form-grid">
              <label>
                Ürün konumu
                <input value={city} onChange={(e) => setCity(e.target.value)} />
              </label>
              <label>
                Teslimat
                <select
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                >
                  <option>Param Güvende Kargo</option>
                  <option>Ücretsiz kargo</option>
                  <option>Satıcı ödemeli kargo</option>
                  <option>Yüz yüze teslimat</option>
                </select>
              </label>
            </div>
            <div className="preview-card">
              <img
                src={
                  image ||
                  (category === "Telefon"
                    ? "/products/iphone.svg"
                    : category === "Bilgisayar"
                      ? "/products/macbook.svg"
                      : category === "Oyun"
                        ? "/products/ps5.svg"
                        : "/products/dyson.svg")
                }
                alt=""
              />
              <div>
                <span className="category-label">{category}</span>
                <h3>{title || "İlan başlığı"}</h3>
                <small>Başlangıç</small>
                <strong>{money.format(price)}</strong>
              </div>
            </div>
            <div className="summary-list">
              <div>
                <span>Gizli taban fiyat</span>
                <strong>{money.format(Math.max(reservePrice, price))}</strong>
              </div>
              <div>
                <span>Minimum artış</span>
                <strong>{money.format(minIncrement)}</strong>
              </div>
              <div>
                <span>Açık artırma süresi</span>
                <strong>
                  {hours < 24 ? `${hours} saat` : `${hours / 24} gün`}
                </strong>
              </div>
              <div>
                <span>Teslimat</span>
                <strong>{shipping}</strong>
              </div>
              <div>
                <span>Tahmini hizmet bedeli</span>
                <strong>
                  {money.format(Math.max(reservePrice, price) * 0.075)}
                </strong>
              </div>
              <div>
                <span>Tahmini net kazanç</span>
                <strong>
                  {money.format(Math.max(reservePrice, price) * 0.925)}
                </strong>
              </div>
            </div>
            <div className="info-box">
              {liveMode
                ? "İlan Supabase veritabanında yayınlanacak ve tüm kullanıcılara gösterilecek."
                : "İlan demo verisine kaydedilecek. Canlı bağlantı açıldığında aynı akış Supabase üzerinde çalışacak."}
            </div>
          </>
        )}
        <div className="form-actions">
          <button
            type="button"
            className="draft-button"
            onClick={saveAsDraft}
          >
            Taslak olarak kaydet
          </button>
          {step > 1 && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => setStep((value) => value - 1)}
            >
              Geri
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => setStep((value) => value + 1)}
            >
              Devam Et
            </button>
          ) : (
            <button className="primary-button" type="submit">
              İlanı Yayınla
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function BidsScreen({
  currentUser,
  bids,
  auctions,
  autoBids,
  now,
  onOpen,
}: {
  currentUser: AppUser;
  bids: Bid[];
  auctions: Auction[];
  autoBids: AutoBid[];
  now: number;
  onOpen: (id: string) => void;
}) {
  const [tab, setTab] = useState<"ongoing" | "won" | "lost">("ongoing");
  const userBids = bids.filter((bid) => bid.userId === currentUser.id);
  const auctionIds = [...new Set(userBids.map((bid) => bid.auctionId))];
  const records = auctionIds.flatMap((id) => {
    const auction = auctions.find((item) => item.id === id);
    if (!auction) return [];
    const myBid = Math.max(
      ...userBids
        .filter((bid) => bid.auctionId === id)
        .map((bid) => bid.amount),
    );
    const winning = myBid >= auction.currentBid;
    const ended = isEnded(auction, now);
    const state: "ongoing" | "won" | "lost" = ended
      ? winning
        ? "won"
        : "lost"
      : "ongoing";
    const automatic = autoBids.find(
      (item) =>
        item.auctionId === id && item.userId === currentUser.id && item.active,
    );
    return [{ auction, myBid, winning, ended, state, automatic }];
  });
  const filteredRecords = records.filter((record) => record.state === tab);
  const counts = {
    ongoing: records.filter((record) => record.state === "ongoing").length,
    won: records.filter((record) => record.state === "won").length,
    lost: records.filter((record) => record.state === "lost").length,
  };

  return (
    <section className="page">
      <ScreenTitle
        title="Teklif Merkezi"
        text="Devam eden, kazandığın ve kaybettiğin açık artırmaları takip et"
      />
      <div className="bid-center-metrics">
        <div>
          <span>Devam eden</span>
          <strong>{counts.ongoing}</strong>
        </div>
        <div>
          <span>Kazandığın</span>
          <strong>{counts.won}</strong>
        </div>
        <div>
          <span>Otomatik teklif</span>
          <strong>
            {
              autoBids.filter(
                (item) => item.userId === currentUser.id && item.active,
              ).length
            }
          </strong>
        </div>
      </div>
      <div className="segmented bid-tabs">
        <button
          className={tab === "ongoing" ? "active" : ""}
          onClick={() => setTab("ongoing")}
        >
          Devam Eden ({counts.ongoing})
        </button>
        <button
          className={tab === "won" ? "active" : ""}
          onClick={() => setTab("won")}
        >
          Kazandıklarım ({counts.won})
        </button>
        <button
          className={tab === "lost" ? "active" : ""}
          onClick={() => setTab("lost")}
        >
          Kaybettiklerim ({counts.lost})
        </button>
      </div>
      <div className="tracking-list">
        {filteredRecords.map(
          ({ auction, myBid, winning, ended, automatic }) => (
            <button key={auction.id} onClick={() => onOpen(auction.id)}>
              <img src={auction.image} alt="" />
              <div>
                <h3>{auction.title}</h3>
                <small>Senin teklifin: {money.format(myBid)}</small>
                {automatic && (
                  <em className="auto-bid-chip">
                    ⚡ Limit {money.format(automatic.maxAmount)}
                  </em>
                )}
                <span>
                  {ended
                    ? "Açık artırma sona erdi"
                    : `${remaining(auction.endsAt, now)} kaldı`}
                </span>
              </div>
              <b className={winning ? "status winning" : "status outbid"}>
                {ended
                  ? winning
                    ? "Kazandın"
                    : "Kaybettin"
                  : winning
                    ? "Öndesin"
                    : "Teklifin geçildi"}
              </b>
            </button>
          ),
        )}
        {filteredRecords.length === 0 && (
          <EmptyState
            icon={tab === "ongoing" ? "⇄" : tab === "won" ? "🏆" : "○"}
            title={
              tab === "ongoing"
                ? "Devam eden teklifin yok"
                : tab === "won"
                  ? "Henüz kazandığın ilan yok"
                  : "Kaybettiğin ilan yok"
            }
            text={
              tab === "ongoing"
                ? "Bir açık artırmaya katıldığında burada görünecek."
                : "Sonuçlanan açık artırmalar bu bölümde ayrılacak."
            }
          />
        )}
      </div>
    </section>
  );
}

function Notifications({
  notices,
  onOpen,
  onReadAll,
}: {
  notices: Notice[];
  onOpen: (notice: Notice) => void;
  onReadAll: () => void;
}) {
  const unread = notices.filter((notice) => !notice.read).length;
  return (
    <section className="page standalone-page">
      <div className="screen-title-row">
        <ScreenTitle
          title="Bildirimler"
          text="Açık artırma hareketlerin ve hesap güncellemelerin"
        />
        <button disabled={unread === 0} onClick={onReadAll}>
          Tümünü okundu yap
        </button>
      </div>
      <div className="notice-summary">
        <div>
          <strong>{unread}</strong>
          <span>Okunmamış</span>
        </div>
        <div>
          <strong>{notices.filter((notice) => notice.auctionId).length}</strong>
          <span>İlan hareketi</span>
        </div>
        <div>
          <strong>{notices.length}</strong>
          <span>Toplam bildirim</span>
        </div>
      </div>
      <div className="notice-list">
        {notices.map((notice) => (
          <button
            className={notice.read ? "" : "unread"}
            key={notice.id}
            onClick={() => onOpen(notice)}
          >
            <span>{notice.auctionId ? "🔔" : "✓"}</span>
            <div>
              <strong>{notice.title}</strong>
              <p>{notice.text}</p>
              <small>{dateTime.format(new Date(notice.createdAt))}</small>
            </div>
            {!notice.read && <i />}
            <b>›</b>
          </button>
        ))}
        {notices.length === 0 && (
          <EmptyState
            icon="🔔"
            title="Bildirim yok"
            text="Teklif, satış ve hesap hareketlerin burada görünecek."
          />
        )}
      </div>
    </section>
  );
}

function CompareScreen({
  auctions,
  bids,
  now,
  onOpen,
  onRemove,
  onClear,
}: {
  auctions: Auction[];
  bids: Bid[];
  now: number;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (auctions.length < 2) {
    return (
      <section className="page standalone-page">
        <ScreenTitle title="Ürün karşılaştırma" text="Fiyat, süre ve satıcı güvenini yan yana incele" />
        <EmptyState icon="⇄" title="Karşılaştırmak için 2 ürün seç" text="Ana sayfadaki ilan kartlarında bulunan karşılaştırma düğmesine dokun." />
      </section>
    );
  }
  const bestPrice = Math.min(...auctions.map((auction) => auction.currentBid));
  const mostBids = Math.max(...auctions.map((auction) => auction.bidCount));
  return (
    <section className="page standalone-page compare-page">
      <div className="compare-heading">
        <ScreenTitle title="Ürün karşılaştırma" text={`${auctions.length} ilan fiyat, teklif ve güven ölçütleriyle karşılaştırılıyor`} />
        <button onClick={onClear}>Listeyi temizle</button>
      </div>
      <div className="comparison-grid">
        {auctions.map((auction) => {
          const score = sellerScore(auction.sellerId);
          const reserveMet = auction.currentBid >= auction.reservePrice;
          const priceDifference = auction.currentBid - bestPrice;
          return (
            <article className="comparison-card" key={auction.id}>
              <button className="comparison-remove" onClick={() => onRemove(auction.id)}>×</button>
              <img src={auction.image} alt="" />
              <span className="category-label">{auction.category}</span>
              <h2>{auction.title}</h2>
              <div className="comparison-price">
                <small>Güncel teklif</small>
                <strong>{money.format(auction.currentBid)}</strong>
                {priceDifference === 0 ? <em>En düşük fiyat</em> : <span>+{money.format(priceDifference)}</span>}
              </div>
              <dl className="comparison-specs">
                <div><dt>Durum</dt><dd>{auction.condition}</dd></div>
                <div><dt>Konum</dt><dd>{auction.city}</dd></div>
                <div><dt>Kalan süre</dt><dd>{isEnded(auction, now) ? "Sona erdi" : remaining(auction.endsAt, now)}</dd></div>
                <div><dt>Teklif</dt><dd>{auction.bidCount}{auction.bidCount === mostBids ? " · En yoğun" : ""}</dd></div>
                <div><dt>Min. artış</dt><dd>{money.format(auction.minIncrement)}</dd></div>
                <div><dt>Taban fiyat</dt><dd>{reserveMet ? "Aşıldı ✓" : "Bekleniyor"}</dd></div>
                <div><dt>Satıcı puanı</dt><dd>★ {score.rating.toFixed(1)} · {score.count} yorum</dd></div>
                <div><dt>Teslimat</dt><dd>{auction.shipping}</dd></div>
              </dl>
              <button className="primary-button" onClick={() => onOpen(auction.id)}>İlanı aç</button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ListingManager({
  auctions,
  drafts,
  autoRelistIds,
  now,
  onOpen,
  onPublishDraft,
  onDeleteDraft,
  onToggleAutoRelist,
  onExtend,
  onRelist,
  onSell,
}: {
  auctions: Auction[];
  drafts: AuctionDraft[];
  autoRelistIds: string[];
  now: number;
  onOpen: (id: string) => void;
  onPublishDraft: (id: string) => void | Promise<void>;
  onDeleteDraft: (id: string) => void;
  onToggleAutoRelist: (id: string) => void;
  onExtend: (ids: string[], hours: number) => void;
  onRelist: (ids: string[]) => void;
  onSell: () => void;
}) {
  const [tab, setTab] = useState<"active" | "drafts" | "ended">("active");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const visible = auctions.filter((auction) => tab === "active" ? !isEnded(auction, now) : isEnded(auction, now));
  function toggleSelected(id: string) {
    setSelectedIds((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }
  function selectAll() {
    const visibleIds = visible.map((auction) => auction.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((items) => allSelected ? items.filter((id) => !visibleIds.includes(id)) : [...new Set([...items, ...visibleIds])]);
  }
  return (
    <section className="page standalone-page listing-manager-page">
      <div className="manager-heading">
        <ScreenTitle title="Toplu ilan yönetimi" text="Taslaklarını, aktif ilanlarını ve yeniden yayınlama kurallarını tek ekrandan yönet" />
        <button className="primary-button" onClick={onSell}>＋ Yeni ilan</button>
      </div>
      <div className="manager-summary">
        <div><strong>{auctions.filter((item) => !isEnded(item, now)).length}</strong><small>Yayında</small></div>
        <div><strong>{drafts.length}</strong><small>Taslak</small></div>
        <div><strong>{autoRelistIds.length}</strong><small>Otomatik yayın</small></div>
        <div><strong>{auctions.filter((item) => isEnded(item, now)).length}</strong><small>Sona eren</small></div>
      </div>
      <div className="segmented manager-tabs">
        <button className={tab === "active" ? "active" : ""} onClick={() => { setTab("active"); setSelectedIds([]); }}>Yayında</button>
        <button className={tab === "drafts" ? "active" : ""} onClick={() => { setTab("drafts"); setSelectedIds([]); }}>Taslaklar ({drafts.length})</button>
        <button className={tab === "ended" ? "active" : ""} onClick={() => { setTab("ended"); setSelectedIds([]); }}>Sona eren</button>
      </div>
      {tab !== "drafts" && (
        <>
          <div className="bulk-toolbar">
            <label><input type="checkbox" checked={visible.length > 0 && visible.every((item) => selectedIds.includes(item.id))} onChange={selectAll} />Tümünü seç</label>
            <span>{selectedIds.length} ilan seçildi</span>
            {tab === "active" ? <button onClick={() => onExtend(selectedIds, 24)}>Süreyi +24 saat uzat</button> : <button onClick={() => onRelist(selectedIds)}>72 saat yeniden yayınla</button>}
          </div>
          <div className="manager-list">
            {visible.map((auction) => (
              <article key={auction.id} className={selectedIds.includes(auction.id) ? "selected" : ""}>
                <input type="checkbox" checked={selectedIds.includes(auction.id)} onChange={() => toggleSelected(auction.id)} />
                <img src={auction.image} alt="" />
                <div className="manager-list-copy" onClick={() => onOpen(auction.id)}>
                  <h3>{auction.title}</h3><small>{auction.bidCount} teklif · {money.format(auction.currentBid)}</small><span>{isEnded(auction, now) ? "Sona erdi" : `${remaining(auction.endsAt, now)} kaldı`}</span>
                </div>
                <button className={autoRelistIds.includes(auction.id) ? "relist-toggle active" : "relist-toggle"} onClick={() => onToggleAutoRelist(auction.id)}>
                  <b>{autoRelistIds.includes(auction.id) ? "Açık" : "Kapalı"}</b><small>Satılmazsa tekrar yayınla</small>
                </button>
              </article>
            ))}
            {visible.length === 0 && <EmptyState icon="◫" title="Bu bölüm boş" text="İlanların durumuna göre burada listelenecek." />}
          </div>
        </>
      )}
      {tab === "drafts" && (
        <div className="draft-list">
          {drafts.map((draft) => (
            <article key={draft.id}>
              <img src={draft.image || fallbackImage(draft.category)} alt="" />
              <div><span className="category-label">{draft.category}</span><h3>{draft.title}</h3><small>{money.format(draft.startingBid)} başlangıç · {draft.durationHours} saat</small><p>Son kayıt: {dateTime.format(new Date(draft.savedAt))}</p></div>
              <div className="draft-actions"><button className="primary-button" onClick={() => onPublishDraft(draft.id)}>Yayınla</button><button className="secondary-button" onClick={() => onDeleteDraft(draft.id)}>Sil</button></div>
            </article>
          ))}
          {drafts.length === 0 && <EmptyState icon="📝" title="Taslak yok" text="İlan oluştururken Taslak olarak kaydet düğmesini kullan." />}
        </div>
      )}
    </section>
  );
}

function MyListings({
  auctions,
  now,
  onOpen,
}: {
  auctions: Auction[];
  now: number;
  onOpen: (id: string) => void;
}) {
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="İlanlarım"
        text="Yayındaki ve tamamlanan açık artırmaların"
      />
      <div className="tracking-list">
        {auctions.map((auction) => (
          <button key={auction.id} onClick={() => onOpen(auction.id)}>
            <img src={auction.image} alt="" />
            <div>
              <h3>{auction.title}</h3>
              <small>
                {auction.bidCount} teklif · {money.format(auction.currentBid)}
              </small>
              <span>
                {isEnded(auction, now)
                  ? "Sona erdi"
                  : `${remaining(auction.endsAt, now)} kaldı`}
              </span>
            </div>
            <b className="status winning">Yayında</b>
          </button>
        ))}
        {auctions.length === 0 && (
          <EmptyState
            icon="◫"
            title="Henüz ilanın yok"
            text="İlan Ver düğmesinden ilk açık artırmanı oluştur."
          />
        )}
      </div>
    </section>
  );
}

function Profile({
  currentUser,
  liveMode,
  unreadMessages,
  walletBalance,
  membership,
  businessAccount,
  verification,
  followedCount,
  reminderCount,
  couponCount,
  disputeCount,
  reviewableCount,
  savedSearchCount,
  promotionCount,
  draftCount,
  onWallet,
  onVerification,
  onTrustCenter,
  onMessages,
  onListings,
  onBids,
  onOrders,
  onSellerCenter,
  onSellerAnalytics,
  onSavedSearches,
  onPromotions,
  onListingManager,
  onStoreManager,
  onMembership,
  onBusinessAccount,
  onFinanceReports,
  onAddresses,
  onShippingOperations,
  onOperationsCenter,
  onLiveSystem,
  onFollowing,
  onReminders,
  onCoupons,
  onAuctionResults,
  onDisputes,
  onReviews,
  onSecurity,
  onSupport,
  showAdmin,
  onAdmin,
  onReset,
  onSignOut,
}: {
  currentUser: AppUser;
  liveMode: boolean;
  unreadMessages: number;
  walletBalance: number;
  membership: MembershipState;
  businessAccount: BusinessAccount;
  verification: VerificationState;
  followedCount: number;
  reminderCount: number;
  couponCount: number;
  disputeCount: number;
  reviewableCount: number;
  savedSearchCount: number;
  promotionCount: number;
  draftCount: number;
  onWallet: () => void;
  onVerification: () => void;
  onTrustCenter: () => void;
  onMessages: () => void;
  onListings: () => void;
  onBids: () => void;
  onOrders: () => void;
  onSellerCenter: () => void;
  onSellerAnalytics: () => void;
  onSavedSearches: () => void;
  onPromotions: () => void;
  onListingManager: () => void;
  onStoreManager: () => void;
  onMembership: () => void;
  onBusinessAccount: () => void;
  onFinanceReports: () => void;
  onAddresses: () => void;
  onShippingOperations: () => void;
  onOperationsCenter: () => void;
  onLiveSystem: () => void;
  onFollowing: () => void;
  onReminders: () => void;
  onCoupons: () => void;
  onAuctionResults: () => void;
  onDisputes: () => void;
  onReviews: () => void;
  onSecurity: () => void;
  onSupport: () => void;
  showAdmin: boolean;
  onAdmin: () => void;
  onReset: () => void;
  onSignOut: () => void | Promise<void>;
}) {
  const verifiedCount = Object.values(verification).filter(Boolean).length;
  return (
    <section className="page">
      <div className="profile-card">
        <div className="large-avatar">{currentUser.initials}</div>
        <div>
          <h1>{currentUser.name}</h1>
          <p>
            {liveMode
              ? currentUser.email
              : verification.identity
                ? "Kimlik ve telefon doğrulandı ✓"
                : "Doğrulama adımları bekliyor"}
          </p>
        </div>
        <span className="profile-level">
          {businessAccount.verificationStatus === "verified"
            ? "Kurumsal Satıcı"
            : membership.tier === "pro"
              ? "PRO Satıcı"
              : membership.tier === "plus"
                ? "PLUS Satıcı"
                : verification.identity
                  ? "Güvenilir Satıcı"
                  : "Doğrulama Gerekli"}
        </span>
      </div>
      <div className="stats">
        <div>
          <strong>{liveMode ? "Canlı" : "4.9"}</strong>
          <small>{liveMode ? "Veritabanı" : "Satıcı puanı"}</small>
        </div>
        <div>
          <strong>{verifiedCount}/4</strong>
          <small>Güvenlik adımı</small>
        </div>
        <div>
          <strong>{liveMode ? "Aktif" : "27"}</strong>
          <small>{liveMode ? "Oturum" : "Verilen teklif"}</small>
        </div>
      </div>
      <button className="wallet-card wallet-button" onClick={onWallet}>
        <div>
          <span>Kullanılabilir bakiye</span>
          <strong>{money.format(walletBalance)}</strong>
        </div>
        <b>Cüzdanı aç ›</b>
      </button>
      <div className="menu-list">
        <button onClick={onLiveSystem}>
          <span>🟢</span>Canlı sistem bağlantısı
          <em className={`menu-badge neutral ${liveMode ? "connected" : ""}`}>
            {liveMode ? "Bağlı" : "Hazırla"}
          </em>
          <b>›</b>
        </button>
        <button onClick={onMessages}>
          <span>💬</span>Mesajlarım
          {unreadMessages > 0 && (
            <em className="menu-badge">{unreadMessages}</em>
          )}
          <b>›</b>
        </button>
        <button onClick={onSellerCenter}>
          <span>▤</span>Satış Merkezi<b>›</b>
        </button>
        <button onClick={onSellerAnalytics}>
          <span>📈</span>Satıcı performans analizi<b>›</b>
        </button>
        <button onClick={onSavedSearches}>
          <span>🔔</span>Kaydedilmiş aramalar
          {savedSearchCount > 0 && (
            <em className="menu-badge neutral">{savedSearchCount}</em>
          )}
          <b>›</b>
        </button>
        <button onClick={onPromotions}>
          <span>🚀</span>İlan öne çıkarma
          {promotionCount > 0 && (
            <em className="menu-badge neutral">{promotionCount}</em>
          )}
          <b>›</b>
        </button>
        <button onClick={onListingManager}>
          <span>🗂️</span>Toplu ilan yönetimi
          {draftCount > 0 && (
            <em className="menu-badge neutral">{draftCount} taslak</em>
          )}
          <b>›</b>
        </button>
        <button onClick={onStoreManager}>
          <span>🏪</span>Mağazam ve vitrinim<b>›</b>
        </button>
        <button onClick={onMembership}>
          <span>👑</span>Üyelik ve komisyon planı
          <em className={`plan-mini-badge ${membership.tier}`}>
            {membershipMeta[membership.tier].name}
          </em>
          <b>›</b>
        </button>
        <button onClick={onBusinessAccount}>
          <span>🏢</span>Kurumsal hesap ve fatura
          <em className={`business-mini-status ${businessAccount.verificationStatus}`}>
            {businessAccount.verificationStatus === "verified"
              ? "Doğrulandı"
              : businessAccount.verificationStatus === "pending"
                ? "İncelemede"
                : "Kurulum"}
          </em>
          <b>›</b>
        </button>
        <button onClick={onFinanceReports}>
          <span>🧾</span>Satış, komisyon ve vergi raporları<b>›</b>
        </button>
        <button onClick={onAddresses}>
          <span>📍</span>Adres defterim<b>›</b>
        </button>
        <button onClick={onShippingOperations}>
          <span>🚚</span>Kargo operasyon merkezi<b>›</b>
        </button>
        <button onClick={onOrders}>
          <span>📦</span>Siparişlerim<b>›</b>
        </button>
        <button onClick={onListings}>
          <span>◫</span>İlanlarım<b>›</b>
        </button>
        <button onClick={onBids}>
          <span>⇄</span>Tekliflerim<b>›</b>
        </button>
        <button onClick={onFollowing}>
          <span>👥</span>Takip ettiğim satıcılar
          {followedCount > 0 && (
            <em className="menu-badge neutral">{followedCount}</em>
          )}
          <b>›</b>
        </button>
        <button onClick={onReminders}>
          <span>⏰</span>İlan uyarılarım
          {reminderCount > 0 && (
            <em className="menu-badge neutral">{reminderCount}</em>
          )}
          <b>›</b>
        </button>
        <button onClick={onCoupons}>
          <span>🎟️</span>Kuponlarım
          {couponCount > 0 && (
            <em className="menu-badge neutral">{couponCount}</em>
          )}
          <b>›</b>
        </button>
        <button onClick={onAuctionResults}>
          <span>🏁</span>Açık artırma sonuçları<b>›</b>
        </button>
        <button onClick={onDisputes}>
          <span>⚖️</span>İtiraz ve iadeler
          {disputeCount > 0 && (
            <em className="menu-badge">{disputeCount}</em>
          )}
          <b>›</b>
        </button>
        <button onClick={onReviews}>
          <span>⭐</span>Değerlendirmelerim
          {reviewableCount > 0 && (
            <em className="menu-badge neutral">{reviewableCount}</em>
          )}
          <b>›</b>
        </button>
        <button onClick={onVerification}>
          <span>🪪</span>Kimlik ve hesap doğrulama
          <em className="menu-status">{verifiedCount}/4</em>
          <b>›</b>
        </button>
        <button onClick={onTrustCenter}>
          <span>🔎</span>Güvenli işlem merkezi<b>›</b>
        </button>
        <button onClick={onSecurity}>
          <span>🛡</span>Hesap ve güvenlik<b>›</b>
        </button>
        <button onClick={onSupport}>
          <span>?</span>Yardım ve destek<b>›</b>
        </button>
        {showAdmin && (
          <>
            <button onClick={onAdmin}>
              <span>⚙</span>Yönetim paneli<b>›</b>
            </button>
            <button onClick={onOperationsCenter}>
              <span>🛰️</span>Denetim ve operasyon merkezi<b>›</b>
            </button>
          </>
        )}
        {liveMode ? (
          <button className="danger-row" onClick={onSignOut}>
            <span>↪</span>Çıkış yap<b>›</b>
          </button>
        ) : (
          <button className="danger-row" onClick={onReset}>
            <span>↻</span>Demo verilerini sıfırla<b>›</b>
          </button>
        )}
      </div>
    </section>
  );
}

function OperationsCenter({
  logs,
  cases,
  settings,
  onCaseStatus,
  onToggleBlock,
  onToggleSetting,
  onBackup,
}: {
  logs: AuditLog[];
  cases: UserCase[];
  settings: SystemSettings;
  onCaseStatus: (id: string, status: UserCaseStatus) => void;
  onToggleBlock: (id: string) => void;
  onToggleSetting: (key: SystemToggleKey) => void;
  onBackup: () => void;
}) {
  const [tab, setTab] = useState<"cases" | "audit" | "system">("cases");
  const [severity, setSeverity] = useState<"all" | AuditSeverity>("all");
  const [caseFilter, setCaseFilter] = useState<"all" | UserCaseStatus>("all");
  const filteredCases = cases.filter((item) => caseFilter === "all" || item.status === caseFilter);
  const filteredLogs = logs.filter((item) => severity === "all" || item.severity === severity);
  const openCount = cases.filter((item) => item.status !== "resolved").length;
  const blockedCount = cases.filter((item) => item.blocked).length;
  const criticalCount = logs.filter((item) => item.severity === "critical").length;
  const healthScore = [
    !settings.maintenanceMode,
    settings.newListingsEnabled,
    settings.paymentsEnabled,
    settings.autoModeration,
  ].filter(Boolean).length * 25;

  function exportAuditCsv() {
    const rows = [
      ["Tarih", "Seviye", "Aktör", "İşlem", "Hedef", "Detay"],
      ...filteredLogs.map((item) => [
        new Date(item.createdAt).toLocaleString("tr-TR"),
        item.severity,
        item.actor,
        item.action,
        item.target,
        item.details,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `kapiskapis-denetim-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="page standalone-page operations-page">
      <div className="operations-heading">
        <div>
          <span className="eyebrow">YÖNETİCİ ALANI</span>
          <h1>Denetim ve operasyon merkezi</h1>
          <p>Şikâyetleri, riskli kullanıcıları, sistem ayarlarını ve yönetici hareketlerini tek ekrandan yönet.</p>
        </div>
        <span className={healthScore === 100 ? "health-badge healthy" : "health-badge warning"}>
          Sistem sağlığı %{healthScore}
        </span>
      </div>

      <div className="operations-stats">
        <article><span>⚠️</span><div><strong>{openCount}</strong><small>Açık inceleme</small></div></article>
        <article><span>⛔</span><div><strong>{blockedCount}</strong><small>Engelli hesap</small></div></article>
        <article><span>🚨</span><div><strong>{criticalCount}</strong><small>Kritik kayıt</small></div></article>
        <article><span>🗄️</span><div><strong>{dateTime.format(new Date(settings.lastBackup))}</strong><small>Son yedek</small></div></article>
      </div>

      <div className="segmented operations-tabs">
        <button className={tab === "cases" ? "active" : ""} onClick={() => setTab("cases")}>Şikâyetler</button>
        <button className={tab === "audit" ? "active" : ""} onClick={() => setTab("audit")}>Denetim kayıtları</button>
        <button className={tab === "system" ? "active" : ""} onClick={() => setTab("system")}>Sistem kontrolü</button>
      </div>

      {tab === "cases" && (
        <div className="operations-panel">
          <div className="operations-toolbar">
            <div>
              <h2>Kullanıcı ve şikâyet incelemeleri</h2>
              <p>Risk puanı yüksek kayıtları önce incele.</p>
            </div>
            <select value={caseFilter} onChange={(event) => setCaseFilter(event.target.value as "all" | UserCaseStatus)}>
              <option value="all">Tüm durumlar</option>
              <option value="open">Açık</option>
              <option value="reviewing">İncelemede</option>
              <option value="resolved">Sonuçlandı</option>
            </select>
          </div>
          <div className="case-list">
            {filteredCases.map((item) => (
              <article key={item.id} className={`case-card risk-${item.riskScore >= 80 ? "high" : item.riskScore >= 60 ? "medium" : "low"}`}>
                <div className="case-topline">
                  <div>
                    <span className={`case-status ${item.status}`}>{item.status === "open" ? "Açık" : item.status === "reviewing" ? "İncelemede" : "Sonuçlandı"}</span>
                    {item.blocked && <span className="blocked-chip">İşlemler durduruldu</span>}
                  </div>
                  <strong className="risk-score">Risk {item.riskScore}/100</strong>
                </div>
                <h3>{item.userName}</h3>
                <p className="case-reason">{item.reason}</p>
                <div className="case-meta"><span>{item.source}</span><span>{dateTime.format(new Date(item.createdAt))}</span></div>
                <small className="case-note">{item.notes}</small>
                <div className="case-actions">
                  {item.status !== "reviewing" && <button onClick={() => onCaseStatus(item.id, "reviewing")}>İncelemeye al</button>}
                  {item.status !== "resolved" && <button className="success" onClick={() => onCaseStatus(item.id, "resolved")}>Sonuçlandır</button>}
                  {item.status === "resolved" && <button onClick={() => onCaseStatus(item.id, "open")}>Yeniden aç</button>}
                  <button className={item.blocked ? "neutral" : "danger"} onClick={() => onToggleBlock(item.id)}>
                    {item.blocked ? "Engeli kaldır" : "Hesabı engelle"}
                  </button>
                </div>
              </article>
            ))}
            {filteredCases.length === 0 && <EmptyState icon="✓" title="Kayıt bulunamadı" text="Seçilen filtrede inceleme kaydı yok." />}
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="operations-panel">
          <div className="operations-toolbar">
            <div><h2>Değiştirilemez yönetici geçmişi</h2><p>Platformdaki kritik hareketleri zaman sırasıyla izle.</p></div>
            <div className="audit-actions">
              <select value={severity} onChange={(event) => setSeverity(event.target.value as "all" | AuditSeverity)}>
                <option value="all">Tüm seviyeler</option>
                <option value="critical">Kritik</option>
                <option value="warning">Uyarı</option>
                <option value="info">Bilgi</option>
              </select>
              <button onClick={exportAuditCsv}>CSV indir</button>
            </div>
          </div>
          <div className="audit-list">
            {filteredLogs.map((item) => (
              <article key={item.id}>
                <i className={`audit-dot ${item.severity}`} />
                <div><div className="audit-title"><strong>{item.action}</strong><span>{dateTime.format(new Date(item.createdAt))}</span></div><p>{item.target} · {item.details}</p><small>İşlemi yapan: {item.actor}</small></div>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === "system" && (
        <div className="operations-system-grid">
          <div className="operations-panel">
            <h2>Platform anahtarları</h2>
            <p className="panel-description">Kritik servisleri tek dokunuşla yönet. Demo modunda seçimler cihazda saklanır.</p>
            <SystemToggle title="Bakım modu" text="Açıldığında kullanıcılar geçici bakım ekranı görür." active={settings.maintenanceMode} danger onClick={() => onToggleSetting("maintenanceMode")} />
            <SystemToggle title="Yeni ilan kabulü" text="Yeni ürünlerin yayınlanmasına izin verir." active={settings.newListingsEnabled} onClick={() => onToggleSetting("newListingsEnabled")} />
            <SystemToggle title="Ödeme işlemleri" text="Cüzdan ve kart ödemelerini etkin tutar." active={settings.paymentsEnabled} danger onClick={() => onToggleSetting("paymentsEnabled")} />
            <SystemToggle title="Otomatik moderasyon" text="Riskli ilan ve mesajları otomatik işaretler." active={settings.autoModeration} onClick={() => onToggleSetting("autoModeration")} />
          </div>
          <div className="operations-panel health-panel">
            <h2>Servis durumu</h2>
            <div className="service-row"><span><i className="online" />Web uygulaması</span><b>Çalışıyor</b></div>
            <div className="service-row"><span><i className={settings.paymentsEnabled ? "online" : "offline"} />Ödeme altyapısı</span><b>{settings.paymentsEnabled ? "Çalışıyor" : "Durduruldu"}</b></div>
            <div className="service-row"><span><i className={settings.newListingsEnabled ? "online" : "offline"} />İlan servisi</span><b>{settings.newListingsEnabled ? "Çalışıyor" : "Durduruldu"}</b></div>
            <div className="service-row"><span><i className={settings.autoModeration ? "online" : "offline"} />Risk motoru</span><b>{settings.autoModeration ? "Çalışıyor" : "Kapalı"}</b></div>
            <div className="backup-card"><span>Son güvenli yedek</span><strong>{new Date(settings.lastBackup).toLocaleString("tr-TR")}</strong><button className="primary-button" onClick={onBackup}>Şimdi yedek oluştur</button></div>
          </div>
        </div>
      )}
    </section>
  );
}

function SystemToggle({
  title,
  text,
  active,
  danger = false,
  onClick,
}: {
  title: string;
  text: string;
  active: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`system-toggle ${danger ? "danger" : ""}`} onClick={onClick}>
      <span><strong>{title}</strong><small>{text}</small></span>
      <i className={active ? "active" : ""}><b /></i>
    </button>
  );
}

function BusinessAccountScreen({
  account,
  currentUser,
  onSave,
  onVerification,
}: {
  account: BusinessAccount;
  currentUser: AppUser;
  onSave: (account: BusinessAccount) => void;
  onVerification: (status: BusinessVerificationStatus) => void;
}) {
  const [draft, setDraft] = useState<BusinessAccount>(account);
  const companyReady =
    draft.companyTitle.trim().length > 2 &&
    draft.taxNumber.trim().length >= 10 &&
    draft.taxOffice.trim().length > 2 &&
    draft.invoiceEmail.includes("@") &&
    draft.address.trim().length > 10;

  function update<K extends keyof BusinessAccount>(key: K, value: BusinessAccount[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="page standalone-page business-page">
      <ScreenTitle
        title="Kurumsal hesap ve fatura"
        text="Şirket bilgilerini doğrula, kurumsal rozetini ve fatura raporlarını aç"
      />

      <div className={`business-status-card ${draft.verificationStatus}`}>
        <div className="business-status-icon">
          {draft.verificationStatus === "verified" ? "✓" : draft.verificationStatus === "pending" ? "…" : "🏢"}
        </div>
        <div>
          <span>Kurumsal doğrulama</span>
          <h2>
            {draft.verificationStatus === "verified"
              ? "Şirket hesabın doğrulandı"
              : draft.verificationStatus === "pending"
                ? "Belgelerin inceleniyor"
                : "Kurumsal hesabını oluştur"}
          </h2>
          <p>
            {draft.verificationStatus === "verified"
              ? "Mağazanda kurumsal satıcı rozeti ve fatura bilgileri gösterilecek."
              : "Vergi ve şirket bilgilerini tamamlayarak doğrulamaya gönder."}
          </p>
        </div>
      </div>

      <div className="account-type-selector">
        <button
          className={draft.accountType === "individual" ? "active" : ""}
          onClick={() => update("accountType", "individual")}
        >
          <span>👤</span>
          <strong>Bireysel satıcı</strong>
          <small>Kimlik bilgileriyle satış</small>
        </button>
        <button
          className={draft.accountType === "company" ? "active" : ""}
          onClick={() => update("accountType", "company")}
        >
          <span>🏢</span>
          <strong>Kurumsal satıcı</strong>
          <small>Şirket ve vergi bilgileriyle satış</small>
        </button>
      </div>

      <div className="business-form-card">
        <div className="business-form-head">
          <div>
            <span>Fatura profili</span>
            <h3>{draft.accountType === "company" ? "Şirket bilgileri" : "Bireysel fatura bilgileri"}</h3>
          </div>
          <b>{currentUser.name}</b>
        </div>

        <div className="business-form-grid">
          <label className="wide-field">
            <span>Şirket / ticari unvan</span>
            <input
              value={draft.companyTitle}
              onChange={(event) => update("companyTitle", event.target.value)}
              placeholder="Örn. Akar Teknoloji Ltd. Şti."
            />
          </label>
          <label>
            <span>Vergi / T.C. kimlik numarası</span>
            <input
              inputMode="numeric"
              value={draft.taxNumber}
              onChange={(event) => update("taxNumber", event.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="10 veya 11 hane"
            />
          </label>
          <label>
            <span>Vergi dairesi</span>
            <input
              value={draft.taxOffice}
              onChange={(event) => update("taxOffice", event.target.value)}
              placeholder="Vergi dairesi"
            />
          </label>
          <label>
            <span>MERSİS numarası</span>
            <input
              inputMode="numeric"
              value={draft.mersisNumber}
              onChange={(event) => update("mersisNumber", event.target.value.replace(/\D/g, "").slice(0, 16))}
              placeholder="İsteğe bağlı"
            />
          </label>
          <label>
            <span>E-fatura e-posta adresi</span>
            <input
              type="email"
              value={draft.invoiceEmail}
              onChange={(event) => update("invoiceEmail", event.target.value)}
              placeholder="fatura@sirket.com"
            />
          </label>
          <label className="wide-field">
            <span>Fatura adresi</span>
            <textarea
              value={draft.address}
              onChange={(event) => update("address", event.target.value)}
              placeholder="Mahalle, cadde, bina, ilçe ve şehir"
              rows={3}
            />
          </label>
        </div>

        <div className="business-actions">
          <button className="secondary-button" onClick={() => onSave(draft)}>
            Bilgileri kaydet
          </button>
          {draft.verificationStatus === "not_started" && (
            <button
              className="primary-button"
              disabled={!companyReady}
              onClick={() => {
                onSave(draft);
                onVerification("pending");
                setDraft((current) => ({ ...current, verificationStatus: "pending" }));
              }}
            >
              Doğrulamaya gönder
            </button>
          )}
          {draft.verificationStatus === "pending" && (
            <button
              className="primary-button"
              onClick={() => {
                onVerification("verified");
                setDraft((current) => ({ ...current, verificationStatus: "verified" }));
              }}
            >
              Demo doğrulamayı tamamla
            </button>
          )}
        </div>
      </div>

      <div className="verification-checklist">
        <h3>Kurumsal doğrulama kontrolü</h3>
        <div><i className={draft.companyTitle.trim() ? "done" : ""}>✓</i><span>Ticari unvan</span></div>
        <div><i className={draft.taxNumber.length >= 10 ? "done" : ""}>✓</i><span>Vergi veya kimlik numarası</span></div>
        <div><i className={draft.invoiceEmail.includes("@") ? "done" : ""}>✓</i><span>Fatura e-postası</span></div>
        <div><i className={draft.address.trim().length > 10 ? "done" : ""}>✓</i><span>Fatura adresi</span></div>
      </div>

      <div className="business-info-note">
        <b>Canlı sistem notu</b>
        <p>Gerçek şirket doğrulaması için vergi levhası, imza sirküsü ve banka hesabı kontrolleri güvenli servis sağlayıcıları üzerinden bağlanacaktır.</p>
      </div>
    </section>
  );
}

function FinanceReportsScreen({
  account,
  membership,
  orders,
  auctions,
  currentUser,
  invoiceRecords,
}: {
  account: BusinessAccount;
  membership: MembershipState;
  orders: Order[];
  auctions: Auction[];
  currentUser: AppUser;
  invoiceRecords: InvoiceRecord[];
}) {
  const sellerOrders = orders.filter((order) => order.sellerId === currentUser.id);
  const liveGross = sellerOrders.reduce((sum, order) => sum + order.amount, 0);
  const plan = membershipMeta[membership.tier];
  const liveCommission = Math.round(liveGross * (plan.commission / 100));
  const liveVat = Math.round(liveCommission * 0.2);
  const liveNet = Math.max(0, liveGross - liveCommission - liveVat);
  const reportGross = invoiceRecords.reduce((sum, item) => sum + item.grossSales, 0) + liveGross;
  const reportNet = invoiceRecords.reduce((sum, item) => sum + item.netPayout, 0) + liveNet;

  function exportCsv() {
    const rows = [
      ["Dönem", "Brüt satış", "Komisyon", "KDV", "Net ödeme", "Fatura no"],
      ...invoiceRecords.map((item) => [
        item.period,
        item.grossSales,
        item.commission,
        item.vat,
        item.netPayout,
        item.invoiceNo,
      ]),
    ];
    const csv = rows.map((row) => row.join(";")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kapiskapis-satis-raporu.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="page standalone-page finance-page">
      <ScreenTitle
        title="Satış, komisyon ve vergi raporları"
        text="Aylık satışlarını, platform kesintilerini ve net ödemelerini izle"
      />

      <div className="finance-hero">
        <div>
          <span>Raporlanan toplam satış</span>
          <strong>{money.format(reportGross)}</strong>
          <small>{invoiceRecords.length + 1} dönem · {plan.name} komisyon planı</small>
        </div>
        <button onClick={exportCsv}>CSV indir ↓</button>
      </div>

      <div className="finance-summary-grid">
        <article><span>Net satıcı ödemesi</span><strong>{money.format(reportNet)}</strong><small>Kesintiler sonrası</small></article>
        <article><span>Aktif komisyon</span><strong>%{plan.commission}</strong><small>{plan.name}</small></article>
        <article><span>Bu ay satış</span><strong>{money.format(liveGross)}</strong><small>{sellerOrders.length} sipariş</small></article>
        <article><span>Aktif ilan</span><strong>{auctions.filter((item) => item.sellerId === currentUser.id).length}</strong><small>Satıcı hesabında</small></article>
      </div>

      <div className="current-period-card">
        <div className="current-period-head">
          <div><span>Temmuz 2026</span><h3>Devam eden dönem</h3></div>
          <b>Taslak rapor</b>
        </div>
        <div className="period-breakdown">
          <div><span>Brüt satış</span><strong>{money.format(liveGross)}</strong></div>
          <div><span>Platform komisyonu</span><strong>-{money.format(liveCommission)}</strong></div>
          <div><span>Komisyon KDV’si</span><strong>-{money.format(liveVat)}</strong></div>
          <div className="period-net"><span>Tahmini net ödeme</span><strong>{money.format(liveNet)}</strong></div>
        </div>
      </div>

      <div className="invoice-panel">
        <div className="invoice-panel-head">
          <div><span>Aylık belgeler</span><h3>Komisyon faturaları ve ödeme özetleri</h3></div>
          <em className={account.verificationStatus === "verified" ? "verified" : ""}>
            {account.verificationStatus === "verified" ? "Kurumsal profil doğrulandı" : "Fatura profilini tamamla"}
          </em>
        </div>
        <div className="invoice-list">
          {invoiceRecords.map((record) => (
            <article key={record.id}>
              <div className="invoice-icon">🧾</div>
              <div className="invoice-copy">
                <h4>{record.period}</h4>
                <span>{record.invoiceNo}</span>
                <small>{dateTime.format(new Date(record.createdAt))}</small>
              </div>
              <div className="invoice-money">
                <strong>{money.format(record.netPayout)}</strong>
                <small>Net ödeme</small>
              </div>
              <b className="invoice-status">Kesildi</b>
            </article>
          ))}
        </div>
      </div>

      <div className="tax-warning-card">
        <span>ℹ️</span>
        <div>
          <b>Vergi hesapları bilgilendirme amaçlıdır</b>
          <p>Platform raporu muhasebe kaydı veya mali müşavir görüşünün yerine geçmez. Gerçek e-fatura entegrasyonu canlı sistemde bağlanacaktır.</p>
        </div>
      </div>
    </section>
  );
}

function MembershipScreen({
  membership,
  walletBalance,
  auctions,
  onSelect,
  onToggleRenew,
  onCancel,
}: {
  membership: MembershipState;
  walletBalance: number;
  auctions: Auction[];
  onSelect: (tier: MembershipTier) => void;
  onToggleRenew: () => void;
  onCancel: () => void;
}) {
  const activePlan = membershipMeta[membership.tier];
  const completedSales = auctions.filter((item) => item.bidCount > 0).length;
  const sellerLevel = completedSales >= 20 ? "Altın" : completedSales >= 8 ? "Gümüş" : "Bronz";
  const levelProgress = Math.min(100, Math.max(18, completedSales * 8));

  return (
    <section className="page standalone-page membership-page">
      <ScreenTitle
        title="Üyelik ve komisyon planı"
        text="Daha düşük komisyon, daha fazla ilan ve premium satıcı araçları"
      />

      <div className={`membership-current ${membership.tier}`}>
        <div>
          <span>Aktif planın</span>
          <h2>{activePlan.name}</h2>
          <p>Satış hizmet bedeli %{activePlan.commission}</p>
        </div>
        <div className="membership-current-side">
          <strong>{activePlan.price ? `${money.format(activePlan.price)}/ay` : "Ücretsiz"}</strong>
          <small>Kullanılabilir bakiye: {money.format(walletBalance)}</small>
        </div>
      </div>

      <div className="seller-level-card">
        <div className="seller-level-icon">🏅</div>
        <div className="seller-level-copy">
          <span>Satıcı seviyen</span>
          <h3>{sellerLevel} Satıcı</h3>
          <p>Daha fazla başarılı satış ve yüksek puan ile üst seviyeye çık.</p>
          <div className="level-track"><i style={{ width: `${levelProgress}%` }} /></div>
          <small>{completedSales} performans puanı · sonraki seviye için ilerleme %{levelProgress}</small>
        </div>
      </div>

      <div className="membership-grid">
        {(Object.keys(membershipMeta) as MembershipTier[]).map((tier) => {
          const plan = membershipMeta[tier];
          const active = membership.tier === tier;
          return (
            <article key={tier} className={`membership-plan ${tier} ${active ? "active" : ""}`}>
              {tier === "pro" && <b className="recommended-ribbon">EN GÜÇLÜ</b>}
              <div className="membership-plan-head">
                <span>{tier === "free" ? "○" : tier === "plus" ? "✦" : "♛"}</span>
                <div>
                  <h3>{plan.name}</h3>
                  <small>{plan.color} satıcı rozeti</small>
                </div>
              </div>
              <div className="membership-price">
                <strong>{plan.price ? money.format(plan.price) : "Ücretsiz"}</strong>
                {plan.price > 0 && <small>/ ay</small>}
              </div>
              <div className="commission-highlight">
                <span>Satış hizmet bedeli</span>
                <strong>%{plan.commission}</strong>
              </div>
              <ul>
                {plan.benefits.map((benefit) => <li key={benefit}>✓ {benefit}</li>)}
              </ul>
              <button
                className={active ? "secondary-button" : "primary-button"}
                disabled={active}
                onClick={() => onSelect(tier)}
              >
                {active ? "Aktif plan" : tier === "free" ? "Başlangıç planına geç" : "Planı etkinleştir"}
              </button>
            </article>
          );
        })}
      </div>

      {membership.tier !== "free" && (
        <div className="renewal-card">
          <div>
            <h3>Otomatik yenileme</h3>
            <p>
              {membership.renewAt
                ? `${dateTime.format(new Date(membership.renewAt))} tarihinde yenilenir.`
                : "Yenileme tarihi belirlenmedi."}
            </p>
          </div>
          <button className={`toggle-switch ${membership.autoRenew ? "on" : ""}`} onClick={onToggleRenew}>
            <i />
            <span>{membership.autoRenew ? "Açık" : "Kapalı"}</span>
          </button>
          <button className="text-danger-button" onClick={onCancel}>Üyeliği iptal et</button>
        </div>
      )}

      <div className="membership-note">
        <b>Demo açıklaması</b>
        <p>Plan bedeli cüzdandan düşer ve komisyon oranı anında güncellenir. Gerçek ödeme ve faturalandırma canlı ödeme kuruluşu bağlandığında aktif olacaktır.</p>
      </div>
    </section>
  );
}

function orderLabel(order: Order) {
  if (order.shipmentStatus === "disputed") return "İtiraz açıldı";
  if (order.shipmentStatus === "approved" || order.paymentStatus === "released")
    return "Tamamlandı";
  if (order.shipmentStatus === "delivered") return "Teslim edildi";
  if (order.shipmentStatus === "shipped") return "Kargoda";
  if (order.shipmentStatus === "prepared") return "Kargoya hazırlanıyor";
  if (order.paymentStatus === "pending") return "Ödeme bekleniyor";
  return "Satıcıdan gönderim bekleniyor";
}

function orderProgress(order: Order) {
  if (order.shipmentStatus === "approved" || order.paymentStatus === "released")
    return 4;
  if (order.shipmentStatus === "delivered") return 3;
  if (order.shipmentStatus === "shipped") return 2;
  if (order.paymentStatus === "held" || order.shipmentStatus === "prepared")
    return 1;
  return 0;
}

function OrdersScreen({
  currentUser,
  orders,
  auctions,
  liveMode,
  onOpen,
  onAdvance,
  onCheckout,
  onTrack,
  onMessage,
}: {
  currentUser: AppUser;
  orders: Order[];
  auctions: Auction[];
  liveMode: boolean;
  onOpen: (id: string) => void;
  onAdvance: (id: string) => void;
  onCheckout: (id: string) => void;
  onTrack: (id: string) => void;
  onMessage: (auctionId: string, participantId: string) => void;
}) {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const filteredOrders = orders.filter((order) =>
    tab === "buy"
      ? order.buyerId === currentUser.id
      : order.sellerId === currentUser.id,
  );
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Siparişlerim"
        text="Kazandığın ürünlerin ve tamamlanan satışların ödeme-kargo akışı"
      />
      <div className="segmented">
        <button
          className={tab === "buy" ? "active" : ""}
          onClick={() => setTab("buy")}
        >
          Alımlarım
        </button>
        <button
          className={tab === "sell" ? "active" : ""}
          onClick={() => setTab("sell")}
        >
          Satışlarım
        </button>
      </div>
      <div className="order-list">
        {filteredOrders.map((order) => {
          const auction = auctions.find((item) => item.id === order.auctionId);
          if (!auction) return null;
          const progress = orderProgress(order);
          const isBuyer = order.buyerId === currentUser.id;
          const participantId = isBuyer ? order.sellerId : order.buyerId;
          let action = "";
          if (order.paymentStatus === "pending" && isBuyer)
            action = "Ödemeyi tamamla";
          else if (order.shipmentStatus === "waiting" && !isBuyer)
            action = "Siparişi hazırla";
          else if (order.shipmentStatus === "prepared" && !isBuyer)
            action = "Kargoya ver";
          else if (order.shipmentStatus === "shipped" && isBuyer)
            action = "Teslim aldım";
          else if (order.shipmentStatus === "delivered" && isBuyer)
            action = "Ürünü onayla";
          return (
            <article className="order-card" key={order.id}>
              <button className="order-main" onClick={() => onOpen(auction.id)}>
                <img src={auction.image} alt="" />
                <div>
                  <span className="order-status">{orderLabel(order)}</span>
                  <h3>{auction.title}</h3>
                  <small>
                    {isBuyer ? `Satıcı: ${auction.seller}` : "Korumalı satış"}
                  </small>
                  <strong>{money.format(order.amount)}</strong>
                </div>
                <b>›</b>
              </button>
              <div className="order-steps">
                {["Ödeme", "Hazırlık", "Kargo", "Onay"].map((label, index) => (
                  <div
                    className={
                      index < progress
                        ? "done"
                        : index === progress
                          ? "current"
                          : ""
                    }
                    key={label}
                  >
                    <span>{index < progress ? "✓" : index + 1}</span>
                    <small>{label}</small>
                  </div>
                ))}
              </div>
              {order.trackingNumber && (
                <div className="tracking-code">
                  <span>{order.carrier || "Kargo"}</span>
                  <strong>{order.trackingNumber}</strong>
                </div>
              )}
              <div className="order-secondary-actions">
                <button
                  onClick={() => onMessage(order.auctionId, participantId)}
                >
                  💬 Mesaj
                </button>
                <button onClick={() => onTrack(order.id)}>
                  📍 Süreç detayı
                </button>
              </div>
              {action && (
                <button
                  className="order-action"
                  onClick={() =>
                    action === "Ödemeyi tamamla"
                      ? onCheckout(order.id)
                      : onAdvance(order.id)
                  }
                >
                  {action}
                </button>
              )}
              {liveMode && (
                <small className="live-note">
                  Canlı ödeme/kargo işlemleri sağlayıcı bağlantısından sonra
                  gerçek para ve kargo API'siyle çalışacak.
                </small>
              )}
            </article>
          );
        })}
        {filteredOrders.length === 0 && (
          <EmptyState
            icon="📦"
            title="Henüz sipariş yok"
            text={
              tab === "buy"
                ? "Kazandığın açık artırmalar burada görünecek."
                : "Tamamlanan satışların burada görünecek."
            }
          />
        )}
      </div>
    </section>
  );
}

function MessagesScreen({
  currentUser,
  auctions,
  messages,
  selectedConversationId,
  onSelect,
  onSend,
  onOpenAuction,
}: {
  currentUser: AppUser;
  auctions: Auction[];
  messages: ChatMessage[];
  selectedConversationId: string;
  onSelect: (id: string) => void;
  onSend: (id: string, body: string) => void;
  onOpenAuction: (id: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const conversations = useMemo(() => {
    const ids = Array.from(
      new Set([
        ...messages.map((message) => message.conversationId),
        ...(selectedConversationId ? [selectedConversationId] : []),
      ]),
    );
    return ids
      .map((id) => {
        const items = messages
          .filter((message) => message.conversationId === id)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
        const last = items[items.length - 1];
        const auctionId = last?.auctionId || id.split(":")[0];
        const auction = auctions.find((item) => item.id === auctionId);
        const other = [...items]
          .reverse()
          .find((item) => item.senderId !== currentUser.id);
        return {
          id,
          items,
          last,
          auction,
          otherName:
            other?.senderName || auction?.seller || "KapışKapış kullanıcısı",
          unread: items.filter(
            (item) => !item.read && item.senderId !== currentUser.id,
          ).length,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.last?.createdAt || 0).getTime() -
          new Date(a.last?.createdAt || 0).getTime(),
      );
  }, [messages, auctions, currentUser.id, selectedConversationId]);
  const activeId = selectedConversationId || conversations[0]?.id || "";
  const active = conversations.find(
    (conversation) => conversation.id === activeId,
  );
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!activeId || !draft.trim()) return;
    onSend(activeId, draft);
    setDraft("");
  }
  return (
    <section className="page standalone-page messages-page">
      <ScreenTitle
        title="Mesajlarım"
        text="İlan ve siparişler için güvenli platform içi iletişim"
      />
      <div className="message-layout">
        <aside className="conversation-list">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={conversation.id === activeId ? "active" : ""}
              onClick={() => onSelect(conversation.id)}
            >
              <span className="conversation-avatar">
                {conversation.otherName.charAt(0)}
              </span>
              <div>
                <strong>{conversation.otherName}</strong>
                <small>{conversation.auction?.title || "İlan konuşması"}</small>
                <p>{conversation.last?.body}</p>
              </div>
              {conversation.unread > 0 && <b>{conversation.unread}</b>}
            </button>
          ))}
          {conversations.length === 0 && (
            <EmptyState
              icon="💬"
              title="Mesajın yok"
              text="Bir ilandaki Satıcıya mesaj gönder düğmesiyle sohbet başlat."
            />
          )}
        </aside>
        <section className="chat-panel">
          {active ? (
            <>
              <header>
                <div>
                  <strong>{active.otherName}</strong>
                  <small>{active.auction?.title}</small>
                </div>
                {active.auction && (
                  <button onClick={() => onOpenAuction(active.auction!.id)}>
                    İlanı gör
                  </button>
                )}
              </header>
              <div className="chat-safety">
                🛡️ Ödeme, IBAN veya telefon bilgisini sohbet dışında paylaşma.
              </div>
              <div className="chat-messages">
                {active.items.map((message) => (
                  <article
                    className={
                      message.senderId === currentUser.id ? "mine" : ""
                    }
                    key={message.id}
                  >
                    <div>{message.body}</div>
                    <small>
                      {message.senderId === currentUser.id
                        ? "Sen"
                        : message.senderName}{" "}
                      · {dateTime.format(new Date(message.createdAt))}
                    </small>
                  </article>
                ))}
              </div>
              <form className="chat-compose" onSubmit={submit}>
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Mesajını yaz…"
                />
                <button type="submit">Gönder</button>
              </form>
            </>
          ) : (
            <EmptyState
              icon="💬"
              title="Bir konuşma seç"
              text="Soldaki konuşmalardan birini aç."
            />
          )}
        </section>
      </div>
    </section>
  );
}

function CheckoutScreen({
  order,
  auction,
  walletBalance,
  coupons,
  addresses,
  onManageAddresses,
  onUseCoupon,
  onPay,
}: {
  order: Order;
  auction?: Auction;
  walletBalance: number;
  coupons: Coupon[];
  addresses: AddressRecord[];
  onManageAddresses: () => void;
  onUseCoupon: (code: string) => void;
  onPay: (method: "card" | "wallet", total: number, addressId: string) => void;
}) {
  const [method, setMethod] = useState<"card" | "wallet">("card");
  const [accepted, setAccepted] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(
    order.deliveryAddressId || addresses.find((item) => item.isDefault)?.id || addresses[0]?.id || "",
  );
  const serviceFee = Math.round(order.amount * 0.025);
  const coupon = coupons.find((item) => item.code === appliedCode);
  const discount = coupon
    ? coupon.type === "fixed"
      ? coupon.value
      : Math.min(
          Math.round(((order.amount + serviceFee) * coupon.value) / 100),
          coupon.maxDiscount ?? Number.MAX_SAFE_INTEGER,
        )
    : 0;
  const total = Math.max(0, order.amount + serviceFee - discount);
  function applyCoupon() {
    const normalized = couponCode.trim().toLocaleUpperCase("tr");
    const match = coupons.find((item) => item.code === normalized);
    if (!match) return setCouponError("Kupon kodu bulunamadı.");
    if (match.used) return setCouponError("Bu kupon daha önce kullanılmış.");
    if (new Date(match.expiresAt).getTime() <= Date.now())
      return setCouponError("Kuponun süresi dolmuş.");
    if (order.amount < match.minSpend)
      return setCouponError(
        `Bu kupon için en az ${money.format(match.minSpend)} ürün bedeli gerekli.`,
      );
    setAppliedCode(match.code);
    setCouponError("");
  }
  function pay() {
    if (!selectedAddressId) return;
    if (coupon) onUseCoupon(coupon.code);
    onPay(method, total, selectedAddressId);
  }
  return (
    <section className="page standalone-page checkout-page">
      <ScreenTitle
        title="Güvenli ödeme"
        text="Ödemen ürün teslim edilip onaylanana kadar satıcıya aktarılmaz"
      />
      <div className="checkout-grid">
        <section>
          <div className="checkout-product">
            {auction && <img src={auction.image} alt="" />}
            <div>
              <span>Kazandığın açık artırma</span>
              <strong>{auction?.title || "KapışKapış ürünü"}</strong>
              <small>{auction?.seller}</small>
            </div>
            <b>{money.format(order.amount)}</b>
          </div>
          <div className="checkout-address-card">
            <div className="checkout-address-head">
              <div>
                <strong>Teslimat adresi</strong>
                <small>Kazandığın ürün bu adrese gönderilecek.</small>
              </div>
              <button onClick={onManageAddresses}>Adresleri yönet</button>
            </div>
            <div className="checkout-address-options">
              {addresses.map((address) => (
                <label className={selectedAddressId === address.id ? "selected" : ""} key={address.id}>
                  <input
                    type="radio"
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                  />
                  <div>
                    <b>{address.label} {address.isDefault && <em>Varsayılan</em>}</b>
                    <span>{address.fullName} · {address.phone}</span>
                    <small>{address.neighborhood} {address.addressLine}, {address.district}/{address.city}</small>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="checkout-card">
            <strong>Ödeme yöntemi</strong>
            <label className={method === "card" ? "selected" : ""}>
              <input
                type="radio"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              <span>💳</span>
              <div>
                <b>Kredi / banka kartı</b>
                <small>3D Secure ile güvenli ödeme</small>
              </div>
            </label>
            <label className={method === "wallet" ? "selected" : ""}>
              <input
                type="radio"
                checked={method === "wallet"}
                onChange={() => setMethod("wallet")}
              />
              <span>◉</span>
              <div>
                <b>KapışKapış bakiye</b>
                <small>Mevcut bakiye: {money.format(walletBalance)}</small>
              </div>
            </label>
            {method === "card" && (
              <div className="mock-card-fields">
                <input
                  placeholder="Kart üzerindeki isim"
                  defaultValue="KEMAL AKAR"
                />
                <input
                  placeholder="Kart numarası"
                  defaultValue="**** **** **** 4242"
                />
                <div>
                  <input placeholder="AA/YY" defaultValue="12/29" />
                  <input placeholder="CVV" defaultValue="***" />
                </div>
              </div>
            )}
          </div>
          <div className="coupon-entry">
            <div>
              <strong>Kupon kodu</strong>
              <small>Uygun kuponunu ödeme özetine uygula.</small>
            </div>
            <div>
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Örn. AP250"
              />
              <button onClick={applyCoupon}>Uygula</button>
            </div>
            {couponError && <p>{couponError}</p>}
            {coupon && <span>✓ {coupon.title} uygulandı</span>}
          </div>
          <label className="checkout-consent">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
            />
            <span>
              Mesafeli satış, açık artırma kuralları ve alıcı korumasını kabul
              ediyorum.
            </span>
          </label>
        </section>
        <aside className="payment-summary">
          <strong>Ödeme özeti</strong>
          <div>
            <span>Ürün bedeli</span>
            <b>{money.format(order.amount)}</b>
          </div>
          <div>
            <span>Alıcı koruma hizmeti</span>
            <b>{money.format(serviceFee)}</b>
          </div>
          <div>
            <span>Kargo</span>
            <b>Ücretsiz</b>
          </div>
          {discount > 0 && (
            <div className="discount-line">
              <span>Kupon indirimi</span>
              <b>−{money.format(discount)}</b>
            </div>
          )}
          <div className="total">
            <span>Toplam</span>
            <b>{money.format(total)}</b>
          </div>
          <div className="payment-hold-info">
            <span>🛡️</span>
            <p>
              Tutar güvenli hesapta tutulur. Ürün sorunluysa onay vermeden
              itiraz açabilirsin.
            </p>
          </div>
          <button
            disabled={
              !accepted || !selectedAddressId || (method === "wallet" && walletBalance < total)
            }
            onClick={pay}
          >
            {method === "wallet" && walletBalance < total
              ? `${money.format(total - walletBalance)} bakiye eksik`
              : `${money.format(total)} güvenli öde`}
          </button>
        </aside>
      </div>
    </section>
  );
}

function ShipmentScreen({
  order,
  auction,
  currentUser,
  deliveryAddress,
  onAdvance,
  onMessage,
  onDispute,
}: {
  order: Order;
  auction?: Auction;
  currentUser: AppUser;
  deliveryAddress?: AddressRecord;
  onAdvance: () => void;
  onMessage: (auctionId: string, participantId: string) => void;
  onDispute: () => void;
}) {
  const progress = orderProgress(order);
  const isBuyer = order.buyerId === currentUser.id;
  const participantId = isBuyer ? order.sellerId : order.buyerId;
  const steps = [
    {
      title: "Ödeme korumaya alındı",
      text: "Tutar satıcıya aktarılmadan güvenli hesapta tutuluyor.",
    },
    {
      title: "Satıcı ürünü hazırlıyor",
      text: "Paketleme ve kargo etiketi oluşturuluyor.",
    },
    {
      title: "Kargoya teslim edildi",
      text: order.trackingNumber
        ? `${order.carrier}: ${order.trackingNumber}`
        : "Takip kodu henüz oluşmadı.",
    },
    {
      title: "Teslimat ve alıcı onayı",
      text: "Ürün tesliminden sonra kontrol ederek onayla veya itiraz aç.",
    },
  ];
  let action = "";
  if (order.paymentStatus === "pending" && isBuyer) action = "Ödemeye dön";
  else if (order.shipmentStatus === "waiting" && !isBuyer)
    action = "Siparişi hazırla";
  else if (order.shipmentStatus === "prepared" && !isBuyer)
    action = "Kargoya ver";
  else if (order.shipmentStatus === "shipped" && isBuyer)
    action = "Teslim aldım";
  else if (order.shipmentStatus === "delivered" && isBuyer)
    action = "Ürünü onayla";
  return (
    <section className="page standalone-page shipment-page">
      <ScreenTitle
        title="Sipariş süreci"
        text="Ödeme, kargo ve teslimat adımlarını tek ekranda izle"
      />
      <div className="shipment-hero">
        {auction && <img src={auction.image} alt="" />}
        <div>
          <span>{orderLabel(order)}</span>
          <h2>{auction?.title}</h2>
          <p>
            Sipariş #{order.id} · {money.format(order.amount)}
          </p>
        </div>
      </div>
      <div className="shipment-grid">
        <section className="shipment-timeline">
          {steps.map((step, index) => (
            <article
              className={
                index < progress ? "done" : index === progress ? "current" : ""
              }
              key={step.title}
            >
              <span>{index < progress ? "✓" : index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
                {index === 2 && order.trackingNumber && (
                  <button>Taşıyıcı sitesinde takip et ↗</button>
                )}
              </div>
            </article>
          ))}
        </section>
        <aside>
          <div className="shipment-address">
            <strong>Teslimat bilgisi</strong>
            <p>{deliveryAddress?.fullName || currentUser.name}</p>
            <p>{deliveryAddress ? `${deliveryAddress.neighborhood} ${deliveryAddress.addressLine}` : "Adres bilgisi bekleniyor"}</p>
            <p>{deliveryAddress ? `${deliveryAddress.district} / ${deliveryAddress.city}` : currentUser.city}</p>
            {deliveryAddress?.phone && <p>{deliveryAddress.phone}</p>}
          </div>
          <button
            className="message-order-button"
            onClick={() => onMessage(order.auctionId, participantId)}
          >
            💬 {isBuyer ? "Satıcıya" : "Alıcıya"} mesaj gönder
          </button>
          {action && action !== "Ödemeye dön" && (
            <button className="shipment-primary" onClick={onAdvance}>
              {action}
            </button>
          )}
          <button className="dispute-button" onClick={onDispute}>Sorun bildir / itiraz aç</button>
        </aside>
      </div>
    </section>
  );
}

function PromotionsCenter({
  currentUser,
  auctions,
  promotions,
  walletBalance,
  now,
  onOpen,
  onActivate,
}: {
  currentUser: AppUser;
  auctions: Auction[];
  promotions: Promotion[];
  walletBalance: number;
  now: number;
  onOpen: (id: string) => void;
  onActivate: (auctionId: string, plan: Promotion["plan"], price: number) => void;
}) {
  const mine = auctions.filter((auction) => auction.sellerId === currentUser.id && !isEnded(auction, now));
  const plans = [
    { id: "24h" as const, title: "24 saat vitrin", price: 149, text: "Ana sayfa vitrini ve Öne Çıkan etiketi" },
    { id: "3d" as const, title: "3 gün güçlü görünürlük", price: 349, text: "Kategori üst sırası ve arama vurgusu" },
    { id: "7d" as const, title: "7 gün maksimum erişim", price: 649, text: "Vitrin, kategori ve takipçi bildirimi" },
  ];
  const [selectedAuctionId, setSelectedAuctionId] = useState(mine[0]?.id || "");
  const active = promotions.filter((item) => new Date(item.expiresAt).getTime() > now);
  return (
    <section className="page standalone-page promotion-page">
      <ScreenTitle title="İlan öne çıkarma" text="İlanını daha çok alıcıya göster, daha fazla teklif topla" />
      <div className="promotion-wallet"><span>Kullanılabilir bakiye</span><strong>{money.format(walletBalance)}</strong><small>Öne çıkarma bedeli KapışKapış cüzdanından düşer.</small></div>
      <div className="promotion-picker">
        <strong>Öne çıkarılacak ilan</strong>
        {mine.length ? (
          <select value={selectedAuctionId} onChange={(event) => setSelectedAuctionId(event.target.value)}>
            {mine.map((auction) => <option key={auction.id} value={auction.id}>{auction.title}</option>)}
          </select>
        ) : <p>Öne çıkarılabilecek aktif ilanın bulunmuyor.</p>}
      </div>
      <div className="promotion-plans">
        {plans.map((plan) => (
          <article key={plan.id}>
            <span>{plan.id === "7d" ? "EN AVANTAJLI" : "VİTRİN PAKETİ"}</span>
            <h3>{plan.title}</h3>
            <p>{plan.text}</p>
            <strong>{money.format(plan.price)}</strong>
            <button disabled={!selectedAuctionId} onClick={() => onActivate(selectedAuctionId, plan.id, plan.price)}>Paketi etkinleştir</button>
          </article>
        ))}
      </div>
      <div className="section-heading"><div><strong>Aktif kampanyalar</strong></div><span>{active.length} ilan</span></div>
      <div className="promotion-active-list">
        {active.map((promotion) => {
          const auction = auctions.find((item) => item.id === promotion.auctionId);
          if (!auction) return null;
          const ctr = promotion.impressions ? ((promotion.clicks / promotion.impressions) * 100).toFixed(1) : "0.0";
          return (
            <button key={promotion.auctionId} onClick={() => onOpen(auction.id)}>
              <img src={auction.image} alt="" />
              <div><strong>{auction.title}</strong><small>{remaining(promotion.expiresAt, now)} kampanya süresi</small><span>{promotion.impressions.toLocaleString("tr-TR")} gösterim · {promotion.clicks} tıklama · %{ctr} TO</span></div>
              <b>AKTİF</b>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SellerCenter({
  currentUser,
  auctions,
  orders,
  now,
  onOpen,
  onSell,
  onAnalytics,
}: {
  currentUser: AppUser;
  auctions: Auction[];
  orders: Order[];
  now: number;
  onOpen: (id: string) => void;
  onSell: () => void;
  onAnalytics: () => void;
}) {
  const mine = auctions.filter(
    (auction) => auction.sellerId === currentUser.id,
  );
  const active = mine.filter((auction) => !isEnded(auction, now));
  const sales = orders.filter((order) => order.sellerId === currentUser.id);
  const turnover = sales.reduce((total, order) => total + order.amount, 0);
  const fees = turnover * 0.075;
  return (
    <section className="page standalone-page">
      <div className="seller-hero">
        <div>
          <span>SATICI PANELİ</span>
          <h1>Satış Merkezi</h1>
          <p>İlan performansı, sipariş ve tahmini kazançların tek ekranda.</p>
        </div>
        <div className="seller-hero-actions">
          <button className="ghost" onClick={onAnalytics}>📈 Detaylı analiz</button>
          <button onClick={onSell}>＋ Yeni ilan</button>
        </div>
      </div>
      <div className="seller-metrics">
        <div>
          <span>Aktif ilan</span>
          <strong>{active.length}</strong>
          <small>
            {mine.reduce((sum, item) => sum + item.bidCount, 0)} toplam teklif
          </small>
        </div>
        <div>
          <span>Brüt satış</span>
          <strong>{money.format(turnover)}</strong>
          <small>{sales.length} sipariş</small>
        </div>
        <div>
          <span>Tahmini net</span>
          <strong>{money.format(turnover - fees)}</strong>
          <small>{money.format(fees)} hizmet bedeli</small>
        </div>
      </div>
      <div className="insight-card">
        <span>💡</span>
        <div>
          <strong>Satış önerisi</strong>
          <p>
            Net fotoğraf, detaylı kusur açıklaması ve piyasanın %15 altında
            başlangıç fiyatı daha fazla teklif getirir.
          </p>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <strong>İlan performansı</strong>
        </div>
        <span>{mine.length} ilan</span>
      </div>
      <div className="tracking-list">
        {mine.map((auction) => (
          <button key={auction.id} onClick={() => onOpen(auction.id)}>
            <img src={auction.image} alt="" />
            <div>
              <h3>{auction.title}</h3>
              <small>
                {auction.bidCount} teklif · {money.format(auction.currentBid)}
              </small>
              <span>
                {isEnded(auction, now)
                  ? "Tamamlandı"
                  : `${remaining(auction.endsAt, now)} kaldı`}
              </span>
            </div>
            <b
              className={
                isEnded(auction, now) ? "status outbid" : "status winning"
              }
            >
              {isEnded(auction, now) ? "Sonuçlandı" : "Yayında"}
            </b>
          </button>
        ))}
        {mine.length === 0 && (
          <EmptyState
            icon="▤"
            title="Henüz satış verisi yok"
            text="İlk açık artırmanı oluşturarak satış merkezini kullanmaya başla."
          />
        )}
      </div>
    </section>
  );
}

function WalletCenter({
  balance,
  transactions,
  liveMode,
  onDeposit,
  onWithdraw,
}: {
  balance: number;
  transactions: WalletTransaction[];
  liveMode: boolean;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}) {
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState(1000);
  const pending = transactions
    .filter((item) => item.status === "pending")
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const submit = () =>
    mode === "deposit" ? onDeposit(amount) : onWithdraw(amount);
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="KapışKapış Cüzdan"
        text="Bakiyeni, güvenli ödemelerini ve satış gelirlerini yönet"
      />
      <div className="wallet-hero">
        <div>
          <span>Kullanılabilir bakiye</span>
          <strong>{money.format(balance)}</strong>
          <small>
            {pending > 0
              ? `${money.format(pending)} işlem beklemede`
              : "Bekleyen işlem yok"}
          </small>
        </div>
        <span className="wallet-shield">🛡️</span>
      </div>
      {liveMode && (
        <div className="live-note wallet-live-note">
          Canlı para hareketleri ödeme kuruluşu entegrasyonundan sonra gerçek
          bakiyeye bağlanacak.
        </div>
      )}
      <div className="wallet-action-card">
        <div className="segmented">
          <button
            className={mode === "deposit" ? "active" : ""}
            onClick={() => setMode("deposit")}
          >
            Para yükle
          </button>
          <button
            className={mode === "withdraw" ? "active" : ""}
            onClick={() => setMode("withdraw")}
          >
            Para çek
          </button>
        </div>
        <div className="wallet-quick">
          {[500, 1000, 2500, 5000].map((value) => (
            <button
              className={amount === value ? "active" : ""}
              key={value}
              onClick={() => setAmount(value)}
            >
              {mode === "deposit" ? "+" : ""}
              {money.format(value)}
            </button>
          ))}
        </div>
        <label>
          Tutar
          <div className="wallet-amount">
            <span>₺</span>
            <input
              type="number"
              min="100"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </div>
        </label>
        <button className="primary-button" onClick={submit}>
          {mode === "deposit" ? "Bakiyeye ekle" : "Banka hesabına çek"}
        </button>
      </div>
      <div className="section-heading">
        <div>
          <strong>Cüzdan hareketleri</strong>
        </div>
        <span>{transactions.length} işlem</span>
      </div>
      <div className="wallet-transactions">
        {transactions.map((item) => (
          <article key={item.id}>
            <span
              className={`transaction-icon ${item.amount >= 0 ? "positive" : "negative"}`}
            >
              {item.amount >= 0 ? "＋" : "−"}
            </span>
            <div>
              <strong>{item.title}</strong>
              <small>
                {dateTime.format(new Date(item.createdAt))} ·{" "}
                {item.status === "pending" ? "İşleniyor" : "Tamamlandı"}
              </small>
            </div>
            <b className={item.amount >= 0 ? "positive" : "negative"}>
              {item.amount >= 0 ? "+" : ""}
              {money.format(item.amount)}
            </b>
          </article>
        ))}
      </div>
    </section>
  );
}

function VerificationCenter({
  state,
  onComplete,
}: {
  state: VerificationState;
  onComplete: (key: keyof VerificationState) => void;
}) {
  const steps: Array<{
    key: keyof VerificationState;
    icon: string;
    title: string;
    text: string;
  }> = [
    {
      key: "phone",
      icon: "📱",
      title: "Telefon doğrulaması",
      text: "Teklif ve hesap kurtarma işlemlerinde güvenlik kodu kullanılır.",
    },
    {
      key: "identity",
      icon: "🪪",
      title: "Kimlik doğrulaması",
      text: "Satıcı rozeti, yüksek tutarlı ilan ve para çekme için gereklidir.",
    },
    {
      key: "bank",
      icon: "🏦",
      title: "Banka hesabı doğrulaması",
      text: "Satış gelirleri yalnızca sana ait doğrulanmış hesaba gönderilir.",
    },
    {
      key: "twoFactor",
      icon: "🔐",
      title: "İki aşamalı giriş",
      text: "Yeni cihaz girişlerinde tek kullanımlık güvenlik kodu ister.",
    },
  ];
  const completed = Object.values(state).filter(Boolean).length;
  const progress = Math.round((completed / steps.length) * 100);
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Kimlik ve hesap doğrulama"
        text="Güvenli teklif, satış ve para çekme için hesabını tamamla"
      />
      <div className="verification-hero">
        <div>
          <span>Doğrulama seviyesi</span>
          <strong>{progress}%</strong>
          <small>
            {completed}/{steps.length} adım tamamlandı
          </small>
        </div>
        <div
          className="verification-ring"
          style={
            { "--progress": `${progress * 3.6}deg` } as React.CSSProperties
          }
        >
          {progress}
        </div>
      </div>
      <div className="verification-list">
        {steps.map((step, index) => (
          <article
            className={state[step.key] ? "completed" : ""}
            key={step.key}
          >
            <span>{state[step.key] ? "✓" : step.icon}</span>
            <div>
              <small>ADIM {index + 1}</small>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </div>
            <button
              disabled={state[step.key]}
              onClick={() => onComplete(step.key)}
            >
              {state[step.key] ? "Tamamlandı" : "Şimdi doğrula"}
            </button>
          </article>
        ))}
      </div>
      <div className="verification-note">
        <span>🔒</span>
        <p>
          Kimlik bilgileri ilanlarda gösterilmez. Doğrulama verileri şifreli
          şekilde yalnızca güvenlik ve yasal yükümlülükler için kullanılır.
        </p>
      </div>
    </section>
  );
}

function TrustCenter({ auctions }: { auctions: Auction[] }) {
  const [salePrice, setSalePrice] = useState(18000);
  const [marketPrice, setMarketPrice] = useState(25000);
  const ratio = marketPrice > 0 ? salePrice / marketPrice : 1;
  const level = ratio < 0.55 ? "high" : ratio < 0.75 ? "medium" : "low";
  const labels = {
    high: [
      "Yüksek risk",
      "Piyasanın çok altında fiyat; ödeme ve iletişim taleplerini dikkatle incele.",
    ],
    medium: [
      "Orta risk",
      "Fiyat avantajlı görünüyor. Fatura, seri numarası ve satıcı geçmişini doğrula.",
    ],
    low: [
      "Düşük risk",
      "Fiyat piyasa aralığında. Yine de yalnızca korumalı ödeme kullan.",
    ],
  } as const;
  const unverified = auctions.filter(
    (auction) => !auction.verified && !isEnded(auction, Date.now()),
  ).length;
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Güvenli İşlem Merkezi"
        text="Bir ilanı satın almadan önce fiyat ve güvenlik işaretlerini kontrol et"
      />
      <div className="trust-grid">
        <section className="risk-calculator">
          <div className="risk-calculator-head">
            <span>🔎</span>
            <div>
              <strong>Fiyat risk kontrolü</strong>
              <small>İlan fiyatını tahmini piyasa değeriyle karşılaştır</small>
            </div>
          </div>
          <div className="form-grid">
            <label>
              İlan fiyatı
              <div className="risk-input">
                <span>₺</span>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(event) => setSalePrice(Number(event.target.value))}
                />
              </div>
            </label>
            <label>
              Piyasa değeri
              <div className="risk-input">
                <span>₺</span>
                <input
                  type="number"
                  value={marketPrice}
                  onChange={(event) =>
                    setMarketPrice(Number(event.target.value))
                  }
                />
              </div>
            </label>
          </div>
          <div className={`risk-result ${level}`}>
            <div>
              <span>
                {level === "high" ? "⚠️" : level === "medium" ? "!" : "✓"}
              </span>
              <div>
                <strong>{labels[level][0]}</strong>
                <p>{labels[level][1]}</p>
              </div>
            </div>
            <b>%{Math.max(0, Math.round((1 - ratio) * 100))} piyasa altı</b>
          </div>
        </section>
        <aside className="trust-score-card">
          <span>Platform güvenlik özeti</span>
          <strong>92/100</strong>
          <div>
            <p>
              <b>✓</b> Korumalı ödeme aktif
            </p>
            <p>
              <b>✓</b> Teklif geçmişi kayıtlı
            </p>
            <p>
              <b>!</b> {unverified} doğrulanmamış aktif satıcı
            </p>
          </div>
        </aside>
      </div>
      <div className="section-heading">
        <div>
          <strong>Kırmızı bayraklar</strong>
        </div>
        <span>İşlemden önce kontrol et</span>
      </div>
      <div className="red-flag-grid">
        <article>
          <span>💬</span>
          <strong>Platform dışına çağırma</strong>
          <p>
            WhatsApp, EFT veya farklı bir ödeme yöntemine yönlendiren
            satıcılarla işlem yapma.
          </p>
        </article>
        <article>
          <span>💸</span>
          <strong>Aşırı düşük fiyat</strong>
          <p>
            Piyasanın yarısından ucuz ürünlerde fatura, seri numarası ve cihaz
            doğrulaması iste.
          </p>
        </article>
        <article>
          <span>📦</span>
          <strong>Kargo öncesi onay</strong>
          <p>
            Ürünü teslim almadan “teslim aldım” veya “ürünü onayla” butonuna
            basma.
          </p>
        </article>
        <article>
          <span>🪪</span>
          <strong>Doğrulanmamış hesap</strong>
          <p>
            Yüksek tutarlı işlemlerde kimlik doğrulama rozeti olan satıcıları
            tercih et.
          </p>
        </article>
      </div>
    </section>
  );
}

function FollowingScreen({
  sellerIds,
  auctions,
  now,
  onOpen,
  onSeller,
}: {
  sellerIds: string[];
  auctions: Auction[];
  now: number;
  onOpen: (id: string) => void;
  onSeller: (id: string) => void;
}) {
  const sellers = sellerIds.map((sellerId) => {
    const sellerAuctions = auctions.filter(
      (auction) => auction.sellerId === sellerId,
    );
    const seller = sellerAuctions[0];
    return {
      sellerId,
      name: seller?.seller || "KapışKapış Satıcısı",
      city: seller?.city || "Türkiye",
      auctions: sellerAuctions.filter((auction) => !isEnded(auction, now)),
      score: sellerScore(sellerId),
    };
  });
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Takip ettiğim satıcılar"
        text="Güvendiğin satıcıların yeni açık artırmalarını kaçırma"
      />
      <div className="followed-seller-list">
        {sellers.map((seller) => (
          <article key={seller.sellerId}>
            <button
              className="followed-seller-head"
              onClick={() => onSeller(seller.sellerId)}
            >
              <span>{seller.name.charAt(0)}</span>
              <div>
                <strong>{seller.name}</strong>
                <small>
                  {seller.city} · ★ {seller.score.rating.toFixed(1)} ·{" "}
                  {seller.score.sales} satış
                </small>
              </div>
              <b>›</b>
            </button>
            <div className="followed-auctions">
              {seller.auctions.slice(0, 3).map((auction) => (
                <button key={auction.id} onClick={() => onOpen(auction.id)}>
                  <img src={auction.image} alt="" />
                  <div>
                    <strong>{auction.title}</strong>
                    <small>
                      {money.format(auction.currentBid)} ·{" "}
                      {remaining(auction.endsAt, now)}
                    </small>
                  </div>
                </button>
              ))}
              {seller.auctions.length === 0 && (
                <p>Şu anda aktif ilanı bulunmuyor.</p>
              )}
            </div>
          </article>
        ))}
        {sellers.length === 0 && (
          <EmptyState
            icon="👥"
            title="Takip ettiğin satıcı yok"
            text="Bir satıcı profiline girip Satıcıyı takip et düğmesine bas."
          />
        )}
      </div>
    </section>
  );
}

function RemindersScreen({
  reminders,
  auctions,
  now,
  onOpen,
  onRemove,
}: {
  reminders: AuctionReminder[];
  auctions: Auction[];
  now: number;
  onOpen: (id: string) => void;
  onRemove: (auctionId: string, kind: ReminderKind) => void;
}) {
  const active = reminders.filter((item) => item.active);
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="İlan uyarılarım"
        text="Bitiş zamanı ve fiyat hedefi bildirimlerini yönet"
      />
      <div className="reminder-list">
        {active.map((reminder) => {
          const auction = auctions.find(
            (item) => item.id === reminder.auctionId,
          );
          if (!auction) return null;
          return (
            <article key={`${reminder.auctionId}-${reminder.kind}`}>
              <button
                className="reminder-main"
                onClick={() => onOpen(auction.id)}
              >
                <img src={auction.image} alt="" />
                <div>
                  <span>
                    {reminder.kind === "ending"
                      ? "⏰ Bitiş uyarısı"
                      : "🎯 Fiyat uyarısı"}
                  </span>
                  <strong>{auction.title}</strong>
                  <small>
                    {reminder.kind === "ending"
                      ? `${remaining(auction.endsAt, now)} kaldı`
                      : `Hedef: ${money.format(reminder.targetPrice || 0)} · Güncel: ${money.format(auction.currentBid)}`}
                  </small>
                </div>
                <b>{reminder.triggered ? "Bildirildi" : "Aktif"}</b>
              </button>
              <button
                className="remove-reminder"
                onClick={() => onRemove(reminder.auctionId, reminder.kind)}
              >
                Uyarıyı kaldır
              </button>
            </article>
          );
        })}
        {active.length === 0 && (
          <EmptyState
            icon="⏰"
            title="Aktif uyarın yok"
            text="Bir ilan detayından bitiş veya fiyat uyarısı kurabilirsin."
          />
        )}
      </div>
    </section>
  );
}

function CouponsScreen({ coupons, now }: { coupons: Coupon[]; now: number }) {
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Kuponlarım"
        text="Güvenli ödeme sırasında kullanabileceğin kampanyalar"
      />
      <div className="coupon-list">
        {coupons.map((coupon) => {
          const expired = new Date(coupon.expiresAt).getTime() <= now;
          const disabled = expired || coupon.used;
          return (
            <article className={disabled ? "disabled" : ""} key={coupon.code}>
              <div className="coupon-cut">%</div>
              <div>
                <span>{coupon.code}</span>
                <strong>{coupon.title}</strong>
                <small>
                  Minimum sepet: {money.format(coupon.minSpend)} · Son gün{" "}
                  {dateTime.format(new Date(coupon.expiresAt))}
                </small>
              </div>
              <b>
                {coupon.used
                  ? "Kullanıldı"
                  : expired
                    ? "Süresi doldu"
                    : "Kullanılabilir"}
              </b>
            </article>
          );
        })}
      </div>
      <div className="coupon-info">
        <span>🎟️</span>
        <div>
          <strong>Kupon nasıl kullanılır?</strong>
          <p>
            Kazandığın ürünün ödeme ekranında kupon kodunu gir. Uygun indirim
            toplam tutardan otomatik düşer.
          </p>
        </div>
      </div>
    </section>
  );
}

function SecurityCenter({ liveMode }: { liveMode: boolean }) {
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Hesap ve güvenlik"
        text="Teklif ve satış işlemleri için doğrulama durumun"
      />
      <div className="security-score">
        <div>
          <span>Güvenlik puanı</span>
          <strong>{liveMode ? "%60" : "%92"}</strong>
          <small>
            {liveMode
              ? "Telefon ve kimlik doğrulaması sırada"
              : "Hesabın güçlü şekilde korunuyor"}
          </small>
        </div>
        <div className="score-ring">{liveMode ? "60" : "92"}</div>
      </div>
      <div className="security-list">
        <article>
          <span>✓</span>
          <div>
            <strong>E-posta doğrulaması</strong>
            <p>Hesap iletişimi ve giriş kurtarma için kullanılır.</p>
          </div>
          <b>Tamamlandı</b>
        </article>
        <article>
          <span>{liveMode ? "2" : "✓"}</span>
          <div>
            <strong>Telefon doğrulaması</strong>
            <p>Yüksek tutarlı tekliflerde ek güvenlik sağlar.</p>
          </div>
          <b>{liveMode ? "Bekliyor" : "Tamamlandı"}</b>
        </article>
        <article>
          <span>{liveMode ? "3" : "✓"}</span>
          <div>
            <strong>Kimlik doğrulaması</strong>
            <p>Satıcı rozeti ve para çekme işlemleri için zorunludur.</p>
          </div>
          <b>{liveMode ? "Başlat" : "Tamamlandı"}</b>
        </article>
        <article>
          <span>4</span>
          <div>
            <strong>İki aşamalı giriş</strong>
            <p>Yeni cihaz girişlerinde tek kullanımlık kod ister.</p>
          </div>
          <b>Etkinleştir</b>
        </article>
      </div>
      <div className="protection-card">
        <span>🛡️</span>
        <div>
          <strong>Korumalı ödeme</strong>
          <p>
            Alıcı ödemesi ürün teslim edilip onaylanana kadar satıcıya
            aktarılmaz.
          </p>
        </div>
      </div>
    </section>
  );
}

function SupportCenter() {
  const [open, setOpen] = useState(0);
  const faqs = [
    [
      "Teklif verdikten sonra vazgeçebilir miyim?",
      "Açık artırma teklifleri bağlayıcıdır. Hatalı işlem durumunda destek kaydı açılır ve işlem geçmişi incelenir.",
    ],
    [
      "Gizli taban fiyat ne demek?",
      "Satıcının satışın gerçekleşmesi için belirlediği minimum tutardır. Rakam alıcılara gösterilmez.",
    ],
    [
      "Ödeme satıcıya ne zaman geçer?",
      "Ürün teslim edilip alıcı tarafından onaylandığında güvenli hesaptaki tutar satıcı bakiyesine aktarılır.",
    ],
    [
      "Ürün anlatıldığı gibi değilse ne olur?",
      "Teslimattan sonra onay vermeden itiraz açılır; ödeme inceleme tamamlanana kadar bloke kalır.",
    ],
  ];
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Yardım ve destek"
        text="Açık artırma, ödeme ve teslimatla ilgili hızlı cevaplar"
      />
      <div className="support-actions">
        <button>
          <span>💬</span>
          <strong>Canlı destek</strong>
          <small>09.00–23.00</small>
        </button>
        <button>
          <span>📝</span>
          <strong>Destek kaydı</strong>
          <small>Ortalama 2 saat</small>
        </button>
        <button>
          <span>⚠️</span>
          <strong>İtiraz merkezi</strong>
          <small>Ödeme koruması</small>
        </button>
      </div>
      <div className="faq-list">
        {faqs.map(([question, answer], index) => (
          <button
            className={open === index ? "open" : ""}
            key={question}
            onClick={() => setOpen(open === index ? -1 : index)}
          >
            <div>
              <strong>{question}</strong>
              <span>{open === index ? "−" : "+"}</span>
            </div>
            {open === index && <p>{answer}</p>}
          </button>
        ))}
      </div>
      <div className="support-banner">
        <strong>Acil güvenlik sorunu mu var?</strong>
        <p>
          Şüpheli ödeme talebi, sahte ürün veya hesap ele geçirme durumunda
          işlem yapmadan destek kaydı oluştur.
        </p>
        <button>Güvenlik bildirimi oluştur</button>
      </div>
    </section>
  );
}


function StoreShowcase({
  storefronts,
  auctions,
  followedSellers,
  onOpen,
}: {
  storefronts: StoreProfile[];
  auctions: Auction[];
  followedSellers: string[];
  onOpen: (sellerId: string) => void;
}) {
  const cards = storefronts
    .map((store) => {
      const sellerAuctions = auctions.filter(
        (auction) => auction.sellerId === store.sellerId,
      );
      return { store, sellerAuctions };
    })
    .filter((item) => item.sellerAuctions.length > 0)
    .slice(0, 3);

  if (!cards.length) return null;

  return (
    <section className="store-showcase">
      <div className="store-showcase-head">
        <div>
          <span>SEÇİLMİŞ SATICILAR</span>
          <h2>KapışKapış mağazaları</h2>
          <p>Takip et, koleksiyonları keşfet ve takipçiye özel kampanyaları yakala.</p>
        </div>
      </div>
      <div className="store-card-grid">
        {cards.map(({ store, sellerAuctions }) => {
          const lead = sellerAuctions.find((auction) =>
            store.featuredAuctionIds.includes(auction.id),
          ) || sellerAuctions[0];
          return (
            <button
              key={store.sellerId}
              className="store-card"
              onClick={() => onOpen(store.sellerId)}
            >
              <div className="store-card-visual">
                <img src={lead.image} alt="" />
                <span>{store.name.charAt(0)}</span>
              </div>
              <div className="store-card-copy">
                <small>
                  {followedSellers.includes(store.sellerId)
                    ? "✓ Takip ediliyor"
                    : "DOĞRULANMIŞ MAĞAZA"}
                </small>
                <strong>{store.name}</strong>
                <p>{store.tagline}</p>
                <div>
                  <span>{sellerAuctions.length} ilan</span>
                  {store.campaignActive && (
                    <b>%{store.followerDiscount} takipçi indirimi</b>
                  )}
                </div>
              </div>
              <em>Mağazaya git →</em>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function StorefrontScreen({
  sellerId,
  profile,
  auctions,
  reviews,
  now,
  followed,
  isOwner,
  onFollow,
  onOpen,
  onManage,
}: {
  sellerId: string;
  profile?: StoreProfile;
  auctions: Auction[];
  reviews: Review[];
  now: number;
  followed: boolean;
  isOwner: boolean;
  onFollow: (sellerId: string, sellerName: string) => void;
  onOpen: (id: string) => void;
  onManage: () => void;
}) {
  const sellerAuctions = auctions.filter(
    (auction) => auction.sellerId === sellerId,
  );
  const sellerName = sellerAuctions[0]?.seller || "KapışKapış Satıcısı";
  const store: StoreProfile =
    profile || {
      sellerId,
      name: `${sellerName} Mağazası`,
      tagline: "Güvenli açık artırmalar ve seçilmiş ikinci el ürünler",
      about:
        "Bu mağaza KapışKapış korumalı ödeme ve doğrulanmış satıcı altyapısını kullanır.",
      featuredAuctionIds: sellerAuctions.slice(0, 3).map((item) => item.id),
      followerDiscount: 5,
      campaignActive: false,
      updatedAt: new Date().toISOString(),
    };
  const featured = store.featuredAuctionIds
    .map((id) => sellerAuctions.find((auction) => auction.id === id))
    .filter(Boolean) as Auction[];
  const active = sellerAuctions.filter((auction) => !isEnded(auction, now));
  const categories = Array.from(
    new Set(sellerAuctions.map((auction) => auction.category)),
  );
  const score = sellerScore(sellerId, reviews);

  return (
    <section className="page standalone-page store-page">
      <div className="store-hero">
        <div className="store-hero-pattern" />
        <div className="store-logo">{store.name.charAt(0)}</div>
        <div className="store-hero-copy">
          <span>✓ DOĞRULANMIŞ AÇIKPAZAR MAĞAZASI</span>
          <h1>{store.name}</h1>
          <p>{store.tagline}</p>
          <div>
            <b>★ {score.rating.toFixed(1)}</b>
            <span>{score.sales} tamamlanan satış</span>
            <span>{active.length} aktif ilan</span>
          </div>
        </div>
        <div className="store-hero-actions">
          {isOwner ? (
            <button onClick={onManage}>Mağazayı yönet</button>
          ) : (
            <button
              className={followed ? "following" : ""}
              onClick={() => onFollow(sellerId, store.name)}
            >
              {followed ? "✓ Takip ediliyor" : "+ Mağazayı takip et"}
            </button>
          )}
        </div>
      </div>

      {store.campaignActive && (
        <div className={followed || isOwner ? "store-campaign unlocked" : "store-campaign"}>
          <div>
            <span>🎁 TAKİPÇİYE ÖZEL</span>
            <strong>%{store.followerDiscount} mağaza kampanyası</strong>
            <p>
              {followed || isOwner
                ? `TAKIP${store.followerDiscount} kodu ödeme ekranında hazır.`
                : "Kampanya kodunu açmak için mağazayı takip et."}
            </p>
          </div>
          <b>{followed || isOwner ? `TAKIP${store.followerDiscount}` : "KİLİTLİ"}</b>
        </div>
      )}

      <div className="store-about-grid">
        <article>
          <span>MAĞAZA HAKKINDA</span>
          <p>{store.about}</p>
        </article>
        <article>
          <span>GÜVEN ÖZETİ</span>
          <div>
            <b>🪪 Kimlik doğrulandı</b>
            <b>📦 %96 zamanında kargo</b>
            <b>🛡️ Korumalı ödeme</b>
          </div>
        </article>
      </div>

      {featured.length > 0 && (
        <>
          <div className="section-heading store-section-heading">
            <div><strong>Mağaza vitrini</strong></div>
            <span>{featured.length} seçilmiş ürün</span>
          </div>
          <AuctionGrid
            auctions={featured}
            now={now}
            onOpen={onOpen}
            onFavorite={() => undefined}
          />
        </>
      )}

      {categories.length > 0 && (
        <div className="store-collections">
          <div className="section-heading">
            <div><strong>Koleksiyonlar</strong></div>
            <span>{categories.length} kategori</span>
          </div>
          <div className="store-collection-grid">
            {categories.map((category) => {
              const items = sellerAuctions.filter(
                (auction) => auction.category === category,
              );
              return (
                <article key={category}>
                  <span>{category === "Oyun" ? "🎮" : category === "Telefon" ? "📱" : "💻"}</span>
                  <div>
                    <strong>{category} koleksiyonu</strong>
                    <small>{items.length} ürün · Açık artırma</small>
                  </div>
                  <b>→</b>
                </article>
              );
            })}
          </div>
        </div>
      )}

      <div className="section-heading store-section-heading">
        <div><strong>Tüm mağaza ilanları</strong></div>
        <span>{sellerAuctions.length} ilan</span>
      </div>
      <AuctionGrid
        auctions={sellerAuctions}
        now={now}
        onOpen={onOpen}
        onFavorite={() => undefined}
        empty={
          <EmptyState
            icon="🏪"
            title="Mağaza vitrini hazırlanıyor"
            text="Satıcının yeni ilanları burada görünecek."
          />
        }
      />
    </section>
  );
}

function StoreManagerScreen({
  currentUser,
  profile,
  auctions,
  onSave,
  onPreview,
}: {
  currentUser: AppUser;
  profile?: StoreProfile;
  auctions: Auction[];
  onSave: (profile: StoreProfile) => void;
  onPreview: () => void;
}) {
  const initial: StoreProfile =
    profile || {
      sellerId: currentUser.id,
      name: `${currentUser.name} Mağazası`,
      tagline: "Seçilmiş ürünler, güvenli açık artırmalar",
      about: "Mağazamızdaki tüm ürünler ayrıntılı açıklama ve korumalı ödeme ile listelenir.",
      featuredAuctionIds: auctions.slice(0, 3).map((item) => item.id),
      followerDiscount: 10,
      campaignActive: false,
      updatedAt: new Date().toISOString(),
    };
  const [name, setName] = useState(initial.name);
  const [tagline, setTagline] = useState(initial.tagline);
  const [about, setAbout] = useState(initial.about);
  const [featuredIds, setFeaturedIds] = useState<string[]>(
    initial.featuredAuctionIds,
  );
  const [discount, setDiscount] = useState(initial.followerDiscount);
  const [campaignActive, setCampaignActive] = useState(initial.campaignActive);

  function toggleFeatured(id: string) {
    if (featuredIds.includes(id)) {
      setFeaturedIds((items) => items.filter((item) => item !== id));
      return;
    }
    if (featuredIds.length >= 4) return;
    setFeaturedIds((items) => [...items, id]);
  }

  function save() {
    if (!name.trim() || !tagline.trim()) return;
    onSave({
      sellerId: currentUser.id,
      name: name.trim(),
      tagline: tagline.trim(),
      about: about.trim(),
      featuredAuctionIds: featuredIds,
      followerDiscount: discount,
      campaignActive,
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Mağazam ve vitrinim"
        text="Satıcı markanı oluştur, öne çıkan ürünlerini seç ve takipçilerine kampanya sun."
      />

      <div className="store-manager-layout">
        <div className="store-manager-form">
          <div className="settings-card">
            <div className="settings-head">
              <div><span>01</span><strong>Mağaza kimliği</strong></div>
              <small>Alıcıların göreceği bilgiler</small>
            </div>
            <label>
              Mağaza adı
              <input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} />
            </label>
            <label>
              Kısa slogan
              <input value={tagline} onChange={(event) => setTagline(event.target.value)} maxLength={90} />
            </label>
            <label>
              Mağaza açıklaması
              <textarea value={about} onChange={(event) => setAbout(event.target.value)} rows={4} />
            </label>
          </div>

          <div className="settings-card">
            <div className="settings-head">
              <div><span>02</span><strong>Vitrin koleksiyonu</strong></div>
              <small>En fazla 4 ilan seç</small>
            </div>
            <div className="store-product-selector">
              {auctions.length ? (
                auctions.map((auction) => (
                  <button
                    key={auction.id}
                    className={featuredIds.includes(auction.id) ? "selected" : ""}
                    onClick={() => toggleFeatured(auction.id)}
                  >
                    <img src={auction.image} alt="" />
                    <div>
                      <strong>{auction.title}</strong>
                      <small>{money.format(auction.currentBid)}</small>
                    </div>
                    <span>{featuredIds.includes(auction.id) ? "✓" : "+"}</span>
                  </button>
                ))
              ) : (
                <EmptyState
                  icon="◫"
                  title="Vitrine eklenecek ilan yok"
                  text="Önce bir açık artırma ilanı yayınla."
                />
              )}
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-head">
              <div><span>03</span><strong>Takipçi kampanyası</strong></div>
              <small>Mağazanı takip edenlere özel</small>
            </div>
            <div className="discount-options">
              {[5, 10, 15].map((value) => (
                <button
                  key={value}
                  className={discount === value ? "active" : ""}
                  onClick={() => setDiscount(value)}
                >
                  %{value}
                </button>
              ))}
            </div>
            <label className="switch-row">
              <div>
                <strong>Kampanyayı yayınla</strong>
                <small>Takipçiler ödeme ekranında TAKIP{discount} kodunu kullanır.</small>
              </div>
              <input
                type="checkbox"
                checked={campaignActive}
                onChange={(event) => setCampaignActive(event.target.checked)}
              />
            </label>
          </div>

          <div className="store-manager-actions">
            <button onClick={save}>Değişiklikleri kaydet</button>
            <button className="secondary" onClick={onPreview}>Mağazayı önizle</button>
          </div>
        </div>

        <aside className="store-preview-card">
          <span>CANLI ÖNİZLEME</span>
          <div className="preview-store-logo">{name.trim().charAt(0) || "A"}</div>
          <h2>{name || "Mağaza adı"}</h2>
          <p>{tagline || "Mağaza sloganın burada görünecek."}</p>
          <div>
            <b>★ 5.0</b>
            <span>{auctions.length} ilan</span>
          </div>
          {campaignActive && (
            <em>%{discount} takipçi kampanyası aktif</em>
          )}
        </aside>
      </div>
    </section>
  );
}

function SellerProfile({
  sellerId,
  auctions,
  now,
  followed,
  reviews,
  onFollow,
  onOpen,
  onStore,
}: {
  sellerId: string;
  auctions: Auction[];
  now: number;
  followed: boolean;
  reviews: Review[];
  onFollow: (sellerId: string, sellerName: string) => void;
  onOpen: (id: string) => void;
  onStore: () => void;
}) {
  const sellerAuctions = auctions.filter(
    (auction) => auction.sellerId === sellerId,
  );
  const seller = sellerAuctions[0];
  const sellerReviews = reviews.filter(
    (review) => review.sellerId === sellerId,
  );
  const score = sellerScore(sellerId, reviews);
  const sellerName = seller?.seller || "KapışKapış Satıcısı";
  const sellerCity = seller?.city || "Türkiye";
  return (
    <section className="page standalone-page">
      <div className="seller-profile-head">
        <div className="seller-avatar-large">{sellerName.charAt(0)}</div>
        <div>
          <span className="verified-line">✓ Kimliği doğrulanmış satıcı</span>
          <h1>{sellerName}</h1>
          <p>{sellerCity} · 2024'ten beri üye</p>
        </div>
        <div className="seller-head-actions">
          <button className="store-link-button" onClick={onStore}>
            Mağazayı aç
          </button>
          <button
            className={followed ? "following" : ""}
            onClick={() => onFollow(sellerId, sellerName)}
          >
            {followed ? "✓ Takip ediliyor" : "+ Satıcıyı takip et"}
          </button>
        </div>
      </div>
      <div className="seller-score-grid">
        <div>
          <strong>{score.rating.toFixed(1)}</strong>
          <span>★★★★★</span>
          <small>{score.count} değerlendirme</small>
        </div>
        <div>
          <strong>{score.sales}</strong>
          <span>Tamamlanan satış</span>
          <small>%96 zamanında kargo</small>
        </div>
        <div>
          <strong>2 sa</strong>
          <span>Ortalama cevap</span>
          <small>Son 24 saatte aktif</small>
        </div>
      </div>
      <div className="seller-guarantees">
        <span>🪪 Kimlik doğrulandı</span>
        <span>📦 Kargo performansı yüksek</span>
        <span>🛡️ Korumalı ödeme</span>
      </div>
      <div className="section-heading">
        <div>
          <strong>Satıcının ilanları</strong>
        </div>
        <span>{sellerAuctions.length} ilan</span>
      </div>
      <AuctionGrid
        auctions={sellerAuctions}
        now={now}
        onOpen={onOpen}
        onFavorite={() => undefined}
        empty={
          <EmptyState
            icon="◫"
            title="Aktif ilan yok"
            text="Bu satıcının şu anda açık artırması bulunmuyor."
          />
        }
      />
      <div className="section-heading review-heading">
        <div>
          <strong>Alıcı değerlendirmeleri</strong>
        </div>
        <span>★ {score.rating.toFixed(1)}</span>
      </div>
      <div className="review-list">
        {sellerReviews.length ? (
          sellerReviews.map((review) => (
            <article key={review.id}>
              <div>
                <span className="review-avatar">
                  {review.reviewer.charAt(0)}
                </span>
                <div>
                  <strong>{review.reviewer}</strong>
                  <small>
                    {review.product} ·{" "}
                    {dateTime.format(new Date(review.createdAt))}
                  </small>
                </div>
                <b>
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </b>
              </div>
              <p>{review.text}</p>
            </article>
          ))
        ) : (
          <EmptyState
            icon="★"
            title="Henüz değerlendirme yok"
            text="İlk tamamlanan satıştan sonra alıcı yorumları burada görünecek."
          />
        )}
      </div>
    </section>
  );
}

function AdminPanel({
  auctions,
  bids,
  orders,
  moderation,
  onModerate,
  onOpen,
}: {
  auctions: Auction[];
  bids: Bid[];
  orders: Order[];
  moderation: Record<string, ModerationStatus>;
  onModerate: (id: string, status: ModerationStatus) => void;
  onOpen: (id: string) => void;
}) {
  const reviewQueue = auctions.filter(
    (auction) => moderation[auction.id] === "pending",
  );
  const approved = Object.values(moderation).filter(
    (status) => status === "approved",
  ).length;
  const rejected = Object.values(moderation).filter(
    (status) => status === "rejected",
  ).length;
  const volume = bids.reduce((sum, bid) => sum + bid.amount, 0);
  return (
    <section className="page standalone-page">
      <div className="admin-hero">
        <div>
          <span>YÖNETİM MERKEZİ</span>
          <h1>KapışKapış Kontrol Paneli</h1>
          <p>İlan güvenliği, kullanıcı hareketleri ve platform performansı.</p>
        </div>
        <b>Kurucu erişimi</b>
      </div>
      <div className="admin-metrics">
        <article>
          <span>Aktif ilan</span>
          <strong>
            {auctions.filter((auction) => !isEnded(auction, Date.now())).length}
          </strong>
          <small>{reviewQueue.length} inceleme bekliyor</small>
        </article>
        <article>
          <span>Teklif hacmi</span>
          <strong>{money.format(volume)}</strong>
          <small>{bids.length} teklif hareketi</small>
        </article>
        <article>
          <span>Korumalı sipariş</span>
          <strong>{orders.length}</strong>
          <small>
            {money.format(orders.reduce((sum, order) => sum + order.amount, 0))}{" "}
            toplam
          </small>
        </article>
        <article>
          <span>Moderasyon</span>
          <strong>
            {approved}/{rejected}
          </strong>
          <small>Onaylanan / reddedilen</small>
        </article>
      </div>
      <div className="admin-grid">
        <section>
          <div className="section-heading">
            <div>
              <span className="live-dot" />
              <strong>İnceleme kuyruğu</strong>
            </div>
            <span>{reviewQueue.length} ilan</span>
          </div>
          <div className="moderation-list">
            {reviewQueue.map((auction) => (
              <article key={auction.id}>
                <button
                  className="moderation-main"
                  onClick={() => onOpen(auction.id)}
                >
                  <img src={auction.image} alt="" />
                  <div>
                    <span>
                      {auction.category} · {auction.city}
                    </span>
                    <h3>{auction.title}</h3>
                    <small>
                      {auction.seller} · {money.format(auction.startingBid)}{" "}
                      başlangıç
                    </small>
                  </div>
                  <b>›</b>
                </button>
                <div className="moderation-flags">
                  <span>Yeni satıcı</span>
                  <span>Yüksek tutar</span>
                  <span>Görsel kontrolü</span>
                </div>
                <div className="moderation-actions">
                  <button onClick={() => onModerate(auction.id, "rejected")}>
                    Reddet
                  </button>
                  <button onClick={() => onModerate(auction.id, "approved")}>
                    Onayla
                  </button>
                </div>
              </article>
            ))}
            {reviewQueue.length === 0 && (
              <EmptyState
                icon="✓"
                title="Kuyruk temiz"
                text="İnceleme bekleyen ilan bulunmuyor."
              />
            )}
          </div>
        </section>
        <aside>
          <div className="risk-card">
            <span>🛡️</span>
            <div>
              <strong>Risk özeti</strong>
              <p>Son 24 saatte kritik güvenlik olayı bulunmuyor.</p>
            </div>
          </div>
          <div className="admin-feed">
            <strong>Son sistem hareketleri</strong>
            <p>
              <span>✓</span> Kimlik doğrulama servisi aktif
            </p>
            <p>
              <span>✓</span> Teklif RPC kontrolü çalışıyor
            </p>
            <p>
              <span>!</span> Ödeme sağlayıcısı bağlantısı bekliyor
            </p>
            <p>
              <span>!</span> Kargo API entegrasyonu bekliyor
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}


function SavedSearchesScreen({
  items,
  auctions,
  now,
  onApply,
  onToggleNotify,
  onDelete,
}: {
  items: SavedSearch[];
  auctions: Auction[];
  now: number;
  onApply: (item: SavedSearch) => void;
  onToggleNotify: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  function matchCount(item: SavedSearch) {
    return auctions.filter((auction) => {
      if (isEnded(auction, now)) return false;
      const haystack = `${auction.title} ${auction.category} ${auction.city}`.toLocaleLowerCase("tr");
      return (
        (!item.query || haystack.includes(item.query.toLocaleLowerCase("tr"))) &&
        (item.category === "Tümü" || auction.category === item.category) &&
        (item.condition === "Tümü" || auction.condition === item.condition) &&
        (item.city === "Tümü" || auction.city === item.city) &&
        (!item.maxPrice || auction.currentBid <= item.maxPrice)
      );
    }).length;
  }

  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Kaydedilmiş aramalar"
        text="Yeni ilanları kaçırmamak için arama ve filtrelerini bildirimli takip et"
      />
      <div className="saved-search-summary">
        <div><span>Aktif arama</span><strong>{items.length}</strong></div>
        <div><span>Bildirim açık</span><strong>{items.filter((item) => item.notify).length}</strong></div>
        <div><span>Yeni eşleşme</span><strong>{items.reduce((sum, item) => sum + matchCount(item), 0)}</strong></div>
      </div>
      <div className="saved-search-list">
        {items.map((item) => (
          <article key={item.id}>
            <div className="saved-search-icon">⌕</div>
            <div className="saved-search-copy">
              <small>{dateTime.format(new Date(item.createdAt))}</small>
              <strong>{item.name}</strong>
              <p>
                {[
                  item.condition !== "Tümü" ? item.condition : "",
                  item.endingFilter !== "Tümü" ? `${item.endingFilter} saat içinde` : "",
                ].filter(Boolean).join(" · ") || "Genel arama"}
              </p>
              <span>{matchCount(item)} aktif ilan eşleşiyor</span>
            </div>
            <div className="saved-search-actions">
              <button className={item.notify ? "notify active" : "notify"} onClick={() => onToggleNotify(item.id)}>
                {item.notify ? "🔔 Bildirim açık" : "🔕 Bildirim kapalı"}
              </button>
              <button onClick={() => onApply(item)}>Sonuçları gör</button>
              <button className="danger" onClick={() => onDelete(item.id)}>Sil</button>
            </div>
          </article>
        ))}
        {items.length === 0 && (
          <EmptyState
            icon="⌕"
            title="Kaydedilmiş araman yok"
            text="Ana sayfada filtrelerini seçip Aramayı kaydet düğmesine bas."
          />
        )}
      </div>
    </section>
  );
}

function SellerAnalyticsScreen({
  currentUser,
  auctions,
  bids,
  orders,
  now,
  onOpen,
}: {
  currentUser: AppUser;
  auctions: Auction[];
  bids: Bid[];
  orders: Order[];
  now: number;
  onOpen: (id: string) => void;
}) {
  const mine = auctions.filter((auction) => auction.sellerId === currentUser.id);
  const sold = orders.filter((order) => order.sellerId === currentUser.id);
  const active = mine.filter((auction) => !isEnded(auction, now));
  const ended = mine.filter((auction) => isEnded(auction, now));
  const totalBids = mine.reduce((sum, auction) => sum + auction.bidCount, 0);
  const revenue = sold.reduce((sum, order) => sum + order.amount, 0);
  const conversion = ended.length ? Math.round((sold.length / ended.length) * 100) : 0;
  const averageSale = sold.length ? revenue / sold.length : 0;
  const estimatedViews = mine.reduce((sum, auction) => sum + 38 + auction.bidCount * 14, 0);
  const maxBidCount = Math.max(1, ...mine.map((auction) => auction.bidCount));
  const categoryStats = Array.from(new Set(mine.map((auction) => auction.category))).map((category) => ({
    category,
    count: mine.filter((auction) => auction.category === category).length,
    bids: mine.filter((auction) => auction.category === category).reduce((sum, auction) => sum + auction.bidCount, 0),
  }));

  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Satıcı performans analizi"
        text="İlanlarının görüntülenme, teklif ve satış dönüşümünü incele"
      />
      <div className="analytics-metrics">
        <article><span>Tahmini görüntülenme</span><strong>{estimatedViews}</strong><small>Son 30 gün · ↗ %16</small></article>
        <article><span>Toplam teklif</span><strong>{totalBids}</strong><small>{active.length} aktif ilan</small></article>
        <article><span>Satış dönüşümü</span><strong>%{conversion}</strong><small>{sold.length} başarılı satış</small></article>
        <article><span>Ortalama satış</span><strong>{money.format(averageSale)}</strong><small>Net öncesi tutar</small></article>
      </div>
      <div className="analytics-layout">
        <section className="analytics-card">
          <div className="analytics-card-head"><div><strong>İlan bazında teklif gücü</strong><small>En çok ilgi gören ilanlarını karşılaştır</small></div><span>TEKLİF</span></div>
          <div className="auction-bar-list">
            {mine.map((auction) => (
              <button key={auction.id} onClick={() => onOpen(auction.id)}>
                <img src={auction.image} alt="" />
                <div><strong>{auction.title}</strong><small>{money.format(auction.currentBid)} · {auction.bidCount} teklif</small><span><i style={{ width: `${Math.max(8, (auction.bidCount / maxBidCount) * 100)}%` }} /></span></div>
                <b>{isEnded(auction, now) ? "Bitti" : remaining(auction.endsAt, now)}</b>
              </button>
            ))}
            {mine.length === 0 && <EmptyState icon="📈" title="Analiz için ilan gerekli" text="İlk ilanını yayınladığında performans burada oluşacak." />}
          </div>
        </section>
        <aside className="analytics-card category-analytics">
          <div className="analytics-card-head"><div><strong>Kategori dağılımı</strong><small>İlan ve teklif yoğunluğu</small></div></div>
          {categoryStats.map((item) => (
            <div key={item.category}>
              <span>{item.category}</span><strong>{item.count} ilan</strong><small>{item.bids} teklif</small>
            </div>
          ))}
          <div className="analytics-tip"><span>💡</span><p>İlk 24 saatte teklif almayan ilanlarda başlangıç fiyatını %8–12 düşürmek görünürlüğü artırabilir.</p></div>
        </aside>
      </div>
    </section>
  );
}

function AuctionResultsScreen({
  auctions,
  bids,
  orders,
  currentUser,
  now,
  onOpen,
  onOrder,
}: {
  auctions: Auction[];
  bids: Bid[];
  orders: Order[];
  currentUser: AppUser;
  now: number;
  onOpen: (id: string) => void;
  onOrder: (id: string) => void;
}) {
  const ended = auctions
    .filter((auction) => isEnded(auction, now))
    .sort(
      (a, b) =>
        new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime(),
    );
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Açık artırma sonuçları"
        text="Kazanan, taban fiyat ve işlem başlangıcını tek ekranda gör"
      />
      <div className="result-summary-grid">
        <article>
          <span>Tamamlanan</span>
          <strong>{ended.length}</strong>
          <small>Açık artırma</small>
        </article>
        <article>
          <span>Kazandıkların</span>
          <strong>
            {
              ended.filter((auction) => {
                const top = bids
                  .filter((bid) => bid.auctionId === auction.id)
                  .sort((a, b) => b.amount - a.amount)[0];
                return top?.userId === currentUser.id;
              }).length
            }
          </strong>
          <small>Ödeme bekleyen dahil</small>
        </article>
        <article>
          <span>Satılan ilanların</span>
          <strong>
            {
              ended.filter(
                (auction) =>
                  auction.sellerId === currentUser.id &&
                  bids
                    .filter((bid) => bid.auctionId === auction.id)
                    .some((bid) => bid.amount >= auction.reservePrice),
              ).length
            }
          </strong>
          <small>Taban fiyat karşılandı</small>
        </article>
      </div>
      <div className="auction-result-list">
        {ended.map((auction) => {
          const topBid = bids
            .filter((bid) => bid.auctionId === auction.id)
            .sort((a, b) => b.amount - a.amount)[0];
          const reserveMet = Boolean(
            topBid && topBid.amount >= auction.reservePrice,
          );
          const order = orders.find((item) => item.auctionId === auction.id);
          const userWon = topBid?.userId === currentUser.id;
          const userSold = auction.sellerId === currentUser.id && reserveMet;
          return (
            <article key={auction.id}>
              <button className="result-product" onClick={() => onOpen(auction.id)}>
                <img src={auction.image} alt="" />
                <div>
                  <span>
                    {reserveMet
                      ? userWon
                        ? "KAZANDIN"
                        : userSold
                          ? "SATILDI"
                          : "SONUÇLANDI"
                      : "TABAN FİYAT KARŞILANMADI"}
                  </span>
                  <strong>{auction.title}</strong>
                  <small>
                    {topBid
                      ? `${topBid.userName} · ${money.format(topBid.amount)}`
                      : "Teklif verilmedi"}
                  </small>
                </div>
                <b className={reserveMet ? "success" : "warning"}>
                  {reserveMet ? "Satış oluştu" : "Satış yok"}
                </b>
              </button>
              <div className="result-meta">
                <span>Başlangıç {money.format(auction.startingBid)}</span>
                <span>Taban {money.format(auction.reservePrice)}</span>
                <span>{auction.bidCount} teklif</span>
                {order && (
                  <button onClick={() => onOrder(order.id)}>
                    Sipariş sürecini aç →
                  </button>
                )}
              </div>
            </article>
          );
        })}
        {!ended.length && (
          <EmptyState
            icon="🏁"
            title="Henüz sonuçlanan açık artırma yok"
            text="Süresi biten ilanların kazanan ve satış bilgileri burada görünecek."
          />
        )}
      </div>
    </section>
  );
}

function disputeLabel(status: DisputeStatus) {
  if (status === "open") return "Yeni kayıt";
  if (status === "reviewing") return "İnceleniyor";
  if (status === "resolved_buyer") return "Alıcı lehine sonuçlandı";
  return "Satıcı lehine sonuçlandı";
}

function DisputesCenter({
  disputes,
  orders,
  auctions,
  currentUser,
  selectedOrderId,
  liveMode,
  onCreate,
  onResolve,
}: {
  disputes: Dispute[];
  orders: Order[];
  auctions: Auction[];
  currentUser: AppUser;
  selectedOrderId: string;
  liveMode: boolean;
  onCreate: (orderId: string, reason: string, details: string) => void;
  onResolve: (id: string, result: "buyer" | "seller" | "reviewing") => void;
}) {
  const relevantOrders = orders.filter(
    (order) =>
      order.buyerId === currentUser.id || order.sellerId === currentUser.id,
  );
  const [orderId, setOrderId] = useState(
    selectedOrderId || relevantOrders[0]?.id || "",
  );
  const [reason, setReason] = useState("Ürün ilandaki gibi değil");
  const [details, setDetails] = useState("");
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="İtiraz ve iadeler"
        text="Ödeme korumasını durdur, kanıt ekle ve çözüm sürecini takip et"
      />
      <div className="dispute-layout">
        <section className="dispute-form-card">
          <span>YENİ SORUN BİLDİRİMİ</span>
          <h2>İşlem için güvenli inceleme başlat</h2>
          <label>
            Sipariş
            <select value={orderId} onChange={(event) => setOrderId(event.target.value)}>
              {relevantOrders.map((order) => {
                const auction = auctions.find((item) => item.id === order.auctionId);
                return (
                  <option value={order.id} key={order.id}>
                    {auction?.title || order.id} · {money.format(order.amount)}
                  </option>
                );
              })}
            </select>
          </label>
          <label>
            Sorun türü
            <select value={reason} onChange={(event) => setReason(event.target.value)}>
              <option>Ürün ilandaki gibi değil</option>
              <option>Kargo süresi aşıldı</option>
              <option>Eksik veya hasarlı ürün</option>
              <option>Sahte ürün şüphesi</option>
              <option>Yanlış ürün gönderildi</option>
            </select>
          </label>
          <label>
            Açıklama
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Sorunu, teslimat durumunu ve talep ettiğin çözümü yaz…"
            />
          </label>
          <button
            className="primary-button"
            disabled={!orderId}
            onClick={() => {
              onCreate(orderId, reason, details);
              setDetails("");
            }}
          >
            İtiraz kaydı oluştur
          </button>
          <p>
            İtiraz açıldığında ödeme satıcıya aktarılmaz. İnceleme sonuçlanana kadar
            güvenli hesapta tutulur.
          </p>
        </section>
        <aside className="dispute-rules">
          <strong>Çözüm hedefi</strong>
          <b>48 saat</b>
          <p>Mesajlar, ilan açıklaması, ödeme ve kargo geçmişi birlikte incelenir.</p>
          <ul>
            <li>✓ Ödeme otomatik durdurulur</li>
            <li>✓ Tarafların kayıtları korunur</li>
            <li>✓ İade veya ödeme kararı verilir</li>
          </ul>
        </aside>
      </div>
      <div className="section-heading">
        <div><strong>İtiraz geçmişi</strong></div>
        <span>{disputes.length} kayıt</span>
      </div>
      <div className="dispute-list">
        {disputes.map((dispute) => {
          const order = orders.find((item) => item.id === dispute.orderId);
          const auction = auctions.find((item) => item.id === order?.auctionId);
          return (
            <article key={dispute.id}>
              <div className="dispute-head">
                <span className={`dispute-status ${dispute.status}`}>
                  {disputeLabel(dispute.status)}
                </span>
                <small>{dateTime.format(new Date(dispute.updatedAt))}</small>
              </div>
              <strong>{auction?.title || dispute.orderId}</strong>
              <h3>{dispute.reason}</h3>
              <p>{dispute.details}</p>
              <div className="dispute-actions">
                <span>{order ? money.format(order.amount) : ""}</span>
                {!liveMode && (dispute.status === "open" || dispute.status === "reviewing") && (
                  <div>
                    <button onClick={() => onResolve(dispute.id, "reviewing")}>İncelemeye al</button>
                    <button onClick={() => onResolve(dispute.id, "buyer")}>Alıcı lehine</button>
                    <button onClick={() => onResolve(dispute.id, "seller")}>Satıcı lehine</button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
        {!disputes.length && (
          <EmptyState
            icon="⚖️"
            title="İtiraz kaydı yok"
            text="Sorunsuz tamamlanan işlemlerde ödeme otomatik olarak satıcıya aktarılır."
          />
        )}
      </div>
    </section>
  );
}

function ReviewsCenter({
  reviews,
  orders,
  auctions,
  currentUser,
  onSubmit,
}: {
  reviews: Review[];
  orders: Order[];
  auctions: Auction[];
  currentUser: AppUser;
  onSubmit: (orderId: string, rating: number, text: string) => void;
}) {
  const reviewable = orders.filter(
    (order) =>
      order.buyerId === currentUser.id &&
      (order.paymentStatus === "released" || order.shipmentStatus === "approved") &&
      !reviews.some((review) => review.orderId === order.id),
  );
  const mine = reviews.filter((review) => review.reviewer === currentUser.name);
  const [ratingByOrder, setRatingByOrder] = useState<Record<string, number>>({});
  const [textByOrder, setTextByOrder] = useState<Record<string, string>>({});
  return (
    <section className="page standalone-page">
      <ScreenTitle
        title="Değerlendirmelerim"
        text="Tamamlanan işlemleri puanla ve satıcı güven puanına katkı sağla"
      />
      <div className="review-summary-grid">
        <article><span>Değerlendirilebilir</span><strong>{reviewable.length}</strong><small>Tamamlanan alım</small></article>
        <article><span>Yayınlanan yorum</span><strong>{mine.length}</strong><small>Satıcı profillerinde</small></article>
        <article><span>Ortalama puanın</span><strong>{mine.length ? (mine.reduce((sum, item) => sum + item.rating, 0) / mine.length).toFixed(1) : "—"}</strong><small>Verdiğin puanlar</small></article>
      </div>
      <div className="reviewable-list">
        {reviewable.map((order) => {
          const auction = auctions.find((item) => item.id === order.auctionId);
          const rating = ratingByOrder[order.id] || 0;
          const text = textByOrder[order.id] || "";
          return (
            <article key={order.id}>
              {auction && <img src={auction.image} alt="" />}
              <div>
                <span>İŞLEM TAMAMLANDI</span>
                <strong>{auction?.title}</strong>
                <small>{money.format(order.amount)}</small>
                <div className="star-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      className={star <= rating ? "active" : ""}
                      onClick={() => setRatingByOrder((items) => ({ ...items, [order.id]: star }))}
                      key={star}
                    >★</button>
                  ))}
                </div>
                <textarea
                  value={text}
                  onChange={(event) => setTextByOrder((items) => ({ ...items, [order.id]: event.target.value }))}
                  placeholder="Ürün, iletişim ve kargo deneyimini yaz…"
                />
                <button
                  className="primary-button"
                  onClick={() => onSubmit(order.id, rating, text)}
                >
                  Değerlendirmeyi yayınla
                </button>
              </div>
            </article>
          );
        })}
        {!reviewable.length && (
          <EmptyState
            icon="⭐"
            title="Bekleyen değerlendirme yok"
            text="Teslim alıp onayladığın işlemler burada puanlamaya açılır."
          />
        )}
      </div>
      <div className="section-heading review-heading">
        <div><strong>Yayınladığın yorumlar</strong></div>
        <span>{mine.length} yorum</span>
      </div>
      <div className="review-list">
        {mine.map((review) => (
          <article key={review.id}>
            <div>
              <span className="review-avatar">{review.reviewer.charAt(0)}</span>
              <div><strong>{review.product}</strong><small>{dateTime.format(new Date(review.createdAt))}</small></div>
              <b>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</b>
            </div>
            <p>{review.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AddressBookScreen({
  addresses,
  onSave,
  onDelete,
  onDefault,
}: {
  addresses: AddressRecord[];
  onSave: (address: AddressRecord) => void;
  onDelete: (id: string) => void;
  onDefault: (id: string) => void;
}) {
  const empty: AddressRecord = {
    id: "",
    label: "Ev",
    fullName: "",
    phone: "",
    city: "İzmir",
    district: "",
    neighborhood: "",
    addressLine: "",
    postalCode: "",
    isDefault: false,
    isBilling: false,
  };
  const [draft, setDraft] = useState<AddressRecord>(empty);
  const [editing, setEditing] = useState(false);
  function edit(address?: AddressRecord) {
    setDraft(address ? { ...address } : { ...empty, id: `address-${Date.now()}` });
    setEditing(true);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.fullName.trim() || !draft.phone.trim() || !draft.district.trim() || !draft.addressLine.trim()) return;
    onSave({ ...draft, id: draft.id || `address-${Date.now()}` });
    setEditing(false);
    setDraft(empty);
  }
  return (
    <section className="page standalone-page address-book-page">
      <ScreenTitle title="Adres defterim" text="Teslimat ve fatura adreslerini tek yerden yönet" />
      <div className="address-toolbar">
        <div><strong>{addresses.length} kayıtlı adres</strong><small>Ödeme sırasında varsayılan adres otomatik seçilir.</small></div>
        <button onClick={() => edit()}>＋ Yeni adres</button>
      </div>
      <div className="address-grid">
        {addresses.map((address) => (
          <article className={address.isDefault ? "address-card default" : "address-card"} key={address.id}>
            <div className="address-card-head"><span>📍</span><div><strong>{address.label}</strong>{address.isDefault && <em>Varsayılan</em>}</div></div>
            <h3>{address.fullName}</h3>
            <p>{address.neighborhood} {address.addressLine}</p>
            <p>{address.district} / {address.city} · {address.postalCode}</p>
            <small>{address.phone}{address.isBilling ? " · Fatura adresi" : ""}</small>
            <div className="address-actions">
              {!address.isDefault && <button onClick={() => onDefault(address.id)}>Varsayılan yap</button>}
              <button onClick={() => edit(address)}>Düzenle</button>
              <button className="danger" onClick={() => onDelete(address.id)}>Sil</button>
            </div>
          </article>
        ))}
      </div>
      {editing && (
        <div className="address-modal-backdrop">
          <form className="address-form" onSubmit={submit}>
            <div className="address-form-head"><div><strong>{addresses.some((item) => item.id === draft.id) ? "Adresi düzenle" : "Yeni adres"}</strong><small>Kargo teslimatı için eksiksiz doldur.</small></div><button type="button" onClick={() => setEditing(false)}>×</button></div>
            <div className="address-form-grid">
              <label>Adres başlığı<input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></label>
              <label>Ad soyad<input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} /></label>
              <label>Telefon<input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></label>
              <label>Şehir<input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} /></label>
              <label>İlçe<input value={draft.district} onChange={(e) => setDraft({ ...draft, district: e.target.value })} /></label>
              <label>Mahalle<input value={draft.neighborhood} onChange={(e) => setDraft({ ...draft, neighborhood: e.target.value })} /></label>
              <label className="wide">Açık adres<textarea value={draft.addressLine} onChange={(e) => setDraft({ ...draft, addressLine: e.target.value })} /></label>
              <label>Posta kodu<input value={draft.postalCode} onChange={(e) => setDraft({ ...draft, postalCode: e.target.value })} /></label>
            </div>
            <div className="address-checks">
              <label><input type="checkbox" checked={draft.isDefault} onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })} /> Varsayılan teslimat adresi</label>
              <label><input type="checkbox" checked={draft.isBilling} onChange={(e) => setDraft({ ...draft, isBilling: e.target.checked })} /> Fatura adresi olarak kullan</label>
            </div>
            <button className="address-save" type="submit">Adresi kaydet</button>
          </form>
        </div>
      )}
    </section>
  );
}

const shippingCarriers = [
  { name: "Yurtiçi Kargo", base: 79, perDesi: 10, eta: "1-2 iş günü" },
  { name: "MNG Kargo", base: 75, perDesi: 11, eta: "1-3 iş günü" },
  { name: "Aras Kargo", base: 82, perDesi: 9, eta: "1-2 iş günü" },
  { name: "Sürat Kargo", base: 69, perDesi: 12, eta: "2-3 iş günü" },
];

function ShippingOperationsScreen({
  currentUser,
  orders,
  auctions,
  labels,
  onCreate,
  onPrinted,
  onHandOver,
  onOpenOrder,
}: {
  currentUser: AppUser;
  orders: Order[];
  auctions: Auction[];
  labels: ShipmentLabel[];
  onCreate: (input: Omit<ShipmentLabel, "id" | "trackingNumber" | "status" | "createdAt">) => void;
  onPrinted: (labelId: string) => void;
  onHandOver: (labelId: string) => void;
  onOpenOrder: (id: string) => void;
}) {
  const sellerOrders = orders.filter((order) => order.sellerId === currentUser.id && order.paymentStatus !== "pending");
  const [carrierByOrder, setCarrierByOrder] = useState<Record<string, string>>({});
  const [desiByOrder, setDesiByOrder] = useState<Record<string, number>>({});
  const [packageByOrder, setPackageByOrder] = useState<Record<string, ShipmentLabel["packageType"]>>({});
  return (
    <section className="page standalone-page shipping-ops-page">
      <ScreenTitle title="Kargo operasyon merkezi" text="Etiket, takip kodu ve gönderim süreçlerini tek ekrandan yönet" />
      <div className="shipping-kpis">
        <div><span>Hazırlanacak</span><strong>{sellerOrders.filter((o) => o.shipmentStatus === "waiting").length}</strong><small>Ödemesi güvence altında</small></div>
        <div><span>Etiketi hazır</span><strong>{labels.filter((l) => l.status !== "handed_over").length}</strong><small>Kargoya teslim bekliyor</small></div>
        <div><span>Yola çıkan</span><strong>{labels.filter((l) => l.status === "handed_over").length}</strong><small>Takip kodu aktif</small></div>
      </div>
      <div className="shipping-order-list">
        {sellerOrders.map((order) => {
          const auction = auctions.find((item) => item.id === order.auctionId);
          if (!auction) return null;
          const label = labels.find((item) => item.orderId === order.id);
          const carrierName = carrierByOrder[order.id] || label?.carrier || shippingCarriers[0].name;
          const carrier = shippingCarriers.find((item) => item.name === carrierName) || shippingCarriers[0];
          const desi = desiByOrder[order.id] || label?.desi || 2;
          const packageType = packageByOrder[order.id] || label?.packageType || "medium";
          const multiplier = packageType === "small" ? 0.9 : packageType === "large" ? 1.25 : 1;
          const price = Math.round((carrier.base + carrier.perDesi * desi) * multiplier);
          return (
            <article className="shipping-order-card" key={order.id}>
              <div className="shipping-order-product"><img src={auction.image} alt="" /><div><span>{orderLabel(order)}</span><h3>{auction.title}</h3><small>Sipariş #{order.id} · {money.format(order.amount)}</small></div><button onClick={() => onOpenOrder(order.id)}>Detay ›</button></div>
              {label ? (
                <div className="shipping-label-ready">
                  <div className="label-code"><span>TAKİP KODU</span><strong>{label.trackingNumber}</strong><small>{label.carrier} · {label.estimatedDelivery}</small></div>
                  <div className="label-meta"><span>{label.desi} desi</span><span>{label.packageType === "small" ? "Küçük" : label.packageType === "large" ? "Büyük" : "Orta"} paket</span><b>{money.format(label.price)}</b></div>
                  <div className="label-actions"><button onClick={() => { onPrinted(label.id); window.print(); }}>🖨 Etiketi yazdır</button>{label.status !== "handed_over" ? <button className="primary" onClick={() => onHandOver(label.id)}>Kargoya teslim edildi</button> : <span>✓ Gönderi yola çıktı</span>}</div>
                </div>
              ) : (
                <div className="shipping-label-form">
                  <label>Kargo firması<select value={carrierName} onChange={(e) => setCarrierByOrder({ ...carrierByOrder, [order.id]: e.target.value })}>{shippingCarriers.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
                  <label>Paket tipi<select value={packageType} onChange={(e) => setPackageByOrder({ ...packageByOrder, [order.id]: e.target.value as ShipmentLabel["packageType"] })}><option value="small">Küçük paket</option><option value="medium">Orta paket</option><option value="large">Büyük paket</option></select></label>
                  <label>Desi<input type="number" min="1" max="50" value={desi} onChange={(e) => setDesiByOrder({ ...desiByOrder, [order.id]: Number(e.target.value) })} /></label>
                  <div className="shipping-quote"><span>Tahmini ücret</span><strong>{money.format(price)}</strong><small>{carrier.eta}</small></div>
                  <button className="create-label" onClick={() => onCreate({ orderId: order.id, carrier: carrier.name, packageType, desi, price, estimatedDelivery: carrier.eta })}>Etiket ve takip kodu oluştur</button>
                </div>
              )}
            </article>
          );
        })}
        {!sellerOrders.length && <EmptyState icon="🚚" title="Gönderilecek sipariş yok" text="Ödemesi tamamlanan satışların burada görünecek." />}
      </div>
      <div className="shipping-note"><span>🛡️</span><div><strong>Demo kargo altyapısı</strong><p>Fiyat ve takip kodları çalışan demo verisidir. Canlı sürümde kargo firmalarının API’leri bağlanarak gerçek etiket ve gönderi kodu üretilecektir.</p></div></div>
    </section>
  );
}

function ScreenTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="screen-title">
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={active ? "nav-item active" : "nav-item"}
      onClick={onClick}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}
function EmptyState({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="empty-state">
      <span>{icon}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
