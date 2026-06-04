class APIFeatures {

  constructor(
    query,
    queryString
  ) {

    this.query = query;

    this.queryString =
      queryString;

  }

  filter() {

    const queryObj = {
      ...this.queryString,
    };

    const excludedFields = [
      "page",
      "sort",
      "limit",
      "search",
    ];

    excludedFields.forEach(
      (field) =>
        delete queryObj[field]
    );

    this.query =
      this.query.find(
        queryObj
      );

    return this;
  }

  search(fields = []) {

    if (
      this.queryString.search
    ) {

      const regex =
        new RegExp(
          this.queryString.search,
          "i"
        );

      this.query =
        this.query.find({

          $or: fields.map(
            (field) => ({
              [field]: regex,
            })
          ),

        });
    }

    return this;
  }

  sort() {

    if (
      this.queryString.sort
    ) {

      this.query =
        this.query.sort(
          this.queryString.sort
        );

    } else {

      this.query =
        this.query.sort(
          "-createdAt"
        );

    }

    return this;
  }

  paginate() {

    const page =
      Number(
        this.queryString.page
      ) || 1;

    const limit =
      Number(
        this.queryString.limit
      ) || 10;

    const skip =
      (page - 1) * limit;

    this.query =
      this.query
        .skip(skip)
        .limit(limit);

    return this;
  }
}

export default APIFeatures;