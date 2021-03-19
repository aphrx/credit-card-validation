import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import CreditCardForm from "./CreditCardForm"

// Check if rendering the form
it("renders correctly", ()=>{
    const {getByTestId} = render(<CreditCardForm/>);
    expect(getByTestId("cardName")).toBeTruthy()
    expect(getByTestId("cardNumber")).toBeTruthy()
    expect(getByTestId("cardType")).toBeTruthy()
    expect(getByTestId("cardExpiration")).toBeTruthy()
    expect(getByTestId("cardSecurityCode")).toBeTruthy()
    expect(getByTestId("cardPostalCode")).toBeTruthy()
    expect(getByTestId("validateButton")).toBeTruthy()
})