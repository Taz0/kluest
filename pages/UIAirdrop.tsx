import type { NextPage } from 'next';
import { Form, Row, Button, Container } from 'react-bootstrap';
import { ReactElement, useState } from 'react';
import LMHTTPClient, { RequestResponse } from '../utils/httpClient/LMHTTPClient';
import _ from 'lodash';

interface UIAirDropProps {
  contractAddress: string;
}

const UIAirDrop: NextPage<UIAirDropProps> = (props) => {

  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [airdropResult, setAirdropResult] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading) {
      return;
    }

    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity() === true) {
      const address = form.formWalletAddress.value;
      console.log(`contract ${props.contractAddress})`);
      setAirdropResult("");
      setLoading(true);
      LMHTTPClient.sendAirDrop(address)
        .then((response) => {
          const result = response.result;
          console.log(`airdrop result is ${result}`);

          if (!_.isUndefined(response.message)) {
            setAirdropResult(response.message);
          }
        }).catch((error) => {
          setAirdropResult(error.message || 'unknown error');
        }).finally(() => {
          setLoading(false);
        });
    }
    setValidated(true);
  };

  return (
    <Container>
      <h4>Initial airdrop:</h4>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group className="mb-3" controlId="formWalletAddress">
            <Form.Label>Wallet address</Form.Label>
            <Form.Control required type="text" placeholder="0x123456789..." defaultValue="0xF0deCE36Aa5D5702e1a1d6986854774011095EA0" />
            <Form.Text className="text-muted">
              We&apos;ll never share your wallet with anyone else.
            </Form.Text>
          </Form.Group>
        </Row>
        <Button variant="primary" disabled={isLoading} type="submit">
          {isLoading ? 'Loading...' : 'Execute air drop'}
        </Button>
        {showResult()}
      </Form>
    </Container>
  );

  function showResult(): ReactElement | undefined {
    if (airdropResult.length === 0 || isLoading) {
      return undefined;
    }

    return (<span className="m-3">Result: {airdropResult}</span>);
  }

};

export default UIAirDrop;
