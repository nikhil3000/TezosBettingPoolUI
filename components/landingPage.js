import React from 'react';
import {
  Button,
  Navbar,
  Container,
  Nav,
  Card,
  Form,
  Row,
  Col,
  Modal,
} from 'react-bootstrap';
import { ThanosWallet } from '@thanos-wallet/dapp';
import { Spinner } from './';
import { backendBaseURL, oracleContract } from '../config';
import * as axios from 'axios';

export function LandingPage() {
  return (
    <Container className="landingPageRoot">
      <Header />
      <Body />
    </Container>
  );
}

function Body() {
  const [betType, setBetType] = React.useState(0);
  const [randomNumber, setRandomNumber] = React.useState(0);
  const [opHash, setOpHash] = React.useState('');
  const [txConfirmed, setTxStatus] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState();
  const [totalFunds, setTotalFunds] = React.useState();

  const betSizeMap = new Map();
  betSizeMap.set(5, 5);
  betSizeMap.set(10, 3);
  betSizeMap.set(15, 1);
  const randomNumberChange = (event) => {
    setRandomNumber(Number(event.target.value));
  };

  React.useEffect(() => {
    async function onMount() {
      axios.post(`${backendBaseURL}/data`).then((obj) => {
        const {
          data: { amount },
        } = obj;
        setTotalFunds(amount * 10 ** -6);
      });
    }
    onMount();
  }, []);

  const handleBetTypeChange = (event) => {
    console.log(event.target.value);
    setBetType(Number(event.target.value));
  };

  const handlePlaceBet = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setOpHash('');
      setTxStatus(false);
      setError('');
      const available = await ThanosWallet.isAvailable();
      if (!available) {
        throw new Error('Thanos Wallet not installed');
      }
      if (randomNumber == 0) setRandomNumber(Math.floor(Math.random() * 10000));

      const wallet = new ThanosWallet('Tezos Betting Poo');
      await wallet.connect('carthagenet');
      const tezos = await wallet.toTezos();
      const accountPkh = await tezos.wallet.pkh();
      const accountBalance = await tezos.tz.getBalance(accountPkh);
      console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
      const counter = await tezos.wallet.at(oracleContract);
      const operation = await counter.methods
        .placeBet(betType, randomNumber)
        .send({ amount: betSizeMap.get(betType) });
      console.log(operation);
      setOpHash(operation.opHash);
      setLoading(false);
      operation.confirmation().then((result) => {
        console.log(result);
        if (result.completed) setTxStatus(true);
      });
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      setError(err.message);
    }
  };
  return (
    <Container>
      <Container className="body-pos mt-6 ">
        <Container className="fundsDeposited">
          Total Funds Deposited <span>{totalFunds}tz</span>
        </Container>
        <Container className="betform-pos">
          <Form onSubmit={handlePlaceBet}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Control
                    as="select"
                    defaultValue="betType"
                    size="lg"
                    onChange={handleBetTypeChange}
                  >
                    <option disabled value="betType">
                      Bet Type
                    </option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Random Number"
                  size="lg"
                  onChange={randomNumberChange}
                />
                <Form.Text className="text-muted">Optional Field</Form.Text>
              </Col>
            </Row>
            <Row>
              <Col className="submit-btn-pos mt-3">
                <button type="submit" className="btn rules-button">
                  Place Bet
                </button>
              </Col>
            </Row>
          </Form>
        </Container>
      </Container>
      {loading ? (
        <Container className="text-center tx-status mt-3">
          <Spinner /> Processing . . .
        </Container>
      ) : null}
      {error ? (
        <Container className="mt-3 errorMessage">{error}</Container>
      ) : null}
      {!!opHash ? (
        <Container className="mt-3 tx-status">
          Opertaion injected with operation id : {opHash}
        </Container>
      ) : null}
      {!!opHash && !txConfirmed ? (
        <Container className="tx-status">
          <Spinner />
          Waiting for confirmation ...
        </Container>
      ) : null}

      {!!txConfirmed ? (
        <Container className="tx-status">
          Operation injected successfully
        </Container>
      ) : null}
    </Container>
  );
}

function Header() {
  const [show, setShow] = React.useState(false);
  const [betList, setBetList] = React.useState([]);
  const handleClose = () => setShow(false);
  React.useEffect(() => {
    // handleShow();
  }, []);
  const handleShow = async () => {
    setShow(true);
    const available = await ThanosWallet.isAvailable();
    if (!available) {
      throw new Error('Thanos Wallet not installed');
    }
    const wallet = new ThanosWallet('Tezos Betting Poo');
    await wallet.connect('carthagenet');
    const tezos = await wallet.toTezos();
    const accountPkh = await tezos.wallet.pkh();
    const accountBalance = await tezos.tz.getBalance(accountPkh);
    console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
    let data = JSON.stringify({
      address: accountPkh,
    });
    let obj = {
      address: accountPkh,
    };
    axios.post(`${backendBaseURL}/data`, obj).then((res) => {
      const {
        data: { betList: _betList },
      } = res;
      console.log(res.data);
      setBetList(_betList);
    });
  };

  const betComponent = betList.map((value, index) => (
    <Row key={index}>
      <Col xs={3}>{new Date(value.timestamp).toDateString()}</Col>
      <Col xs={3}>{String(value.parameters).split(' ')[1]} Cycles</Col>
      <Col xs={6} style={{ overflow: 'scroll' }}>
        {value.operation_group_hash}
      </Col>
    </Row>
  ));

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        className="tx-modal"
      >
        <Modal.Header className="text-center" closeButton>
          <Modal.Title>Your Transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {betList && betList.length > 0 ? (
            betComponent
          ) : (
            <p>You don't have any bets from your Thanos address</p>
          )}
        </Modal.Body>
      </Modal>
      <Navbar variant="dark" id="landing" className="justify-content-between">
        <Navbar.Brand className="logo mt-4">BettingPool</Navbar.Brand>
        <Navbar.Toggle />
        {/* <div> */}
        <Nav className="mt-4">
          <a href="#rules" className="mr-4">
            <button className="btn rules-button">Rules</button>
          </a>
          {/* <a href="#rules"> */}
          <button className="btn rules-button" onClick={handleShow}>
            My Bets
          </button>
          {/* </a> */}
        </Nav>

        {/* </div> */}
      </Navbar>
    </>
  );
}
