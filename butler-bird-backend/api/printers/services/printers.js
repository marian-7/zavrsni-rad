"use strict";

const axios = require("axios");
const md5 = require("md5");
const qs = require("qs");
const escpos = require("../../../libs/escpos");
const sharp = require("sharp");
const { toNumber } = require("lodash");

const ROW_SIZE = toNumber(process.env.SUNMI_PRINTER_ROW_SIZE);

const api = axios.create({
  baseURL: `${process.env.SUNMI_BASE_API}/v1`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

function mapResponse(res) {
  const { data } = res;
  if (data.code === "10000" && !data.data?.sub_code) {
    return res;
  }
  throw new Error(data.msg || data.data.sub_msg);
}

function createSign(data) {
  const key = process.env.SUNMI_APP_KEY;

  const stringA = Object.entries(data)
    .sort(([keyA], [keyB]) => {
      if (keyA > keyB) {
        return 1;
      } else if (keyA < keyB) {
        return -1;
      }
      return 0;
    })
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const stringB = `${stringA}${key}`;

  return md5(stringB).toUpperCase();
}

function createTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

function emptyCharacters(size) {
  return Array.from(new Array(size))
    .map(() => " ")
    .join("");
}

function line() {
  return Array.from(new Array(ROW_SIZE))
    .map(() => "-")
    .join("");
}

function getLabel(t, locale) {
  return t[locale] ?? Object.values(t)[0];
}

function getPrice(amount, local, currency) {
  return `${new Intl.NumberFormat(local, { currency, style: "currency" })
    .formatToParts(amount)
    .reduce((string, part) => {
      if (part.type !== "currency") {
        string += part.value;
      }
      return string;
    }, "")} ${currency}`;
}

async function getImage(url) {
  const { data: buffer } = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const base64 = await sharp(buffer)
    .resize(100)
    .png()
    .toBuffer()
    .then((data) => `data:image/png;base64,${data.toString("base64")}`);

  return new Promise((resolve, reject) => {
    escpos.Image.load(base64, (result) => {
      if (result instanceof Error) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
}

function chunk(string, size = ROW_SIZE) {
  return string.split("").reduce(
    (chunk, letter) => {
      const lastChunk = chunk[chunk.length - 1];
      if (lastChunk.length >= size) {
        chunk[chunk.length] = letter;
      } else {
        chunk[chunk.length - 1] = lastChunk + letter;
      }
      return chunk;
    },
    [""]
  );
}

function getItem(item, local, currency, leftSpacing = "") {
  const amount = `${leftSpacing}${item.amount.toString()}x `;
  const price = getPrice(item.price, local, currency);
  const name = chunk(
    getLabel(item.name, local),
    ROW_SIZE - amount.length - price.length - 2
  );

  return name.reduce((arr, partial, i) => {
    if (i === 0) {
      const left = `${amount}${partial}`;
      arr.push(
        left + emptyCharacters(ROW_SIZE - left.length - price.length) + price
      );
    } else {
      arr.push(emptyCharacters(amount.length) + partial);
    }

    return arr;
  }, []);
}

async function createOrderData(order, printer) {
  let string = "";

  const device = new escpos.Console((data) => {
    const bit = 8;
    for (let i = 0; i < data.length; i += bit) {
      let arr = [];
      for (let j = 0; j < bit && i + j < data.length; j++)
        arr.push(data[i + j]);
      arr = arr
        .map(function (b) {
          return b.toString(16).toUpperCase();
        })
        .map(function (b) {
          if (b.length === 1) b = "0" + b;
          return b;
        });
      string += arr.join("");
    }
  });
  const p = new escpos.Printer(device, { encoding: "UTF8" });

  await new Promise((resolve) => {
    device.open(async () => {
      const { organization } = printer;
      const locale = printer.language.iso;
      const itemLabel = "Item";
      const priceLabel = "Price";
      const totalLabel = "Total price";
      const commentsLabel = "Comments";

      p.encode("UTF8").newLine().align("CT");

      const logoUrl =
        organization.logo?.formats?.small?.url ?? organization.logo?.url;

      if (logoUrl) {
        const logo = await getImage(logoUrl);
        await p.image(logo, "D24");
      }

      p.text(organization.name)
        .newLine()
        .align("LT")
        .style("B")
        .text(`${order.tableSnapshot.label} (ID: ${order.tableSnapshot.id})`)
        .style("NORMAL")
        .text(
          new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(new Date(order.createdAt))
        )
        .text(line())
        .style("B")
        .text(
          itemLabel +
            emptyCharacters(ROW_SIZE - itemLabel.length - priceLabel.length) +
            priceLabel
        )
        .style("NORMAL")
        .newLine();

      order.itemsSnapshot.forEach((item) => {
        getItem(item, locale, order.currencySnapshot).forEach((string) => {
          p.text(string);
        });

        item.optionGroups.forEach((optionGroup) => {
          optionGroup.options.forEach((option) => {
            getItem(option, locale, order.currencySnapshot, ` - `).forEach(
              (string) => {
                p.text(string);
              }
            );
          });
        });
      });

      const total = getPrice(order.amount ?? 0, locale, order.currencySnapshot);
      p.newLine()
        .text(line())
        .style("B")
        .text(
          totalLabel +
            emptyCharacters(ROW_SIZE - totalLabel.length - total.length) +
            total
        );

      if (order.note) {
        p.newLine().text(commentsLabel).style("NORMAL").text(order.note);
      }

      p.cut().close();

      resolve(undefined);
    });
  });

  return string;
}

async function pushContent(order, printers) {
  const id = process.env.SUNMI_APP_ID;

  const data = await Promise.all(
    printers.map(async (printer) => {
      const data = {
        app_id: id,
        msn: printer.serialNumber,
        orderCnt: 1,
        orderData: await createOrderData(order, printer),
        orderType: 1,
        pushId: order.id,
        timestamp: createTimestamp(),
        voice: "",
        voiceCnt: 0,
        voiceUrl: "",
      };
      data.sign = createSign(data);
      return qs.stringify(data);
    })
  );

  return Promise.all(
    data.map((data) => {
      return api
        .post("/printer/pushContent", data)
        .then(mapResponse)
        .catch(console.log);
    })
  );
}

function printerAdd(msn, shopId) {
  const id = process.env.SUNMI_APP_ID;

  const data = {
    app_id: id,
    msn,
    shop_id: shopId,
    timestamp: createTimestamp(),
  };
  data.sign = createSign(data);

  return api.post("/printer/printerAdd", qs.stringify(data)).then(mapResponse);
}

function printerUnBind(msn, shopId) {
  const id = process.env.SUNMI_APP_ID;

  const data = {
    app_id: id,
    msn,
    shop_id: shopId,
    timestamp: createTimestamp(),
  };
  data.sign = createSign(data);

  return api
    .post("/printer/printerUnBind", qs.stringify(data))
    .then(mapResponse);
}

async function findForOrder(order) {
  const printers = await strapi.query("printers").find(
    {
      _limit: -1,
      organization: order.organization,
      triggerLocations: order.location,
    },
    [
      "language",
      "organization.name",
      "organization.logo",
      "triggerTables.id",
      "triggerVenues.id",
    ]
  );
  return printers.filter((printer) => {
    const { triggerVenues, triggerTables } = printer;
    if (triggerVenues.length === 0) {
      return true;
    } else if (triggerTables.length === 0) {
      return triggerVenues.some((venue) => venue.id === order.venue);
    }
    return triggerTables.some((table) => table.id === order.table);
  });
}

module.exports = { printerUnBind, printerAdd, pushContent, findForOrder };
