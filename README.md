# VITBay

A second-hand marketplace for students on one campus. List what you don't need, chat with buyers, take offers, meet somewhere on campus and pay in person.

Live at **https://vit-bay.vercel.app**

## Features

- **Listings** with up to 8 photos, condition, price (or free), original price, "open to offers" and a meet-up spot
- **Browse and search** with category, price, condition and status filters, sorting and pagination
- **Messaging** between buyer and seller for each listing, with **offers** the seller can accept or decline (accepting reserves the item)
- **Mark as reserved or sold**, choosing the buyer from the people who messaged you
- **Seller reviews**, which only the recorded buyer of a sold item can leave
- **Profiles** with hostel, course, rating, items for sale and sold, and a verified badge for college email addresses
- **Saved items**, **reports** for bad listings, account settings, password change and email reset

## Stack

MongoDB, Express, React and Node, deployed on Vercel as a static React build plus one Express function (`api/index.js`).

- `backend/`: Express API (`routes/api.js`), Mongoose models, JWT auth in an httpOnly cookie, rate limiting, Helmet
- `frontend/`: React 18 (Create React App), React Router, Material icons, plain CSS (`src/styles.css`)
- Photos are stored in Vercel Blob. The database is MongoDB Atlas, connected through the Vercel Marketplace.

## Running locally

```bash
npm install && npm --prefix frontend install
cp backend/config/config.env.example backend/config/config.env   # fill in MONGODB_URI, JWT_SECRET, BLOB_READ_WRITE_TOKEN
npm run seed            # optional: starter students and listings
npm run dev:backend     # API on http://localhost:4000
npm run dev:frontend    # app on http://localhost:3000 (proxies /api to :4000)
```

If the project is linked to Vercel, `vercel env pull` writes the variables to `.env.local`, which the backend also reads.

## Seed data

`backend/scripts/seed.js` creates 20 fictional students and about 60 listings, with conversations and reviews for the sold ones. Seeded accounts use an unreachable email domain and random passwords, so nobody can log in as them. Run it again with `--reset` to replace them. Listing photos come from Wikimedia Commons, Flickr and Unsplash under free licences; see the in-app [photo credits](https://vit-bay.vercel.app/credits).

VITBay is an independent student project and is not affiliated with VIT.
