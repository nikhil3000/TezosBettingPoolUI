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
} from 'react-bootstrap';
import { ThanosWallet } from '@thanos-wallet/dapp';
import { Spinner } from './';

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
  const betSizeMap = new Map();
  betSizeMap.set(5, 5);
  betSizeMap.set(10, 3);
  betSizeMap.set(15, 1);
  const randomNumberChange = (event) => {
    setRandomNumber(Number(event.target.value));
  };
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

      const wallet = new ThanosWallet('Tezos Betting Pool');
      await wallet.connect('carthagenet');
      const tezos = await wallet.toTezos();
      const accountPkh = await tezos.wallet.pkh();
      const accountBalance = await tezos.tz.getBalance(accountPkh);
      console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
      // const c = await tezos.contract.at('KT19Duju3PHpkZ6DCjKPRN6pSasSjLQtuw2Z');
      const counter = await tezos.wallet.at(
        'KT19Duju3PHpkZ6DCjKPRN6pSasSjLQtuw2Z'
      );
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
          Total Funds Deposited <span> $332</span>
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
  return (
    <Navbar variant="dark" id="landing" className="justify-content-between">
      <Navbar.Brand className="logo mt-4">BettingPool</Navbar.Brand>
      <Navbar.Toggle />
      <Nav className="mt-4">
        <a href="#rules">
          <button className="btn rules-button">Rules</button>
        </a>
      </Nav>
    </Navbar>
  );
}
