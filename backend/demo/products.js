// Sample campus marketplace listings, used when no database is configured (portfolio demo mode).
// Names, sellers and prices are made up. Photos come from Unsplash and Wikimedia Commons
// (free licences): https://unsplash.com/license

const sellers = [
    [
        "Aarav Sharma",
        "Block C",
        "3rd year"
    ],
    [
        "Diya Menon",
        "Ladies Hostel 2",
        "2nd year"
    ],
    [
        "Kabir Rao",
        "Block A",
        "4th year"
    ],
    [
        "Meera Kulkarni",
        "Ladies Hostel 1",
        "3rd year"
    ],
    [
        "Rohan Patel",
        "Block D",
        "2nd year"
    ],
    [
        "Sneha Iyer",
        "Ladies Hostel 3",
        "4th year"
    ],
    [
        "Ishaan Gupta",
        "Block B",
        "1st year"
    ],
    [
        "Ananya Das",
        "Ladies Hostel 2",
        "3rd year"
    ]
]

const buyers = [
    [
        "Ritvik S.",
        "Met on time and the item was exactly as described."
    ],
    [
        "Pooja N.",
        "Smooth deal. Seller was friendly and flexible on the meeting spot."
    ],
    [
        "Arjun K.",
        "Good condition, fair price. Would buy from this seller again."
    ],
    [
        "Nisha R.",
        "Quick replies and honest about the small flaws."
    ],
    [
        "Vikram T.",
        "Item matched the photos. Pickup was easy."
    ],
    [
        "Tanvi B.",
        "Great seller, very trustworthy."
    ]
]

const listings = [
    {
        "name": "MacBook Air 13-inch (2020)",
        "category": "Laptop",
        "price": 52000,
        "originalPrice": 92000,
        "condition": "Good",
        "daysAgo": 1,
        "seller": 0,
        "rating": 4.5,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Used for two years, mostly for coding and assignments. Battery health around 87%, charger and sleeve included. Selling because I'm upgrading before placements."
    },
    {
        "name": "iPhone 12 with AirPods",
        "category": "SmartPhones",
        "price": 31000,
        "originalPrice": 79900,
        "condition": "Good",
        "daysAgo": 1,
        "seller": 3,
        "rating": 5,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "128 GB, no cracks, always used with a case and screen guard. Comes with the original box and a pair of AirPods."
    },
    {
        "name": "Canon DSLR kit with 50mm lens",
        "category": "Camera",
        "price": 24000,
        "originalPrice": 62999,
        "condition": "Good",
        "daysAgo": 2,
        "seller": 2,
        "rating": 4.5,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Used for the photography club. Body, kit lens, 50mm prime and two spare lenses, plus a bag. Shutter count is low."
    },
    {
        "name": "Nike Free Run, UK 9",
        "category": "Footwear",
        "price": 2800,
        "originalPrice": 8995,
        "condition": "Good",
        "daysAgo": 2,
        "seller": 4,
        "rating": 4,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Worn for one semester of morning runs. Plenty of tread left. Washed and ready to go."
    },
    {
        "name": "Navy blazer, size 40",
        "category": "Attire",
        "price": 2500,
        "originalPrice": 7999,
        "condition": "Like new",
        "daysAgo": 3,
        "seller": 6,
        "rating": 4.5,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1667283831517-5b747b3c17c8?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Worn exactly once, for placement day. Dry-cleaned and kept on a hanger since."
    },
    {
        "name": "MacBook Pro 14-inch",
        "category": "Laptop",
        "price": 98000,
        "originalPrice": 169900,
        "condition": "Like new",
        "daysAgo": 3,
        "seller": 5,
        "rating": 5,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Bought last year for video editing. Barely used since I moved to a desktop. Includes original charger and box."
    },
    {
        "name": "Philips electric kettle, 1.7 L",
        "category": "Hostel",
        "price": 450,
        "originalPrice": 1295,
        "condition": "Good",
        "daysAgo": 4,
        "seller": 1,
        "rating": 4.5,
        "Stock": 1,
        "photo": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Electric_kettle_phillips_white.JPG/960px-Electric_kettle_phillips_white.JPG",
        "description": "Perfect for hostel rooms: noodles, tea, coffee. Auto shut-off works fine."
    },
    {
        "name": "Textbook bundle: design and CS (8 books)",
        "category": "Books",
        "price": 1800,
        "originalPrice": 6500,
        "condition": "Good",
        "daysAgo": 4,
        "seller": 7,
        "rating": 4.5,
        "Stock": 1,
        "photo": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/Books%2C_pencils%2C_laptop%2C_and_iphone_on_a_desk_%28Unsplash%29.jpg/960px-Books%2C_pencils%2C_laptop%2C_and_iphone_on_a_desk_%28Unsplash%29.jpg",
        "description": "Eight books from first and second year, lightly highlighted. Selling as a set only. Comes with a pack of drawing pencils."
    },
    {
        "name": "Black iPhone, 64 GB",
        "category": "SmartPhones",
        "price": 18500,
        "originalPrice": 43900,
        "condition": "Good",
        "daysAgo": 5,
        "seller": 0,
        "rating": 4,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1560617544-b4f287789e24?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Battery replaced six months ago. Small scratch on the frame, screen is perfect. Unlocked, charger included."
    },
    {
        "name": "GoPro action camera with tripod",
        "category": "Camera",
        "price": 8500,
        "originalPrice": 17999,
        "condition": "Good",
        "daysAgo": 5,
        "seller": 4,
        "rating": 4,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1571190144364-1da84d9ca448?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Took it on two treks and one Goa trip. Includes waterproof case, tripod grip and two batteries."
    },
    {
        "name": "White hoodie, size L",
        "category": "Attire",
        "price": 700,
        "originalPrice": 1999,
        "condition": "Like new",
        "daysAgo": 6,
        "seller": 1,
        "rating": 5,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Heavy fleece, very warm for the winter semester. Worn a handful of times."
    },
    {
        "name": "Slim-fit jeans, 32 waist",
        "category": "Bottom",
        "price": 600,
        "originalPrice": 1799,
        "condition": "Good",
        "daysAgo": 6,
        "seller": 6,
        "rating": 4,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1714143136372-ddaf8b606da7?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Mid-blue wash, stretchy and comfortable. No rips or fading."
    },
    {
        "name": "Formal shirts, pack of 3 (M)",
        "category": "Tops",
        "price": 900,
        "originalPrice": 3299,
        "condition": "Like new",
        "daysAgo": 7,
        "seller": 2,
        "rating": 4.5,
        "Stock": 3,
        "photo": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Three shirts I only wore to interviews. Cotton blend, no stains. Selling together or separately."
    },
    {
        "name": "Brown leather boots, UK 8",
        "category": "Footwear",
        "price": 2200,
        "originalPrice": 5499,
        "condition": "Good",
        "daysAgo": 7,
        "seller": 3,
        "rating": 4.5,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Genuine leather, resoled once. Great for the rainy season on campus."
    },
    {
        "name": "Full-frame DSLR with telephoto lens",
        "category": "Camera",
        "price": 38000,
        "originalPrice": 84999,
        "condition": "Good",
        "daysAgo": 8,
        "seller": 5,
        "rating": 5,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Full-frame body with a fast telephoto lens. Perfect for sports day and fests. Handled carefully, with a hard case."
    },
    {
        "name": "Oatmeal hoodie, size M",
        "category": "Attire",
        "price": 800,
        "originalPrice": 2299,
        "condition": "Good",
        "daysAgo": 8,
        "seller": 7,
        "rating": 4.5,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Soft, relaxed fit. Washed twice a month at most."
    },
    {
        "name": "Laptop with aluminium stand and keyboard",
        "category": "Laptop",
        "price": 45000,
        "originalPrice": 70000,
        "condition": "Good",
        "daysAgo": 9,
        "seller": 4,
        "rating": 4,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1658624234283-13d7d2ab76ed?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Complete desk setup in one go: laptop, rotating stand and wireless keyboard. Great for studying in the hostel."
    },
    {
        "name": "White sneakers, UK 8",
        "category": "Footwear",
        "price": 1200,
        "originalPrice": 3499,
        "condition": "Like new",
        "daysAgo": 9,
        "seller": 6,
        "rating": 4.5,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1625860191460-10a66c7384fb?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Clean white sneakers, worn only a few times. Original laces and box."
    },
    {
        "name": "Android phone, 6.6-inch AMOLED",
        "category": "SmartPhones",
        "price": 9500,
        "originalPrice": 24999,
        "condition": "Good",
        "daysAgo": 10,
        "seller": 2,
        "rating": 4,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Great display, long battery life. Selling because I got a new phone. Charger and case included."
    },
    {
        "name": "Steel electric kettle",
        "category": "Hostel",
        "price": 400,
        "originalPrice": 1199,
        "condition": "Fair",
        "daysAgo": 10,
        "seller": 0,
        "rating": 4,
        "Stock": 1,
        "photo": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Electric_water_boiler_2014.JPG/960px-Electric_water_boiler_2014.JPG",
        "description": "Works perfectly, a few cosmetic marks on the body. Good for a first-year room."
    },
    {
        "name": "Black slim jeans, 30 waist",
        "category": "Bottom",
        "price": 550,
        "originalPrice": 1999,
        "condition": "Good",
        "daysAgo": 11,
        "seller": 5,
        "rating": 4.5,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1718252540558-7b383b52642e?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Dark, versatile and soft. Fits true to size."
    },
    {
        "name": "Powder-blue casual shirt (M)",
        "category": "Tops",
        "price": 350,
        "originalPrice": 1299,
        "condition": "Good",
        "daysAgo": 12,
        "seller": 7,
        "rating": 4,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1623658580851-3b25bf83b4ea?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Lightweight cotton, good for hot days. Ironed and folded."
    },
    {
        "name": "Patterned formal shirt (L)",
        "category": "Tops",
        "price": 450,
        "originalPrice": 1499,
        "condition": "Good",
        "daysAgo": 12,
        "seller": 1,
        "rating": 4,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1602810316693-3667c854239a?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "Fine micro-print. Worn for club presentations. No marks."
    },
    {
        "name": "Light-wash denim shorts (M)",
        "category": "Bottom",
        "price": 350,
        "originalPrice": 1299,
        "condition": "Good",
        "daysAgo": 13,
        "seller": 3,
        "rating": 4,
        "Stock": 1,
        "photo": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop&auto=format&q=80",
        "description": "High-waist with a rolled hem. Washed and ready."
    }
]

const DAY = 24 * 60 * 60 * 1000
const now = Date.now()

const products = listings.map((l, i) => {
    const [name, hostel, year] = sellers[l.seller]
    const reviews = [0, 1].map((j) => {
        const [buyer, comment] = buyers[(i + j * 2) % buyers.length]
        return {
            _id: `demo-review-${i}-${j}`.padEnd(24, "0").slice(0, 24),
            user: "000000000000000000000000",
            name: buyer,
            rating: Math.max(3, Math.min(5, Math.round(l.rating + (j === 1 ? -0.5 : 0.5)))),
            comment,
        }
    })

    return {
        _id: `demo${String(i + 1).padStart(2, "0")}`.padEnd(24, "0"),
        name: l.name,
        description: l.description,
        price: l.price,
        originalPrice: l.originalPrice,
        condition: l.condition,
        location: `${hostel} lobby`,
        rating: l.rating,
        images: [{ public_id: `demo/${i + 1}`, url: l.photo }],
        category: l.category,
        Stock: l.Stock,
        numOfReviews: reviews.length,
        reviews,
        user: { _id: `seller${l.seller}`, name, hostel, year },
        createdAt: new Date(now - l.daysAgo * DAY).toISOString(),
    }
})

module.exports = products
