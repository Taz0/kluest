import type { NextPage } from 'next';
import { Form, Row, Button, Container } from 'react-bootstrap';
import { ReactElement, useState } from 'react';
import LMHTTPClient from '../utils/httpClient/LMHTTPClient';
import _ from 'lodash';
import UIUserItem from './UIUserItem';

interface UIUserItemsProps {
  contractAddress: string;
}

const UIUserItems: NextPage<UIUserItemsProps> = (props) => {

  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [requestResult, setRequestResult] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading) {
      return;
    }

    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity() === true) {
      const address = form.formWalletAddress.value;


      setRequestResult("");
      setLoading(true);
      LMHTTPClient.getUserItems(address)
        .then((response) => {
          const result = response.result;
          console.log(`user items result is ${result}`);

          if (!_.isUndefined(response.message)) {
            setRequestResult(JSON.stringify(response.message));
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
      <h4>User items:</h4>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group className="mb-3" controlId="formWalletAddress">
            <Form.Label>User address</Form.Label>
            <Form.Control required type="text" placeholder="0x123456789..." defaultValue="0xF0deCE36Aa5D5702e1a1d6986854774011095EA0" />
            <Form.Text className="text-muted">
              We&apos;ll never share your wallet with anyone else.
            </Form.Text>
          </Form.Group>
        </Row>
        <Button variant="primary" disabled={isLoading} type="submit">
          {isLoading ? 'Loading...' : 'Get user items'}
        </Button>
        {showResult()}
      </Form>
    </Container>
  );

  function showResult(): ReactElement | undefined {
    if (requestResult.length === 0 || isLoading) {
      return undefined;
    }

    const listImages = JSON.parse(requestResult) as string[];
    const imageComponents = listImages.map(itemId => <UIUserItem itemId={itemId} />);

    return (
      <div>
        <span className="m-3">Result: {requestResult}</span>
        <div>
          {imageComponents}
        </div>
      </div>
    );

  }
};

export default UIUserItems;
