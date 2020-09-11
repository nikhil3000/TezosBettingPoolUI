import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Tezos } from '@taquito/taquito';
import { backendBaseURL, oracleContract, node } from '../config';

export function Stats() {
  const [totalFunds, setTotalFunds] = React.useState();
  const [betCount, setBetCount] = React.useState();
  const [activeAmount, setActiveAmount] = React.useState();

  React.useEffect(() => {
    async function onMount() {
      axios.post(`${backendBaseURL}/data`).then((obj) => {
        console.log(obj.data);
        const {
          data: { amount, betCount },
        } = obj;
        setTotalFunds(amount * 10 ** -6);
        setBetCount(betCount);
      });
      Tezos.setProvider({ rpc: node });
      const contractInstance = await Tezos.contract.at(oracleContract);
      const storage = await contractInstance.storage();
      // console.log(storage);
      let activeBetAmount = 0;
      for (let i = 1; i <= 3; i++) {
        const temp = storage.betData.get(String(i * 5));
        temp.keyMap.forEach((betID) => {
          activeBetAmount += temp.get(String(betID)).senderList.length * i * 5;
        });
        setActiveAmount(activeBetAmount);
      }
    }
    onMount();
  }, []);
  return (
    <Container className="stats-root">
      <h1 className="stats-header">Stats</h1>
      <Container className="mt-4">
        <Row style={{ marginTop: '7%' }}>
          <Col>
            <div className="stats-title">total placed bets</div>
            {/* <br></br> */}
            <div className="stats-desc">{totalFunds} tz</div>
          </Col>
          <Col>
            <div className="stats-title"># of Bets Placed</div>
            {/* <br></br> */}
            <div className="stats-desc">{betCount}</div>
          </Col>
        </Row>
        <Row style={{ marginTop: '7%' }}>
          <Col>
            <div className="stats-title">Active Bet Amount</div>
            {/* <br></br> */}
            <div className="stats-desc">{activeAmount} tz</div>
          </Col>
        </Row>
        <Row className=" stats-last-row">
          <Col>
            <div className="stats-title small">
              Where does the prize money come from?
            </div>
            {/* <br></br> */}
            <div className="stats-desc small">
              All the pool balance is delegated to a reliable public baker and
              the staking rewards account for the prize money
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
