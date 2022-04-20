import type { NextPage } from 'next';
import { Form, Row, Button, Container } from 'react-bootstrap';
import { ReactElement, useState } from 'react';
import LMHTTPClient from '../utils/httpClient/LMHTTPClient';
import _ from 'lodash';

interface UIRewardItemProps {
  contractAddress: string;
}

const UIRewardItem: NextPage<UIRewardItemProps> = (props) => {

  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [rewardResult, setRewardResult] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading) {
      return;
    }

    const form = event.currentTarget as HTMLFormElement;
    if (form.checkValidity() === true) {
      const address = form.formWalletAddress.value;
      const item = form.formItem.value;
      if (!_.isString(item)) {
        alert("Invalid item id");
        return;
      }

      setRewardResult("");
      setLoading(true);
      LMHTTPClient.sendRewardItem(address, item)
        .then((response) => {
          const result = response.result;
          console.log(`reward item result is ${result}`);

          if (!_.isUndefined(response.message)) {
            setRewardResult(response.message);
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
      <h4>Reward item:</h4>
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
        <Row className="mb-3">
          <Form.Group className="mb-3" controlId="formItem">
            <Form.Label>Item Id (Not 0)</Form.Label>
            <Form.Control required type="text" placeholder="id" />
          </Form.Group>
        </Row>
        <Button variant="primary" disabled={isLoading} type="submit">
          {isLoading ? 'Loading...' : 'Reward item'}
        </Button>
        {showResult()}
      </Form>
    </Container>
  );

  function showResult(): ReactElement | undefined {
    if (rewardResult.length === 0 || isLoading) {
      return undefined;
    }

    return (<span className="m-3">Result: {rewardResult}</span>);
  }

};

export default UIRewardItem;
