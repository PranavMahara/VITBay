const rupees = (n) => (n === 0 ? "Free" : `₹${Number(n).toLocaleString("en-IN")}`)

module.exports = { rupees }
