// Built-in sample catalog used when no database is configured (portfolio demo mode).
// Photos are served from Unsplash (free licence, hotlinking allowed): https://unsplash.com/license

const owner = "000000000000000000000000"

const reviewers = [
    [
        "Aarav S.",
        "Great quality for the price. Arrived quickly and exactly as shown."
    ],
    [
        "Diya M.",
        "Really happy with this. Looks even better in person."
    ],
    [
        "Kabir R.",
        "Solid build and very comfortable. Would buy again."
    ],
    [
        "Meera K.",
        "Good value. Packaging was neat and delivery was on time."
    ],
    [
        "Rohan P.",
        "Exactly what I was looking for. Highly recommended."
    ],
    [
        "Sneha T.",
        "Nice product, works as described."
    ]
]

const items = [
    {
        "name": "Aero Air 13 Laptop",
        "category": "Laptop",
        "price": 54999,
        "rating": 4.5,
        "Stock": 12,
        "photo": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
        "description": "Ultra-thin 13-inch laptop with a 12th-gen processor, 16 GB RAM and a 512 GB SSD. A full day of battery life in a body that slips into any bag.",
        "reviews": [
            0,
            2,
            4
        ]
    },
    {
        "name": "Aero Pro 14 Laptop",
        "category": "Laptop",
        "price": 89999,
        "rating": 5,
        "Stock": 8,
        "photo": "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0",
        "description": "14-inch creator laptop with a 120 Hz display, 32 GB RAM and a 1 TB SSD. Backlit keyboard, large trackpad and studio-quality speakers.",
        "reviews": [
            1,
            3,
            5
        ]
    },
    {
        "name": "Studio Book 15 + Ergo Stand",
        "category": "Laptop",
        "price": 47999,
        "rating": 4,
        "Stock": 15,
        "photo": "https://images.unsplash.com/photo-1658624234283-13d7d2ab76ed",
        "description": "15-inch productivity laptop bundled with an aluminium rotating stand and wireless keyboard for a clean, comfortable desk setup.",
        "reviews": [
            2,
            4,
            0
        ]
    },
    {
        "name": "Velocity Knit Running Shoes",
        "category": "Footwear",
        "price": 8999,
        "rating": 4.5,
        "Stock": 40,
        "photo": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        "description": "Seamless knit upper with a responsive foam midsole. Lightweight, breathable and built for long runs.",
        "reviews": [
            3,
            5,
            1
        ]
    },
    {
        "name": "Urban Leather Boots",
        "category": "Footwear",
        "price": 6499,
        "rating": 4,
        "Stock": 15,
        "photo": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f",
        "description": "Full-grain leather lace-up boots with a durable rubber sole. Hand-finished for the city and the occasional rainy day.",
        "reviews": [
            4,
            0,
            2
        ]
    },
    {
        "name": "Cloud White Sneakers",
        "category": "Footwear",
        "price": 3999,
        "rating": 4.5,
        "Stock": 55,
        "photo": "https://images.unsplash.com/photo-1625860191460-10a66c7384fb",
        "description": "Minimal low-top sneakers in clean white. Cushioned insole and a flexible sole make them an easy everyday pair.",
        "reviews": [
            5,
            1,
            3
        ]
    },
    {
        "name": "Classic Slim Jeans",
        "category": "Bottom",
        "price": 1799,
        "rating": 4.5,
        "Stock": 60,
        "photo": "https://images.unsplash.com/photo-1714143136372-ddaf8b606da7",
        "description": "Slim-fit stretch denim in a timeless mid-blue wash with a comfortable mid rise.",
        "reviews": [
            0,
            2,
            4
        ]
    },
    {
        "name": "Distressed Denim Shorts",
        "category": "Bottom",
        "price": 1299,
        "rating": 4,
        "Stock": 45,
        "photo": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
        "description": "High-waist light-wash shorts with a rolled hem and light distressing. Perfect for summer.",
        "reviews": [
            1,
            3,
            5
        ]
    },
    {
        "name": "Black Slim Jeans",
        "category": "Bottom",
        "price": 1999,
        "rating": 4,
        "Stock": 38,
        "photo": "https://images.unsplash.com/photo-1718252540558-7b383b52642e",
        "description": "Dark, versatile black denim with a slim taper. Soft, stretchy and easy to dress up or down.",
        "reviews": [
            2,
            4,
            0
        ]
    },
    {
        "name": "Everyday Shirts, Pack of 3",
        "category": "Tops",
        "price": 3299,
        "rating": 4.5,
        "Stock": 70,
        "photo": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
        "description": "Three cotton-blend shirts in neutral shades. Breathable, crease-resistant and ready for class or office.",
        "reviews": [
            3,
            5,
            1
        ]
    },
    {
        "name": "Printed Formal Shirt",
        "category": "Tops",
        "price": 1499,
        "rating": 4,
        "Stock": 50,
        "photo": "https://images.unsplash.com/photo-1602810316693-3667c854239a",
        "description": "Fine micro-print formal shirt with a classic collar and a tailored fit.",
        "reviews": [
            4,
            0,
            2
        ]
    },
    {
        "name": "Powder Blue Casual Shirt",
        "category": "Tops",
        "price": 1299,
        "rating": 3.5,
        "Stock": 65,
        "photo": "https://images.unsplash.com/photo-1623658580851-3b25bf83b4ea",
        "description": "Soft powder-blue shirt in lightweight cotton. Wear it tucked in or loose.",
        "reviews": [
            5,
            1,
            3
        ]
    },
    {
        "name": "Campus White Hoodie",
        "category": "Attire",
        "price": 1999,
        "rating": 5,
        "Stock": 30,
        "photo": "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77",
        "description": "Heavyweight fleece hoodie with a roomy kangaroo pocket. Soft inside, structured outside.",
        "reviews": [
            0,
            2,
            4
        ]
    },
    {
        "name": "Urban Oatmeal Hoodie",
        "category": "Attire",
        "price": 2299,
        "rating": 4.5,
        "Stock": 26,
        "photo": "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5",
        "description": "Relaxed-fit oatmeal hoodie with a double-layer hood. A street-style staple.",
        "reviews": [
            1,
            3,
            5
        ]
    },
    {
        "name": "Tailored Navy Blazer",
        "category": "Attire",
        "price": 7999,
        "rating": 4.5,
        "Stock": 12,
        "photo": "https://images.unsplash.com/photo-1667283831517-5b747b3c17c8",
        "description": "Slim-cut navy blazer with satin-trimmed lapels, fully lined. Made for interviews, receptions and everything formal.",
        "reviews": [
            2,
            4,
            0
        ]
    },
    {
        "name": "Alpha DSLR Starter Kit",
        "category": "Camera",
        "price": 62999,
        "rating": 4.5,
        "Stock": 6,
        "photo": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        "description": "24 MP DSLR with a kit lens, 50 mm prime and a spare lens set. Everything you need to learn photography.",
        "reviews": [
            3,
            5,
            1
        ]
    },
    {
        "name": "ActionCam Pro",
        "category": "Camera",
        "price": 17999,
        "rating": 4,
        "Stock": 14,
        "photo": "https://images.unsplash.com/photo-1571190144364-1da84d9ca448",
        "description": "Waterproof action camera with 5K video, HyperSmooth stabilisation and a tripod mount.",
        "reviews": [
            4,
            0,
            2
        ]
    },
    {
        "name": "Pro DSLR + Telephoto Lens",
        "category": "Camera",
        "price": 84999,
        "rating": 5,
        "Stock": 4,
        "photo": "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac",
        "description": "Full-frame DSLR paired with a fast telephoto lens for sports, wildlife and portraits.",
        "reviews": [
            5,
            1,
            3
        ]
    },
    {
        "name": "Nova X Smartphone",
        "category": "SmartPhones",
        "price": 24999,
        "rating": 4,
        "Stock": 25,
        "photo": "https://images.unsplash.com/photo-1585060544812-6b45742d762f",
        "description": "6.6-inch AMOLED display, 5000 mAh battery and a 64 MP camera with night mode.",
        "reviews": [
            0,
            2,
            4
        ]
    },
    {
        "name": "Pixelite 8",
        "category": "SmartPhones",
        "price": 45999,
        "rating": 4.5,
        "Stock": 18,
        "photo": "https://images.unsplash.com/photo-1560617544-b4f287789e24",
        "description": "Flagship-grade chipset, 120 Hz OLED and an all-day battery. Fast, smooth and secure.",
        "reviews": [
            1,
            3,
            5
        ]
    },
    {
        "name": "Aurora Max 5G",
        "category": "SmartPhones",
        "price": 38999,
        "rating": 4,
        "Stock": 20,
        "photo": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
        "description": "5G smartphone with a 6.7-inch display, wireless charging and a triple camera system.",
        "reviews": [
            2,
            4,
            0
        ]
    }
]

const photo = (url) => `${url}?w=800&h=800&fit=crop&auto=format&q=80`

const products = items.map((item, i) => {
    const reviews = item.reviews.map((r, j) => ({
        _id: `demo-review-${i}-${j}`.padEnd(24, "0").slice(0, 24),
        user: owner,
        name: reviewers[r][0],
        rating: Math.max(3, Math.min(5, Math.round(item.rating + (j === 1 ? -0.5 : 0.5)))),
        comment: reviewers[r][1],
    }))

    return {
        _id: `demo${String(i + 1).padStart(2, "0")}`.padEnd(24, "0"),
        name: item.name,
        description: item.description,
        price: item.price,
        rating: item.rating,
        images: [{ public_id: `demo/${i + 1}`, url: photo(item.photo) }],
        category: item.category,
        Stock: item.Stock,
        numOfReviews: reviews.length,
        reviews,
        user: owner,
        createdAt: new Date(Date.UTC(2023, 0, 1 + i)).toISOString(),
    }
})

module.exports = products
