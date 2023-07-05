// query in url means anything after ?
// http://localhost:4000/products?name=arjun
// so query is name=arjun

class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,   // Mongodb Regex, it is case insensitive if we ask it to find ABC then it would abc and ABC both and vice vers
                    $options: "i",
                },
            }
            : {};

        // console.log(keyword)
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        //   Removing some fields for category
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach((key) => { delete queryCopy[key] });

        // Filter For Price and Rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        // The regular expression is replacing each occurrence of one of these four strings with a modified string 
        // that includes a dollar sign ($) followed by the original string. For example, if the original string was gt, it would be replaced with $gt. 
        // This modified string is often used in MongoDB queries to specify comparison operators.

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        
        // ResultPerPage = 5
        // CurrentPage = 3
        // this.query -> display all products, limit -> show 5 products, skip -> 10 products
        return this;
    }
}

module.exports = ApiFeatures;

