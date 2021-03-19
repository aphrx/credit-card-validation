import React from "react";
import useForm from "../useForm";
import { Button, Form, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreditCardForm.css"
import valid from "card-validator"

const CreditCardForm = () => {
  const { handleChange, values, handleSubmit, errors } = useForm(valid);
  return (
    <div>
      <div className="container w-50">
        <div className="box justify-content-center align-items-center">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                id="cardName"
                data-testid="cardName"
                name="cardName"
                placeholder="Cardholder Name"
                value={values.cardName}
                onChange={handleChange}
              />
              
            </Form.Group>
            <Form.Group>
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="number"
                id="cardNumber"
                data-testid="cardNumber"
                name="cardNumber"
                placeholder="Credit Card Number"
                value={values.cardNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Credit Card Type</Form.Label>
              <Form.Control
                type="text"
                name="cardType"
                id="cardType"
                data-testid="cardType"
                placeholder="Credit Card Type"
                value={values.cardType}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Card Expiration Date</Form.Label>
              <Form.Control
                type="text"
                id="cardExpiration"
                data-testid="cardExpiration"
                name="cardExpiration"
                placeholder="Expiration Date"
                value={values.cardExpiration}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Card Security Code</Form.Label>
              <Form.Control
                type="number"
                id="cardSecurityCode"
                data-testid="cardSecurityCode"
                name="cardSecurityCode"
                placeholder="Security Code"
                value={values.cardSecurityCode}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Card Postal Code</Form.Label>
              <Form.Control
                type="text"
                id="cardPostalCode"
                data-testid="cardPostalCode"
                name="cardPostalCode"
                placeholder="Postal/Zip Code"
                value={values.cardPostalCode}
                onChange={handleChange}
              />
            </Form.Group>
            <Button data-testid="validateButton" type="submit">Validate</Button>
          </Form>
        </div>
        <br />
        <br />
        <Alert variant="success">Testing</Alert>
      </div>
      
    </div>
  );
};

export default CreditCardForm;
