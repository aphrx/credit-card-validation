import { useState } from 'react'

const useForm = valid => {
    const [values, setValues] = useState({
        cardName: '',
        cardNumber: '',
        cardType: '',
        cardExpiration: '',
        cardSecurityCode: '',
        cardPostalCode: ''
    })

    const [errors, setErrors] = useState({})

    const handleChange = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
        console.log(value)
    }

    const handleSubmit = e => {
        e.preventDefault()

        var creditCard = valid.number(values.cardNumber)

        creditCard.expirationDate = valid.expirationDate(values.cardExpiration)
        creditCard.cvv = valid.cvv(values.cardSecurityCode)
        creditCard.cardholderName = valid.cardholderName(values.cardName)
        creditCard.postalCode = valid.postalCode(values.cardPostalCode)
        console.log(creditCard.isValid);
        console.log(creditCard)

        setErrors(creditCard.isValid);
    };

    return { handleChange, values, handleSubmit, errors };
};

export default useForm;