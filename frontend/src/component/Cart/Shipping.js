import React, { Fragment, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../../actions/cartAction'
import { useNavigate } from 'react-router-dom'
import "./Shipping.css"
import { Country, State } from 'country-state-city'
import CheckoutSteps from './CheckoutSteps'

export default function Shipping() {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const { shippingInfo } = useSelector((state) => state.cart)
    const [address, setAddress] = useState(shippingInfo ? shippingInfo.address : "");
    const [city, setCity] = useState(shippingInfo ? shippingInfo.city : "");
    const [state, setState] = useState(shippingInfo ? shippingInfo.state : "");
    const [country, setCountry] = useState(shippingInfo ? shippingInfo.country : "");
    const [pinCode, setPinCode] = useState(shippingInfo ? shippingInfo.pinCode : "");
    const [phoneNo, setPhoneNo] = useState(shippingInfo ? shippingInfo.phoneNo : "");

    const shippingSubmit = (e) => {
        e.preventDefault()
        if (!address || !city || !state || !country || !pinCode || !phoneNo) {
            alert.show("Please fill all the required fields")
        }
        if (phoneNo.length !== 10) {
            alert.show('Please enter valid phone number')
            return;
        }

        dispatch(
            saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
        );

        navigate("/order/confirm")
    }

    return (
        <Fragment>
            <CheckoutSteps activeStep={0} />
            <div className='shippingContainer'>
                <div className='shippingBox'>
                    <h2 className='shippingHeading'>Shipping Details</h2>

                    <form className='shippingForm' encType='multipart/form-data' onSubmit={shippingSubmit}>
                        <div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Address"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="City"
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>

                            <div>
                                <input
                                    type="number"
                                    placeholder="Pin Code"
                                    required
                                    value={pinCode}
                                    onChange={(e) => setPinCode(e.target.value)}
                                />
                            </div>

                            <div>
                                <input
                                    type="number"
                                    placeholder="Phone Number"
                                    required
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                    size="10"
                                />
                            </div>
                        </div>

                        <div>
                            <select
                                required
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            >
                                <option value="">Country</option>
                                {Country &&
                                    Country.getAllCountries().map((item) => (
                                        <option key={item.isoCode} value={item.isoCode}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {country && (
                            <div>
                                <select
                                    required
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                >
                                    <option value="">State</option>
                                    {State &&
                                        State.getStatesOfCountry(country).map((item) => (
                                            <option key={item.isoCode} value={item.isoCode}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}

                        <input
                            type="submit"
                            value="Continue"
                            className="shippingBtn"
                            disabled={state ? false : true}
                        />
                    </form>
                </div>
            </div>
        </Fragment>
    )
}
