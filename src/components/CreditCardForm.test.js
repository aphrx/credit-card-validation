import React from "react";
import {
  render,
  fireEvent,
  getByLabelText,
  getByDisplayValue,
  getByText,
  getAllByTestId,
  getAllByText,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import CreditCardForm from "./CreditCardForm";
import validateInfo from "./../validateInfo";

const valid_values = {
  cardName: "John Smith",
  cardNumber: "4111111111111111",
  cardType: "VISA",
  cardExpiration: "05/2022",
  cardSecurityCode: "352",
  cardPostalCode: "L6R 3K5",
};

const null_values = {
  cardName: null,
  cardNumber: null,
  cardType: null,
  cardExpiration: null,
  cardSecurityCode: null,
  cardPostalCode: null,
};


// Check if rendering the form
describe("test rendering", () => {
  const elements = [
    "cardName",
    "cardNumber",
    "cardType", 
    "cardExpiration", 
    "cardSecurityCode", 
    "cardPostalCode",
    "validateButton",
    "alertMessage"
  ];

  test.each(elements)("focus on card front", async (element) => {
    let { getByTestId } = render(<CreditCardForm />);

    expect(getByTestId(element)).toBeTruthy();
  });

});

describe("test form functionality", () => {
  const field = [
    ["cardName", valid_values.cardName],
    ["cardNumber", valid_values.cardNumber],
    ["cardType", valid_values.cardType],
    ["cardExpiration", valid_values.cardExpiration],
    ["cardSecurityCode", valid_values.cardSecurityCode],
    ["cardPostalCode", valid_values.cardPostalCode],
  ];

  test.each(field)("focus on card front", async (field, values) => {
    let { getByTestId } = render(<CreditCardForm />);
    await act(async () => {
      await fireEvent.focus(getByTestId(field));
      await fireEvent.change(getByTestId(field), {
        target: { value: values },
      });
    });

    expect(getByTestId(field).value).toBe(values);
  });

  test("test onSubmit", () => {
    let { getByTestId } = render(<CreditCardForm />);
    act(() => {
      fireEvent.click(getByTestId("validateButton"));
    });
    expect(getByTestId("alertMessage").className).toBe(
      "fade alert alert-danger show"
    );
  });
});

describe("test empty fields", () => {
  test("test null card", () => {
    expect(validateInfo(null_values)).toStrictEqual({
      message: "Cardholder name is not complete",
      show: true,
      variant: "danger",
      ccvv: false,
      cexp: false,
      cname: false,
      cnumber: false,
      cpostal: false,
      ctype: false,
    });
  });

  test("test empty card name", () => {
    let values = Object.create(valid_values);
    values.cardName = "";
    expect(validateInfo(values)).toStrictEqual({
      message: "Cardholder name is not complete",
      show: true,
      variant: "danger",
      ccvv: true,
      cexp: true,
      cname: false,
      cnumber: true,
      cpostal: true,
      ctype: true,
    });
  });

  test("test empty card number", () => {
    let values = Object.create(valid_values);
    values.cardNumber = "";
    expect(validateInfo(values)).toStrictEqual({
      message: "Credit card number is not complete",
      show: true,
      variant: "danger",
      ccvv: true,
      cexp: true,
      cname: true,
      cnumber: false,
      cpostal: true,
      ctype: false,
    });
  });

  test("test empty card type", () => {
    let values = Object.create(valid_values);
    values.cardType = "";
    expect(validateInfo(values)).toStrictEqual({
      message: "Credit card type is not complete",
      show: true,
      variant: "danger",
      ccvv: true,
      cexp: true,
      cname: true,
      cnumber: true,
      cpostal: true,
      ctype: false,
    });
  });

  test("test empty card exp", () => {
    let values = Object.create(valid_values);
    values.cardExpiration = "";
    expect(validateInfo(values)).toStrictEqual({
      message: "Credit card expiration date is not complete",
      show: true,
      variant: "danger",
      ccvv: true,
      cexp: false,
      cname: true,
      cnumber: true,
      cpostal: true,
      ctype: true,
    });
  });

  test("test empty card cvv", () => {
    let values = Object.create(valid_values);
    values.cardSecurityCode = "";
    expect(validateInfo(values)).toStrictEqual({
      message: "Credit card CVV is not complete",
      show: true,
      variant: "danger",
      ccvv: false,
      cexp: true,
      cname: true,
      cnumber: true,
      cpostal: true,
      ctype: true,
    });
  });

  test("test empty card postal code", () => {
    let values = Object.create(valid_values);
    values.cardPostalCode = "";
    expect(validateInfo(values)).toStrictEqual({
      message: "Credit card postal code is not complete",
      show: true,
      variant: "danger",
      ccvv: true,
      cexp: true,
      cname: true,
      cnumber: true,
      cpostal: false,
      ctype: true,
    });
  });
});

describe("test valid fields", () => {
  test("test valid card", () => {
    const result = {
      message: "Credit Card is valid",
      show: true,
      variant: "success",
      ccvv: true,
      cexp: true,
      cname: true,
      cnumber: true,
      cpostal: true,
      ctype: true,
    };
    expect(validateInfo(valid_values)).toStrictEqual(result);
  });
});

describe("test invalid fields", () => {
  test("test invalid name", () => {
    let values = Object.create(valid_values);
    values.cardName = "4111111111111111";

    const result = {
      message: "Cardholder name is invalid",
      show: true,
      variant: "danger",
      ccvv: true,
      cexp: true,
      cname: false,
      cnumber: true,
      cpostal: true,
      ctype: true,
    };
    expect(validateInfo(values)).toStrictEqual(result);
  });

  test("test invalid number", () => {
    let values = Object.create(valid_values);
    values.cardNumber = "411111111111111111111111";

    const result = {
      message: "Credit card number is invalid",
      show: true,
      variant: "danger",
      ccvv: true,
      cexp: true,
      cname: true,
      cnumber: false,
      cpostal: true,
      ctype: true,
    };
    expect(validateInfo(values)).toStrictEqual(result);
  });

  test("test invalid type", () => {
    let values = Object.create(valid_values);
    values.cardType = "VC";

    const result = {
      message: "Credit card type is invalid",
      show: true,
      variant: "danger",
      ccvv: true,
      cexp: true,
      cname: true,
      cnumber: true,
      cpostal: true,
      ctype: false,
    };
    expect(validateInfo(values)).toStrictEqual(result);
  });

  test("test invalid expiration", () => {
    let values = Object.create(valid_values);
    values.cardExpiration = "0505/20222022";

    const result = {
      message: "Credit card expiration date is invalid",
      show: true,
      variant: "danger",
      ccvv: true,
      cexp: false,
      cname: true,
      cnumber: true,
      cpostal: true,
      ctype: true,
    };
    expect(validateInfo(values)).toStrictEqual(result);
  });

  test("test invalid cvv", () => {
    let values = Object.create(valid_values);
    values.cardSecurityCode = "050520222022";

    const result = {
      message: "Credit card CVV is invalid",
      show: true,
      variant: "danger",
      ccvv: false,
      cexp: true,
      cname: true,
      cnumber: true,
      cpostal: true,
      ctype: true,
    };
    expect(validateInfo(values)).toStrictEqual(result);
  });

  test("test invalid postal code", () => {
    let values = Object.create(valid_values);
    values.cardPostalCode = "0";

    const result = {
      message: "Credit card postal code is invalid",
      show: true,
      variant: "danger",
      ccvv: true,
      cexp: true,
      cname: true,
      cnumber: true,
      cpostal: false,
      ctype: true,
    };
    expect(validateInfo(values)).toStrictEqual(result);
  });
});
