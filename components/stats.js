import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export function Stats() {
  return (
    <Container className="stats-root">
      <h1 className="stats-header">Stats</h1>
      <Container className="mt-4">
        <Row style={{ marginTop: '7%' }}>
          <Col>
            <div className="stats-title">total placed bets</div>
            {/* <br></br> */}
            <div className="stats-desc">$1458</div>
          </Col>
          <Col>
            <div className="stats-title"># of Bets Placed</div>
            {/* <br></br> */}
            <div className="stats-desc">221</div>
          </Col>
        </Row>
        <Row style={{ marginTop: '7%' }}>
          <Col>
            <div className="stats-title">Active Bet Amount</div>
            {/* <br></br> */}
            <div className="stats-desc">$400</div>
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
