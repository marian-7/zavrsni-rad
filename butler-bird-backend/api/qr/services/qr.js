const puppeteer = require("puppeteer");
const fs = require("fs");
const QRCode = require("qrcode");

const translations = {
  dk: {
    title: "Her kan du bestille<br/>med din smartphone",
    description: "Nemt og hurtigt – ingen download nødvendig",
    table: "Bord nr.",
    scan: "Scan QR-koden<br/><br/>– eller indtast hjemmesiden  ovenfor i din browser",
    badge: "Nem bestilling",
    phone: {
      header: "Sådan gør du",
      footer: "På gensyn i restauranten",
      steps: {
        scan: {
          title: "Scan QR-koden",
          description:
            "Scan QR-koden og menukortet åbnes automatisk uden behov for download. Du kan også indtaste hjemme­siden i browseren på din telefon.",
        },
        order: {
          title: "Gå på opdagelse<br/>– og bestil",
          description:
            "Gå på opdagelse i menukortet og vælg dine favoritretter og drikkevarer.",
        },
        play: {
          title: "Betal",
          description:
            "Betal med din telefon. Herefter serverer værten dine drikkevarer, og køkkenet går i gang med at tilberede din mad.",
        },
        after: {
          title: "Velbekomme!",
          description:
            "Nyd din mad! Du er altid velkommen til at bestille mere. ",
        },
      },
    },
  },
  en: {
    title: "Here you can order<br/>with your smartphone",
    description: "Easy and fast - no download required",
    table: "Table no.",
    scan: "Scan the QR code<br/><br/>– or enter the website above in your browser",
    badge: "Easy ordering",
    phone: {
      header: "What to do",
      footer: "See you in<br/>the restaurant",
      steps: {
        scan: {
          title: "Scan the QR code",
          description:
            "Scan the QR code to retrieve the restaurant's menu on your phone. You can now explore the menu.",
        },
        order: {
          title: "Order",
          description: "Order from your phone. Remember to order beverages.",
        },
        play: {
          title: "Pay",
          description:
            "Pay with your phone.<br/>When you have paid, the kitchen starts making your food.",
        },
        after: {
          title: "After dinner",
          description:
            "Once you have finished your dinner, you can leave the restaurant whenever you want - because you have already paid.",
        },
      },
    },
  },
};

module.exports = {
  generate: async (organization, tables, locale) => {
    const translation = translations[locale] ?? translations.en;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--font-render-hinting=none"],
    });

    const [page, pageTemplate, phone] = await Promise.all([
      browser.newPage(),
      readFile(`${__dirname}/page.html`, {
        encoding: "utf8",
      }),
      readFile(`${__dirname}/phone.png`, {
        encoding: "base64",
      }),
    ]);

    const qrs = await Promise.all(
      tables.map((table) =>
        QRCode.toDataURL(`${process.env.QR_BASE_URL}/${table.id}`, {
          margin: 0,
        })
      )
    );

    let content = tables.reduce((content, table, i) => {
      return (
        content +
        pageTemplate
          .replace("{{table}}", table.id)
          .replace("{{title}}", translation.title)
          .replace("{{description}}", translation.description)
          .replace("{{tableLabel}}", translation.table)
          .replace("{{logo}}", organization.logo?.url ?? "")
          .replace("{{scan}}", translation.scan)
          .replace("{{badge}}", translation.badge)
          .replace("{{phoneHeader}}", translation.phone.header)
          .replace(
            "{{phoneStepsScanTitle}}",
            translation.phone.steps.scan.title
          )
          .replace(
            "{{phoneStepsScanDescriptions}}",
            translation.phone.steps.scan.description
          )
          .replace(
            "{{phoneStepsOrderTitle}}",
            translation.phone.steps.order.title
          )
          .replace(
            "{{phoneStepsOrderDescriptions}}",
            translation.phone.steps.order.description
          )
          .replace("{{phoneStepsPayTitle}}", translation.phone.steps.play.title)
          .replace(
            "{{phoneStepsPayDescriptions}}",
            translation.phone.steps.play.description
          )
          .replace(
            "{{phoneStepsAfterTitle}}",
            translation.phone.steps.after.title
          )
          .replace(
            "{{phoneStepsAfterDescriptions}}",
            translation.phone.steps.after.description
          )
          .replace("{{phoneFooter}}", translation.phone.footer)
          .replace("{{url}}", "app.butlerbird.com")
          .replace("{{qr}}", qrs[i])
          .replace("{{phone}}", `data:image/png;base64,${phone}`)
      );
    }, "");

    await page.setContent(`<body>${content}</body>`);

    await Promise.all([
      page.addStyleTag({ path: `${__dirname}/fonts.css` }),
      page.addStyleTag({ path: `${__dirname}/style.css` }),
    ]);

    const buffer = await page.pdf({
      width: "4.1339in",
      height: "5.8268in",
      margin: { bottom: 0, left: 0, right: 0, top: 0 },
      printBackground: true,
    });

    await browser.close();

    return buffer;
  },
};

function readFile(path, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
