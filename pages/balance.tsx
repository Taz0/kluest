import type { NextPage } from 'next'
import { Form, Row, Button, Container } from 'react-bootstrap'
import { ReactElement, useState } from 'react'
import LMHTTPClient from './apiClient/LMHTTPClient';

const Balance: NextPage = () => {

  const [validated, setValidated] = useState(false);
  const [balance, setBalance] = useState(-1);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity() === true) {
      const address = form.formWalletAddress.value;
      console.log(`get Balance from Crypto address ${address}`);
      LMHTTPClient.getBalance(address)
        .then((response) => {
          const amount = response.amount as number;
          console.log(`balance is ${amount}`);
          setBalance(amount); 
        }).catch((error) => {
          console.error(error);
        });
    }
    setValidated(true);
  };

  return (
    <main>
      <Container fluid>
        <h1>Balances..</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group className="mb-3" controlId="formWalletAddress">
              <Form.Label>Wallet address</Form.Label>
              <Form.Control required type="text" placeholder="0x123456789..." defaultValue="0xD8Ff420622449bfFa9C1284004a5D50b7b2e637F" />
              <Form.Text className="text-muted">
                We'll never share your wallet with anyone else.
              </Form.Text>
            </Form.Group>
          </Row>
          <Button type="submit">Get Balance</Button>
        </Form>

        {showBalance()}

      </Container>
    </main>
  )

  function showBalance(): ReactElement | undefined {
    console.log(`Executing balance ${balance}`);
    if (balance === -1) {
      return undefined;
    }

    return (<Row id="1">Balance is {balance}</Row>);
  }
}

export default Balance
