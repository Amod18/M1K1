// Importing the required libraries
import React, { useRef, Component, useState } from 'react';
// Axios maybe used in future
// import axios from 'axios'; 
import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';
import logo from './CMSlogo.png'


// Defining regex rules for input validation for Water bill
const UserIdRegex = /^[a-zA-Z]{2}\d{6}$/;
const ValidateWaterBill = (value) => {
    if (!UserIdRegex.test(value)) {
        return 'Please enter a valid user ID in the format XY123456';
    }
    return true;
};

// Defining regex rules for input validation for Vehicle number
const fineIdRegex = /^[a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{4}$/;
const validateVehicleNumber = (value) => {
    if (!fineIdRegex.test(value)) {
        return 'Please enter a valid registration number in the format XY12AQ3456';
    }
    return true;
};

// Defining regex rules for input validation for RC
const RCIdRegex = /^[a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{4}$/;
const validateRcExtract = (value) => {
    if (!RCIdRegex.test(value)) {
        return 'Please enter a valid registration number in the format XY12AQ3456';
    }
    return true;
};

// Creating arrays for storing the fetched details
let waterBillDetails = [];
let policeFineDetails = [];
let rcExtractDetails = [];
// Variable to store the amount and compare is it greater than 0 or not? 
let billAmt = 0;

class WaterBill extends Component {
    // Creating the constructor for the class and pass the react propTypes in it to check the type of the argument which is being passed.
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            result: '',
            trigger: false,
        };

        this.triggetNext = this.triggetNext.bind(this);
    }

    // This function is for the triggering the next step only when the previous function is called.
    componentDidMount() {
        this.triggetNext()
    }

    // Function to mount all the things which is defined in it whenever called
    UNSAFE_componentWillMount() {
        const self = this;
        const { steps } = this.props;
        const regNo = steps.getWaterRegNo.value;
        console.log(regNo);
        const queryUrl = `http://localhost:5000/fetchDataWater`;

        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', readyStateChange);

        function readyStateChange() {
            if (this.readyState === 4) {
                if (this.responseText.trim() !== "") {
                    console.log(this.responseText)
                    const bindings = JSON.parse(this.responseText);
                    console.log(bindings.Result.ResponseVal);
                    if (bindings.Result.ResponseVal === 1) {
                        waterBillDetails = [
                            "Consumer Name: " + bindings.Result.ResponseData.ConsumerName,
                            "Bill Number : " + bindings.Result.ResponseData.BillNumber,
                            "Bill Date : " + bindings.Result.ResponseData.BillDate,
                            "Bill Amount : " + bindings.Result.ResponseData.BillAmount
                        ]
                        // const billAmount = Number(waterBillDetails[3][14]);
                        // billAmt = Number(waterBillDetails[3][14]);
                        // console.log(billAmt);
                        // console.log((billAmt));

                        const billAmountDetail = waterBillDetails.find(detail => detail.includes('Bill Amount'));
                        // Extract the bill amount from the detail
                        const billAmount = billAmountDetail ? billAmountDetail.split(': ')[1] : null;
                        // Convert the extracted value to a number (if needed)
                        billAmt = billAmount ? parseFloat(billAmount) : null;
                        // Now, you have the bill amount in 'billAmountNumber'
                        console.log(billAmt);

                        self.setState({ loading: false, result: waterBillDetails });
                    } else {
                        waterBillDetails = [
                            "OOPS!, No bill found for this customer ID."
                        ]
                        self.setState({ loading: false, result: waterBillDetails });
                    }
                }
            }
            else {
                console.error("Empty response from the server");
            }
        }
        const data = {
            // RRNo: "SE203677",
            // RRNo: "SE203181",
            RRNo: regNo,
            SubDivisionID: '',
            DuplicateCheckRequired: 'N',
            CityCode: 'BN',
            ServiceCityId: '97',
            CityId: 2,
        };
        xhr.open('POST', queryUrl);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data));
    }

    triggetNext() {
        this.setState({ trigger: true }, () => {
            this.props.triggerNextStep();
        });
    }

    render() {
        const { trigger, loading } = this.state;

        return (
            <div className="WaterBill">
                {loading ? <Loading /> : <div>
                    <p>Bill details:</p>
                    {waterBillDetails.map((detail, index) => (
                        <p key={index}>{detail}</p>
                    ))}
                </div>}
                {
                    !loading &&
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: 20,
                        }}
                    >
                        {
                            !trigger &&
                            <button>
                                Continue
                            </button>
                        }
                    </div>
                }
            </div>
        );

    }
}

WaterBill.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
};

WaterBill.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
};

class PoliceFine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            result: '',
            trigger: false,
        };

        this.triggetNext = this.triggetNext.bind(this);
    }

    componentDidMount() {
        this.triggetNext()
    }

    UNSAFE_componentWillMount() {
        const self = this;
        const { steps } = this.props;
        console.log(steps);
        const regisNum = steps.getFineRegNo && steps.getFineRegNo.value;
        console.log(regisNum);
        const queryUrl = `http://localhost:5000/fetchDataPoliceFine`;

        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', readyStateChange);

        function readyStateChange() {
            if (this.readyState === 4) {
                if (this.responseText.trim() !== "") {
                    const bindings = JSON.parse(this.responseText);
                    console.log(bindings.Result.ResponseVal);

                    if (bindings.Result.ResponseVal === 1 && bindings.Result.ResponseData.PoliceFineDetailsList) {
                        // Check if PoliceFineDetailsList is not undefined and has length > 0
                        if (bindings.Result.ResponseData.PoliceFineDetailsList.length > 0) {
                            policeFineDetails = [
                                "Notice Number: " + bindings.Result.ResponseData.PoliceFineDetailsList[0].NoticeNo,
                                "Registration Number: " + bindings.Result.ResponseData.PoliceFineDetailsList[0].RegistrationNo,
                                "Fine Amount: " + bindings.Result.ResponseData.PoliceFineDetailsList[0].FineAmount,
                            ];
                            self.setState({ loading: false, result: policeFineDetails });
                        } else {
                            policeFineDetails = [
                                "OOPS!, No fine details found for this registration number."
                            ];
                            self.setState({ loading: false, result: policeFineDetails });
                        }
                    } else {
                        console.log("Invalid response or no fine details available.");
                    }
                } else {
                    console.log("Empty response from the server");
                }
            }
        }

        const data = {
            SearchBy: "REGISTERNO",
            regisNum: regisNum,
            ServiceType: "BPS"
        };
        xhr.open('POST', queryUrl);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data));
        console.log(data);
    }

    triggetNext() {
        this.setState({ trigger: true }, () => {
            this.props.triggerNextStep();
        });
    }

    render() {
        const { trigger, loading } = this.state;

        return (
            <div className="PoliceFine">
                {loading ? <Loading /> : <div>
                    <p>Fine details:</p>
                    {policeFineDetails.map((detail, index) => (
                        <p key={index}>{detail}</p>
                    ))}
                </div>}
                {
                    !loading &&
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: 20,
                        }}
                    >
                        {
                            !trigger &&
                            <button>
                                Continue
                            </button>
                        }
                    </div>
                }
            </div>
        );

    }
}

PoliceFine.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
};

PoliceFine.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
};

class RCextract extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            result: '',
            trigger: false,
        };

        this.triggetNext = this.triggetNext.bind(this);
    }

    componentDidMount() {
        this.triggetNext()
    }

    UNSAFE_componentWillMount() {
        const self = this;
        const { steps } = this.props;
        console.log(steps);
        const regNum = steps.getRcExtractRegNo && steps.getRcExtractRegNo.value;
        console.log(regNum);
        const queryUrl = `http://localhost:5000/fetchDataRcExtract`;

        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', readyStateChange);

        function readyStateChange() {
            if (this.readyState === 4) {
                const bindings = JSON.parse(this.responseText);
                console.log(bindings.Result.ResponseVal);
                console.log(bindings.Result.ResponseData.RegistrationNo);
                if (bindings.Result.ResponseVal === 1) {
                    rcExtractDetails = [
                        "Owner Name: " + bindings.Result.ResponseData.OwnerName,
                        "Registration Number: " + bindings.Result.ResponseData.RegistrationNo,
                        "Chasis Number: " + bindings.Result.ResponseData.ChasisNo,
                        "RTO Code: " + bindings.Result.ResponseData.RTOCode,
                        "Amount Paid: " + bindings.Result.ResponseData.AmountPaid,
                    ]
                    self.setState({ loading: false, result: rcExtractDetails });
                } else {
                    rcExtractDetails = [
                        "OOPS!, No bill found for this customer ID."
                    ]
                    self.setState({ loading: false, result: rcExtractDetails });
                }
            }
        }
        const data = {
            regNum: regNum,
            DuplicateCheckRequired: "N",
            CityCode: "BN",
            ServiceCityId: "7",
            CityId: 2
        };
        xhr.open('POST', queryUrl);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data));
        console.log(data);
    }

    triggetNext() {
        this.setState({ trigger: true }, () => {
            this.props.triggerNextStep();
        });
    }

    render() {
        const { trigger, loading } = this.state;

        return (
            <div className="RCextract">
                {loading ? <Loading /> : <div>
                    <p>RC details:</p>
                    {rcExtractDetails.map((detail, index) => (
                        <p key={index}>{detail}</p>
                    ))}
                </div>}
                {
                    !loading &&
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: 20,
                        }}
                    >
                        {
                            !trigger &&
                            <button>
                                Continue
                            </button>
                        }
                    </div>
                }
            </div>
        );

    }
}

RCextract.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
};

RCextract.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
};

function Normal() {
    const [, setUserId] = useState('');
    const myref = useRef(null);

    return (
        <ChatBot ref={myref}
            botAvatar={logo}
            width="1340px"
            height="600px"
            steps={[
                {
                    id: '1',
                    message: 'Welcome to the M1/K1 bill payment bot. Which bill do you want to pay?',
                    trigger: 'options',
                },
                {
                    id: 'options',
                    options: [
                        // { value: "Electricity Bill", label: 'Electricity Bill', trigger: 'waterConsumerID' },
                        { value: "Water Bill", label: 'Water Bill', trigger: 'waterConsumerID' },
                        { value: "Traffic Fine", label: 'Traffic Fine', trigger: 'fineConsumerID' },
                        { value: "Extract RC", label: 'Extract RC', trigger: 'rcExtractConsumerID' },
                    ],
                },
                {
                    id: "rcExtractConsumerID",
                    message: "Please enter your consumer ID",
                    trigger: "getRcExtractRegNo"
                },
                {
                    id: 'getRcExtractRegNo',
                    user: true,
                    validator: validateRcExtract,
                    trigger: 'fetchRCData',
                    callback: (value) => {
                        setUserId(value);
                        return true;
                    },
                },
                {
                    id: 'fetchRCData',
                    message: 'Fetching RC details .....',
                    trigger: 'displayRCData',
                },
                {
                    id: 'displayRCData',
                    asMessage: true,
                    component: <RCextract />,
                    waitAction: true,
                    delay: 2000,
                    trigger: 'PayOrNotRC',
                },
                {
                    id: 'PayOrNotRC',
                    message: 'Do you want to pay for RC?',
                    waitAction: true,
                    delay: 3000,
                    trigger: 'yesNO',
                },
                {
                    id: "waterConsumerID",
                    message: "Please enter your consumer ID",
                    trigger: "getWaterRegNo"
                },
                {
                    id: 'getWaterRegNo',
                    user: true,
                    validator: ValidateWaterBill,
                    trigger: 'fetchWaterData',
                    callback: (value) => {
                        setUserId(value);
                        return true;
                    },
                },
                {
                    id: 'fetchWaterData',
                    message: 'Fetching bill details .....',
                    trigger: 'displayWaterData',
                },
                {
                    id: 'displayWaterData',
                    asMessage: true,
                    component: <WaterBill />,
                    waitAction: true,
                    delay: 2000,
                    trigger: 'PayOrNotWater',
                },
                {
                    id: 'PayOrNotWater',
                    message: 'Do you want to pay the bill?',
                    waitAction: true,
                    delay: 3000,
                    trigger: 'yesNO',
                },
                {
                    id: "fineConsumerID",
                    message: "Please enter your Registration number",
                    trigger: "getFineRegNo"
                },
                {
                    id: 'getFineRegNo',
                    user: true,
                    validator: validateVehicleNumber,
                    trigger: 'fetchFineData',
                    callback: (value) => {
                        setUserId(value);
                        return true;
                    },
                },

                {
                    id: 'fetchFineData',
                    message: 'Fetching fine details .....',
                    trigger: 'displayFineData',
                },

                {
                    id: 'displayFineData',
                    asMessage: true,
                    component: <PoliceFine />,
                    waitAction: true,
                    delay: 3000,
                    trigger: 'PayOrNotFine',
                },
                {
                    id: 'PayOrNotFine',
                    message: 'Do you want to pay the fine?',
                    waitAction: true,
                    delay: 3000,
                    trigger: 'yesNO',
                },
                {
                    id: 'yesNO',
                    options: [
                        { value: "Yes", label: "YES", trigger: "yesMessage" },
                        { value: "No", label: "NO", trigger: "noMes" },
                    ],
                },
                {
                    id: "yesMessage",
                    component: (
                        <span style={{ cursor: 'pointer' }}>
                            Click <a href='https://www.karnatakaone.gov.in/PortalHome/ServiceList' color='black' target="_blank" rel='noreferrer'>here</a> to make a payment
                        </span>
                    ),
                    asMessage: true,
                    trigger: "mainMenu"
                },
                {
                    id: "mainMenu",
                    message: "Do you want to visit main menu",
                    trigger: "mainMenuOptions"
                },
                {
                    id: 'mainMenuOptions',
                    options: [
                        { value: "Yes", label: "YES", trigger: "options" },
                        { value: "No", label: "NO", trigger: "noMes" },
                    ],
                },
                {
                    id: "noMes",
                    message: "Do you want to see/pay any other bills",
                    trigger: "noOpt"
                },
                {
                    id: "noOpt",
                    options: [
                        { value: "Yes", label: "YES", trigger: "options" },
                        { value: "No", label: "NO", trigger: "noMessage" },
                    ]
                },
                {
                    id: "noMessage",
                    message: "Thanks for using the chatbot, see you later!"
                },
            ]}
        />
    );
}

export default Normal
