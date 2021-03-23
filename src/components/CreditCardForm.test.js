import React from "react";
import { render, fireEvent } from "@testing-library/react";
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

// Generate values to be sent and expected messages to be recieved
function validations(index, field, msg) {
  let vals = {
    message: "An unknown error occured. Please try again later",
    show: true,
    variant: "danger",
    ccvv: true,
    cexp: true,
    cname: true,
    cnumber: true,
    cpostal: true,
    ctype: true,
  };
  let values = Object.create(valid_values);

  switch (index) {
    case 0:
      vals.cname = false;
      values.cardName = field;
      break;
    case 1:
      vals.cnumber = false;
      if (field === "") {
        vals.ctype = false;
      }
      values.cardNumber = field;
      break;
    case 2:
      vals.ctype = false;
      values.cardType = field;
      break;
    case 3:
      vals.cexp = false;
      values.cardExpiration = field;
      break;
    case 4:
      vals.ccvv = false;
      values.cardSecurityCode = field;
      break;
    case 5:
      vals.cpostal = false;
      values.cardPostalCode = field;
      break;
    default:
      break;
  }
  vals.message = msg;
  return [values, vals];
}

describe("test form rendering", () => {
  const elements = [
    "cardName",
    "cardNumber",
    "cardType",
    "cardExpiration",
    "cardSecurityCode",
    "cardPostalCode",
    "validateButton",
    "alertMessage",
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
  const messages = [
    [0, "", "Cardholder name is not complete"],
    [1, "", "Credit card number is not complete"],
    [2, "", "Credit card type is not complete"],
    [3, "", "Credit card expiration date is not complete"],
    [4, "", "Credit card CVC is not complete"],
    [5, "", "Credit card postal code is not complete"],
  ];

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

  test.each(messages)("test empty card field", (index, field, messages) => {
    let values = validations(index, field, messages);
    expect(validateInfo(values[0])).toStrictEqual(values[1]);
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
  const errors = [
    [0, "Cardholder name is invalid", "4111111111111111"],
    [1, "Credit card number is invalid", "411111111111111111111111"],
    [2, "Credit card type is invalid", "VC"],
    [3, "Credit card expiration date is invalid", "0505/20222022"],
    [4, "Credit card CVC is invalid", "0"],
    [5, "Credit card postal code is invalid", "0"],
  ];

  test.each(errors)("test empty card field", (index, messages, field) => {
    let values = validations(index, field, messages);
    expect(validateInfo(values[0])).toStrictEqual(values[1]);
  });
});
