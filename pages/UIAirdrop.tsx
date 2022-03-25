import type { NextPage } from 'next';
import { Form, Row, Button, Container } from 'react-bootstrap';
import { ReactElement, useState } from 'react';
import LMHTTPClient, { AirDropResponse } from '../utils/httpClient/LMHTTPClient';
import _ from 'lodash';

interface UIAirDropProps {
  contractAddress: string;
}

const UIAirDrop: NextPage<AirDropResponse> = (props) => {

  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [airDropResult, setAirDropResult] = useState("");

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
      setAirDropResult("");
      setLoading(true);
      LMHTTPClient.sendAirDrop(address)
        .then((response) => {
          const result = response.result;
          console.log(`airdrop result is ${result}`);

          if (!_.isUndefined(response.message)) {
            setAirDropResult(response.message);
          }

          setLoading(false);
        }).catch((error) => {
          console.error(error);
        });
    }
    setValidated(true);
  };

  return (
    <Container>
      <h4>Air Drop:</h4>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group className="mb-3" controlId="formWalletAddress">
            <Form.Label>Wallet address</Form.Label>
            <Form.Control required type="text" placeholder="0x123456789..." defaultValue="0xD8Ff420622449bfFa9C1284004a5D50b7b2e637F" />
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
    if (airDropResult.length === 0 || isLoading) {
      return undefined;
    }

    return (<span className="m-3">AirDrop done, result ${airDropResult}</span>);
  }

};

export default UIAirDrop;
