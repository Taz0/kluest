import type { NextPage } from 'next'
import { Form, Row, Button, Container } from 'react-bootstrap'
import { ReactElement, useState } from 'react'
import LMHTTPClient from '../httpClient/LMHTTPClient';
import { CryptoAddress } from '../shared/SharedTypes';

const AirDrop: NextPage = () => {

  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [balance, setBalance] = useState(-1);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading) {
      return;
    }

    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity() === true) {
      const address = form.formWalletAddress.value;
      setBalance(-1);
      setLoading(true);
      LMHTTPClient.getBalance(address)
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
    <main>
      <Container>
        <h1>Telos EVM Test Air Drop:</h1>
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
            {isLoading ? 'Loading...' : 'Get Balance'}
          </Button>
          {showResult()}
        </Form>
      </Container>
    </main >
  );

  function showResult(): ReactElement | undefined {
    if (balance === -1) {
      return undefined;
    }

    return (<span className="m-3">AirDrop done, new balance ${balance}</span>);
  }

  async function getBalance(address: CryptoAddress) {
    try {
      const response = await LMHTTPClient.getBalance(address);
      const amount = response.amount as number;
      console.log(`balance is ${amount}`);
      setBalance(amount);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
}

export default AirDrop
