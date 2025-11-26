import prisma from '@/lib/prisma';

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const storage = {
  // Auth / User
  getUserByPhone: async (phone: string) => {
    return prisma.user.findUnique({ where: { phone } });
  },
  getUserByEmail: async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  getUserById: async (id: number) => {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser: async (data: any) => {
    return prisma.user.create({ data });
  },

  updateUser: async (id: number, data: any) => {
    return prisma.user.update({ where: { id }, data });
  },

  // Partner store
  createPartnerStore: async (data: any, userId: number) => {
    return prisma.partnerStore.create({ data: { ...data, userId } });
  },

  getPartnerStoreByUserId: async (userId: number) => {
    return prisma.partnerStore.findFirst({ where: { userId } });
  },

  getPartnerStoreById: async (id: number) => {
    return prisma.partnerStore.findUnique({ where: { id } });
  },

  updatePartnerStore: async (id: number, data: any) => {
    return prisma.partnerStore.update({ where: { id }, data });
  },

  // Deals
  createDeal: async (data: any) => {
    return prisma.deal.create({ data });
  },

  getDealsByPartnerId: async (partnerId: number) => {
    return prisma.deal.findMany({ where: { partnerId } });
  },

  getDealById: async (id: number) => {
    return prisma.deal.findUnique({ where: { id } });
  },

  updateDeal: async (id: number, data: any) => {
    return prisma.deal.update({ where: { id }, data });
  },

  deactivateDeal: async (id: number) => {
    return prisma.deal.update({ where: { id }, data: { isActive: false } });
  },

  getActiveDeals: async () => {
    return prisma.deal.findMany({ where: { isActive: true } });
  },

  getDealsByCategory: async (category: string) => {
    return prisma.deal.findMany({ where: { category } });
  },

  searchDeals: async (query: string) => {
    const q = query || '';
    return prisma.deal.findMany({ where: { OR: [ { name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } } ] } });
  },

  // Stores / Search
  searchPartnerStores: async (query: string) => {
    const q = query || '';
    return prisma.partnerStore.findMany({ where: { OR: [ { name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }, { location: { contains: q, mode: 'insensitive' } } ] } });
  },

  getPartnerStoresByCategory: async (category: string) => {
    return prisma.partnerStore.findMany({ where: { categories: { has: category } } });
  },

  getNearbyPartnerStores: async (lat: number, lng: number, radius: number) => {
    // Simple in-memory filter using Haversine formula; latitude/longitude are stored as strings in schema
    const stores = await prisma.partnerStore.findMany({ where: { latitude: { not: null }, longitude: { not: null } } });
    const toNumber = (s: any) => { const n = Number(s); return Number.isFinite(n) ? n : null; };

    function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
      const R = 6371; // km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }

    return stores.filter(s => {
      const sLat = toNumber(s.latitude);
      const sLng = toNumber(s.longitude);
      if (sLat == null || sLng == null) return false;
      const dist = haversine(lat, lng, sLat, sLng);
      return dist <= radius;
    });
  },

  // Visits
  createVisit: async (data: any) => {
    return prisma.visit.create({ data });
  },

  getVisitsByUserId: async (userId: number) => {
    return prisma.visit.findMany({ where: { userId } });
  },

  getVisitById: async (id: number) => {
    return prisma.visit.findUnique({ where: { id } });
  },

  markVisitAsCompleted: async (id: number) => {
    return prisma.visit.update({ where: { id }, data: { status: 'completed', markedAsVisited: true } });
  },

  getScheduledVisitsByPartnerId: async (partnerId: number) => {
    return prisma.visit.findMany({ where: { partnerId, status: 'scheduled' } });
  },

  // Reviews
  createReview: async (data: any) => {
    return prisma.review.create({ data });
  },

  getReviewsByPartnerId: async (partnerId: number) => {
    return prisma.review.findMany({ where: { partnerId } });
  },

  getReviewsByPartnerIdPublic: async (partnerId: number) => {
    return prisma.review.findMany({ where: { partnerId, isPublished: true } });
  },

  // Rewards & Redemptions
  getRewardsByUserId: async (userId: number) => {
    return prisma.reward.findMany({ where: { userId } });
  },

  getTotalRewardPointsByUserId: async (userId: number) => {
    const res = await prisma.reward.aggregate({ where: { userId }, _sum: { points: true } });
    return res._sum.points || 0;
  },

  createReward: async (data: any) => {
    return prisma.reward.create({ data });
  },

  createRedemption: async (data: any) => {
    return prisma.redemption.create({ data });
  },

  getRedemptionsByUserId: async (userId: number) => {
    return prisma.redemption.findMany({ where: { userId } });
  },

  getRedemptionsByPartnerId: async (partnerId: number) => {
    return prisma.redemption.findMany({ where: { partnerId } });
  },

  // Referrals
  createReferral: async (data: any) => {
    return prisma.referral.create({ data });
  },

  getReferralsByReferrerId: async (referrerId: number) => {
    return prisma.referral.findMany({ where: { referrerId } });
  },

  // Notifications
  getNotificationsByUserId: async (userId: number) => {
    return prisma.notification.findMany({ where: { userId } });
  },

  markNotificationAsRead: async (id: number) => {
    return prisma.notification.update({ where: { id }, data: { isRead: true } });
  },

  // Analytics / Stats
  getPartnerStatsByDateRange: async (partnerId: number, startDate: Date, endDate: Date) => {
    return prisma.partnerStat.findMany({ where: { partnerId, date: { gte: startDate, lte: endDate } }, orderBy: { date: 'asc' } });
  },

  // Misc
  incrementStoreViews: async (storeId: number) => {
    const today = startOfDay(new Date());
    const existing = await prisma.partnerStat.findUnique({ where: { partnerId_date: { partnerId: storeId, date: today } } }).catch(() => null);
    if (existing) {
      return prisma.partnerStat.update({ where: { id: existing.id }, data: { storeViews: { increment: 1 } as any } as any });
    }
    return prisma.partnerStat.create({ data: { partnerId: storeId, date: today, storeViews: 1 } });
  },

  incrementDealViews: async (partnerId: number) => {
    const today = startOfDay(new Date());
    const existing = await prisma.partnerStat.findUnique({ where: { partnerId_date: { partnerId, date: today } } }).catch(() => null);
    if (existing) {
      return prisma.partnerStat.update({ where: { id: existing.id }, data: { dealViews: { increment: 1 } as any } as any });
    }
    return prisma.partnerStat.create({ data: { partnerId, date: today, dealViews: 1 } });
  },
};

export default storage;
