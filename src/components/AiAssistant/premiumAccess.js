// components/AiAssistant/premiumAccess.js
// Single source of truth for Porua AI gating (super_admin bypasses).
export const hasPremiumAccess = (dbUser) =>
    dbUser?.globalRole === 'super_admin' || dbUser?.isPremium === true;
