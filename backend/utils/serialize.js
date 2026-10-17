// Shapes documents for the API so private fields (emails, saved lists) never leak

const publicUser = (u) => {
    if (!u) return null
    if (typeof u.toPublic === "function") return u.toPublic()
    return { _id: u._id || u }
}

const listingCard = (l) => ({
    _id: l._id,
    title: l.title,
    price: l.price,
    originalPrice: l.originalPrice,
    negotiable: l.negotiable,
    category: l.category,
    condition: l.condition,
    image: l.images?.[0]?.url,
    imageCount: l.images?.length || 0,
    meetupSpot: l.meetupSpot,
    status: l.status,
    saves: l.saves,
    createdAt: l.createdAt,
    seller: l.seller?.name ? publicUser(l.seller) : l.seller,
})

const listingFull = (l) => ({
    ...listingCard(l),
    description: l.description,
    images: (l.images || []).map((i) => ({ url: i.url })),
    views: l.views,
    soldAt: l.soldAt,
    buyer: l.buyer ? String(l.buyer._id || l.buyer) : undefined,
    updatedAt: l.updatedAt,
})

module.exports = { publicUser, listingCard, listingFull }
