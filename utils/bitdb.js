const bitdb = {
  baseUrl: "https://bob.planaria.network/q/",
  headers: {},

  async find(q, opts = {}) {
    const query = { v: 3, q },
      path = this._encodeQuery(query),
      url = this.baseUrl + path,
      head = { ...this.headers, ...opts.headers };

    const r = await window.fetch(url, { headers: head });
    return r.json();
  },

  async findSingle(q, opts) {
    const sort = { "blk.i": -1, i: -1 },
      limit = 1,
      query = { sort, limit, ...q };

    const data = await this.find(query, opts);

    return data.u.length ? data.u[0] : data.c.length ? data.c[0] : null;
  },

  async findAll(q, opts) {
    const sort = { "blk.i": 1, i: 1 },
      query = { sort, ...q };

    return await this.find(query, opts);
  },

  _encodeQuery(query) {
    const str = JSON.stringify(query);
    if (typeof btoa == "function") {
      return btoa(str);
    } else {
      return Buffer.from(str).toString("base64");
    }
  }
};

module.exports = bitdb;
