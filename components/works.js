import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export function Work() {
  return (
    <Container id="rules">
      <h1 className="stats-header">How it Works </h1>
      <Container>
        <Row>
          <Col>
            <div className="work-title">1. Choose your bet type</div>
            <div className="work-desc">
              Each bet type represents the lock period for your funds. Ex. Bet
              Type 5 signifies a lock period for 5 Tezos Cycles ~ 15 Natural
              days
            </div>
            <div className="work-title">2. Place your bet</div>
            <div className="work-desc">
              Place the desired bet by using Thanos Wallet Browser extension,
              directly to the smart contract
            </div>
            <div className="work-title">3. Get Rewarded</div>
            <div className="work-desc">
              As soon as the lock period for your bet pool ends, prize money
              will be automatically transfered to the winner chosen with random
              numbers provided by users with every bet
            </div>
            <div className="work-title">4. Zero Rish</div>
            <div className="work-desc">
              At the time of prize disbursal, all other participants are also
              tranfered back their investment
            </div>
          </Col>
          <Col>
            <div className="work-right">Sounds Exciting</div>
            <div className="text-center">
              <a href="#landing">
                <button className="btn rules-button">Try Now</button>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
