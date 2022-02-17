const catchAsync = require("./catchAsync");

exports.paginatedResults = (Model) =>
  catchAsync(async (req, res, next) => {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "fields", "limit"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1b Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // console.log(JSON.parse(queryStr));

    const results = {};
    let page;
    if (JSON.parse(queryStr)) results.category = JSON.parse(queryStr);
    if (req.query.page) {
      page = req.query.page * 1;
    } else {
      page = 1;
    }
    // Uncomment To set custom document limit
    // const limit = parseInt(req.query.limit);
    const limit = 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    if (JSON.parse(queryStr)) {
      if (
        endIndex <
        (await Model.find(JSON.parse(queryStr))
          .countDocuments()
          .exec())
      ) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }
    } else if (endIndex < (await Model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    // THIS if statement work for all cases including without any queryString
    // IF nothing is passed then it takes queryString as '{}' but not null
    if (JSON.parse(queryStr)) {
      console.log(JSON.parse(queryStr));
      results.results = await Model.find(JSON.parse(queryStr))
        .sort({
          createdAt: -1,
        })
        .limit(limit)
        .skip(startIndex)
        .exec();
    }
    // Pass the results to the res of the next middleware
    res.paginatedResults = results;
    next();
  });
