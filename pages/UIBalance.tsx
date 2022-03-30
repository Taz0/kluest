import type { NextPage } from 'next'
import { Form, Row, Button, Container } from 'react-bootstrap'
import { ReactElement, useState } from 'react'
import LMHTTPClient from '../utils/httpClient/LMHTTPClient';

interface UIBalanceProps {
  contractAddress: string,
}

const UIBalance: NextPage<UIBalanceProps> = (props) => {

  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [balance, setBalance] = useState(-1);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity() === true) {
      const address = form.formWalletAddress.value;
      setBalance(-1);
      setLoading(true);
      LMHTTPClient.balance(address, props.contractAddress)
        .then((response) => {
          const amount = response.amount as number;
          console.log(`balance is ${amount}`);
          setBalance(amount);
          setLoading(false);
        }).catch((error) => {
          console.error(error);
        });
    }
    setValidated(true);
  };

  return (
    <Container>
      <h4>Query balance:</h4>
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
          {isLoading ? 'Loading...' : 'Get Balance'}
        </Button>
        {showBalance()}
      </Form>
    </Container>
  );

  function showBalance(): ReactElement | undefined {
    if (balance === -1) {
      return undefined;
    }

    return (<span className="m-3">Balance is {balance}</span>);
  }
}

export default UIBalance
