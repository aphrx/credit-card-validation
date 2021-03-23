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

  test("submit empty card name", async () => {
    let values = Object.create(valid_values);
    values.cardName = "";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Cardholder name is not complete");
  });

  test("submit empty card number", async () => {
    let values = Object.create(valid_values);
    values.cardNumber = "";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Credit card number is not complete");
  });

  test("submit empty card type", async () => {
    let values = Object.create(valid_values);
    values.cardType = "";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Credit card type is not complete");
  });

  test("submit empty card exp", async () => {
    let values = Object.create(valid_values);
    values.cardExpiration = "";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Credit card expiration date is not complete");
  });

  test("submit empty card cvv", async () => {
    let values = Object.create(valid_values);
    values.cardSecurityCode = "";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Credit card CVV is not complete");
  });

  test("submit empty postal code", async () => {
    let values = Object.create(valid_values);
    values.cardPostalCode = "";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Credit card postal code is not complete");
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
  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/");
  });

  test("submit invalid name", async () => {
    let values = Object.create(valid_values);
    values.cardName = "4111111111111111";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Cardholder name is invalid");
  });

  test("submit invalid number", async () => {
    let values = Object.create(valid_values);
    values.cardNumber = "411111111111111111111111";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Credit card number is invalid");
  });

  test("submit invalid type", async () => {
    let values = Object.create(valid_values);
    values.cardType = "VC";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Credit card type is invalid");
  });

  test("submit invalid expiration", async () => {
    let values = Object.create(valid_values);
    values.cardExpiration = "0505/20222022";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Credit card expiration date is invalid");
  });

  test("submit invalid cvv", async () => {
    let values = Object.create(valid_values);
    values.cardSecurityCode = "050520222022";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Credit card CVV is invalid");
  });

  test("submit invalid postal code", async () => {
    let values = Object.create(valid_values);
    values.cardPostalCode = "0";
    await fillForm(values, page);

    let alertMessage = await page.$eval(
      "div#alertMessage",
      (alert) => alert.textContent
    );
    expect(alertMessage).toBe("Credit card postal code is invalid");
  });

  afterEach(async () => {
    await browser.close();
  });
});
