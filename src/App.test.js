import puppeteer from "puppeteer";

let browser, page;

const valid_values = {
  cardName: "John Smith",
  cardNumber: "4111111111111111",
  cardType: "VISA",
  cardExpiration: "05/2022",
  cardSecurityCode: "352",
  cardPostalCode: "L6R 3K5",
};

// Complete form and submit
async function fillForm(values, page) {
  await page.click("input#cardName");
  await page.type("input#cardName", values.cardName);
  await page.click("input#cardNumber");
  await page.type("input#cardNumber", values.cardNumber);
  await page.click("input#cardType");
  await page.type("input#cardType", values.cardType);
  await page.click("input#cardExpiration");
  await page.type("input#cardExpiration", values.cardExpiration);
  await page.click("input#cardSecurityCode");
  await page.type("input#cardSecurityCode", values.cardSecurityCode);
  await page.click("input#cardPostalCode");
  await page.type("input#cardPostalCode", values.cardPostalCode);
  await page.click("button#validateButton");
}

// Create values object depending on which field is empty
function emptyField(index, field) {
  let values = Object.create(valid_values);
  switch (index) {
    case 0:
      values.cardName = field;
      break;
    case 1:
      values.cardNumber = field;
      break;
    case 2:
      values.cardType = field;
      break;
    case 3:
      values.cardExpiration = field;
      break;
    case 4:
      values.cardSecurityCode = field;
      break;
    case 5:
      values.cardPostalCode = field;
      break;
    default:
      break;
  }
  return values;
}

describe("test card animations", () => {
  const field = [
    "input#cardName",
    "input#cardNumber",
    "input#cardType",
    "input#cardExpiration",
    "input#cardPostalCode",
  ];

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/");
  });

  test.each(field)("focus on card front", async (field) => {
    await page.click(field);
    let cardAnimation = await page.$eval(
      "div.rccs__card",
      (card) => card.classList
    );
    expect(cardAnimation[2]).toBeFalsy();
  });

  test("focus on cvc", async () => {
    await page.click("input#cardSecurityCode");
    let cardAnimation = await page.$eval(
      "div.rccs__card",
      (card) => card.classList
    );
    expect(cardAnimation[2]).toBe("rccs__card--flipped");
  });

  afterEach(async () => {
    await browser.close();
  });
});

describe("test empty fields", () => {
  const errors = [
    [0, "Cardholder name is not complete"],
    [1, "Credit card number is not complete"],
    [2, "Credit card type is not complete"],
    [3, "Credit card expiration date is not complete"],
    [4, "Credit card CVC is not complete"],
    [5, "Credit card postal code is not complete"],
  ];

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/");
  });

  test("submit empty form", async () => {
    await page.click("button#validateButton");
    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Cardholder name is not complete");
  });

  test.each(errors)("submit empty field ", async (index, err) => {
    let values = emptyField(index, "");
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe(err);
  });

  afterEach(async () => {
    await browser.close();
  });
});

describe("test valid fields", () => {
  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/");
  });

  test("submit valid card", async () => {
    let values = Object.create(valid_values);
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Credit Card is valid");
  });

  afterEach(async () => {
    await browser.close();
  });
});

describe("test invalid fields", () => {
  const errors = [
    [0, "Cardholder name is invalid", "4111111111111111"],
    [1, "Credit card number is invalid", "411111111111111111111111"],
    [2, "Credit card type is invalid", "VC"],
    [3, "Credit card expiration date is invalid", "0505/20222022"],
    [4, "Credit card CVC is invalid", "0"],
    [5, "Credit card postal code is invalid", "0"],
  ];

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/");
  });

  test.each(errors)("submit empty field ", async (index, err, val) => {
    let values = emptyField(index, val);
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe(err);
  });

  afterEach(async () => {
    await browser.close();
  });
});
